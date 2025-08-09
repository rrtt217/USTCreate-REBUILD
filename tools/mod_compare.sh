#!/bin/bash
set -e

# 保存当前分支
original_branch=$(git branch --show-current)
echo "当前分支: $original_branch"

# 创建输出目录
mkdir -p build/versioncheck

# 步骤1-2：生成modlist_2.txt
echo "生成 modlist_2.txt..."
./packwiz list -v > build/versioncheck/modlist_2.txt
find mods -name "*.jar" -exec basename {} \; >> build/versioncheck/modlist_2.txt

# 步骤3：更新并切换到 upstream/main
echo "更新并切换到 upstream/main..."
git pull upstream && git checkout upstream/main

# 步骤4：生成modlist_1.txt
echo "生成 modlist_1.txt..."
find mods -name "*.jar" -exec basename {} \; > build/versioncheck/modlist_1.txt

# 步骤5：切回原始分支
echo "切回原始分支 $original_branch..."
git checkout "$original_branch"

# 步骤6：执行比较脚本
echo "执行版本比较..."
python3 tools/mod_compare.py \
  build/versioncheck/modlist_1.txt \
  build/versioncheck/modlist_2.txt

echo "版本比较完成！"