function doPost(e) {
  var ss = SpreadsheetApp.openById('PASTE_YOUR_SHEET_ID_ONLY'); // ID only
  var sh = ss.getSheetByName('Requests') || ss.insertSheet('Requests');

  var headers = [
    'timestamp','order_id','stripe_session_id',
    'first_name','last_name','phone','email',
    'entity_name','address_street','address_city','address_state','address_zip',
    'governing_state','preferred_deadline','urgency','project_title','details',
    'party1_name','party1_role','party1_email',
    'party2_name','party2_role','party2_email',
    'party3_name','party3_role','party3_email',
    'party4_name','party4_role','party4_email',
    'doc_type',
    // LLC
    'llc_state_of_formation','llc_management_type',
    'llc_member1_name','llc_member1_pct',
    'llc_member2_name','llc_member2_pct',
    'llc_member3_name','llc_member3_pct',
    'llc_effective_date','llc_principal_address',
    // Partnership
    'pship_name','pship_partner1_name','pship_partner1_pct',
    'pship_partner2_name','pship_partner2_pct',
    'pship_partner3_name','pship_partner3_pct',
    'pship_decision_rule','pship_effective_date','pship_capital_notes',
    // NDA
    'nda_type','nda_disclosing_party','nda_receiving_party',
    'nda_term_years','nda_purpose','nda_effective_date',
    // Work for hire
    'wfh_client_party','wfh_creator_party','wfh_work_description','wfh_delivery_date','wfh_compensation',
    // Filing choice
    'filing_option'
  ];

  if (sh.getLastRow() === 0) sh.appendRow(headers);

  var p = {};
  try {
    if (e && e.postData && e.postData.type && e.postData.type.indexOf('application/json') > -1) {
      p = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      p = e.parameter;
    }
  } catch (err) {
    p = (e && e.parameter) ? e.parameter : {};
  }

  var orderId = p.order_id || ('ELB-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random()*900000));

  var row = [
    new Date(), orderId, (p.stripe_session_id || ''),
    (p.first_name || ''), (p.last_name || ''), (p.phone || ''), (p.email || ''),
    (p.entity_name || ''), (p.address_street || ''), (p.address_city || ''), (p.address_state || ''), (p.address_zip || ''),
    (p.governing_state || p.address_state || ''), (p.preferred_deadline || ''), (p.urgency || ''), (p.project_title || ''), (p.details || ''),
    (p.party1_name || ''), (p.party1_role || ''), (p.party1_email || ''),
    (p.party2_name || ''), (p.party2_role || ''), (p.party2_email || ''),
    (p.party3_name || ''), (p.party3_role || ''), (p.party3_email || ''),
    (p.party4_name || ''), (p.party4_role || ''), (p.party4_email || ''),
    (p.doc_type || ''),
    // LLC
    (p.llc_state_of_formation || ''), (p.llc_management_type || ''),
    (p.llc_member1_name || ''), (p.llc_member1_pct || ''),
    (p.llc_member2_name || ''), (p.llc_member2_pct || ''),
    (p.llc_member3_name || ''), (p.llc_member3_pct || ''),
    (p.llc_effective_date || ''), (p.llc_principal_address || ''),
    // Partnership
    (p.pship_name || ''), (p.pship_partner1_name || ''), (p.pship_partner1_pct || ''),
    (p.pship_partner2_name || ''), (p.pship_partner2_pct || ''),
    (p.pship_partner3_name || ''), (p.pship_partner3_pct || ''),
    (p.pship_decision_rule || ''), (p.pship_effective_date || ''), (p.pship_capital_notes || ''),
    // NDA
    (p.nda_type || ''), (p.nda_disclosing_party || ''), (p.nda_receiving_party || ''),
    (p.nda_term_years || ''), (p.nda_purpose || ''), (p.nda_effective_date || ''),
    // Work for hire
    (p.wfh_client_party || ''), (p.wfh_creator_party || ''), (p.wfh_work_description || ''), (p.wfh_delivery_date || ''), (p.wfh_compensation || ''),
    // Filing choice
    (p.filing_option || '')
  ];

  sh.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, order_id: orderId }))
    .setMimeType(ContentService.MimeType.JSON);
}