import { test, expect } from '@playwright/test';

test.describe('CAD看图王功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('登录功能', async ({ page }) => {
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 输入邮箱
    const emailInput = page.locator('input[placeholder="邮箱"]');
    await expect(emailInput).toBeVisible();
    await emailInput.fill('1@qq.com');
    
    // 输入密码
    const passwordInput = page.locator('input[placeholder="密码"]');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('1');
    
    // 点击登录按钮
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    
    // 等待跳转到dashboard
    await page.waitForURL('**/dashboard');
    
    // 验证登录成功
    await expect(page.locator('text=我的文件')).toBeVisible();
  });

  test('上传文件按钮', async ({ page }) => {
    // 先登录
    await page.locator('input[placeholder="邮箱"]').fill('1@qq.com');
    await page.locator('input[placeholder="密码"]').fill('1');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard');
    
    // 点击上传按钮
    const uploadButton = page.locator('button:has-text("上传文件")');
    await expect(uploadButton).toBeVisible();
    
    // 验证按钮可以被点击（检查样式）
    const buttonStyles = await uploadButton.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    expect(buttonStyles).toBe('pointer');
  });

  test('文件列表点击', async ({ page }) => {
    // 先登录
    await page.locator('input[placeholder="邮箱"]').fill('1@qq.com');
    await page.locator('input[placeholder="密码"]').fill('1');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard');
    
    // 验证文件列表容器存在
    const emptyState = page.locator('text=暂无文件');
    await expect(emptyState).toBeVisible();
  });

  test('首页按钮', async ({ page }) => {
    // 先登录
    await page.locator('input[placeholder="邮箱"]').fill('1@qq.com');
    await page.locator('input[placeholder="密码"]').fill('1');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard');
    
    // 点击首页按钮
    const homeButton = page.locator('button:has-text("首页")');
    await expect(homeButton).toBeVisible();
    await homeButton.click();
    
    // 应该还在dashboard页面
    await expect(page.locator('text=我的文件')).toBeVisible();
  });
});