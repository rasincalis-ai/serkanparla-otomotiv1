// Dinamik Sahibinden ilanları - resimsiz tablo
// Beklenen JSON: /data/sahibinden.json

const tbody = document.getElementById('listing-body');
const cityEl = document.getElementById('filter-city');
const priceEl = document.getElementById('filter-price');
const applyBtn = document.getElementById('apply-filters');

const statusEl = document.getElementById('listings-status');
const refreshBtn = document.getElementById('refresh-listings');

let DATA = { updated_at: null, items: [] };

async function fetchListings() {
  setStatus('Yükleniyor...');
  try {
    const res = await fetch('data/sahibinden.json?' + Date.now(), {cache:'no-store'});
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (!json || !Array.isArray(json.items)) throw new Error('Geçersiz JSON');
    DATA = json;
    setStatus('Güncellendi: ' + formatTime(DATA.updated_at));
    applyFilters();
  } catch (e) {
    setStatus('Veri alınamadı. Mağazayı ziyaret edin: serkanparlaotomotiv.sahibinden.com');
    console.error('Listings fetch error:', e);
    render([]);
  }
}

function render(rows){
  tbody.innerHTML = "";
  rows.forEach(r=>{
    if(r.source !== "sahibinden") return;
    const tr = document.createElement('tr');
    if (r.status === 'closed') tr.classList.add('table-secondary');
    tr.innerHTML = `
      <td>${escapeHtml(r.title)}</td>
      <td>${escapeHtml(r.city || '-')}</td>
      <td>${formatPrice(r.price)}</td>
      <td>${r.year ?? "-"}</td>
      <td>
        ${r.status === 'active'
          ? `<a href="${escapeHtml(r.url)}" class="btn btn-sm btn-primary" target="_blank" rel="noopener">İlana Git</a>`
          : `<span class="badge text-bg-secondary">Kapalı</span>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function applyFilters(){
  const city = cityEl?.value || '';
  const maxPrice = Number(priceEl?.value || 0);
  let filtered = (DATA.items || []).slice();

  if(city) filtered = filtered.filter(x=>x.city === city);
  if(maxPrice > 0) filtered = filtered.filter(x=>Number(x.price) <= maxPrice);

  filtered.sort((a,b)=>{
    const sa = a.status === 'active' ? 0 : 1;
    const sb = b.status === 'active' ? 0 : 1;
    if (sa !== sb) return sa - sb;
    return Number(a.price || 0) - Number(b.price || 0);
  });

  render(filtered);
}

applyBtn?.addEventListener('click', applyFilters);
refreshBtn?.addEventListener('click', fetchListings);

fetchListings();

function formatPrice(n){
  const num = Number(n);
  if(!Number.isFinite(num) || num <= 0) return "-";
  return new Intl.NumberFormat('tr-TR', {style:'currency', currency:'TRY', maximumFractionDigits:0}).format(num);
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function setStatus(text){
  if (statusEl) statusEl.textContent = text || '';
}
function formatTime(iso){
  if(!iso) return '-';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'short', timeStyle: 'short' }).format(d);
  } catch { return '-'; }
}
