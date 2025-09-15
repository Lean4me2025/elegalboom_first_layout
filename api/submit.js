// Vercel Serverless Function: /api/submit
// Receives POSTed form data from /index.html, validates minimal fields,
// and forwards to your Google Apps Script webhook OR stores in Vercel KV/Sheet backend.
// Finally redirects user to /success.html.

export const config = { runtime: "edge" };

function badRequest(msg) {
  return new Response(JSON.stringify({ error: msg }), {
    status: 400,
    headers: { "content-type": "application/json" },
  });
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return badRequest("Method not allowed");
  }

  const formData = await req.formData();
  const payload = Object.fromEntries(formData.entries());

  const required = ["name", "email", "doc_type", "order_id"];
  for (const f of required) {
    if (!payload[f] || String(payload[f]).trim() === "") {
      return badRequest(`Missing required field: ${f}`);
    }
  }

  // Example: forward to Google Apps Script endpoint (set in ENV as APPS_SCRIPT_WEBHOOK)
  const hook = process.env.APPS_SCRIPT_WEBHOOK;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // Log but do not block user redirect
      console.error("Webhook error:", e);
    }
  }

  // Redirect to success page
  const url = new URL(req.url);
  const successUrl = `${url.protocol}//${url.host}/success.html`;
  return Response.redirect(successUrl, 303);
}
