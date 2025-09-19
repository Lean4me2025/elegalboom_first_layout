# ElegalBoom — State-Aware with PDF Generation
Generated 2025-09-19.

This package adds:
- `package.json` with **stripe**, **pdfkit**, **nodemailer** for fulfillment.
- `/api/webhook.js` that **generates PDFs** from Markdown templates by token replacement.
- `/templates/` contains the 5 master templates (Universal Articles, Operating Agreement, NDA, Work-for-Hire, State Supplements).

## Environment variables (Vercel)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PUBLIC_BASE_URL` (e.g., https://elegalboom.com)

## Flow
1. Save intake (`/api/save-intake`) → returns `draftId`.
2. Create Checkout (`/api/create-checkout-session`) → embeds `draftId` in Stripe metadata.
3. Webhook (`/api/webhook`) → on success:
   - loads templates
   - fills placeholders like `[llc_name]` from answers
   - writes PDFs with pdfkit
   - TODO: upload to storage & email links (add your provider).

## Notes
- Replace placeholder Price IDs in `config/products.json`.
- Swap the minimal `/public/intake.html` with the full state-aware intake from the previous ZIP.
- For official state forms, you can later replace Markdown templates with **fillable PDF** versions and read them in the same pipeline.

