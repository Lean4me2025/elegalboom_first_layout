// Stripe config (TEST first, then swap to LIVE). Do NOT put secret keys here.
const STRIPE_PUBLISHABLE_KEY = 'pk_test_xxx_replace_me';

// Map each product to its Price ID from Stripe Dashboard → Products → Price
const PRICE_IDS = {
  WORK_FOR_HIRE:   'price_xxx_wfh',    // $79
  BUNDLE:          'price_xxx_bundle', // $449
  EXPEDITED:       'price_xxx_exp',    // $79
  NDA:             'price_xxx_nda',    // $49
  PARTNERSHIP:     'price_xxx_part',   // $199
  LLC:             'price_xxx_llc',    // $299
};
