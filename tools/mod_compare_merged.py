#!/bin/python3
# -*- coding: utf-8 -*-
"""
合并的Mod比较工具
集成了原始 mod_compare.sh 的分支管理和 mod_compare.py 的mod比较功能
"""

import os
import sys
import subprocess
from difflib import SequenceMatcher
from pathlib import Path


def usage():
    """显示使用说明"""
    print("用法: python mod_compare_merged.py [分支1] [分支2]")
    print("如果没有指定分支，则使用默认分支 (upstream/main 和 当前分支)")
    print("示例:")
    print("  python mod_compare_merged.py                 # 对比 upstream/main 和当前分支")
    print("  python mod_compare_merged.py main          # 对比 main 和当前分支")
    print("  python mod_compare_merged.py main dev   # 对比 main 和 dev 分支")


def clean_packwiz_text(text: str):
    """Clean text by removing packwiz-specific formatting."""
    mod_list = text.splitlines()
    for i in range(len(mod_list)):
        start = mod_list[i].rfind('(')
        end = mod_list[i].rfind(')')
        if start != -1 and end != -1:
            mod_list[i] = mod_list[i][start+1:end]
        mod_list[i] = mod_list[i].strip()
        print("debug2:", mod_list[i], '\n')
    return mod_list


def clean_normal_modname(mod_text: str):
    """Clean mod text by removing launcher-specific formatting."""
    mod_list = mod_text.splitlines()
    for i in range(len(mod_list)):
        start = mod_list[i].find('[')
        end = mod_list[i].find(']')
        if start == 0 and end != -1:
            mod_list[i] = mod_list[i][end+1:]
        mod_list[i] = mod_list[i].strip()
        print("debug1:", mod_list[i], '\n')
    return mod_list


def compare_mods(
    mod_list1: list[str],
    mod_list2: list[str]
) -> tuple[list[str], list[tuple[str, str]], list[str], list[str]]:
    """Compare two lists of mods and return a list of differences."""
    # 创建副本避免修改原始列表
    remaining_mods1 = mod_list1.copy()
    remaining_mods2 = mod_list2.copy()

    common_and_same_version_mods: list[str] = []
    common_but_different_version_mods: list[tuple[str, str]] = []

    # 第一阶段：查找完全匹配
    for mod in mod_list1:
        if mod in remaining_mods2:
            common_and_same_version_mods.append(mod)
            remaining_mods1.remove(mod)
            remaining_mods2.remove(mod)

    # 第二阶段：查找相似匹配
    temp_mods1 = remaining_mods1.copy()

    for mod in temp_mods1:
        best_ratio = 0.0
        best_match = None

        # 查找最佳匹配
        for candidate in remaining_mods2:
            ratio = SequenceMatcher(None, mod, candidate).ratio()
            print(f"Comparing {mod} with {candidate}: {ratio}")
            if ratio > best_ratio:
                best_ratio = ratio
                best_match = candidate

        # 检查是否达到相似度阈值
        if best_ratio > 0.5 and best_match:
            common_but_different_version_mods.append((mod, best_match))
            if mod in remaining_mods1:
                remaining_mods1.remove(mod)
            if best_match in remaining_mods2:
                remaining_mods2.remove(best_match)

    return (
        common_and_same_version_mods,
        common_but_different_version_mods,
        remaining_mods1,
        remaining_mods2
    )


def run_command(command, capture_output=True):
    """运行shell命令并返回结果"""
    try:
        if capture_output:
            result = subprocess.run(command, shell=True, capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"错误: 命令执行失败 - {command}")
        print(f"错误输出: {e.stderr}")
        sys.exit(1)


def get_current_branch():
    """获取当前分支名称"""
    return run_command("git branch --show-current").strip()


def switch_to_branch(branch_name):
    """切换到指定分支"""
    print(f"切换到分支 '{branch_name}'...")
    run_command(f"git checkout {branch_name}")
    run_command("git fetch")


def generate_modlist_for_branch(branch_name, output_file):
    """为指定分支生成mod列表"""
    print(f"生成 {output_file}...")
    output_dir = Path(output_file).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    switch_to_branch(branch_name)

    # 使用packwiz生成mod列表
    run_command("./packwiz refresh")
    packwiz_output = run_command("./packwiz list -v")
    with open(output_file, 'w+') as f:
        f.write(packwiz_output)

    # 添加.jar文件信息
    jar_files_output = run_command("find mods -name \"*.jar\" -exec basename {} \;")
    with open(output_file, 'a') as f:
        f.write(jar_files_output)

    return output_file


def parse_branch_args():
    """解析分支参数"""
    if len(sys.argv) == 1:
        # 没有参数: 使用默认分支
        branch1 = "upstream/main"
        branch2 = get_current_branch()
    elif len(sys.argv) == 2:
        # 一个参数: 对比指定分支和当前分支
        branch1 = sys.argv[1]
        branch2 = get_current_branch()
    elif len(sys.argv) == 3:
        # 两个参数: 对比两个指定分支
        branch1 = sys.argv[1]
        branch2 = sys.argv[2]
    else:
        print("错误: 参数数量不正确")
        usage()

    # 验证分支是否存在
    print(f"检查分支 '{branch1}'...")
    try:
        run_command(f"git rev-parse --verify --quiet {branch1}")
    except:
        print(f"错误: 分支 '{branch1}' 不存在")
        sys.exit(1)

    print(f"检查分支 '{branch2}'...")
    try:
        run_command(f"git rev-parse --verify --quiet {branch2}")
    except:
        print(f"错误: 分支 '{branch2}' 不存在")
        sys.exit(1)

    return branch1, branch2


def main():
    """主要函数"""
    # 保存当前分支
    current_branch = get_current_branch()
    print(f"当前分支: {current_branch}")

    # 解析分支参数
    branch1, branch2 = parse_branch_args()

    # 创建输出目录
    output_dir = Path("build/versioncheck")
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"开始分支对比: {branch1} vs {branch2}")

    # 为第一个分支生成mod列表
    mod_list1_file = output_dir / "modlist_1.txt"
    generate_modlist_for_branch(branch1,mod_list1_file)

    # 为第二个分支生成mod列表
    mod_list2_file = output_dir / "modlist_2.txt"
    generate_modlist_for_branch(branch2,mod_list1_file)

    # 切回原始分支
    print(f"切回原始分支 {current_branch}...")
    switch_to_branch(current_branch)

    # 读取并比较mod列表
    with open(mod_list1_file, 'r') as f:
        mod_list1 = clean_normal_modname(f.read())

    with open(mod_list2_file, 'r') as f:
        mod_list2 = clean_packwiz_text(f.read())

    # 执行比较
    common_and_same_version_mods, common_but_different_version_mods, mods_only_in_list1, mods_only_in_list2 = compare_mods(mod_list1, mod_list2)

    # 输出结果
    print("\n=== 比较结果 ===")
    print("Common and same version mods:")
    print(common_and_same_version_mods)
    print("\nCommon but different version mods:")
    print(common_but_different_version_mods)
    print("\nMods only in list 1:")
    print(mods_only_in_list1)
    print("\nMods only in list 2:")
    print(mods_only_in_list2)

    print(f"\n分支对比完成 ({branch1} vs {branch2})!")
    print("结果文件: build/versioncheck/")
    ls_output = run_command("ls build/versioncheck/")
    print(ls_output)


if __name__ == "__main__":
    main()