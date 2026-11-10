/** Small DOM confetti burst for the search easter egg. Skipped with reduced motion. */
export function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#b08bff', '#d4c0ff', '#34d399', '#fbbf24', '#f472b6', '#ffffff'];
  const layer = document.createElement('div');
  layer.className = 'confetti';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 90; i++) {
    const p = document.createElement('i');
    const x = (Math.random() - 0.5) * 900;
    const y = -(260 + Math.random() * 420);
    p.style.cssText = `--x:${x}px;--y:${y}px;--r:${Math.random() * 720 - 360}deg;--d:${(0.9 + Math.random() * 0.9).toFixed(2)}s;background:${colors[i % colors.length]};left:${45 + Math.random() * 10}%;`;
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 2200);
}
