#!/bin/bash

# 检测并删除包含optional = true的mod文件
find mods -name "*.toml" -type f | while read -r file; do
    if grep -q "optional = true" "$file"; then
        echo "Removing optional mod: $file"
        rm "$file"
    fi
done

# 根据参数执行对应的构建脚本
case "$1" in
    curseforge)
        ./build/build-curseforge-client.sh
        ;;
    modrinth)
        ./build/build-modrinth.sh
        ;;
    *)
        echo "Usage: $0 {curseforge|modrinth}"
        exit 1
        ;;
esac
