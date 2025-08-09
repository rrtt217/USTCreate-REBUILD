#!/bin/bash

# 扫描mods目录中的.toml文件
for file in mods/*.toml; do
  # 检查文件是否包含side = "client"
  if grep -q 'side = "client"' "$file"; then
    # 提取模组名称（去掉.pw.toml后缀）
    mod_name=$(basename "$file" .pw.toml)
    
    echo "更新客户端模组: $mod_name"
    ./packwiz update "$mod_name"
  fi
done

echo "所有客户端模组更新完成！"