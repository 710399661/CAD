# CAD看图王 - 本地APK构建指南

## 方法一：使用 Expo 云端构建（推荐）

### 步骤1：注册 Expo 账号
1. 访问 https://expo.dev/signup
2. 免费注册一个账号

### 步骤2：构建APK
```bash
# 登录Expo
eas login

# 配置项目
eas build:configure --platform android

# 构建APK（预览版）
eas build --platform android --profile preview
```

构建完成后会生成APK下载链接。

---

## 方法二：本地构建（需要Android SDK）

### 前置要求
1. Node.js 16+
2. Android Studio（含Android SDK）
3. Java Development Kit (JDK) 11+

### 步骤1：生成本地Android项目
```bash
cd /workspace/app
npx expo prebuild --platform android
```

### 步骤2：打开Android项目
```bash
# 使用Android Studio打开
cd android
open android/
```

### 步骤3：在Android Studio中构建
1. 点击菜单：Build > Generate Signed Bundle / APK
2. 选择 APK
3. 选择 build variant: release 或 debug
4. 配置签名（release需要）
5. 点击 Build

### 步骤4：获取APK
构建完成后，APK位于：
- `android/app/build/outputs/apk/debug/app-debug.apk` (debug版)
- `android/app/build/outputs/apk/release/app-release.apk` (release版)

---

## 方法三：使用命令行构建

```bash
cd /workspace/app

# 生成本地Android项目
npx expo prebuild --platform android

# 进入Android目录
cd android

# 构建Debug APK
./gradlew assembleDebug

# APK位置
ls -la app/build/outputs/apk/debug/
```

## 快速开始（推荐新用户）

如果你只是想快速测试应用，最简单的方法是：

```bash
cd /workspace/app
npm start
```

然后使用 **Expo Go** 手机应用扫描二维码，直接在手机上运行和测试！

---

## 常见问题

### Q: 构建很慢怎么办？
A: 首次构建需要下载大量依赖，建议保持网络连接稳定。

### Q: 报错 "Command failed"？
A: 确保已安装所有依赖：`npm install`

### Q: 如何生成签名密钥？
A: 在Android Studio中：Build > Generate Signed Bundle / APK > Create New

### Q: APK能离线使用吗？
A: 可以！构建的APK包含所有必要的JavaScript代码，无需Metro服务器。
