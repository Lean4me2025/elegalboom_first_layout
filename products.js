
(function(){
  const {PRICES, LINKS} = window.EB;
  const DOCS = ['LLC','PARTNERSHIP','NDA','WFH']; // eligible for discount
  const list = document.getElementById('list');
  const items = [
    ['LLC','LLC Formation','State‑aware LLC formation package'],
    ['PARTNERSHIP','Partnership Agreement','Define roles and ownership'],
    ['WFH','Work‑for‑Hire Agreement','Standard engagement for contractors'],
    ['NDA','Non‑Disclosure Agreement (NDA)','Mutual confidentiality agreement'],
    ['EXPEDITED','Expedited Processing','Priority processing by our system'],
    ['BUNDLE','LegalBoom Document Bundle','Our most popular set (excludes Expedited)']
  ];
  items.forEach(([k,title,sub])=>{
    const card=document.createElement('div');card.className='card';
    card.innerHTML=`<label class="item">
      <input type="checkbox" data-k="${k}"/>
      <div><div class="name">${title}</div><div class="sub">${sub}</div></div>
      <div class="price">$${PRICES[k]||0}</div>
    </label>`;
    list.appendChild(card);
  });

  function selected(){return [...document.querySelectorAll('input[type=checkbox][data-k]:checked')].map(i=>i.dataset.k);}
  function money(n){return '$'+n.toFixed(2).replace(/\.00$/,'');}

  function recompute(){
    const sel = selected();
    // Bundle supersedes individual docs
    let subtotalDocs = 0;
    let expedited = sel.includes('EXPEDITED') ? PRICES.EXPEDITED : 0;
    if(sel.includes('BUNDLE')){
      subtotalDocs = PRICES.BUNDLE;
      // uncheck individual docs when bundle chosen
      ['LLC','PARTNERSHIP','NDA','WFH'].forEach(k=>{
        const box=document.querySelector(`input[data-k="${k}"]`); if(box) box.checked=false;
      });
    }else{
      subtotalDocs = sel.filter(k=>k!=='EXPEDITED').reduce((s,k)=>s+(PRICES[k]||0),0);
      // 25% discount on 3+ docs (expedited excluded)
      const docCount = sel.filter(k=>DOCS.includes(k)).length;
      if(docCount>=3) subtotalDocs *= 0.75;
    }
    const total = subtotalDocs + expedited;
    document.getElementById('total').textContent = money(total);
    sessionStorage.setItem('EB_SELECTED', JSON.stringify(sel));
  }

  document.addEventListener('change', (e)=>{
    if(e.target && e.target.matches('input[type=checkbox][data-k]')) recompute();
  });
  recompute();

  document.getElementById('buy').addEventListener('click', ()=>{
    const sel = selected();
    if(sel.length===0){ alert('Select at least one item.'); return; }

    // Single-item checkout via Payment Links
    if(sel.length===1){
      const k=sel[0]; const url = LINKS[k]||"";
      if(!url){ alert('Missing Stripe Payment Link for '+k+' in config.js'); return; }
      window.location.href = url; return;
    }

    // Bundle + Expedited: open bundle, then expedited in new tab
    if(sel.length===2 && sel.includes('BUNDLE') && sel.includes('EXPEDITED')){
      if(!LINKS.BUNDLE || !LINKS.EXPEDITED){ alert('Missing Stripe link for Bundle or Expedited in config.js'); return; }
      window.open(LINKS.BUNDLE, '_self'); setTimeout(()=>window.open(LINKS.EXPEDITED,'_blank'), 1200); return;
    }

    alert('Multiple selections at once require API checkout. Please purchase one item at a time, or choose the Bundle (you can add Expedited separately).');
  });
})();
