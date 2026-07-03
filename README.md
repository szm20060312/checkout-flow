# Checkout Flow — 订单信息表单

一个用于练习前端表单交互和浏览器自动化测试的静态结账表单页面。

## 项目结构

```
checkout-flow/
├── OrderInformationForm.html    # 主页面 — 结账表单
├── README.md                    # 项目说明
├── css/
│   └── style.css                # 全局样式
├── js/
│   └── helloworld.js            # JavaScript 练习文件
├── img/
│   ├── logo.png
│   ├── self.png
│   └── star.png
└── test/
    └── checkout-test.js         # 自动化测试脚本
```

## 表单包含的字段

### 1. 收货信息（Shipping）
Name · Street · City · State (2 char) · Zip (5 digit)

### 2. 账单信息（Billing）
Name · Street · City · State (2 char) · Zip (5 digit)

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

使用任意 HTTP 服务器：

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server

# 直接打开
open OrderInformationForm.html
```

访问 `http://localhost:8000` 查看表单。

## 自动化测试

使用 **Node.js 内置模块**编写，**无需安装任何依赖**。

### 运行

```bash
node test/checkout-test.js
```

测试脚本会自动启动 HTTP 服务器（端口 8765），执行完测试后自动关闭。

### 测试项

| # | 模块 | 测试内容 |
|---|------|----------|
| 1 | 页面加载 | HTTP 200 / 页面标题 / DOCTYPE 声明 |
| 2 | 表单字段 | 15 个 input 字段 + submit/reset 按钮 + 订阅默认勾选 |
| 3 | 字段分组 | 4 个 fieldset 标题完整 |
| 4 | 信用卡选项 | Visa / MasterCard / Amex / Discover |
| 5 | 表单提交 | 构造 GET 请求，验证 16 个 URL 参数正确编码；提交后页面仍完整返回 |
| 6 | 静态资源 | CSS 文件可访问 |

### 实测结果

```
🚀 测试服务器已启动 → http://127.0.0.1:8765

📄 1. 页面加载                      ✅ 全部通过
📋 2. 表单字段（18 项）              ✅ 全部通过
🗂️  3. 字段分组标题（4 项）          ✅ 全部通过
💳 4. 信用卡选项（4 项）             ✅ 全部通过
📤 5. 表单提交（18 项）              ✅ 全部通过
📦 6. 静态资源                      ✅ 全部通过

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 全部测试通过！
```

### 测试脚本说明

`test/checkout-test.js` 的关键设计：

- **零依赖**：仅使用 `http` / `fs` / `path` 内置模块
- **自托管**：内嵌 HTTP 服务器，无需额外启动
- **URL 编码验证**：`new URLSearchParams()` + `encodeURIComponent` 确保特殊字符正确转义
- **请求参数隔离**：使用 `URL` 构造函数解析请求路径，正确处理带 query string 的 GET 请求

## 技术说明

- **XHTML 1.0 Strict** 标准
- 表单 `method="get"`，提交后数据以 query string 回显
- **无客户端校验** — 适合教学或自动化测试目标页面
- **无后端处理** — 纯静态演示

## 可能的扩展方向

- 添加 JavaScript 前端校验（卡号格式、必填字段、邮箱格式等）
- 改用 `method="post"` 并对接后端处理
- 添加「Same as shipping」按钮一键复制收货信息到账单
- 美化 UI，适配移动端
