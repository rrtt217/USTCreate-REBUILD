#!/bin/python3
# -*- coding: utf-8 -*-
"""
对不同分支的整合包（原始或Packwiz格式）进行对比
"""

import os
import sys
from pathlib import Path
import subprocess
import tomllib
from typing import Literal
from difflib import SequenceMatcher

import logging

import argparse

#____________ 日志配置 ____________

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')

#____________ 功能函数 ____________
def clean_packwiz_text(text: str):
    """
    通过移除packwiz特定格式来清理文本。
    例如：XaeroPlus (XaeroPlus-2.28.6+forge-1.20.1-WM1.39.12-MM25.2.10.jar) -> XaeroPlus-2.28.6+forge-1.20.1-WM1.39.12-MM25.2.10.jar
    """
    mod_list = text.splitlines()
    for i in range(len(mod_list)):
        start = mod_list[i].rfind('(')
        end = mod_list[i].rfind(')')
        if start != -1 and end != -1:
            mod_list[i] = mod_list[i][start+1:end]
        mod_list[i] = mod_list[i].strip()
        logging.debug(""+str(mod_list[i]))
    return mod_list


def clean_normal_modname(mod_text: str):
    """通过移除启动器特定格式来清理mod文本。"""
    mod_list = mod_text.splitlines()
    for i in range(len(mod_list)):
        start = mod_list[i].find('[')
        end = mod_list[i].find(']')
        if start == 0 and end != -1:
            mod_list[i] = mod_list[i][end+1:]
        mod_list[i] = mod_list[i].strip()
        logging.debug(""+str(mod_list[i]))
    return mod_list


def compare_mods(
    mod_list1: list[str],
    mod_list2: list[str],
    similarity_threshold: float = 0.8
) -> tuple[list[str], list[tuple[str, str]], list[str], list[str]]:
    """比较两个mod列表并返回差异列表。"""
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
            logging.info(f"正在比较 {mod} 与 {candidate}: 相似度 {ratio}")
            if ratio > best_ratio:
                best_ratio = ratio
                best_match = candidate

        # 检查是否达到相似度阈值
        if best_ratio > similarity_threshold and best_match:
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
    """运行shell命令并返回结果。"""
    try:
        if capture_output:
            result = subprocess.run(command, shell=True, capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        logging.error(f"错误: 命令执行失败 - {command}")
        logging.error(f"错误输出: {e.stderr}")
        sys.exit(1)


def get_current_branch():
    """获取当前Git分支名称。"""
    return run_command("git branch --show-current").strip()


def switch_to_branch(branch_name):
    """切换到指定的Git分支。"""
    logging.info(f"切换到分支 '{branch_name}'...")
    run_command(f"git checkout {branch_name}")
    run_command("git fetch")

def restore_git_repo():
    """撤销对git管理的文件的更改"""
    logging.info("重置git仓库......")
    run_command("git restore .")

def generate_modlist_for_branch(
    branch_name : str,
    output_file : Path,
    read_modlist_mode : Literal["command","toml"] = "command"
    ):
    """为指定的Git分支生成mod列表文件。"""
    print(f"生成 {output_file}...")
    output_dir = Path(output_file).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    switch_to_branch(branch_name)

    # 使用packwiz生成mod列表
    if read_modlist_mode == "command":
        run_command("./packwiz refresh")
        packwiz_modlist = run_command("./packwiz list -v")
    elif read_modlist_mode == "toml":
        packwiz_modlist = ""
        mods_path = Path("mods")
        for toml_file in mods_path.glob("*.toml"):
            with open(toml_file, 'rb') as f:
                packwiz_modlist += tomllib.load(f)["filename"]
                packwiz_modlist += "\n"
    with open(output_file, 'w+') as f:
        f.write(packwiz_modlist)

    # 添加.jar文件信息
    jar_files_modlist = run_command("find mods -name \"*.jar\" -exec basename {} \;")
    with open(output_file, 'a') as f:
        f.write(jar_files_modlist)
    restore_git_repo()
    return output_file


def setup_argparse() -> argparse.ArgumentParser:
    """设置并返回argparse解析器。"""
    parser = argparse.ArgumentParser(
        description="对两个不同分支的整合包（原始或Packwiz格式）进行对比"
    )
    parser.add_argument(
        "branch1",
        nargs="?",
        default="upstream/main",
        help="第一个分支名称 (默认: upstream/main)"
    )
    parser.add_argument(
        "branch2",
        nargs="?",
        type=str,
        help="第二个分支名称 (默认: 当前分支)"
    )
    parser.add_argument(
        "--similarity",
        type=float,
        default=0.8,
        help="相似度阈值 (默认: 0.8)"
    )
    parser.add_argument(
        "--compare-mods",
        type=bool,
        default=True,
        help="是否比较模组（默认：True）"
    )
    parser.add_argument(
        "--compare-shaderpacks",
        type=bool,
        default=False,
        help="是否比较光影包（默认：False）"
    )
    parser.add_argument(
        "--compare-resourcepacks",
        type=bool,
        default=False,
        help="是否比较资源包（默认：False）"
    )
    parser.add_argument(
        "--compare-datapacks",
        type=bool,
        default=False,
        help="是否比较数据包（默认：False）"
    )
    parser.add_argument(
        "--verbose",
        type=bool,
        default=False,
        help="是否显示详细（调试）信息（默认：False）"
    )
    return parser


def main():
    """主要函数"""
    parser = setup_argparse()
    args = parser.parse_args()

    # 保存当前分支
    current_branch = get_current_branch()
    print(f"当前分支: {current_branch}")

    # 设置分支参数
    branch1 = args.branch1
    if args.branch2 is None:
        branch2 = current_branch
    else:
        branch2 = args.branch2

    # 验证分支是否存在
    print(f"检查分支 '{branch1}'...")
    try:
        run_command(f"git rev-parse --verify {branch1}")
    except:
        print(f"错误: 分支 '{branch1}' 不存在")
        sys.exit(1)

    print(f"检查分支 '{branch2}'...")
    try:
        run_command(f"git rev-parse --verify {branch2}")
    except:
        print(f"错误: 分支 '{branch2}' 不存在")
        sys.exit(1)

    # 创建输出目录
    output_dir = Path("build/versioncheck")
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"开始分支对比: {branch1} vs {branch2}")

    # 为第一个分支生成mod列表
    mod_list1_file = output_dir / "modlist_1.txt"
    generate_modlist_for_branch(branch1,mod_list1_file)

    # 为第二个分支生成mod列表
    mod_list2_file = output_dir / "modlist_2.txt"
    generate_modlist_for_branch(branch2,mod_list2_file)

    # 切回原始分支
    print(f"切回原始分支 {current_branch}...")
    switch_to_branch(current_branch)

    # 读取并比较mod列表
    with open(mod_list1_file, 'r') as f:
        mod_list1 = clean_normal_modname(f.read())

    with open(mod_list2_file, 'r') as f:
        mod_list2 = clean_packwiz_text(f.read())

    # 执行比较
    common_and_same_version_mods, common_but_different_version_mods, mods_only_in_list1, mods_only_in_list2 = compare_mods(
        mod_list1, mod_list2, similarity_threshold=args.similarity
    )

    # 输出结果
    print("\n=== 比较结果 ===")
    print("相同版本的mod：")
    print(common_and_same_version_mods)
    print("\n版本不同的mod：")
    print(common_but_different_version_mods)
    print("\n仅在第一个分支中的mod：")
    print(mods_only_in_list1)
    print("\n仅在第二个分支中的mod：")
    print(mods_only_in_list2)

    print(f"\n分支对比完成 ({branch1} vs {branch2})!")
    print("结果文件位置: build/versioncheck/")
    ls_output = run_command("ls build/versioncheck/")
    print(ls_output)


if __name__ == "__main__":
    main()