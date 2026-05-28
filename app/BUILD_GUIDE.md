# CAD看图王 - 安卓APK构建指南

## 前置要求
1. Node.js 16 或更高版本
2. npm 或 yarn 包管理器
3. 一个 Expo 账户（免费即可）

## 步骤一：安装依赖
```bash
# 进入app目录
cd /workspace/app

# 安装项目依赖
npm install
```

## 步骤二：安装EAS CLI
```bash
npm install -g eas-cli
```

## 步骤三：登录Expo
```bash
eas login
```

## 步骤四：配置项目
```bash
eas build:configure
```

## 步骤五：创建必要的图标文件

在 `app/assets/` 目录下创建以下文件：

1. **icon.png** (1024x1024)
2. **adaptive-icon.png** (1024x1024) 
3. **splash.png** (1284x2778)
4. **favicon.png** (48x48)

## 步骤六：构建APK
```bash
# 构建预览版APK
eas build --platform android --profile preview
```

## 使用 Expo Go 测试（可选）
如果不想完整构建，可以直接测试：
```bash
npm start
```
然后在手机上安装 Expo Go 应用并扫描二维码即可测试！

## 注意事项
1. 首次构建会比较久（通常需要5-20分钟
2. 确保网络连接稳定
3. 使用预览版APK可以直接安装到安卓手机上测试
