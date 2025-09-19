import Stripe from "stripe";
import { buffer } from "micro";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import products from "../config/products.json" assert { type: "json" };
import { getAnswers } from "./save-intake.js";

export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { product, draftId } = session.metadata || {};
    const email = session.customer_details?.email;
    try {
      const cfg = products[product];
      const record = getAnswers(draftId);
      const answers = record?.answers || {};

      const outFiles = [];
      for (const t of cfg.templates) {
        const abs = path.join(process.cwd(), t.path);
        const md = fs.readFileSync(abs, "utf-8");
        const filled = fillTokens(md, answers);
        const pdfPath = path.join("/tmp", `${product}-${path.basename(t.path, ".md")}-${Date.now()}.pdf`);
        await mdToPdfSimple(filled, pdfPath);
        outFiles.push(pdfPath);
      }

      // TODO: upload to storage & email links. For now, log the file paths.
      console.log("Generated PDFs for", email, outFiles);
    } catch (e) {
      console.error("Fulfillment error:", e);
    }
  }

  res.json({ received: true });
}

function fillTokens(text, data) {
  return text.replace(/\[([a-zA-Z0-9_]+)\]/g, (_, key) => (data[key] ?? ""));
}

async function mdToPdfSimple(text, pdfPath) {
  // Very simple: write text lines to a PDF using pdfkit.
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    text.split(/\r?\n/).forEach(line => {
      doc.text(line);
    });
    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}
