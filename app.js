const API = 'api';
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const formatDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : 'Not specified';

async function loadItems(params = new URLSearchParams()) {
  const grid = document.querySelector('#item-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="empty">Loading reports…</div>';
  try {
    const response = await fetch(`${API}/items.php?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to load reports.');
    const category = document.querySelector('#category');
    if (category && category.options.length <= 1) data.categories.forEach(c => category.add(new Option(c, c)));
    grid.innerHTML = data.items.length ? data.items.map(item => `<article class="item-card"><div class="item-card-top"><span class="pill ${escapeHTML(item.item_type.toLowerCase())}">${escapeHTML(item.item_type)}</span><span class="category">${escapeHTML(item.category)}</span></div><h3>${escapeHTML(item.item_name)}</h3><p>${escapeHTML(item.description.length > 150 ? item.description.slice(0,147)+'…' : item.description)}</p><p class="location">📍 ${escapeHTML(item.location)}</p><a class="text-link" href="detail.html?id=${Number(item.id)}">View details →</a></article>`).join('') : '<div class="empty"><h3>No matching reports</h3><p>Try another keyword or remove a filter.</p></div>';
  } catch (error) { grid.innerHTML = `<div class="empty">${escapeHTML(error.message)}<p>Check that Apache, PHP and MySQL are running.</p></div>`; }
}

const filters = document.querySelector('#filters');
if (filters) {
  loadItems();
  filters.addEventListener('submit', event => { event.preventDefault(); loadItems(new URLSearchParams(new FormData(filters))); });
  filters.querySelector('.reset').addEventListener('click', event => { event.preventDefault(); filters.reset(); loadItems(); });
}

const reportForm = document.querySelector('#report-form');
if (reportForm) reportForm.addEventListener('submit', async event => {
  event.preventDefault();
  const message = document.querySelector('#form-message');
  const button = reportForm.querySelector('button[type="submit"]');
  button.disabled = true; button.textContent = 'Submitting…'; message.className = ''; message.textContent = '';
  try {
    const payload = Object.fromEntries(new FormData(reportForm).entries());
    const response = await fetch(`${API}/report.php`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
    const data = await response.json();
    if (!response.ok) throw new Error((data.errors || [data.error || 'Unable to submit report.']).join(' '));
    window.location.href = `detail.html?id=${data.id}&submitted=1`;
  } catch (error) { message.className = 'errors'; message.textContent = error.message; }
  finally { button.disabled = false; button.textContent = 'Submit report'; }
});

const detailCard = document.querySelector('#detail-card');
if (detailCard) (async () => {
  const params = new URLSearchParams(location.search); const id = Number(params.get('id'));
  const message = document.querySelector('#detail-message');
  if (!Number.isInteger(id) || id < 1) { detailCard.innerHTML = '<h2>Invalid item ID</h2>'; return; }
  try {
    const response = await fetch(`${API}/item.php?id=${id}`); const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Item not found.');
    const item = data.item; document.title = `${item.item_name} | FindIt`;
    if (params.get('submitted') === '1') { message.className = 'notice'; message.textContent = 'Your report was submitted successfully.'; }
    detailCard.innerHTML = `<div class="item-card-top"><span class="pill ${escapeHTML(item.item_type.toLowerCase())}">${escapeHTML(item.item_type)}</span><span class="pill status">${escapeHTML(item.status)}</span><span class="category">${escapeHTML(item.category)}</span></div><h1>${escapeHTML(item.item_name)}</h1><p class="detail-description">${escapeHTML(item.description).replace(/\n/g,'<br>')}</p><dl><dt>Location</dt><dd>${escapeHTML(item.location)}</dd><dt>Date</dt><dd>${formatDate(item.item_date)}</dd><dt>Reported on</dt><dd>${formatDate(item.created_at?.slice(0,10))}</dd><dt>Contact person</dt><dd>${escapeHTML(item.contact_name)}</dd><dt>Contact email</dt><dd><a href="mailto:${escapeHTML(item.contact_email)}">${escapeHTML(item.contact_email)}</a></dd></dl><a class="button-link" href="mailto:${encodeURIComponent(item.contact_email)}?subject=${encodeURIComponent('FindIt - '+item.item_name)}">Contact reporter</a>`;
  } catch (error) { detailCard.innerHTML = `<h2>Could not load item</h2><p>${escapeHTML(error.message)}</p>`; }
})();
