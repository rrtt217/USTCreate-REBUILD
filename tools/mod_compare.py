#!/bin/python3
# -*- coding: utf-8 -*-
import os
import sys
from difflib import SequenceMatcher
def clean_packwiz_text(text : str):
    """Clean text by removing packwiz-specific formatting."""
    mod_list = text.splitlines()
    for i in range(len(mod_list)):
        start = mod_list[i].rfind('(')
        end = mod_list[i].rfind(')')
        if start != -1 and end != -1:
            mod_list[i] = mod_list[i][start+1:end]
        mod_list[i] = mod_list[i].strip()
        print("debug2:",mod_list[i],'\n')
    return mod_list
def clean_normal_modname(mod_text : str):
    """Clean mod text by removing launcher-specific formatting."""
    mod_list = mod_text.splitlines()
    for i in range(len(mod_list)):
        start = mod_list[i].find('[')
        end = mod_list[i].find(']')
        if start == 0 and end != -1:
            mod_list[i] = mod_list[i][end+1:]
        mod_list[i] = mod_list[i].strip()
        print("debug1:",mod_list[i],'\n')
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
    # 创建临时列表避免修改遍历中的列表
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
def main():
    """Main function to compare mod lists."""
    if len(sys.argv) != 3:
        print("Usage: python mod_compare.py <mod_list1.txt> <mod_list2.txt>")
        return

    mod_list1_file = sys.argv[1]
    mod_list2_file = sys.argv[2]

    with open(mod_list1_file, 'r') as f:
        mod_list1 = clean_normal_modname(f.read())
    
    with open(mod_list2_file, 'r') as f:
        mod_list2 = clean_packwiz_text(f.read())

    common_and_same_version_mods, common_but_different_version_mods, mods_only_in_list1, mods_only_in_list2 = compare_mods(mod_list1, mod_list2)

    print("Common and same version mods:")
    print(common_and_same_version_mods)
    print("\nCommon but different version mods:")
    print(common_but_different_version_mods)
    print("\nMods only in list 1:")
    print(mods_only_in_list1)
    print("\nMods only in list 2:")
    print(mods_only_in_list2)
    
if __name__ == "__main__":
    main()