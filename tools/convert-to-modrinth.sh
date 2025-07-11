#!/bin/bash

# 转换Modrinth整合包脚本
# 功能：将所有mod转换为Modrinth格式并刷新整合包

# 检查是否在整合包根目录
if [ ! -f "pack.toml" ]; then
    echo "错误：请在整合包根目录（包含pack.toml）运行此脚本"
    exit 1
fi

# 检查./packwiz是否可用
if ! command -v ./packwiz &> /dev/null; then
    echo "错误：未检测到packwiz，请确保已安装并添加到PATH"
    exit 1
fi

# 1. 创建临时文件夹
echo "步骤1/4: 准备临时文件夹..."
TEMP_DIR="modrinth-mods"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# 2. 处理所有文件
echo "步骤2/4: 处理模组文件..."
success_count=0
copied_count=0
warnings=()

# 复制所有非.toml文件
find mods -maxdepth 1 -type f ! -name "*.pw.toml" -exec cp {} "$TEMP_DIR" \;

# 处理所有.pw.toml文件
for mod_file in mods/*.pw.toml; do
    if [ ! -f "$mod_file" ]; then
        continue  # 跳过未找到的文件
    fi
    
    mod_name=$(basename "$mod_file" .pw.toml)
    echo "处理: $mod_name"
    
    # 尝试创建Modrinth元数据
    if ./packwiz mr add "$mod_name" --meta-folder "$TEMP_DIR"; then
        ((success_count++))
    else
        # 失败时复制原始文件
        cp "$mod_file" "$TEMP_DIR"
        warnings+=("$mod_name")
        ((copied_count++))
    fi
done

# 显示警告信息
if [ ${#warnings[@]} -gt 0 ]; then
    echo -e "\n\033[33m警告: 以下模组未找到Modrinth项目，使用原始文件:\033[0m"
    printf ' - %s\n' "${warnings[@]}"
fi

# 3. 替换mods文件夹
echo "步骤3/4: 更新mods文件夹..."
rm -rf mods
mv "$TEMP_DIR" mods

# 4. 刷新整合包
echo "步骤4/4: 执行./packwiz refresh..."
./packwiz refresh

# 完成报告
echo -e "\n\033[32m操作完成!\033[0m"
echo "成功转换: $success_count 个模组"
echo "保留原始: $copied_count 个模组"