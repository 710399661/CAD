# 资源文件

此目录用于存放应用的静态资源文件。

## 需要添加的文件

请在发布应用前添加以下资源文件：

- `icon.png` - 应用图标 (1024x1024)
- `adaptive-icon.png` - Android自适应图标
- `splash.png` - 启动屏图片
- `favicon.png` - Web端图标

## 资源规格

### 图标 (icon.png)
- 尺寸: 1024x1024 像素
- 格式: PNG
- 内容: 应用的主图标

### 自适应图标 (adaptive-icon.png)
- 前景层: 1024x1024 像素
- 背景层: 1024x1024 像素
- 格式: PNG

### 启动屏 (splash.png)
- 尺寸: 1284x2778 像素 (适合多种屏幕尺寸)
- 格式: PNG

## 生成资源

可以使用 Expo 的图标生成工具：
```bash
npx expo install @expo/image-utils
# 然后使用工具生成所需尺寸的图标
```
