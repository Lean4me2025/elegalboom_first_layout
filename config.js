
// Basic site config + Stripe payment links (TEST mode)
window.ELEGALBOOM_CONFIG = {
  brand: "ELegalBoom",
  year: new Date().getFullYear(),

  // Stripe payment links (TEST) — one per product
  payments: {
    "LLC Formation": "https://buy.stripe.com/test_cNibJ3ffqgekigeY1YK3wQ02",
    "Partnership Agreement": "https://buy.stripe.com/test_aFa7sNaI6fom7Isbzk3wQ03",
    "Work-for-Hire Agreement": "https://buy.stripe.com/test_14A8wRal68ZYd2MdHs3wQ04",
    "Expedited Processing": "https://buy.stripe.com/test_6oUfZjffQgde9QAeLw3wQ05",
    "Non-Disclosure Agreement (NDA)": "https://buy.stripe.com/test_4gM7sNcteccad2MfPA3wQ06",
    "LegalBoom Document Bundle": "https://buy.stripe.com/test_bJebJ3al66RQ3scgTE3wQ01"
  },

  // Display prices (labels only; charge occurs on Stripe)
  prices: {
    "LLC Formation": 299,
    "Partnership Agreement": 199,
    "Work-for-Hire Agreement": 79,
    "Expedited Processing": 79,
    "Non-Disclosure Agreement (NDA)": 49,
    "LegalBoom Document Bundle": 449
  },

  // Bundle logic: picking the bundle applies a 25% discount to
  // the included core docs (expedited NOT included in discount)
  bundles: {
    "LLC": ["LLC Formation", "Non-Disclosure Agreement (NDA)", "Work-for-Hire Agreement"],
    "Partnership": ["Partnership Agreement", "Non-Disclosure Agreement (NDA)", "Work-for-Hire Agreement"]
  },

  bundleDiscountPct: 0.25
};
