# Telegram AI Bot (Cloudflare Workers)

一个支持自定义 AI 模型（如 grok-3, gemini）的 Telegram 聊天机器人，部署在 Cloudflare Workers 上。

## 🚀 部署步骤

1. 安装 wrangler
```bash
npm install -g wrangler
```

2. 修改 `wrangler.toml` 中的 Token 和 API 地址

3. 登录 Cloudflare
```bash
wrangler login
```

4. 发布项目
```bash
wrangler publish
```

5. 设置 Telegram Webhook
```bash
curl -X POST https://api.telegram.org/bot<你的Token>/setWebhook \
  -d "url=https://<你的workers地址>/webhook/<你的Token>"
```

## ✅ 支持命令

- `/model grok-3` 切换模型
- 直接发送消息开始对话
