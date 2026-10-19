/* 「問」 button for the 3D campus map — opens the separate 問 service at campus/ask/.
   The map exposes window.campusMap and reads ?to= / ?flow= (see the end of index.html / sketch.html). */
(function(){
  /* procedural brush calligraphy for 問 — stroke order, bristles, 飛白, 頓筆 */
  function mulberry(a){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // 問 in a 100×100 box, in stroke order: [points, width, ending]
  // horizontals are thin and rise slightly to the right; verticals are heavy; folds press at the corner
  const WEN = [
    [[[16,8],[16.5,94]], 9.5, 'dry'],                                   // 1 門 left vertical
    [[[17,10.5],[42,8.8],[41.5,35]], 5.6, 'fold'],                      // 2 left box: top → right side
    [[[19,22.8],[40,21.6]], 3.8, 'flat'],                               // 3 left box middle
    [[[19,34.6],[40.5,33.4]], 4.2, 'flat'],                             // 4 left box bottom
    [[[58.5,10],[58.5,35.5]], 6.2, 'dry'],                              // 5 right box left side
    [[[59.5,10.2],[86,8.2],[85.4,84.5],[76.5,91.5]], 8.6, 'hook'], // 6 right top → long vertical → hook
    [[[61,22.6],[83.5,21.4]], 3.8, 'flat'],                             // 7 right box middle
    [[[61,34.4],[83.5,33.2]], 4.2, 'flat'],                             // 8 right box bottom
    [[[33.5,51],[34,80]], 6.4, 'dry'],                                  // 9 口 left
    [[[34.5,51.5],[65,49.8],[64.5,79.5]], 5.6, 'fold'],                 // 10 口 top → right
    [[[35,77.8],[64,76.6]], 4.6, 'dry'],                                // 11 口 bottom
  ];
  function buildBrush(size, seed = 5){
    const r = mulberry(seed), k = size / 100, segs = [], step = Math.max(.9, size / 520);
    for (const [raw, base, end] of WEN){
      const pts = raw.map(([x, y]) => [x * k, y * k]), W = base * k;
      // resample with per-segment direction (no fans at folds) and corner flags
      const S = [];
      for (let i = 0; i < pts.length - 1; i++){
        const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(1, Math.ceil(L / step));
        const dx = (x2 - x1) / L, dy = (y2 - y1) / L;
        for (let j = 0; j < n; j++) S.push({ x: x1 + (x2 - x1) * j / n, y: y1 + (y2 - y1) * j / n, dx, dy, seg: i, corner: i > 0 && j === 0 });
      }
      const N = S.length, BR = 26;
      const bristles = Array.from({ length: BR }, (_, i) => ({ o: ((i + .5) / BR) * 2 - 1 + (r() - .5) * .04, ink: .78 + r() * .3, dry: r(), drift: 0 }));
      const prevOff = new Float32Array(BR), prevPos = [];
      for (let i = 0; i < N; i++){
        const t = i / (N - 1), p = S[i];
        // distance (in samples) to the nearest corner → 頓筆 swell
        let cd = 99; for (let q = Math.max(0, i - 14); q < Math.min(N, i + 14); q++) if (S[q].corner) cd = Math.min(cd, Math.abs(q - i));
        let pr = 1 + .38 * Math.exp(-i / (5 * k / step));                      // heavy entry
        if (cd < 99 && !(end === 'hook' && S.slice(Math.max(0, i - 14), i + 14).some(s => s.corner && s.seg === raw.length - 2) && p.seg >= raw.length - 3 && i > N * .6)) pr += .32 * Math.exp(-cd / (2.2 * k / step)); // press at the fold
        const lastSeg = raw.length - 2, hookStart = end === 'hook' ? S.findIndex(s => s.seg === lastSeg) : -1;
        if (end === 'hook' && p.seg === lastSeg) pr *= Math.max(.14, 1 - (i - hookStart) / Math.max(1, N - hookStart) * .95);
        else if (end === 'flat') pr *= 1 + .3 * Math.exp(-(N - 1 - i) / (3 * k / step)); // 收筆 bump at the right end
        else if (end === 'dry') pr *= 1 - .14 * Math.max(0, t - .75) / .25;
        const w = W * pr / 2, nx = -p.dy, ny = p.dx;
        // ink runs out toward the end → 飛白
        const inHook = end === 'hook' && p.seg === raw.length - 2;
        const dryness = inHook ? .15 + .55 * (i - hookStart) / Math.max(1, N - hookStart) : end === 'hook' ? Math.max(0, t - .72) * .7 : end === 'flat' ? Math.max(0, t - .6) * .9 : end === 'fold' ? Math.max(0, t - .55) * 1.2 : Math.max(0, t - .45) * 1.35;
        for (let b = 0; b < BR; b++){
          const br = bristles[b];
          br.drift += (r() - .5) * .05; br.drift *= .96;                       // slow random walk, not a sine wave
          const off = (br.o + br.drift * .5) * w;
          const x = p.x + nx * off, y = p.y + ny * off;
          const gap = br.dry < dryness - .05 && (Math.abs(br.o) < .92 || r() < .5);
          if (i > 0 && !p.corner && !gap && r() > .008){
            const [px, py] = prevPos[b];
            segs.push([px, py, x, y, Math.max(.7, W / BR * 2.15), Math.min(1, br.ink * (1 - dryness * .3))]);
          }
          prevPos[b] = [x, y];
        }
        if (p.corner && !(end === 'hook' && p.seg === raw.length - 2)) segs.push(['blot', p.x, p.y, W * .5, W * .46, Math.atan2(p.dy, p.dx) + .6]); // 頓筆
      }
      const s0 = S[0];
      segs.push(['blot', s0.x + s0.dx * W * .3, s0.y + s0.dy * W * .3, W * .5, W * .4, Math.atan2(s0.dy, s0.dx) + .75]); // 起筆 (tucked inside the stroke head)
      segs.push(['end']);
    }
    return segs;
  }
  function drawSegs(g, segs, from, to, ink){
    g.strokeStyle = ink; g.fillStyle = ink; g.lineCap = 'round';
    for (let i = from; i < to; i++){
      const s = segs[i];
      if (s[0] === 'end') continue;
      if (s[0] === 'blot'){ g.globalAlpha = .95; g.beginPath(); g.ellipse(s[1], s[2], s[3], s[4], s[5], 0, Math.PI * 2); g.fill(); continue; }
      g.globalAlpha = s[5]; g.lineWidth = s[4]; g.beginPath(); g.moveTo(s[0], s[1]); g.lineTo(s[2], s[3]); g.stroke();
    }
    g.globalAlpha = 1;
  }

  const css = `
  .wen-fab{position:fixed;z-index:15;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(150px + env(safe-area-inset-bottom,0px));
    width:58px;height:58px;border-radius:50%;border:0;display:grid;place-items:center;cursor:pointer;text-decoration:none;
    background:#1A1916;color:#F2EEE4;box-shadow:0 10px 26px rgba(0,0,0,.28);transition:transform .2s}
  .wen-fab:hover{transform:translateY(-2px)}
  .wen-fab:focus-visible{outline:3px solid #B3302A;outline-offset:3px}
  .wen-fab i{width:34px;height:34px;background:currentColor;-webkit-mask:var(--wen-mark) center/contain no-repeat;mask:var(--wen-mark) center/contain no-repeat}
  .wen-fab b{position:absolute;right:66px;white-space:nowrap;background:#1A1916;color:#F2EEE4;font:500 13px/1 system-ui,sans-serif;padding:8px 11px;border-radius:999px;
    opacity:0;transform:translateX(6px);transition:opacity .2s,transform .2s;pointer-events:none}
  .wen-fab:hover b,.wen-fab.hint b{opacity:1;transform:none}
  @media (prefers-color-scheme:dark){ .wen-fab{background:#ECE6D8;color:#1A1916} .wen-fab b{background:#ECE6D8;color:#1A1916} }
  @media (max-width:760px){ .wen-fab{width:52px;height:52px;right:max(10px,env(safe-area-inset-right,0px));bottom:calc(84px + env(safe-area-inset-bottom,0px))} .wen-fab i{width:30px;height:30px}
    body.card-open .wen-fab, body.has-route .wen-fab{bottom:auto;right:auto;top:calc(64px + env(safe-area-inset-top,0px));left:max(10px,env(safe-area-inset-left,0px));width:44px;height:44px}
    body.card-open .wen-fab i, body.has-route .wen-fab i{width:26px;height:26px} }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const ic = document.createElement('canvas'); ic.width = ic.height = 128;
  const g = ic.getContext('2d'); g.translate(4, 4); const segs = buildBrush(120, 5); drawSegs(g, segs, 0, segs.length, '#000');
  document.documentElement.style.setProperty('--wen-mark', `url(${ic.toDataURL()})`);

  const en = () => (window.campusMap && window.campusMap.lang && window.campusMap.lang() === 'en');
  const a = document.createElement('a');
  a.className = 'wen-fab'; a.href = 'ask/';
  const label = () => en() ? 'Ask: where to go, what to do' : '問：要去哪？要辦什麼？';
  a.innerHTML = '<i aria-hidden="true"></i><b></b>';
  a.querySelector('b').textContent = label(); a.setAttribute('aria-label', label());
  document.body.appendChild(a);
  document.getElementById('langBtn')?.addEventListener('click', () => setTimeout(() => { a.querySelector('b').textContent = label(); a.setAttribute('aria-label', label()); }, 0));
  // brief hint the first time
  let seen = false; try { seen = localStorage.getItem('wen-hint') === '1'; localStorage.setItem('wen-hint', '1'); } catch (e) {}
  if (!seen){ setTimeout(() => a.classList.add('hint'), 1800); setTimeout(() => a.classList.remove('hint'), 6500); }
})();
