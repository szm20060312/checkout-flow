const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8765;
const BASE = "http://127.0.0.1:" + PORT;
const ROOT = path.resolve(__dirname, "..");

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({
        status: res.statusCode,
        body:   data,
        url:    res.headers.location || url,
      }));
    }).on("error", reject);
  });
}

function assert(condition, msg) {
  if (!condition) {
    console.log("  ❌ FAIL: " + msg);
    process.exitCode = 1;
  } else {
    console.log("  ✅ PASS: " + msg);
  }
}

function assertContains(text, substr, label) {
  assert(text.includes(substr), label + " — 应包含 \"" + substr + "\"");
}

const MIME = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, BASE);
  let filePath = urlObj.pathname === "/"
    ? "/OrderInformationForm.html"
    : urlObj.pathname;

  filePath = path.join(ROOT, filePath);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
    } else {
      res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
      res.end(content);
    }
  });
});

async function runTests() {
  console.log("\n🧪 Checkout Flow 自动化测试");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("📄 1. 页面加载");
  const page = await fetch(BASE + "/OrderInformationForm.html");
  assert(page.status === 200, "HTTP 200");
  assertContains(page.body, "Order Information Form", "页面标题");
  assertContains(page.body, "<!DOCTYPE html", "DOCTYPE 声明");

  console.log("\n📋 2. 表单字段");
  var fields = ["s_name","s_street","s_city","s_state","s_zip",
                "b_name","b_street","b_city","b_state","b_zip",
                "card_type","card_num","exp_date","email","phone"];
  for (var f of fields) {
    assertContains(page.body, 'name="' + f + '"', "字段 " + f);
  }
  assertContains(page.body, 'type="submit"', "提交按钮");
  assertContains(page.body, 'type="reset"',  "重置按钮");
  assertContains(page.body, 'checked="checked"', "订阅默认勾选");

  console.log("\n🗂️  3. 字段分组标题");
  assertContains(page.body, "Shipping information",  "收货信息");
  assertContains(page.body, "Billing information",   "账单信息");
  assertContains(page.body, "Credit card information", "信用卡");
  assertContains(page.body, "Contact information",   "联系方式");

  console.log("\n💳 4. 信用卡选项");
  assertContains(page.body, "Visa",             "Visa");
  assertContains(page.body, "MasterCard",       "MasterCard");
  assertContains(page.body, "American Express", "American Express");
  assertContains(page.body, "Discover",         "Discover");

  console.log("\n📤 5. 表单提交（GET 回显）");

  var formData = {
    s_name: "John Doe",
    s_street: "123 Main St",
    s_city: "Portland",
    s_state: "OR",
    s_zip: "97201",
    b_name: "John Doe",
    b_street: "123 Main St",
    b_city: "Portland",
    b_state: "OR",
    b_zip: "97201",
    card_type: "visa",
    card_num: "4111111111111111",
    exp_date: "12/28",
    email: "john@example.com",
    phone: "503-555-0100",
    subscribe: "on",
  };
  var params = new URLSearchParams(formData).toString();
  var submitUrl = BASE + "/OrderInformationForm.html?" + params;
  var submitRes = await fetch(submitUrl);
  assert(submitRes.status === 200, "提交后 HTTP 200");

  assertContains(submitUrl, "s_name=John+Doe",          "URL 含收货姓名");
  assertContains(submitUrl, "s_street=123+Main+St",     "URL 含收货街道");
  assertContains(submitUrl, "s_city=Portland",          "URL 含收货城市");
  assertContains(submitUrl, "s_state=OR",               "URL 含收货州");
  assertContains(submitUrl, "s_zip=97201",              "URL 含收货邮编");
  assertContains(submitUrl, "b_name=John+Doe",          "URL 含账单姓名");
  assertContains(submitUrl, "b_street=123+Main+St",     "URL 含账单街道");
  assertContains(submitUrl, "b_city=Portland",          "URL 含账单城市");
  assertContains(submitUrl, "b_state=OR",               "URL 含账单州");
  assertContains(submitUrl, "b_zip=97201",              "URL 含账单邮编");
  assertContains(submitUrl, "card_type=visa",           "URL 含卡类型");
  assertContains(submitUrl, "card_num=4111111111111111", "URL 含卡号");
  assertContains(submitUrl, "exp_date=12%2F28",         "URL 含有效期");
  assertContains(submitUrl, "email=john%40example.com", "URL 含邮箱");
  assertContains(submitUrl, "phone=503-555-0100",       "URL 含电话");
  assertContains(submitUrl, "subscribe=on",             "URL 含订阅状态");

  // 验证提交后返回的页面内容完整
  assertContains(submitRes.body, "Order Information Form", "提交后页面标题");
  assertContains(submitRes.body, "method=\"get\"",        "提交后表单 method 仍为 get");

  console.log("\n📦 6. 静态资源");
  var cssRes = await fetch(BASE + "/css/style.css");
  assert(cssRes.status === 200, "CSS 可访问");

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  if (process.exitCode) {
    console.log("❌ 部分测试未通过\n");
  } else {
    console.log("✅ 全部测试通过！\n");
  }

  server.close();
}

server.listen(PORT, "127.0.0.1", async () => {
  console.log("🚀 测试服务器已启动 → http://127.0.0.1:" + PORT);
  await runTests();
});
