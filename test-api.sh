#!/bin/bash

echo "========================================="
echo "CAD看图王 API 测试"
echo "========================================="
echo ""

# 检查服务器是否运行
echo "1. 检查服务器状态..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "   ✅ 服务器正在运行"
else
    echo "   ❌ 服务器未运行，尝试启动..."
    cd /workspace
    npm run dev &
    sleep 5
fi

echo ""
echo "2. 获取首页内容..."
RESPONSE=$(curl -s http://localhost:5173)
if echo "$RESPONSE" | grep -q "CAD"; then
    echo "   ✅ 首页加载成功"
    echo "$RESPONSE" | grep -o '<title>.*</title>'
else
    echo "   ❌ 首页加载失败"
fi

echo ""
echo "3. 检查登录页面..."
if echo "$RESPONSE" | grep -q "邮箱\|password"; then
    echo "   ✅ 登录表单存在"
else
    echo "   ❌ 登录表单未找到"
fi

echo ""
echo "========================================="
echo "测试完成"
echo "========================================="
echo ""
echo "请在本地浏览器访问: http://localhost:5173"
echo "然后使用账号: 1@qq.com 密码: 1 登录"