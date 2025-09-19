const store = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { product, answers } = req.body || {};
  if (!product || !answers) return res.status(400).json({ error: "Missing product or answers" });

  const draftId = cryptoRandomId();
  store.set(draftId, { product, answers, createdAt: Date.now() });
  res.json({ draftId });
}

export function getAnswers(draftId) {
  return store.get(draftId);
}

function cryptoRandomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'draft_' + Math.random().toString(36).slice(2);
}
