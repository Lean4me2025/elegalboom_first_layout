
(function(){
  const C = window.ELEGALBOOM_CONFIG;
  const PRODUCT_ORDER = [
    "LLC Formation",
    "Partnership Agreement",
    "LegalBoom Document Bundle",
    "Non-Disclosure Agreement (NDA)",
    "Work-for-Hire Agreement",
    "Expedited Processing"
  ];

  const productGrid = document.getElementById('productGrid');
  const selections = new Set(JSON.parse(localStorage.getItem('selections')||"[]"));

  function render(){
    productGrid.innerHTML = '';
    PRODUCT_ORDER.forEach(name => {
      const price = C.prices[name];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <label class="row" style="gap:14px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <input type="checkbox" ${selections.has(name)?'checked':''} data-name="${name}" />
            <div>
              <h3>${name}</h3>
              <div class="note">${bundleHelper(name)}</div>
            </div>
          </div>
          <div class="price">$${price}</div>
        </label>
      `;
      productGrid.appendChild(card);
    });
    updateTotal();
  }

  function bundleHelper(name){
    if(name==="LegalBoom Document Bundle"){
      return "Includes the core documents for one organization type (LLC or Partnership). Expedited Processing billed separately. Bundle discount applied at 25% off.";
    }
    if(name==="Expedited Processing"){
      return "Priority processing by our system (priced separately; not discounted in bundle).";
    }
    if(name==="LLC Formation"){
      return "State‑aware LLC formation package.";
    }
    if(name==="Partnership Agreement"){
      return "Define roles and ownership for a partnership.";
    }
    if(name==="Non-Disclosure Agreement (NDA)"){
      return "Mutual confidentiality agreement.";
    }
    if(name==="Work-for-Hire Agreement"){
      return "Standard engagement for contractors.";
    }
    return "";
  }

  function calcTotal(){
    const items = Array.from(selections);
    const prices = C.prices;

    // If bundle selected, detect which org type (LLC or Partnership) to pair with first in selections
    const hasBundle = items.includes("LegalBoom Document Bundle");

    let subtotal = 0;
    if(hasBundle){
      // Identify org type preference: if selections includes "LLC Formation" -> LLC bundle, else if "Partnership Agreement" -> Partnership bundle
      const orgType = items.includes("LLC Formation") ? "LLC"
                    : items.includes("Partnership Agreement") ? "Partnership"
                    : "LLC"; // default

      const included = new Set(C.bundles[orgType]); // core docs included in bundle discount
      // add bundle sticker price (already reflects discount from standard list price)
      subtotal += prices["LegalBoom Document Bundle"];

      // Add expedited (if chosen) — separate fee, no discount
      if(items.includes("Expedited Processing")) subtotal += prices["Expedited Processing"];

      // Any extra items not in included + not expedited get added at list price
      items.forEach(n => {
        if(n==="LegalBoom Document Bundle") return;
        if(n==="Expedited Processing") return;
        if(included.has(n)) return; // included
        subtotal += prices[n] || 0;
      });
    } else {
      // No bundle: sum all selected
      items.forEach(n => subtotal += prices[n] || 0);
      // If BOTH organization types chosen (LLC + Partnership) or the user selected 3+ eligible docs,
      // apply 25% off on eligible docs (expedited never discounted).
      const elig = items.filter(n => n!=="Expedited Processing");
      if(elig.length>=3 || (items.includes("LLC Formation") && items.includes("Partnership Agreement"))){
        const discountable = elig.reduce((s,n)=> s + (prices[n]||0), 0);
        subtotal -= Math.round(discountable * C.bundleDiscountPct);
      }
    }
    return subtotal;
  }

  function updateTotal(){
    document.getElementById('total').textContent = `$${calcTotal()}`;
    localStorage.setItem('selections', JSON.stringify(Array.from(selections)));
  }

  productGrid.addEventListener('change', (e)=>{
    const cb = e.target;
    if(cb && cb.dataset && cb.dataset.name){
      if(cb.checked) selections.add(cb.dataset.name);
      else selections.delete(cb.dataset.name);
      updateTotal();
    }
  });

  document.getElementById('buyBtn').addEventListener('click', ()=>{
    // If only one item selected, send straight to its Stripe link.
    const sel = Array.from(selections);
    if(sel.length===0){
      alert("Please select an item to buy.");
      return;
    }
    if(sel.length===1){
      const url = C.payments[sel[0]];
      if(url) { window.location.href = url; return; }
    }
    // For now, on multi-select, prompt to use the bundle (or API checkout later)
    alert("Multiple selections: bundle/discount logic applied to total display here. For purchase in Test mode, please buy one item at a time. We’ll switch to an API-based combined checkout next.");
  });

  render();
})();
