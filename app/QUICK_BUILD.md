# 🎯 CAD看图王 APP - 快速构建指南

## ⚡ 5分钟快速开始

### 在你自己的电脑上：

1️⃣ **下载项目**
```
下载整个 /workspace/app 文件夹
```

2️⃣ **安装依赖**
```bash
cd app
npm install
```

3️⃣ **生成Android项目**
```bash
npx expo prebuild --platform android
```

4️⃣ **构建APK**
```bash
# Windows
cd android
gradlew.bat assembleDebug

# Mac/Linux
cd android
./gradlew assembleDebug
```

5️⃣ **安装APK**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📦 构建产物

**APK文件位置：**
```
app/android/app/build/outputs/apk/debug/app-debug.apk
```

**文件大小：** 30-50 MB

**是否需要网络：** 构建完成后可完全离线使用 ✅

---

## 🛠️ 快速修复

| 问题 | 解决方案 |
|------|---------|
| gradlew 不是命令 | Windows用 `gradlew.bat` |
| 下载慢 | 配置国内镜像 |
| SDK未找到 | 安装 Android Studio |
| 构建失败 | 检查 Node.js 版本 (16+) |

---

## 📱 测试APK功能

安装后可以测试：
- ✅ 登录功能
- ✅ 文件管理（添加/删除CAD文件）
- ✅ CAD图纸查看（缩放、旋转、平移）
- ✅ 测量工具（距离、面积、角度）
- ✅ 导出分享
- ✅ 完全离线使用

---

## 🎉 成功标志

看到以下输出表示构建成功：
```
BUILD SUCCESSFUL
app-debug.apk generated successfully
```

---

**详细文档：** [APK_BUILD_GUIDE.md](APK_BUILD_GUIDE.md)
