const products = [
  { name: "LLC Formation", price: 299, link: config.links.llc },
  { name: "Partnership Agreement", price: 199, link: config.links.partnership },
  { name: "Non-Disclosure Agreement", price: 49, link: config.links.nda },
  { name: "Expedited Processing", price: 79, link: config.links.expedited },
  { name: "LegalBoom Document Bundle", price: 449, link: config.links.bundle },
  { name: "Work-for-Hire Agreement", price: 79, link: config.links.work }
];

window.onload = () => {
  const container = document.getElementById("product-list");
  products.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<input type="checkbox" onclick="window.location.href='${p.link}'"> ${p.name} - $${p.price}`;
    container.appendChild(div);
  });
};