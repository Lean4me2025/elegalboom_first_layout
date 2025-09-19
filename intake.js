
(function(){
  const C = window.ELEGALBOOM_CONFIG;
  const picks = new Set(JSON.parse(localStorage.getItem('selections')||"[]"));
  // Show conditional sections
  function show(id, on){ document.getElementById(id).classList.toggle('hidden', !on); }

  const wantsLLC = picks.has("LLC Formation") || (picks.has("LegalBoom Document Bundle") && !picks.has("Partnership Agreement"));
  const wantsPartnership = picks.has("Partnership Agreement") || (picks.has("LegalBoom Document Bundle") && !picks.has("LLC Formation") && picks.has("Partnership Agreement"));
  // If bundle only with neither org picked, default to LLC fields visible
  const bundleOnly = picks.has("LegalBoom Document Bundle") && !picks.has("LLC Formation") && !picks.has("Partnership Agreement");

  show("llcFields", wantsLLC || bundleOnly);
  show("partnershipFields", wantsPartnership);
  show("ndaFields", picks.has("Non-Disclosure Agreement (NDA)") || picks.has("LegalBoom Document Bundle"));
  show("wfhFields", picks.has("Work-for-Hire Agreement") || picks.has("LegalBoom Document Bundle"));

  const form = document.getElementById('intakeForm');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    // In this static prototype, we just go to success. Later we'll POST to /api/order
    localStorage.setItem('intake', JSON.stringify(Object.fromEntries(new FormData(form).entries())));
    window.location.href = "success.html";
  });
})();
