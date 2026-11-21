/* ===== Golden Space — script.js (MVP) ===== */
const PHONE = '995568800870';

/* ---- მენიუს მონაცემები (ფასები ლარში) — აქ შეცვალე ფასები/კერძები ---- */
const MENU = {
  shaurma: { label: '🌯 შაურმა', items: [
    { id: 's1', name: 'შაურმა მინი',      sub: 'mini',      price: 7,  em: '🌯' },
    { id: 's2', name: 'შაურმა პატარა',    sub: 'პატარა',    price: 10, em: '🌯' },
    { id: 's3', name: 'შაურმა სტანდარტი', sub: 'სტანდარტი', price: 12, em: '🌯' },
    { id: 's4', name: 'შაურმა საშუალო',   sub: 'საშუალო',   price: 16, em: '🌯' },
    { id: 's5', name: 'შაურმა დიდი',      sub: 'დიდი',      price: 18, em: '🌯' },
    { id: 's6', name: 'შაურმა გოლდენი',   sub: 'გოლდენი',   price: 25, em: '🌯', tag: 'GOLD' }
  ]},
  burger: { label: '🍔 ბურგერი', items: [
    { id: 'b1', name: 'ბურგერი',    sub: 'შაურმის ხორცით', price: 6, em: '🍔' },
    { id: 'b2', name: 'ჩიზბურგერი', sub: 'შაურმის ხორცით', price: 9, em: '🧀' }
  ]},
  hotdog: { label: '🌭 ჰოთ დოგი', items: [
    { id: 'h1', name: 'ჰოთ დოგი კლასიკი',   sub: 'კლასიკური',     price: 5,  em: '🌭' },
    { id: 'h2', name: 'ჰოთ დოგი მექსიკური', sub: 'მექსიკური',     price: 7,  em: '🌭' },
    { id: 'h3', name: 'ბულდოგი',             sub: 'დიდი ჰოთ დოგი', price: 10, em: '🌭', tag: 'TOP' }
  ]},
  box: { label: '📦 ბოქსი & ნაგეტი', items: [
    { id: 'x1', name: 'შაურმა ბოქსი',  sub: 'GS Box', price: 12, em: '📦' },
    { id: 'n1', name: 'ნაგეტი პატარა', sub: 'პატარა', price: 6,  em: '🍗' },
    { id: 'n2', name: 'ნაგეტი დიდი',   sub: 'დიდი',   price: 9,  em: '🍗' }
  ]},
  fries: { label: '🍟 ფრი & სოუსი', items: [
    { id: 'f1', name: 'ფრი საშუალო',         sub: 'საშუალო', price: 6,  em: '🍟' },
    { id: 'f2', name: 'ფრი დიდი',            sub: 'დიდი',    price: 12, em: '🍟' },
    { id: 'c1', name: 'ყველის სოუსი პატარა', sub: 'პატარა',  price: 5,  em: '🧀' },
    { id: 'c2', name: 'ყველის სოუსი დიდი',   sub: 'დიდი',    price: 10, em: '🧀' }
  ]},
  drinks: { label: '🥤 სასმელი', items: [
    { id: 'd1', name: 'გამაგრილებელი', sub: 'Coca-Cola, Fanta, Sprite...', price: 2.5, em: '🥤' },
    { id: 'l1', name: 'ლუდი Paulaner', sub: 'ბოთლი', price: 8, em: '🍺' },
    { id: 'l2', name: 'ლუდი Heineken', sub: 'ბოთლი', price: 6, em: '🍻' },
    { id: 'a1', name: 'აირანი',        sub: 'Ayran', price: 3, em: '🥛' }
  ]}
};
const ALL = Object.values(MENU).flatMap(c => c.items);
const byId = id => ALL.find(x => x.id === id);

/* ---- კომბოები: [კერძის id, რაოდენობა]. ფასი = კერძების ჯამი ---- */
const COMBOS = [
  { id: 'k1', name: 'GS კლასიკი',        em: '🌯🍟🥤', hot: true, items: [['s3', 1], ['f1', 1], ['d1', 1]] },
  { id: 'k2', name: 'ბურგერ სეტი',       em: '🍔🍟🥤', items: [['b2', 1], ['f1', 1], ['d1', 1]] },
  { id: 'k3', name: 'ნაგეტი & ყველი',    em: '🍗🧀🥤', items: [['n2', 1], ['c1', 1], ['d1', 1]] },
  { id: 'k4', name: 'ჰოთ დოგ დუო',       em: '🌭🌭🍟', items: [['h1', 1], ['h2', 1], ['f1', 1]] },
  { id: 'k5', name: 'კომპანიის ბოქსი',   em: '📦🍟🧀', items: [['x1', 1], ['f2', 1], ['c2', 1], ['d1', 2]] }
];
const comboTotal = c => c.items.reduce((s, [id, q]) => s + byId(id).price * q, 0);

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const fmt = n => (Number.isInteger(n) ? n : n.toFixed(1)) + '₾';
const ls = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ---- ზოგადი ---- */
const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
let toastT;
function toast(msg) {
  const t = $('#toast'); if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1800);
}
const vibrate = (ms = 15) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

/* scroll progress */
const prog = $('#progress');
addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  if (prog && h > 0) prog.style.width = (scrollY / h * 100) + '%';
}, { passive: true });

/* ripple on buttons */
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.btn'); if (!b) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) / 2;
  const el = document.createElement('span'); el.className = 'rp';
  el.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  b.appendChild(el); setTimeout(() => el.remove(), 650);
});

/* ---- კალათა ---- */
let cart = ls.get('gs_cart', {});
const saveCart = () => ls.set('gs_cart', cart);
function addToCart(id, n = 1, silent) {
  cart[id] = (cart[id] || 0) + n; saveCart(); renderAll(); vibrate();
  if (!silent) toast('✅ ' + byId(id).name);
  const cb = $('#cartBtn'); cb?.classList.remove('bump'); void cb?.offsetWidth; cb?.classList.add('bump');
}
function changeQty(id, d) { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; saveCart(); renderAll(); vibrate(8); }
const cartIds = () => Object.keys(cart).filter(id => byId(id));
const cartTotal = () => cartIds().reduce((s, id) => s + cart[id] * byId(id).price, 0);

/* ---- კომბოები ---- */
const comboBox = $('#combos-list');
if (comboBox) {
  comboBox.innerHTML = COMBOS.map(c => `
    <article class="combo">
      ${c.hot ? '<span class="hot">🔥 TOP</span>' : ''}
      <div class="ems">${c.em}</div>
      <h3>${c.name}</h3>
      <ul>${c.items.map(([id, q]) => `<li>${q}× ${byId(id).name}</li>`).join('')}</ul>
      <div class="foot"><span class="tot">${fmt(comboTotal(c))}</span>
      <button class="btn btn-gold" data-combo="${c.id}">+ კალათაში</button></div>
    </article>`).join('');
  comboBox.addEventListener('click', e => {
    const b = e.target.closest('[data-combo]'); if (!b) return;
    const c = COMBOS.find(x => x.id === b.dataset.combo);
    c.items.forEach(([id, q]) => { cart[id] = (cart[id] || 0) + q; });
    saveCart(); renderAll(); vibrate(25); toast('🔥 ' + c.name + ' დაემატა');
    const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 14);
  });
}

/* ---- მენიუ + ძებნა ---- */
const grid = $('#menuGrid'), tabs = $('#tabs'), search = $('#q');
let activeTab = 'shaurma', query = '';
function renderTabs() {
  if (!tabs) return;
  tabs.innerHTML = Object.entries(MENU).map(([k, c]) =>
    `<button class="tab ${!query && k === activeTab ? 'active' : ''}" data-tab="${k}">${c.label}</button>`).join('');
}
function itemHTML(it, i, anim) {
  const q = cart[it.id] || 0;
  const ctl = q
    ? `<div class="stp"><button data-q="-1" data-id="${it.id}" aria-label="ნაკლები">−</button><b>${q}</b><button data-q="1" data-id="${it.id}" aria-label="მეტი">+</button></div>`
    : `<button class="add" data-add="${it.id}" aria-label="დამატება">+</button>`;
  return `<article class="item ${q ? 'has' : ''} ${anim ? 'anim' : ''}" style="${anim ? `animation-delay:${i * 40}ms` : ''}">
    <div class="em">${it.em}</div>
    <div><h4>${it.name}${it.tag ? `<span class="tag">${it.tag}</span>` : ''}</h4><small>${it.sub || ''}</small></div>
    <span class="price">${fmt(it.price)}</span>${ctl}</article>`;
}
function renderMenu(anim) {
  if (!grid) return;
  const list = query
    ? ALL.filter(it => (it.name + ' ' + (it.sub || '')).toLowerCase().includes(query))
    : MENU[activeTab].items;
  grid.innerHTML = list.length ? list.map((it, i) => itemHTML(it, i, anim)).join('') : '<div class="none">😕 ვერაფერი მოიძებნა</div>';
}
tabs?.addEventListener('click', e => {
  const b = e.target.closest('.tab'); if (!b) return;
  activeTab = b.dataset.tab; query = ''; if (search) search.value = '';
  renderTabs(); renderMenu(true);
  tabs.querySelector('.active')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
});
search?.addEventListener('input', () => { query = search.value.trim().toLowerCase(); renderTabs(); renderMenu(true); });
grid?.addEventListener('click', e => {
  const a = e.target.closest('[data-add]');
  if (a) { addToCart(a.dataset.add); const r = a.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2); return; }
  const q = e.target.closest('[data-q]'); if (q) changeQty(q.dataset.id, +q.dataset.q);
});

/* ---- კალათის ფურცელი ---- */
const drawer = $('#drawer'), overlay = $('#overlay');
let orderType = 'courier';
const profile = ls.get('gs_profile', {});
function renderCart() {
  const ids = cartIds();
  const count = ids.reduce((s, id) => s + cart[id], 0), total = cartTotal();
  const cc = $('#cartCount'); if (cc) cc.textContent = count;
  const tt = $('#cartTotal'); if (tt) tt.textContent = fmt(total);
  const mc = $('#miniCart');
  if (mc) { $('#miniText').textContent = `🛒 ${count} • ${fmt(total)}`; mc.classList.toggle('show', count > 0 && !drawer?.classList.contains('open')); }
  const box = $('#cartItems'); if (!box) return;
  const last = ls.get('gs_last', null);
  box.innerHTML = ids.length ? ids.map(id => { const it = byId(id); return `
    <div class="ci"><div class="e">${it.em}</div>
      <div><b>${it.name}</b><small>${fmt(it.price)} × ${cart[id]} = ${fmt(it.price * cart[id])}</small></div>
      <div class="qty"><button data-q="-1" data-id="${id}">−</button><span>${cart[id]}</span><button data-q="1" data-id="${id}">+</button></div>
    </div>`; }).join('')
    : `<div class="empty"><span>🛒</span>კალათა ცარიელია${last && Object.keys(last).length ? '<button class="btn btn-ghost" id="reorder">↻ ბოლო შეკვეთის გამეორება</button>' : ''}</div>`;
}
function renderAll() { renderCart(); renderMenu(false); }

function openCart() {
  $('#oName').value ||= profile.name || ''; $('#oPhone').value ||= profile.phone || ''; $('#oAddr').value ||= profile.addr || '';
  drawer?.classList.add('open'); overlay?.classList.add('show'); $('#miniCart')?.classList.remove('show');
}
function closeCart() { drawer?.classList.remove('open'); overlay?.classList.remove('show'); renderCart(); }
$('#cartBtn')?.addEventListener('click', openCart);
$('#miniCart')?.addEventListener('click', openCart);
$('#courierOrder')?.addEventListener('click', () => cartIds().length ? openCart() : (toast('ჯერ აირჩიე კერძები 👇'), $('#menu').scrollIntoView()));
$('#closeCart')?.addEventListener('click', closeCart);
overlay?.addEventListener('click', closeCart);
$('#clearCart')?.addEventListener('click', () => { cart = {}; saveCart(); renderAll(); });
$('#cartItems')?.addEventListener('click', e => {
  const b = e.target.closest('[data-q]'); if (b) return changeQty(b.dataset.id, +b.dataset.q);
  if (e.target.closest('#reorder')) { const last = ls.get('gs_last', {}); Object.entries(last).forEach(([id, q]) => { if (byId(id)) cart[id] = q; }); saveCart(); renderAll(); toast('↻ დაემატა'); }
});
$('#seg')?.addEventListener('click', e => {
  const b = e.target.closest('[data-type]'); if (!b) return;
  orderType = b.dataset.type;
  $$('#seg button').forEach(x => x.classList.toggle('on', x === b));
  $('#oAddr').style.display = orderType === 'courier' ? '' : 'none';
});
$('#orderWa')?.addEventListener('click', () => {
  const ids = cartIds();
  if (!ids.length) return toast('🛒 კალათა ცარიელია');
  const name = $('#oName').value.trim(), phone = $('#oPhone').value.trim(), addr = $('#oAddr').value.trim(), note = $('#oNote').value.trim();
  const need = [['#oName', name], ['#oPhone', phone]]; if (orderType === 'courier') need.push(['#oAddr', addr]);
  need.forEach(([s, v]) => $(s).classList.toggle('err', !v));
  if (need.some(([, v]) => !v)) return toast('შეავსე აუცილებელი ველები');
  const lines = ids.map(id => `• ${byId(id).name} × ${cart[id]} = ${fmt(byId(id).price * cart[id])}`);
  const msg = `${orderType === 'courier' ? '🛵 კურიერით' : '🏃 ადგილზე წამოღებით'} — ახალი შეკვეთა (Golden Space)\n\n${lines.join('\n')}\n\nჯამი: ${fmt(cartTotal())}\n\n👤 ${name}\n📞 ${phone}${orderType === 'courier' ? `\n📍 ${addr}` : ''}${note ? `\n📝 ${note}` : ''}`;
  ls.set('gs_profile', { name, phone, addr }); ls.set('gs_last', { ...cart });
  burst(innerWidth / 2, innerHeight / 2, 36); vibrate(40);
  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
});
$$('input').forEach(i => i.addEventListener('input', () => i.classList.remove('err')));

/* ---- დაჯავშნა ---- */
const bd = $('#bDate');
if (bd) { bd.min = new Date().toISOString().slice(0, 10); bd.value = bd.min; }
$('#bookingForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const f = [$('#bName'), $('#bPhone'), $('#bDate'), $('#bTime')];
  let ok = true;
  f.forEach(i => { const bad = !i.value.trim(); i.classList.toggle('err', bad); if (bad) ok = false; });
  if (!ok) return toast('შეავსე ყველა ველი');
  const msg = `📅 მაგიდის დაჯავშნა — Golden Space\n\n👤 ${f[0].value}\n📞 ${f[1].value}\n🗓 ${f[2].value}  ⏰ ${f[3].value}\n👥 სტუმარი: ${$('#bGuests').value}\n📝 ${$('#bNote').value || '—'}`;
  const out = $('#bookingOk');
  out.textContent = '✅ ჯავშანი მზადაა — გაგზავნე WhatsApp-ით, ან დაგვირეკე.'; out.classList.add('show');
  burst(innerWidth / 2, innerHeight / 2, 30);
  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  e.target.reset(); if (bd) bd.value = bd.min;
});

/* ---- ნავიგაცია: აქტიური სექცია ---- */
const links = $$('#bar a[data-sec]');
if (links.length) {
  const spy = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.dataset.sec === en.target.id));
  }), { rootMargin: '-40% 0px -50% 0px' });
  links.forEach(a => { const s = $('#' + a.dataset.sec); if (s) spy.observe(s); });
}

/* ---- reveal ---- */
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .1 });
$$('.sec h2, .form, .courier').forEach(el => { el.classList.add('reveal'); io.observe(el); });

/* ---- ჰერო: ემოჯის ცვლა თეფშზე ---- */
const plateEm = $('#plateEm');
if (plateEm) {
  const E = ['🌯', '🍔', '🍟', '🌭', '🍗', '🧀'];
  let i = 0;
  setInterval(() => {
    plateEm.classList.add('out');
    setTimeout(() => { i = (i + 1) % E.length; plateEm.textContent = E[i]; plateEm.classList.remove('out'); }, 320);
  }, 2400);
}

/* ---- ნაპერწკლები ---- */
const cv = $('#sparks');
if (cv) {
  const c = cv.getContext('2d'); let W, H, P = [], run = true;
  const resize = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
  resize(); addEventListener('resize', resize);
  const mk = () => ({ x: Math.random() * W, y: H + Math.random() * 30, r: Math.random() * 1.8 + .5, v: Math.random() * .6 + .25, a: Math.random() * .6 + .3 });
  for (let i = 0; i < 35; i++) { const p = mk(); p.y = Math.random() * H; P.push(p); }
  new IntersectionObserver(es => { run = es[0].isIntersecting; if (run) loop(); }).observe(cv);
  function loop() {
    if (!run) return;
    c.clearRect(0, 0, W, H);
    P.forEach((p, i) => {
      p.y -= p.v; p.x += Math.sin(p.y / 30) * .3; p.a -= .0008;
      if (p.y < -6 || p.a <= 0) P[i] = mk();
      c.beginPath(); c.arc(p.x, p.y, p.r, 0, 7);
      c.fillStyle = `rgba(255,190,50,${p.a})`; c.shadowBlur = 8; c.shadowColor = '#ffa800'; c.fill();
    });
    requestAnimationFrame(loop);
  }
}

/* ---- კონფეტი/ნაპერწკალი ---- */
function burst(x, y, n = 10) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i');
    const a = Math.random() * Math.PI * 2, d = 26 + Math.random() * 50;
    s.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:6px;height:6px;border-radius:50%;background:#ffc83c;box-shadow:0 0 8px #ff9d00;pointer-events:none;z-index:400;transition:transform .65s ease-out,opacity .65s`;
    document.body.appendChild(s);
    requestAnimationFrame(() => { s.style.transform = `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(.2)`; s.style.opacity = 0; });
    setTimeout(() => s.remove(), 700);
  }
}

/* ---- PWA: აპად დაყენება + offline ---- */
let dip;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); dip = e; $('#install')?.classList.add('show'); });
$('#install')?.addEventListener('click', async () => {
  if (!dip) return; dip.prompt(); await dip.userChoice; dip = null; $('#install').classList.remove('show');
});
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});

/* ---- start ---- */
renderTabs(); renderMenu(true); renderCart();
