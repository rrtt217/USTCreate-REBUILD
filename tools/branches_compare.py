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
def clean_packwiz_format(input: str | list[str]) -> list[str]:
    """
    通过移除packwiz特定格式来清理文本。
    例如：XaeroPlus (XaeroPlus-2.28.6+forge-1.20.1-WM1.39.12-MM25.2.10.jar) -> XaeroPlus-2.28.6+forge-1.20.1-WM1.39.12-MM25.2.10.jar
    """
    if type(input) == str:
        mod_list = input.splitlines()
    elif type(input) == list[str]:
        mod_list = input
    else:
        logging.error("clean_packwiz_format(): Type Mismatch")
        return []
    for i in range(len(mod_list)):
        start = mod_list[i].rfind('(')
        end = mod_list[i].rfind(')')
        if start != -1 and end != -1:
            mod_list[i] = mod_list[i][start+1:end]
        mod_list[i] = mod_list[i].strip()
        logging.debug(""+str(mod_list[i]))
    return mod_list


def clean_normal_format(input: str | list[str]) -> list[str]:
    """通过移除启动器特定格式来清理mod文本。"""
    if type(input) == str:
        mod_list = input.splitlines()
    elif type(input) == list[str]:
        mod_list = input
    else:
        logging.error("clean_normal_format(): Type Mismatch")
        return []
    for i in range(len(mod_list)):
        start = mod_list[i].find('[')
        end = mod_list[i].find(']')
        if start == 0 and end != -1:
            mod_list[i] = mod_list[i][end+1:]
        mod_list[i] = mod_list[i].strip()
        logging.debug(""+str(mod_list[i]))
    return mod_list


def compare_str_lists(
    mod_list1: list[str],
    mod_list2: list[str],
    similarity_threshold: float = 0.8
) -> tuple[list[str], list[tuple[str, str]], list[str], list[str]]:
    """比较两个字符串列表并返回差异列表。"""
    # 创建副本避免修改原始列表
    remaining_strings1 = mod_list1.copy()
    remaining_strings2 = mod_list2.copy()

    common_and_same_version_strings: list[str] = []
    common_but_different_version_strings: list[tuple[str, str]] = []

    # 第一阶段：查找完全匹配
    for item in mod_list1:
        if item in remaining_strings2:
            common_and_same_version_strings.append(item)
            if item in remaining_strings1:
                remaining_strings1.remove(item)
            if item in remaining_strings2:
                remaining_strings2.remove(item)

    # 第二阶段：查找相似匹配
    temp_items1 = remaining_strings1.copy()

    for item in temp_items1:
        best_ratio = 0.0
        best_match = None

        # 查找最佳匹配
        for candidate in remaining_strings2:
            ratio = SequenceMatcher(None, item, candidate).ratio()
            logging.debug(f"正在比较 {item} 与 {candidate}: 相似度 {ratio}")
            if ratio > best_ratio:
                best_ratio = ratio
                best_match = candidate

        # 检查是否达到相似度阈值
        if best_ratio > similarity_threshold and best_match:
            common_but_different_version_strings.append((item, best_match))
            if item in remaining_strings1:
                remaining_strings1.remove(item)
            if best_match in remaining_strings2:
                remaining_strings2.remove(best_match)

    return (
        common_and_same_version_strings,
        common_but_different_version_strings,
        remaining_strings1,
        remaining_strings2
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


def get_current_branch() -> str:
    """获取当前Git分支名称。"""
    return run_command("git branch --show-current").strip()


def switch_to_branch(branch_name : str):
    """切换到指定的Git分支。"""
    logging.info(f"切换到分支 '{branch_name}'...")
    run_command(f"git checkout {branch_name}")
    run_command("git fetch")

def restore_git_repo():
    """撤销对git管理的文件的更改"""
    logging.info("重置git仓库......")
    run_command("git restore .")



def generate_addon_list(
    addon_type : Literal["mods","shaderpacks","resourcepacks","datapacks"] = "mods",
    read_modlist_mode : Literal["command","toml"] = "command"
    ) -> list[str]:
    """为当前的仓库生成‘附加包’（模组、光影包、资源包、数据包）列表。"""
    packwiz_addon_list = []
    if read_modlist_mode == "command" and addon_type == "mods":
        # 使用packwiz生成mod列表
        run_command("./packwiz refresh")
        packwiz_addon_list = clean_packwiz_format(run_command("./packwiz list -v"))
    elif read_modlist_mode == "toml" or addon_type != "mods":
        addon_path = Path(addon_type)
        if addon_path.exists():
            for toml_file in addon_path.glob("*.toml"):
                with open(toml_file, 'rb') as f:
                    packwiz_addon_list.append(tomllib.load(f)["filename"])

    # 添加原始文件信息
    file_list_str = run_command(f"find mods -name '{"*.jar" if addon_type == "mods" else "*.zip"}' -printf '%f\n' 2>/dev/null || true")
    raw_files_modlist = clean_normal_format(file_list_str) if file_list_str else []
    restore_git_repo()
    return packwiz_addon_list+raw_files_modlist


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
        "--compare-others",
        type=bool,
        default=False,
        help="是否比较其他文件（默认：False）"
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

    # 为第一个分支生成mod,shader,resourcepack,datapack,其他项目列表
    switch_to_branch(branch1)
    if args.compare_mods:
        mod_list1 = generate_addon_list(addon_type="mods")
    if args.compare_shaderpacks:
        shader_list1 = generate_addon_list(addon_type="shaderpacks")
    if args.compare_resourcepacks:
        resourcepack_list1 = generate_addon_list(addon_type="resourcepacks")
    if args.compare_datapacks:
        datapack_list1 = generate_addon_list(addon_type="datapacks")
    # 为第一个分支生成mod,shader,resourcepack,datapack,其他项目列表
    switch_to_branch(branch2)
    if args.compare_mods:
        mod_list2 = generate_addon_list(addon_type="mods")
    if args.compare_shaderpacks:
        shader_list2 = generate_addon_list(addon_type="shaderpacks")
    if args.compare_resourcepacks:
        resourcepack_list2 = generate_addon_list(addon_type="resourcepacks")
    if args.compare_datapacks:
        datapack_list2 = generate_addon_list(addon_type="datapacks")

    # 切回原始分支
    print(f"切回原始分支 {current_branch}...")
    switch_to_branch(current_branch)

    # 执行比较
    print("\n=== 比较结果 ===")
    if args.compare_mods:
        common_and_same_version_mods, common_but_different_version_mods, mods_only_in_list1, mods_only_in_list2 = compare_str_lists(
        mod_list1, mod_list2, similarity_threshold=args.similarity
        )
        # 输出mod比较结果
        print("相同版本的mod：")
        print(common_and_same_version_mods)
        print("\n版本不同的mod：")
        print(common_but_different_version_mods)
        print("\n仅在第一个分支中的mod：")
        print(mods_only_in_list1)
        print("\n仅在第二个分支中的mod：")
        print(mods_only_in_list2)
    if args.compare_shaderpacks:
        common_and_same_version_shaderpacks, common_but_different_version_shaderpacks, shaderpacks_only_in_list1, shaderpacks_only_in_list2 = compare_str_lists(
        shader_list1, shader_list2, similarity_threshold=args.similarity
        )
        # 输出shader比较结果
        print("相同版本的shader：")
        print(common_and_same_version_shaderpacks)
        print("\n版本不同的shader：")
        print(common_but_different_version_shaderpacks)
        print("\n仅在第一个分支中的shader：")
        print(shaderpacks_only_in_list1)
        print("\n仅在第二个分支中的shader：")
        print(shaderpacks_only_in_list2)
    if args.compare_resourcepacks:
        common_and_same_version_resourcepacks, common_but_different_version_resourcepacks, resourcepacks_only_in_list1, resourcepacks_only_in_list2 = compare_str_lists(
        resourcepack_list1, resourcepack_list2, similarity_threshold=args.similarity
        )
        # 输出resourcepack比较结果
        print("相同版本的resourcepack：")
        print(common_and_same_version_resourcepacks)
        print("\n版本不同的resourcepack：")
        print(common_but_different_version_resourcepacks)
        print("\n仅在第一个分支中的resourcepack：")
        print(resourcepacks_only_in_list1)
        print("\n仅在第二个分支中的resourcepack：")
        print(resourcepacks_only_in_list2)
    if args.compare_datapacks:
        common_and_same_version_datapacks, common_but_different_version_datapacks, datapacks_only_in_list1, datapacks_only_in_list2 = compare_str_lists(
        datapack_list1, datapack_list2, similarity_threshold=args.similarity
        )
        # 输出datapack比较结果
        print("相同版本的datapack：")
        print(common_and_same_version_datapacks)
        print("\n版本不同的datapack：")
        print(common_but_different_version_datapacks)
        print("\n仅在第一个分支中的datapack：")
        print(datapacks_only_in_list1)
        print("\n仅在第二个分支中的datapack：")
        print(datapacks_only_in_list2)

    print(f"\n分支对比完成 ({branch1} vs {branch2})!")


if __name__ == "__main__":
    main()