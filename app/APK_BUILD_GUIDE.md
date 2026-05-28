# CAD看图王 - APK构建完整指南

## 🚀 最快方式：使用构建脚本（推荐）

我已经为你准备好了构建脚本，只需在你自己的电脑上运行即可！

### Windows 用户
1. 下载整个 `/workspace/app` 文件夹到本地
2. 进入 `app` 目录
3. 双击运行 `build-apk.bat`
4. 等待构建完成（首次需要5-20分钟）

### Mac/Linux 用户
1. 下载整个 `/workspace/app` 文件夹到本地
2. 进入 `app` 目录
3. 在终端运行：
```bash
chmod +x build-apk.sh
./build-apk.sh
```
4. 等待构建完成

---

## 📋 详细步骤

### 第一步：准备工作

#### 1. 安装 Node.js
- 下载地址：https://nodejs.org/
- 推荐安装 Node.js 18 LTS 版本

#### 2. 安装 Android Studio
- 下载地址：https://developer.android.com/studio
- 安装时确保选择 "Android SDK" 和 "Android Virtual Device"

#### 3. 配置环境变量
确保以下命令可用：
```bash
node --version
npm --version
```

### 第二步：获取项目代码

从本仓库下载 `/workspace/app` 文件夹到本地电脑。

### 第三步：安装依赖
```bash
cd app
npm install
```

### 第四步：生成本地Android项目
```bash
npx expo prebuild --platform android
```

### 第五步：构建APK

#### 方法A：使用Android Studio（图形界面）
1. 打开 Android Studio
2. 选择 "Open an existing project"
3. 选择 `app/android` 文件夹
4. 等待索引和同步完成
5. 菜单：Build > Build Bundle(s) / APK(s) > Build APK(s)
6. 等待构建完成
7. 点击 "locate" 查看APK文件

#### 方法B：使用命令行
```bash
cd app/android
./gradlew assembleDebug    # Windows用 gradlew.bat
```

### 第六步：安装APK

#### 使用ADB安装（需要USB调试）
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### 直接安装
将APK文件复制到手机存储，通过文件管理器点击安装。

---

## 📱 快速测试（不构建APK）

如果你只是想快速测试应用功能：

```bash
cd app
npm start
```

然后：
1. 在手机上安装 **Expo Go** 应用
2. 打开 Expo Go，扫描终端显示的二维码
3. 即可在手机上测试应用

---

## ❓ 常见问题

### Q1: 提示 "gradlew不是内部或外部命令"？
**解决**：在 Windows 上使用 `gradlew.bat` 而不是 `./gradlew`

### Q2: Gradle下载很慢或超时？
**解决**：
- 确保网络稳定
- 可以配置国内镜像：
  在 `android/gradle/wrapper/gradle-wrapper.properties` 中添加：
  ```
  distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.3-all.zip
  ```

### Q3: Android SDK 未找到？
**解决**：
1. 打开 Android Studio
2. Menu > Tools > SDK Manager
3. 确保已安装 SDK Platform 和 Build Tools

### Q4: 构建失败 "Could not find tools.jar"？
**解决**：
1. 确保已安装 JDK（不是 JRE）
2. 设置 JAVA_HOME 环境变量指向 JDK 目录

### Q5: 生成的APK可以离线使用吗？
**答案**：是的！Debug APK 包含所有必要的代码，可以完全离线使用。

---

## 🎯 构建成功后的APK位置

```
app/android/app/build/outputs/apk/debug/app-debug.apk
```

文件大小通常是 30-50MB。

---

## 📞 需要帮助？

如果遇到问题，请检查：
1. Node.js 版本（需要 16+）
2. Android Studio 和 SDK 是否正确安装
3. 网络连接是否稳定
4. 是否有足够的磁盘空间（建议 10GB+）

---

## 🔧 高级配置

### Release 版本构建
```bash
cd android
./gradlew assembleRelease
```

### 自定义应用图标
1. 准备 1024x1024 的图标图片
2. 放入 `app/assets/` 目录
3. 修改 `app.json` 中的 icon 路径

### 修改应用包名
在 `app.json` 中修改：
```json
{
  "android": {
    "package": "com.yourcompany.yourapp"
  }
}
```

---

祝你构建成功！🎉
