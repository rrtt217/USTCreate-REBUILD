#!/bin/bash
set -e

# 使用说明
usage() {
    echo "用法: $0 [分支1] [分支2]"
    echo "如果没有指定分支，则使用默认分支 (upstream/main 和 当前分支)"
    echo "示例:"
    echo "  $0                   # 对比 upstream/main 和当前分支"
    echo "  $0 main              # 对比 main 和当前分支"
    echo "  $0 main dev-modrinth # 对比 main 和 dev-modrinth 分支"
    exit 1
}

# 解析参数
if [ $# -eq 1 ]; then
    # 一个参数: 对比指定分支和当前分支
    branch1="$1"
    branch2=$(git branch --show-current)
elif [ $# -eq 2 ]; then
    # 两个参数: 对比两个指定分支
    branch1="$1"
    branch2="$2"
elif [ $# -eq 0 ]; then
    # 没有参数: 使用默认分支
    branch1="upstream/main"
    branch2=$(git branch --show-current)
else
    echo "错误: 参数数量不正确"
    usage
fi

# 验证分支是否存在
echo "检查分支 '$branch1'..."
if ! git rev-parse --verify --quiet "$branch1" >/dev/null 2>&1; then
    echo "错误: 分支 '$branch1' 不存在"
    usage
fi

echo "检查分支 '$branch2'..."
if ! git rev-parse --verify --quiet "$branch2" >/dev/null 2>&1; then
    echo "错误: 分支 '$branch2' 不存在"
    usage
fi

# 保存当前分支
current_branch=$(git branch --show-current)
echo "当前分支: $current_branch"

# 创建输出目录
mkdir -p build/versioncheck

echo "开始分支对比: $branch1 vs $branch2"

# 切换到第一个分支并生成modlist_1.txt
echo "切换到分支 '$branch1'..."
git checkout "$branch1"

echo "生成 modlist_1.txt..."
git fetch
./packwiz list -v > build/versioncheck/modlist_1.txt
find mods -name "*.jar" -exec basename {} \; >> build/versioncheck/modlist_1.txt

# 切换到第二个分支并生成modlist_2.txt
echo "切换到分支 '$branch2'..."
git checkout "$branch2"

echo "生成 modlist_2.txt..."
./packwiz list -v > build/versioncheck/modlist_2.txt
find mods -name "*.jar" -exec basename {} \; >> build/versioncheck/modlist_2.txt

# 切回原始分支
echo "切回原始分支 $current_branch..."
git checkout "$current_branch"

# 执行比较脚本
echo "执行版本比较..."
tools/mod_compare.py \
  build/versioncheck/modlist_1.txt \
  build/versioncheck/modlist_2.txt

echo "分支对比完成 ($branch1 vs $branch2)!"
echo "结果文件: build/versioncheck/"
ls build/versioncheck/