# Checkout Flow — 订单信息表单

一个用于练习前端表单交互和浏览器自动化测试的静态结账表单页面。

## 项目结构

```
checkout-flow/
├── OrderInformationForm.html    # 主页面 — 结账表单
├── README.md                    # 本文件
├── css/
│   └── style.css                # 全局样式
├── js/
│   └── helloworld.js            # JavaScript 练习文件
└── img/
    ├── logo.png
    ├── self.png
    └── star.png
```

## 表单包含的字段

### 1. 收货信息（Shipping）
- Name · Street · City · State (2 char) · Zip (5 digit)

### 2. 账单信息（Billing）
- Name · Street · City · State (2 char) · Zip (5 digit)

### 3. 信用卡信息（Credit Card）
- Card Type — 下拉选择（Visa / MasterCard / Amex / Discover）
- Card Number
- Expiration Date

### 4. 联系方式（Contact）
- E-mail · Phone
- 订阅复选框（默认勾选）

### 5. 操作按钮
- **Submit** — 以 GET 方式提交到当前页面，数据呈现在 URL 参数中
- **Clear** — 重置所有字段

## 本地运行

使用任意 HTTP 服务器运行：

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server

# 或直接用浏览器打开 HTML 文件
open OrderInformationForm.html
```

然后访问 `http://localhost:8000` 即可查看表单。

## 测试结果

所有字段均通过浏览器自动化测试（使用 Codex in-app Browser）：

| 模块 | 状态 |
|------|------|
| 收货信息 | ✅ 填写完成 |
| 账单信息 | ✅ 填写完成 |
| 信用卡信息 | ✅ Visa 选中，卡号 & 有效期已填 |
| 联系方式 | ✅ 邮箱、电话已填，订阅默认勾选 |
| 表单提交 | ✅ 成功，所有字段正确出现在 URL 参数中 |

## 技术说明

- 使用 **XHTML 1.0 Strict** 标准
- 表单使用 `method="get"`，提交后数据以 query string 形式回显
- **无客户端校验** — 适合作为教学示范或自动化测试的目标页面
- **无后端处理** — 适合静态演示或前端练习

## 可能的扩展方向

- 添加 JavaScript 前端校验（卡号格式、必填字段、邮箱格式等）
- 改用 `method="post"` 并对接后端处理
- 添加「Same as shipping」按钮一键复制收货信息到账单
- 美化 UI，适配移动端
