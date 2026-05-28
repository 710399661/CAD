# CAD看图王 - 移动版

专业的CAD图纸查看工具，支持Android和iOS平台。

## 功能特性

- 📁 CAD文件管理：支持导入、查看和管理DXF/DWG/SVG等格式的CAD文件
- 🔍 图纸查看：支持缩放、旋转、平移等操作
- 📐 测量工具：支持距离、面积、角度测量
- 📤 导出分享：支持将图纸导出为图片并分享
- 🎨 简洁界面：直观易用的用户界面

## 技术栈

- React Native + Expo
- Redux Toolkit (状态管理)
- React Navigation (导航)
- React Native SVG (图纸渲染)
- Expo Document Picker (文件选择)

## 开发环境配置

1. 安装依赖：
```bash
cd app
npm install
```

2. 启动开发服务器：
```bash
npm start
```

3. 在设备上运行：
   - Android: 按 `a` 键
   - iOS: 按 `i` 键
   - 或使用 Expo Go 应用扫描二维码

## 项目结构

```
app/
├── assets/              # 静态资源
├── screens/             # 页面组件
│   ├── LoginScreen.tsx      # 登录页
│   ├── DashboardScreen.tsx  # 文件列表页
│   └── ViewerScreen.tsx     # 图纸查看页
├── store/               # Redux状态管理
│   └── index.ts
├── types/               # TypeScript类型定义
│   └── index.ts
├── utils/               # 工具函数
│   └── cadParser.ts         # CAD文件解析
├── App.tsx              # 主入口
├── app.json             # Expo配置
├── babel.config.js      # Babel配置
├── package.json         # 项目依赖
└── tsconfig.json        # TypeScript配置
```

## 页面说明

### LoginScreen
- 用户登录界面
- 输入邮箱和密码进行登录

### DashboardScreen
- 文件管理界面
- 显示用户的CAD文件列表
- 支持添加新文件、删除文件
- 点击文件进入查看界面

### ViewerScreen
- 图纸查看和编辑界面
- 工具栏：平移、距离测量、面积测量、角度测量
- 缩放和旋转控制
- 测量结果显示
- 导出分享功能

## 构建发布

### Android构建
```bash
npm run build:android
```

### iOS构建
```bash
npm run build:ios
```

## 注意事项

1. 确保设备有足够的存储空间
2. 首次使用需要授予文件访问权限
3. 大尺寸CAD文件可能需要较长的加载时间

## 许可证

MIT License
