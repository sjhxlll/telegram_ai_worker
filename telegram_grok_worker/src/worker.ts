export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname !== `/webhook/${env.TELEGRAM_TOKEN}`) {
      return new Response("Not found", { status: 404 });
    }

    const update = await request.json();
    const chat_id = update.message?.chat.id;
    const text = update.message?.text || "";

    let model = env.DEFAULT_MODEL;
    const modelMatch = text.match(/^\/model\s+([\w\-\.]+)/);
    if (modelMatch) {
      model = modelMatch[1];
      await sendMessage(chat_id, `✅ 模型已切换为 \\`${model}\\``, env);
      return new Response("ok");
    }

    const payload = {
      model,
      messages: [{ role: "user", content: text }]
    };

    const response = await fetch(`${env.OPENAI_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const json = await response.json();
    const reply = json.choices?.[0]?.message?.content || "❌ 无响应";

    await sendMessage(chat_id, reply, env);
    return new Response("ok");
  }
};

async function sendMessage(chat_id: number, text: string, env: any) {
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "Markdown" })
  });
}
