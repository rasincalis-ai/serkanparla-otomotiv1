// Not: sahibinden.com içeriğini doğrudan scrape etmek TOS'a aykırı olabilir.
// Bu örnek, backend'inizin sağladığı bir JSON endpointini (/api/listings?sources=sahibinden&no_images=1)
// var sayarak tasarlanmıştır. Şimdilik örnek veri kullanıyoruz.

const tbody = document.getElementById('listing-body');
const cityEl = document.getElementById('filter-city');
const priceEl = document.getElementById('filter-price');
const applyBtn = document.getElementById('apply-filters');

// Sample data - will be replaced with API call in production
const listingsData = [
  {title:"2016 BMW 320i ED", city:"İstanbul", price: 785000, year:2016, source:"sahibinden", url:"https://www.sahibinden.com/ilan/1"},
  {title:"2018 Mercedes C180", city:"Ankara",  price: 925000, year:2018, source:"sahibinden", url:"https://www.sahibinden.com/ilan/2"},
  {title:"2015 Audi A4",      city:"İzmir",   price: 690000, year:2015, source:"sahibinden", url:"https://www.sahibinden.com/ilan/3"}
];

function render(rows){
  tbody.innerHTML = "";
  rows.forEach(r=>{
    if(r.source !== "sahibinden") return; // sadece sahibinden
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(r.title)}</td>
      <td>${escapeHtml(r.city)}</td>
      <td>${formatPrice(r.price)}</td>
      <td>${r.year ?? "-"}</td>
      <td><a href="${escapeHtml(r.url)}" class="btn btn-sm btn-primary" target="_blank" rel="noopener">İlana Git</a></td>
    `;
    tbody.appendChild(tr);
  });
}

function applyFilters(){
  const city = cityEl.value;
  const maxPrice = Number(priceEl.value || 0);
  let filtered = listingsData.slice();

  if(city) filtered = filtered.filter(x=>x.city === city);
  if(maxPrice > 0) filtered = filtered.filter(x=>x.price <= maxPrice);

  render(filtered);
}

applyBtn?.addEventListener('click', applyFilters);
render(listingsData);

// Helpers
const HTML_ENTITIES = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'};

function formatPrice(n){
  if(typeof n !== "number") return "-";
  return new Intl.NumberFormat('tr-TR', {style:'currency', currency:'TRY', maximumFractionDigits:0}).format(n);
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => HTML_ENTITIES[m]);
}
