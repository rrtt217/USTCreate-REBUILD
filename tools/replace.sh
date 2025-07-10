#!/bin/bash

# 检查参数是否正确
if [ $# -ne 1 ]; then
  echo "用法: $0 <目录路径>"
  exit 1
fi

target_dir="$1"

# 验证目录是否存在
if [ ! -d "$target_dir" ]; then
  echo "错误: 目录 $target_dir 不存在"
  exit 1
fi

# 处理每个文件的函数
process_file() {
  local file="$1"
  echo "正在处理文件: $file"
  
  # 用户选择替换选项
  PS3="请选择替换选项 (输入数字): "
  options=("both" "server" "client" "跳过此文件" "退出脚本")
  select replace_with in "${options[@]}"; do
    case $replace_with in
      "both"|"server"|"client")
        echo "已将 'both' 替换为: $replace_with"
        sed -i "s/\bboth\b/$replace_with/g" "$file"
        return 0
        ;;
      "跳过此文件")
        echo "跳过文件: $file"
        return 0
        ;;
      "退出脚本")
        echo "退出脚本"
        exit 0
        ;;
      *)
        echo "无效选项! 请选择 1-5"
        ;;
    esac
  done < /dev/tty  # 从终端直接读取输入
}

# 创建文件列表数组
file_list=()
while IFS= read -r -d $'\0' file; do
  file_list+=("$file")
done < <(find "$target_dir" -type f -name "*.toml" -print0)

# 处理每个文件
echo "找到 ${#file_list[@]} 个 .toml 文件"
for file in "${file_list[@]}"; do
  process_file "$file"
done

echo "所有文件处理完成!"