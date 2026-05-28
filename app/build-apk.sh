#!/bin/bash

# CAD看图王 - APK构建脚本
# 使用方法：在本地电脑上运行此脚本

echo "=== CAD看图王 APK 构建脚本 ==="
echo ""

# 检查是否在app目录
if [ ! -f "package.json" ]; then
    echo "错误：请在 app 目录下运行此脚本"
    exit 1
fi

# 步骤1：安装依赖
echo "步骤1/4：安装依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "错误：npm install 失败"
    exit 1
fi
echo "✓ 依赖安装完成"
echo ""

# 步骤2：生成本地Android项目
echo "步骤2/4：生成本地Android项目..."
npx expo prebuild --platform android --clean
if [ $? -ne 0 ]; then
    echo "错误：prebuild 失败"
    exit 1
fi
echo "✓ Android项目生成完成"
echo ""

# 步骤3：构建Debug APK
echo "步骤3/4：构建Debug APK..."
cd android
./gradlew assembleDebug
if [ $? -ne 0 ]; then
    echo "错误：Gradle构建失败"
    exit 1
fi
cd ..
echo "✓ Debug APK构建完成"
echo ""

# 步骤4：显示APK位置
echo "步骤4/4：APK构建成功！"
echo ""
echo "APK文件位置："
ls -lh android/app/build/outputs/apk/debug/*.apk
echo ""
echo "安装命令："
echo "adb install android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "或者将APK文件复制到手机安装："
echo "adb push android/app/build/outputs/apk/debug/app-debug.apk /sdcard/Download/"
