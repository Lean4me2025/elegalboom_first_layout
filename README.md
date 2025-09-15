# eLegalBoom Intake (Interim)
A minimal intake funnel you can deploy on **Vercel** and link from your GoDaddy placeholder site. Visitors click “Request a Document” → fill this form → you receive the request and fulfill it. Optionally pair with **Stripe** (pay-first or pay-after).

## Deploy (Quick)
1. Create a new GitHub repo and add these files.
2. Import the repo into **Vercel**. Accept defaults.
3. After deploy, you'll have a URL like `https://init-elegalboom.vercel.app`. Use that in GoDaddy as the **Request** link.

## Link from GoDaddy
- Add a button or change the Contact form's redirect to: `https://YOUR-VERCEL-URL/` (or `/index.html`).
- You can also deep-link a doc type: `https://YOUR-VERCEL-URL/?doc=LLC`.

## Optional: Stripe → Intake
1. Create Stripe **Payment Links** or a **Checkout Session** per doc type.
2. Set Checkout **success_url** to:
   ```
   https://YOUR-VERCEL-URL/?sid={CHECKOUT_SESSION_ID}&doc=LLC
   ```
3. The intake page will carry `sid` forward for reconciliation. Use Stripe **webhooks** in your main app if desired.

## Data Capture
This sample forwards submissions to a **Google Apps Script** webhook if you set the env var `APPS_SCRIPT_WEBHOOK` in Vercel.
- In Vercel → Project → Settings → Environment Variables:
  - `APPS_SCRIPT_WEBHOOK` = `https://script.google.com/macros/s/YOUR-DEPLOYMENT-ID/exec`

### Google Apps Script (paste into a new script attached to a Google Sheet)
```javascript
function doPost(e) {
  const ss = SpreadsheetApp.openById('YOUR_SHEET_ID');
  const sh = ss.getSheetByName('Requests') || ss.insertSheet('Requests');
  const data = JSON.parse(e.postData.contents);
  const headers = ['timestamp','order_id','stripe_session_id','name','email','doc_type','urgency','details'];
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  sh.appendRow([new Date(), data.order_id||'', data.stripe_session_id||'', data.name||'', data.email||'', data.doc_type||'', data.urgency||'', data.details||'']);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}
```

- Deploy as **Web app**: `Execute as Me`, `Anyone` may access (or restricted with token if you prefer). Copy the web app URL into Vercel's `APPS_SCRIPT_WEBHOOK` env var.

## Local Editing
Static files:
- `index.html` — intake form (generates `order_id`, parses `?doc` and `?sid`)
- `success.html` — confirmation page
- `styles.css` — minimal dark UI

Serverless:
- `api/submit.js` — receives POST, forwards to Apps Script (if configured), redirects to success.

## Compliance
The top bar and checkbox remind users: *AI-powered doc prep, not a law firm.* You can tune the language as needed.

## Next Steps
- Add email confirmation (use your main app or a service like Resend/SendGrid) keyed on `order_id`.
- Build Stripe webhooks in your main app to mark orders as paid.
- Add per-document dynamic fields (e.g., for LLC: state, members, capital splits). A simple approach is to show/hide fields based on the selected `doc_type` with a small JS snippet.

© 2025 eLegalBoom
