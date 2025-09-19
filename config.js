// === Payment Links config (fastest path) ===
// Paste your buy.stripe.com/test_... link for each product.
const PAYMENT_LINKS = {
  LLC: "",            // e.g., "https://buy.stripe.com/test_llc123"
  PARTNERSHIP: "",
  NDA: "",
  WORK_FOR_HIRE: "",
  EXPEDITED: "",
  BUNDLE: ""          // optional bundle link
};

// Display-only prices used in the UI
const DISPLAY_PRICES = {WORK_FOR_HIRE:79,BUNDLE:449,EXPEDITED:79,NDA:49,PARTNERSHIP:199,LLC:299};

// === (Optional) Checkout Sessions placeholders for later ===
const STRIPE_PUBLISHABLE_KEY = "pk_test_replace_if_using_api_checkout";
const PRICE_IDS = {WORK_FOR_HIRE:"",BUNDLE:"",EXPEDITED:"",NDA:"",PARTNERSHIP:"",LLC:""};