@echo off
chcp 65001 > nul
echo ========================================
echo   CAD看图王 APK 构建脚本
echo ========================================
echo.

REM 检查是否在app目录
if not exist "package.json" (
    echo 错误：请在 app 目录下运行此脚本
    pause
    exit /b 1
)

REM 步骤1：安装依赖
echo 步骤1/4：安装依赖...
call npm install
if errorlevel 1 (
    echo 错误：npm install 失败
    pause
    exit /b 1
)
echo ✓ 依赖安装完成
echo.

REM 步骤2：生成本地Android项目
echo 步骤2/4：生成本地Android项目...
call npx expo prebuild --platform android --clean
if errorlevel 1 (
    echo 错误：prebuild 失败
    pause
    exit /b 1
)
echo ✓ Android项目生成完成
echo.

REM 步骤3：构建Debug APK
echo 步骤3/4：构建Debug APK...
cd android
call gradlew assembleDebug
if errorlevel 1 (
    echo 错误：Gradle构建失败
    pause
    exit /b 1
)
cd ..
echo ✓ Debug APK构建完成
echo.

REM 步骤4：显示APK位置
echo ========================================
echo   APK构建成功！
echo ========================================
echo.
echo APK文件位置：
dir android\app\build\outputs\apk\debug\*.apk
echo.
echo 安装命令：
echo   adb install android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 或者将APK文件复制到手机安装
echo.

pause
