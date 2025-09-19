import Stripe from "stripe";
import products from "../config/products.json" assert { type: "json" };
import { getAnswers } from "./save-intake.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { product, draftId } = req.body || {};
  if (!product || !draftId) return res.status(400).json({ error: "Missing product or draftId" });

  const cfg = products[product];
  if (!cfg) return res.status(400).json({ error: "Unknown product" });

  // Optionally validate required fields here (state-specific rules).
  // const record = getAnswers(draftId); validate(record.answers)

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: cfg.priceId, quantity: 1 }],
    success_url: `${process.env.PUBLIC_BASE_URL || "https://example.com"}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.PUBLIC_BASE_URL || "https://example.com"}/cancel`,
    metadata: { product, draftId }
  });

  res.json({ id: session.id });
}
