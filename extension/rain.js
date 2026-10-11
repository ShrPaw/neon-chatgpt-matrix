(() => {
  if (document.getElementById('neon-chat-rain')) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'neon-chat-rain';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });
  const glyphs = '0101100101010011';
  let columns = [];
  let previous = 0;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    columns = Array.from({ length: Math.ceil(innerWidth / 18) }, (_, index) => ({ x: index * 18, y: Math.random() * innerHeight, speed: .5 + Math.random() * 1.5 }));
  };
  const frame = time => {
    requestAnimationFrame(frame);
    if (time - previous < 45 || document.hidden) return;
    previous = time;
    ctx.fillStyle = 'rgba(3, 10, 6, .11)';
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.font = '16px Courier New, monospace';
    columns.forEach(column => {
      if (Math.random() < .45) return;
      ctx.fillStyle = Math.random() > .95 ? '#beffcf' : '#31bd6d';
      ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], column.x, column.y);
      column.y += column.speed * 17;
      if (column.y > innerHeight && Math.random() > .85) column.y = -Math.random() * 180;
    });
  };
  resize();
  addEventListener('resize', resize);
  requestAnimationFrame(frame);
})();
