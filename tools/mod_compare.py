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
        #print("debug2:",mod_list[i],'\n')
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
        #print("debug1:",mod_list[i],'\n')
    return mod_list
def compare_mods(mod_list1 : list, mod_list2 : list):
    """Compare two lists of mods and return a list of differences."""
    #this only stores one.
    common_and_same_version_mods = []
    #this stores a tuple of two.
    common_but_different_version_mods = []
    #these only store one.
    mods_only_in_list1 = []
    mods_only_in_list2 = []
    for mod in mod_list1:
        if mod in mod_list2:
            common_and_same_version_mods.append(mod)
            mod_list1.remove(mod)
            mod_list2.remove(mod)
        else:
            ratios = []
            for mod2 in mod_list2:
                ratios.append(SequenceMatcher(None, mod, mod2).ratio())
            if max(ratios) > 0.5:
                common_but_different_version_mods.append((mod, mod_list2[ratios.index(max(ratios))]))
                mod_list1.remove(mod)
                mod_list2.remove(mod_list2[ratios.index(max(ratios))])
    mods_only_in_list1 = mod_list1
    mods_only_in_list2 = mod_list2
    return common_and_same_version_mods, common_but_different_version_mods, mods_only_in_list1, mods_only_in_list2
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