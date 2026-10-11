const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d', { alpha: true });
const intensity = document.getElementById('intensity');
const glow = document.getElementById('glow');
const pixel = document.getElementById('pixel');
const motion = document.getElementById('motion');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let columns = [];
let lastFrame = 0;
const glyphs = '0101011010010110';

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cell = pixel.checked ? 19 : 15;
  columns = Array.from({ length: Math.ceil(innerWidth / cell) }, (_, i) => ({
    x: i * cell,
    y: Math.random() * innerHeight,
    speed: .38 + Math.random() * .9,
    size: cell,
  }));
}

function draw(time) {
  requestAnimationFrame(draw);
  if (time - lastFrame < 33 || !motion.checked || reduceMotion.matches) return;
  lastFrame = time;
  ctx.fillStyle = 'rgba(2, 9, 5, .1)';
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  const density = Number(intensity.value) / 100;
  ctx.font = `${pixel.checked ? 'bold ' : ''}${pixel.checked ? 18 : 16}px Courier New, monospace`;
  for (const col of columns) {
    if (Math.random() > density) continue;
    for (let step = 0; step < 12; step++) {
      const y = col.y - step * col.size;
      if (y < 0 || y > innerHeight) continue;
      ctx.globalAlpha = (1 - step / 13) * (step === 0 ? .9 : .38);
      ctx.fillStyle = step === 0 ? '#c7ffde' : Math.random() > .97 ? '#ad4eff' : '#25d277';
      ctx.shadowColor = '#11f376';
      ctx.shadowBlur = step === 0 ? 13 * Number(glow.value) / 100 : 0;
      ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], col.x, y);
    }
    ctx.globalAlpha = 1;
    col.y += col.speed * col.size;
    if (col.y > innerHeight + col.size * 12) col.y = -Math.random() * 280;
  }
  ctx.shadowBlur = 0;
}

function applyControls() {
  document.getElementById('intensity-value').value = `${intensity.value}%`;
  document.getElementById('glow-value').value = `${glow.value}%`;
  document.documentElement.style.setProperty('--glow', Number(glow.value) / 100);
  document.body.classList.toggle('pixel-mode', pixel.checked);
  try { localStorage.setItem('neon-chat-controls', JSON.stringify({ intensity: intensity.value, glow: glow.value, pixel: pixel.checked, motion: motion.checked })); } catch {}
}

try {
  const saved = JSON.parse(localStorage.getItem('neon-chat-controls') || '{}');
  if (saved.intensity !== undefined) intensity.value = saved.intensity;
  if (saved.glow !== undefined) glow.value = saved.glow;
  if (saved.pixel !== undefined) pixel.checked = saved.pixel;
  if (saved.motion !== undefined) motion.checked = saved.motion;
} catch {}
for (const control of [intensity, glow, pixel, motion]) control.addEventListener('input', () => { applyControls(); if (control === pixel) resize(); });
applyControls();
resize();
requestAnimationFrame(draw);
window.addEventListener('resize', resize);

document.getElementById('settings-toggle').addEventListener('click', () => document.body.classList.toggle('show-controls'));
document.getElementById('menu').addEventListener('click', () => document.body.classList.toggle('show-menu'));
document.getElementById('close-menu').addEventListener('click', () => document.body.classList.remove('show-menu'));
document.getElementById('new-chat').addEventListener('click', () => { document.getElementById('messages').replaceChildren(); document.getElementById('prompt').focus(); document.body.classList.remove('show-menu'); });

const form = document.getElementById('composer');
const input = document.getElementById('prompt');
input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
form.addEventListener('submit', e => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  const row = document.createElement('article');
  row.className = 'message user-message';
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = '◎';
  const body = document.createElement('div');
  body.className = 'message-body';
  const meta = document.createElement('div');
  meta.className = 'message-meta';
  meta.textContent = 'BIGBOSS · LOCAL PREVIEW';
  const p = document.createElement('p');
  p.textContent = value;
  body.append(meta, p);
  row.append(avatar, body);
  document.getElementById('messages').append(row);
  input.value = '';
  row.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'nearest' });
});
