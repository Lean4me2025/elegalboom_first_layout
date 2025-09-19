
(function(){
  const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY"];
  document.getElementById('state').innerHTML = '<option value="">Select…</option>' + STATES.map(s=>`<option>${s}</option>`).join('');
  const sel = JSON.parse(sessionStorage.getItem('EB_SELECTED')||'[]');

  const show = (id, on)=>{ const el=document.getElementById(id); if(el) el.style.display = on?'block':'none'; };
  show('llc', sel.includes('LLC') || sel.includes('BUNDLE'));
  show('partnership', sel.includes('PARTNERSHIP') || sel.includes('BUNDLE'));
  show('nda', sel.includes('NDA') || sel.includes('BUNDLE'));
  show('wfh', sel.includes('WFH') || sel.includes('BUNDLE'));

  document.getElementById('f').addEventListener('submit', (e)=>{
    e.preventDefault();
    // For now redirect to success (replace with Stripe link routing as needed)
    window.location.href = 'success.html';
  });
})();
