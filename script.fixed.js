// Fixed script: matrix + modal-based decrypted view
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const baseFontSize = 14;
let fontSize = baseFontSize;
let dpr = window.devicePixelRatio || 1;
let drops = [];

function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fontSize = baseFontSize;
  const columns = Math.floor(window.innerWidth / fontSize);
  drops = Array(Math.max(1, columns)).fill(1);
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  ctx.fillStyle = '#0F0';
  ctx.font = fontSize + 'px monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
  requestAnimationFrame(drawMatrix);
}

resizeCanvas();
window.addEventListener('resize', () => { clearTimeout(window._matrixResizeTimer); window._matrixResizeTimer = setTimeout(resizeCanvas, 120); });
drawMatrix();

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username && password) {
    const btn = document.getElementById('loginBtn'); if (btn) btn.textContent = '► VERIFYING CREDENTIALS...';
    setTimeout(() => {
      document.getElementById('loginPage').classList.add('hidden');
      document.getElementById('dashboardPage').style.display = 'block';
      document.getElementById('displayUsername').textContent = username.toUpperCase();
      if (btn) btn.textContent = '► INITIATE ACCESS ◄';
    }, 900);
  } else alert('⚠ ACCESS DENIED: MISSING CREDENTIALS ⚠');
}

function logout() {
  if (!confirm('⚠ TERMINATE SESSION? ALL UNSAVED DATA WILL BE LOST')) return;
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('dashboardPage').style.display = 'none';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  for (let i = 1; i <= 3; i++) {
    const ph = document.getElementById(`placeholder${i}`);
    const ce = document.getElementById(`content${i}`);
    if (ph) ph.style.display = 'block';
    if (ce) ce.style.display = 'none';
    const inp = document.querySelector(`input[data-content="${i}"]`);
    if (inp) { inp.value = ''; if (inp.parentElement) inp.parentElement.style.display = 'flex'; }
  }
  const overlayEl = document.getElementById('overlay'); if (overlayEl) { overlayEl.classList.remove('active'); setTimeout(() => { overlayEl.style.display = 'none'; }, 260); }
  const modal = document.querySelector('.decrypted-modal'); if (modal) modal.remove();
  document.getElementById('backButton').style.display = 'none';
  document.body.style.filter = 'none';
  document.querySelectorAll('.card').forEach(c => { c.classList.remove('decrypted'); c.style.display = 'block'; });
}

document.getElementById('password').addEventListener('keypress', (e) => { if (e.key === 'Enter') login(); });

document.querySelectorAll('input').forEach(input => input.addEventListener('input', function() { this.style.boxShadow = '0 0 30px rgba(0,255,0,0.8)'; setTimeout(() => this.style.boxShadow = '0 0 10px rgba(0,255,0,0.3)', 100); }));

function revealContent(contentId) {
  const input = document.querySelector(`input[data-content="${contentId}"]`);
  if (!input) return alert('Input not found');
  const code = input.value;
  const codes = {1:'1234',2:'5678',3:'9012'};
  if (code !== codes[contentId]) { alert('⚠ DECRYPTION FAILED: INVALID KEY ⚠'); input.value=''; return; }
  const contentElement = document.getElementById(`content${contentId}`);
  if (!contentElement) return alert('Content not found');
  if (!contentElement.dataset.original) contentElement.dataset.original = contentElement.innerHTML;
  const contentInner = contentElement.dataset.original;
  if (input.parentElement) input.parentElement.style.display = 'none';
  const overlayEl = document.getElementById('overlay'); if (overlayEl) { overlayEl.style.display = 'block'; requestAnimationFrame(() => overlayEl.classList.add('active')); }
  let modal = document.querySelector('.decrypted-modal'); if (!modal) { modal = document.createElement('div'); modal.className='decrypted-modal'; document.body.appendChild(modal); }
  modal.innerHTML = `<div class="modal-inner">${contentInner}</div>`;
  const backButton = document.getElementById('backButton'); if (backButton) backButton.style.display = 'block';
  document.body.style.filter = 'brightness(0.98)';
  const card = input.closest('.card'); document.querySelectorAll('.card').forEach(c => { if (c !== card) c.style.display = 'none'; });
}

function resetView() {
  const overlayEl = document.getElementById('overlay'); if (overlayEl) { overlayEl.classList.remove('active'); setTimeout(() => overlayEl.style.display = 'none', 260); }
  const backButton = document.getElementById('backButton'); if (backButton) backButton.style.display = 'none';
  document.body.style.filter = 'none';
  document.querySelectorAll('.card').forEach(card => {
    card.classList.remove('decrypted'); card.style.display = 'block';
    const inp = card.querySelector('.decrypt-input'); if (inp) {
      const id = inp.dataset.content; const ce = document.getElementById(`content${id}`);
      if (ce && ce.dataset.original) { ce.innerHTML = ce.dataset.original; ce.style.display = 'none'; }
      const ph = document.getElementById(`placeholder${id}`); if (ph) ph.style.display = 'block';
      if (inp.parentElement) inp.parentElement.style.display = 'flex'; inp.value = '';
    }
  });
  const modal = document.querySelector('.decrypted-modal'); if (modal) modal.remove();
}

document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('backButton'); if (backButton) backButton.addEventListener('click', resetView);
  document.querySelectorAll('.decrypt-input').forEach(inp => {
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); const id = parseInt(inp.dataset.content, 10); if (!Number.isNaN(id)) revealContent(id); } });
    const card = inp.closest('.card'); if (card) card.addEventListener('click', (e) => { if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'button') return; inp.focus(); });
  });
  const username = document.getElementById('username'); if (username) username.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); login(); } });
});
