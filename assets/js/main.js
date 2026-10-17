/*===== MOBILE MENU LOGIC =====*/
const initMenu = (toggleId, navId, closeId) => {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId),
          closeBtn = document.getElementById(closeId)

    // Ensure backdrop overlay exists
    let backdrop = document.getElementById('nav-backdrop')
    if (!backdrop) {
        backdrop = document.createElement('div')
        backdrop.id = 'nav-backdrop'
        backdrop.className = 'nav__backdrop'
        const header = document.querySelector('.l-header')
        if (header) {
            header.insertBefore(backdrop, header.firstChild)
        } else {
            document.body.appendChild(backdrop)
        }
    }

    const openMenu = () => {
        if (nav) nav.classList.add('show')
        if (backdrop) backdrop.classList.add('show')
        document.body.style.overflow = 'hidden'
    }

    const closeMenu = () => {
        if (nav) nav.classList.remove('show')
        if (backdrop) backdrop.classList.remove('show')
        document.body.style.overflow = ''
    }

    if (toggle) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation()
            if (nav && nav.classList.contains('show')) {
                closeMenu()
            } else {
                openMenu()
            }
        })
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            closeMenu()
        })
    }

    if (backdrop) {
        backdrop.addEventListener('click', (e) => {
            e.stopPropagation()
            closeMenu()
        })
    }

    const navLinks = document.querySelectorAll('.nav__link')
    navLinks.forEach(n => n.addEventListener('click', closeMenu))
}
initMenu('nav-toggle', 'nav-menu', 'nav-close')

/*===== SCROLL SECTIONS ACTIVE LINK & PROGRESS BAR =====*/
const sections = document.querySelectorAll('section[id]')
const scrollProgressBar = document.getElementById('scrollProgress')

window.addEventListener('scroll', scrollActive)
window.addEventListener('load', scrollActive)

function scrollActive(){
    const scrollY = window.pageYOffset

    // Reading Scroll Progress Bar
    if (scrollProgressBar) {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0
        scrollProgressBar.style.width = scrolled + '%'
    }

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id')
        const navLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if(navLink){
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                navLink.classList.add('active')
            }else{
                navLink.classList.remove('active')
            }
        }
    })
}

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = (typeof ScrollReveal === 'function')
    ? ScrollReveal({ origin: 'bottom', distance: '24px', duration: 600, easing: 'cubic-bezier(.2,.7,.2,1)', reset: false })
    : { reveal() {} }; // animations are optional; never block the rest of the page

/*SCROLL HOME*/
sr.reveal('.home__title', {});
sr.reveal('.home__scroll', { delay: 60 });
sr.reveal('.home__img', { delay: 120 });
sr.reveal('.home__data', {});
sr.reveal('.hero__photo', { delay: 120 });
sr.reveal('.tl__item, .area', { interval: 50 });


/*SCROLL ABOUT*/
sr.reveal('.about__img', {delay: 100})
sr.reveal('.about__subtitle', {delay: 60})
sr.reveal('.about__profession', {delay: 80})
sr.reveal('.about__text', {delay: 100})
sr.reveal('.about__social-icon', {delay: 100, interval: 60})

/*SCROLL SKILLS*/
sr.reveal('.skills__subtitle', {})
sr.reveal('.skills__name', {distance: '12px', interval: 30})
sr.reveal('.skills__img', {delay: 80})

/*SCROLL PORTFOLIO*/
sr.reveal('.portfolio__img, .portfolio__card, .pf-card', {interval: 80})

/*SCROLL CONTACT*/
sr.reveal('.contact__subtitle', {})
sr.reveal('.contact__text', {interval: 80})
sr.reveal('.contact__input', {delay: 80})
sr.reveal('.contact__button', {delay: 120})

/*===== CONTACT FORM: open the visitor's mail app with the message filled in =====*/
document.querySelectorAll('form.contact__form').forEach(form => {
    const action = form.getAttribute('action') || '';
    if (!action.startsWith('mailto:')) return;
    const to = action.slice(7).split('?')[0];
    form.addEventListener('submit', e => {
        e.preventDefault();
        const val = n => (form.querySelector(`[name="${n}"]`) || {}).value || '';
        const name = val('name').trim(), email = val('email').trim(), msg = val('message').trim();
        const subject = `[CV Website] Message from ${name || 'a visitor'}`;
        const body = `${msg}\n\n— ${name}${email ? ' <' + email + '>' : ''}`;
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        let status = form.querySelector('.contact__status');
        if (!status) {
            status = document.createElement('p');
            status.className = 'contact__status';
            form.appendChild(status);
        }
        status.textContent = `已開啟您的郵件程式；若沒有反應，請直接寫信至 ${to}`;
    });
});

/*===== HERO NUMBERS: count up once when visible =====*/
(() => {
    const nums = document.querySelectorAll('[data-count]');
    if (!nums.length || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const run = el => {
        const end = +el.dataset.count, suffix = el.dataset.suffix || '', t0 = performance.now(), dur = 1100;
        const step = now => {
            const p = Math.min(1, (now - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(end * eased) + (p === 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    }), { threshold: .6 });
    nums.forEach(n => io.observe(n));
})();

/*===== Click-to-play YouTube (loads the player only when clicked) =====*/
function bindYT(btn) {
    btn.addEventListener('click', () => {
        if (!btn.dataset.thumb) btn.dataset.thumb = btn.innerHTML;
        const id = btn.dataset.yt;
        const f = document.createElement('iframe');
        f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
        f.title = btn.getAttribute('aria-label') || 'YouTube video';
        f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        f.referrerPolicy = 'strict-origin-when-cross-origin';
        f.allowFullscreen = true;
        btn.replaceChildren(f);
        btn.style.cursor = 'default';
    }, { once: true });
}
// stop a playing video and show its thumbnail again
function resetYT(btn) {
    if (!btn.dataset.thumb || !btn.querySelector('iframe')) return;
    btn.innerHTML = btn.dataset.thumb; btn.style.cursor = ''; bindYT(btn);
}
document.querySelectorAll('.ib-video__frame[data-yt]').forEach(bindYT);

/*===== Lab: student works — tabs + arrows + swipe, no autoplay =====*/
document.querySelectorAll('.lab2__works').forEach(box => {
    const tabs = [...box.querySelectorAll('.lab2__tab')];
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    const count = box.querySelector('.lab2__count');
    let cur = 0;
    const show = i => {
        i = (i + panels.length) % panels.length;
        if (i === cur) return;
        panels[cur].querySelectorAll('.ib-video__frame[data-yt]').forEach(resetYT);
        panels[cur].querySelectorAll('video').forEach(v => v.pause());
        panels.forEach((p, k) => { p.hidden = k !== i; });
        tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); t.tabIndex = k === i ? 0 : -1; });
        cur = i;
        if (count) count.textContent = `${i + 1} / ${panels.length}`;
    };
    tabs.forEach((t, k) => {
        t.tabIndex = k === 0 ? 0 : -1;
        t.addEventListener('click', () => show(k));
        t.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); show(cur + (e.key === 'ArrowRight' ? 1 : -1)); tabs[cur].focus(); }
        });
    });
    box.querySelectorAll('.lab2__arrow').forEach(b => b.addEventListener('click', () => show(cur + Number(b.dataset.dir))));
    let x0 = null, y0 = 0;
    box.addEventListener('touchstart', e => { if (e.target.closest('iframe, details')) return; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    box.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });
});

/*===== Lab mascot: a parcel-bot that walks around the Lab section title =====*/
(() => {
    const section = document.getElementById('laboratory');
    const title = section && section.querySelector('.section-title');
    if (!title) return;
    const BOTS = [
        { c: '#6c63ff', icon: c => `<path d="M141 141h15l14 14-12 12-14-14z" fill="${c}"/><circle cx="148" cy="148" r="3.2" fill="#fff"/>`, line: '我是上架 Agent，英日德三語商品頁一次寫好！' },
        { c: '#38bdf8', icon: c => `<circle cx="153" cy="145" r="10" fill="none" stroke="${c}" stroke-width="5"/><line x1="160" y1="152" x2="169" y2="161" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`, line: '我是選品 Agent，專門從差評裡挖商機。' },
        { c: '#ec4899', icon: c => `<path d="M140 145h13l17-10v30l-17-10h-13z" fill="${c}"/><rect x="144" y="155" width="7" height="11" rx="2" fill="${c}"/>`, line: '我是行銷 Agent，短影音、廣告投放交給我！' },
        { c: '#10b981', icon: c => `<rect x="139" y="135" width="38" height="25" rx="8" fill="${c}"/><path d="M147 159v9l9-9z" fill="${c}"/><circle cx="149" cy="147.5" r="2.6" fill="#fff"/><circle cx="158" cy="147.5" r="2.6" fill="#fff"/><circle cx="167" cy="147.5" r="2.6" fill="#fff"/>`, line: '我是客服 Agent，海外詢盤 24 小時回覆。' },
        { c: '#f59e0b', icon: c => `<circle cx="158" cy="150" r="15" fill="${c}"/><text x="158" y="157.5" text-anchor="middle" font-size="21" font-weight="900" fill="#fff" font-family="Arial, sans-serif">€</text>`, line: '我是報價 Agent，匯率一變就幫你守住毛利。' },
        { c: '#f97316', icon: c => `<rect x="145" y="138" width="11" height="11" rx="1.5" fill="${c}"/><rect x="158" y="138" width="11" height="11" rx="1.5" fill="${c}"/><path d="M137 152h42l-7 13h-28z" fill="${c}"/>`, line: '我是物流關務 Agent，HS Code 和訂艙包在我身上。' },
    ];
    const EN = (document.documentElement.lang || '').toLowerCase().startsWith('en');
    if (EN) BOTS.forEach((b, i) => { b.line = ['I’m the Listing Agent: product pages in English, Japanese and German in one go!', 'I’m the Sourcing Agent: I dig business ideas out of bad reviews.', 'I’m the Marketing Agent: short videos and ad campaigns are my thing!', 'I’m the Support Agent: overseas enquiries answered 24/7.', 'I’m the Pricing Agent: when exchange rates move, I protect your margin.', 'I’m the Logistics Agent: HS codes and freight booking, leave them to me.'][i]; });
    const T = EN ? {
        note: '⚠️ AI can make mistakes. Please double-check important info. Chats are logged to improve the bot; don’t share personal data.', hint: 'Xia Ge here 🦐 click me to ask!', open: 'Chat with Xia Ge, the ICMA Lab bot', title: 'Xia Ge 🦐 · ICMA Lab bot', hi: 'Hi, I’m Xia Ge 🦐! ', swap: 'Next agent', close: 'Close', label: 'Your question',
        ph: 'Ask me: what does the lab do?', send: 'Send', hello: ' Ask me anything about the lab!', thinking: 'Thinking…',
        slow: 'Too many questions at once. Give me a minute!', down: 'I can’t reach my brain right now. Please try later or email nutcelvischen@gmail.com.', offline: 'Looks like the network dropped. Please try again!',
        extra: ['I’m Xia Ge 🦐 Click me to ask!', 'You bring the idea, we bring the tokens!', 'Questions? Let’s chat!', 'Welcome to ICMA Lab 👋'],
    } : {
        note: '‼️ AI 可能會有錯誤，請同學務必注意，重要資訊請再確認。對話會被記錄以改善服務，請勿輸入個資。', hint: '蝦哥在這 🦐 點我問問題！', open: '和蝦哥（ICMA Lab 機器人）聊天', title: '蝦哥 🦐 · ICMA Lab 機器人', hi: '嗨，我是蝦哥 🦐！', swap: '換一位 Agent', close: '關閉', label: '輸入問題',
        ph: '問我：實驗室在做什麼？', send: '送出', hello: ' 想問實驗室什麼都可以問我！', thinking: '思考中…',
        slow: '問太快了，我喘口氣，一分鐘後再問我！', down: '我暫時連不上大腦，請稍後再試，或寫信到 nutcelvischen@gmail.com。', offline: '網路好像斷了，請稍後再試！',
        extra: ['我是蝦哥 🦐 點我問問題！', '你有點子，老師有 Token！', '有問題？點我聊聊！', '歡迎加入 ICMA Lab 👋'],
    };
    const EXTRA = T.extra;
    const FUN = EN ? ['🍫 Fun fact: the professor loves chocolate.', '🚫 Fun fact: the professor is on a diet. Please do not feed him.', '🧋 Fun fact: the professor only drinks sugar-free drinks.', "💪 Fun fact: the professor can do 20 pull-ups in one go. Beat that and he’ll be very impressed.", '🎮 Fun fact: the professor is a homebody who plays with AI agents all day.', "😂 Why don’t AI agents mind overtime? The professor pays for the tokens.", '😂 Why are multi-agent meetings so efficient? Every agent only does its own job.', '😂 Why write clear prompts? Because AI, like professors, fills in the gaps on its own.'] : ['🍫 老師小八卦：老師非常喜歡吃巧克力。', '🤰 老師小八卦：老師的肚子很大，標準中年老頭身材。', '🤬 老師小八卦：老師講話很直接，激動起來偶爾會飆一下（聽到請假裝沒聽到）。', '💪 老師小八卦：老師可以拉單槓一次 20 下！你能挑戰成功，老師讓你 all pass（all pass 是開玩笑的啦，但老師真的會佩服你）。', '🚫 老師小八卦：老師減肥中，請勿餵食。', '🧋 老師小八卦：老師的飲料只喝無糖。', '🎮 老師小八卦：老師很宅，整天都在玩 Agent。', '😂 冷笑話：為什麼 AI Agent 都不怕加班？因為 Token 老師買單。', '😂 冷笑話：國貿系的浪漫是什麼？陪你從 FOB 一路算到 CIF。', '😂 冷笑話：AI 最怕哪種客戶？說「你懂我意思吧」的那種。', '😂 冷笑話：多代理人系統開會為什麼很有效率？因為每個 Agent 都只做自己的事。', '😂 冷笑話：報價 Agent 失戀了，因為對方說他「太看重毛利」。', '😂 冷笑話：為什麼 Prompt 要寫清楚？因為 AI 跟老師一樣，看不懂就自己腦補。', '😂 冷笑話：物流 Agent 最喜歡的歌？當然是《貨到付款》……沒有這首歌，所以它很難過。'];
    let funLast = -1;
    const pickFun = () => { let i; do { i = Math.floor(Math.random() * FUN.length); } while (FUN.length > 1 && i === funLast); funLast = i; return FUN[i]; };
    const svg = b => `<svg viewBox="0 0 200 220" aria-hidden="true">
        <g class="lw-legs"><rect class="lw-leg lw-leg--l" x="66" y="176" width="18" height="30" rx="8" fill="#17133a"/><rect class="lw-leg lw-leg--r" x="116" y="176" width="18" height="30" rx="8" fill="#17133a"/></g>
        <line x1="100" y1="42" x2="100" y2="20" stroke="#17133a" stroke-width="6" stroke-linecap="round"/>
        <circle cx="100" cy="15" r="10" fill="${b.c}" stroke="#17133a" stroke-width="5"/>
        <rect x="28" y="40" width="144" height="142" rx="36" fill="${b.c}"/>
        <rect x="89" y="40" width="22" height="142" fill="#fff" opacity=".22"/>
        <rect x="46" y="66" width="108" height="70" rx="22" fill="#17133a"/>
        <g class="lw-eyes"><ellipse cx="80" cy="96" rx="9" ry="12" fill="#fff"/><ellipse cx="120" cy="96" rx="9" ry="12" fill="#fff"/></g>
        <path d="M87 116q13 10 26 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
        <g class="lw-arm"><rect x="164" y="104" width="34" height="16" rx="8" fill="${b.c}" stroke="#17133a" stroke-width="4"/></g>
        <circle cx="158" cy="150" r="29" fill="#fff" stroke="${b.c}" stroke-width="5"/>${b.icon(b.c)}
      </svg>`;

    section.classList.add('has-walker');
    const layer = document.createElement('div');
    layer.className = 'lab-walker';
    layer.innerHTML = `<div class="lw-bubble" role="status" aria-live="polite"></div><button type="button" class="lw-bot" aria-label="${T.open}" aria-expanded="false" aria-controls="lw-chat"></button>`;
    section.appendChild(layer);
    const bot = layer.querySelector('.lw-bot'), bubble = layer.querySelector('.lw-bubble');
    let idx = 0;
    const paint = () => { bot.innerHTML = svg(BOTS[idx]); };
    paint();

    const W = 46, H = 51, PAD = 10, R = 26, SPEED = .07;   // px per ms
    // Path around the title box (relative to the section); falls back to the top edge on narrow screens
    function geom() {
        const sr = section.getBoundingClientRect(), tr = title.getBoundingClientRect();
        // union of the text runs only (the heading and its <small> are full-width blocks)
        let L = Infinity, Rr = -Infinity;
        const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            if (!n.textContent.trim()) continue;
            const rg = document.createRange(); rg.selectNodeContents(n);
            for (const q of rg.getClientRects()) { L = Math.min(L, q.left); Rr = Math.max(Rr, q.right); }
        }
        const rr = { left: L, right: Rr };
        const x0 = rr.left - sr.left - PAD, x1 = rr.right - sr.left + PAD;
        const y0 = tr.top - sr.top - PAD + 6, y1 = tr.bottom - sr.top + PAD - 4;
        const loop = (x0 - H - 8) > 0 && (x1 + H + 8) < sr.width;
        const sx = x1 - x0 - 2 * R, sy = y1 - y0 - 2 * R, arc = Math.PI * R / 2;
        return { x0, x1, y0, y1, loop, sx, sy, arc, len: loop ? 2 * sx + 2 * sy + 4 * arc : (x1 - x0) };
    }
    // point + tangent angle (deg) at distance s along the clockwise loop
    function at(g, s) {
        if (!g.loop) return { x: g.x0 + s, y: g.y0, a: 0 };
        const { x0, x1, y0, y1, sx, sy, arc } = g;
        const seg = [sx, arc, sy, arc, sx, arc, sy, arc];
        const arcAt = (cx, cy, f0, t) => { const f = (f0 + 90 * t) * Math.PI / 180; return { x: cx + R * Math.cos(f), y: cy + R * Math.sin(f), a: f0 + 90 * t + 90 }; };
        let k = 0; s = ((s % g.len) + g.len) % g.len;
        while (k < 7 && s > seg[k]) { s -= seg[k]; k++; }
        const t = seg[k] ? s / seg[k] : 0;
        switch (k) {
            case 0: return { x: x0 + R + s, y: y0, a: 0 };
            case 1: return arcAt(x1 - R, y0 + R, -90, t);
            case 2: return { x: x1, y: y0 + R + s, a: 90 };
            case 3: return arcAt(x1 - R, y1 - R, 0, t);
            case 4: return { x: x1 - R - s, y: y1, a: 180 };
            case 5: return arcAt(x0 + R, y1 - R, 90, t);
            case 6: return { x: x0, y: y1 - R - s, a: 270 };
            default: return arcAt(x0 + R, y0 + R, 180, t);
        }
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let s = 40, dir = 1, state = 'walk', until = performance.now() + 5000, last = 0, visible = false, bubbleUntil = 0, hopUntil = 0;
    function draw(t) {
        const g = geom();
        if (!g.loop) { s = Math.max(0, Math.min(g.len - W, s)); }
        const p = at(g, g.loop ? s : s + W / 2);
        const walking = state === 'walk' && t > bubbleUntil;
        const lift = (walking ? Math.abs(Math.sin(t / 110)) * 3 : 0) + (t < hopUntil ? Math.sin((1 - (hopUntil - t) / 420) * Math.PI) * 22 : 0);
        const rad = p.a * Math.PI / 180, nx = Math.sin(rad), ny = -Math.cos(rad);
        bot.style.transform = `translate(${p.x - W / 2 + nx * lift}px, ${p.y - H + ny * lift}px) rotate(${p.a}deg)`;
        bot.querySelector('svg').style.transform = `scaleX(${dir})`;
        bot.classList.toggle('is-walking', walking);
        bot.classList.toggle('is-waving', state === 'wave' || t < bubbleUntil);
        // bubble: upright, just outside the bot, kept inside the section
        const bw = bubble.offsetWidth || 220, bh = bubble.offsetHeight || 36, sw = section.clientWidth;
        let bx = p.x + nx * (H + 12) - bw / 2, by = p.y + ny * (H + 12) - bh / 2;
        if (Math.abs(ny) > .7) by = ny < 0 ? p.y - H - bh - 10 : p.y + H + 10;
        bubble.style.transform = `translate(${Math.max(8, Math.min(sw - bw - 8, bx))}px, ${by}px)`;
        bubble.classList.toggle('is-on', t < bubbleUntil);
    }
    function loop(t) {
        const dt = Math.min(50, t - (last || t)); last = t;
        if (visible) {
            if (chatOpen) { state = 'idle'; until = t + 1500; }
            else if (t > nextHint && t > bubbleUntil) { say(EXTRA[hintN++ % EXTRA.length]); nextHint = t + 11000 + Math.random() * 5000; }
            if (chatOpen) { /* stand still while chatting */ }
            else if (state === 'walk' && t > bubbleUntil) {
                s += dir * SPEED * dt;
                const g = geom();
                if (!g.loop && (s <= 0 || s >= g.len - W)) { dir *= -1; state = 'idle'; until = t + 700; }
                if (t > until) { const r = Math.random(); state = r < .5 ? 'wave' : 'idle'; until = t + 900 + Math.random() * 1300; }
            } else if (t > until && t > bubbleUntil) {
                state = 'walk'; until = t + 2500 + Math.random() * 4000;
                if (Math.random() < .12) dir *= -1;
            }
            draw(t);
        }
        requestAnimationFrame(loop);
    }
    const say = text => { const t = performance.now(); bubble.textContent = text; bubbleUntil = t + 3200; hopUntil = t + 420; if (reduce) draw(t); };
    // ---- Chat: click the bot to open a small chat panel ----
    const API = 'https://icma-lab-chat.netlify.app/api/chat';
    let chatOpen = false, busy = false, nextHint = performance.now() + 4000, hintN = 0;
    const history = [];
    // anonymous per-browser id so the server can count the 6-questions-a-day quota
    let vid = '';
    try { vid = localStorage.getItem('icma_vid') || ''; if (!vid) { vid = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()); localStorage.setItem('icma_vid', vid); } } catch (_) { vid = ''; }
    let outOfQuota = false;
    const panel = document.createElement('div');
    panel.className = 'lw-chat'; panel.id = 'lw-chat'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', T.open);
    panel.innerHTML = `<div class="lw-chat__head"><span class="lw-chat__dot"></span><strong>${T.title}</strong>
        <button type="button" class="lw-chat__swap">${T.swap}</button><button type="button" class="lw-chat__close" aria-label="${T.close}">×</button></div>
        <div class="lw-chat__log" aria-live="polite"></div>
        <div class="lw-chat__chips"><button type="button" class="lw-chat__fun">${EN ? '🎲 Tell me a fun one' : '🎲 再來一則笑話／八卦'}</button></div>
        <form class="lw-chat__form"><label class="sr-only" for="lw-q">${T.label}</label><input id="lw-q" type="text" maxlength="300" autocomplete="off" placeholder="${T.ph}"><button type="submit">${T.send}</button></form>
        <p class="lw-chat__note">${T.note}</p>`;
    section.appendChild(panel);
    const log = panel.querySelector('.lw-chat__log'), input = panel.querySelector('input'), sendBtn = panel.querySelector('.lw-chat__form button'), dot = panel.querySelector('.lw-chat__dot');
    const PAGE_NAMES = { '': '首頁', publications: '著作論文', projects: '研究專案', talks: '演講講座', awards: '榮譽獲獎', teaching: '教學資源', laboratory: '實驗室', contact: '聯絡資訊', about: '關於老師', 'se/index': '軟體工程講義' };
    const PAGE_NAMES_EN = { '': 'Home', en: 'English profile', publications: 'Publications', projects: 'Projects', talks: 'Talks', awards: 'Awards', teaching: 'Teaching', laboratory: 'ICMA Lab', contact: 'Contact', about: 'About', 'se/index': 'Textbook' };
    // render text, turning https links into safe anchors (built with DOM nodes, never innerHTML)
    const fill = (el, text) => {
        el.replaceChildren();
        const re = /https:\/\/[^\s<>"'）)，。]+/g; let i = 0, m;
        while ((m = re.exec(text))) {
            el.append(text.slice(i, m.index));
            const a = document.createElement('a'); a.href = m[0]; a.rel = 'noopener';
            const own = m[0].startsWith('https://drchunchihchen.github.io/cv/');
            if (!own) a.target = '_blank';
            const key = m[0].replace('https://drchunchihchen.github.io/cv/', '').replace(/\.html.*$/, '').replace(/^#/, '');
            a.textContent = m[0].startsWith('https://aisap.nutc.edu.tw/') ? (EN ? 'Teaching timetable ↗' : '查看老師課表 ↗') : own ? (EN ? `Open “${PAGE_NAMES_EN[key] || 'page'}” ↗` : `前往「${PAGE_NAMES[key] || '網站'}」↗`) : m[0];
            el.append(a); i = m.index + m[0].length;
        }
        el.append(text.slice(i));
    };
    const addMsg = (who, text) => { const m = document.createElement('div'); m.className = 'lw-msg lw-msg--' + who; fill(m, text); log.appendChild(m); log.scrollTop = log.scrollHeight; return m; };
    const place = () => {
        if (window.innerWidth <= 640) { panel.style.top = ''; return; }
        const sr = section.getBoundingClientRect(), tr = title.getBoundingClientRect();
        panel.style.top = (tr.bottom - sr.top + 64) + 'px';
    };
    const setBot = () => { dot.style.background = BOTS[idx].c; };
    function openChat() {
        chatOpen = true; panel.hidden = false; bot.setAttribute('aria-expanded', 'true');
        bubbleUntil = 0; place(); setBot();
        if (!log.childElementCount) {
            addMsg('bot', T.hi + (EN ? 'Today I’m playing ' + BOTS[idx].line.replace(/^I’m the /, 'the ') : '今天的身分是' + BOTS[idx].line.replace(/^我是/, '')) + T.hello);
            // first visit only: add one joke or fun fact (remembered in this browser)
            let seen = true;
            try { seen = localStorage.getItem('icma_fun_seen') === '1'; localStorage.setItem('icma_fun_seen', '1'); } catch (_) { seen = false; }
            if (!seen) addMsg('bot', pickFun());
        }
        requestAnimationFrame(() => panel.classList.add('is-open'));
        input.focus({ preventScroll: true });
    }
    function closeChat() {
        chatOpen = false; panel.classList.remove('is-open'); bot.setAttribute('aria-expanded', 'false');
        setTimeout(() => { if (!chatOpen) panel.hidden = true; }, 200);
        nextHint = performance.now() + 9000;
    }
    bot.addEventListener('click', () => { chatOpen ? closeChat() : openChat(); });
    bot.addEventListener('mouseenter', () => { if (!chatOpen && performance.now() > bubbleUntil) say(T.hint); });
    panel.querySelector('.lw-chat__fun').addEventListener('click', () => { addMsg('bot', pickFun()); hopUntil = performance.now() + 420; });
    panel.querySelector('.lw-chat__close').addEventListener('click', () => { closeChat(); bot.focus({ preventScroll: true }); });
    panel.querySelector('.lw-chat__swap').addEventListener('click', () => {
        idx = (idx + 1) % BOTS.length; paint(); setBot(); addMsg('bot', BOTS[idx].line);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && chatOpen) { closeChat(); bot.focus({ preventScroll: true }); } });
    window.addEventListener('resize', () => { if (chatOpen) place(); });
    panel.querySelector('form').addEventListener('submit', async e => {
        e.preventDefault();
        const q = input.value.trim();
        if (!q || busy) return;
        busy = true; sendBtn.disabled = true; input.value = '';
        addMsg('user', q);
        const pending = addMsg('bot', T.thinking); pending.classList.add('is-loading');
        let answer;
        try {
            const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, history: history.slice(-8), vid }) });
            const d = await r.json().catch(() => ({}));
            if (r.status === 429 && d.code === 'daily_limit') { answer = d.error; outOfQuota = true; }
            else if (r.status === 429) answer = T.slow;
            else answer = d.answer || d.error || T.down;
            if (r.ok && d.answer) history.push({ role: 'user', content: q }, { role: 'assistant', content: d.answer });
            if (r.ok && d.left === 0) { answer += EN ? '\n\n(That was your last question for today.)' : '\n\n（這是你今天的最後一題囉！）'; outOfQuota = true; }
            else if (r.ok && d.left > 0 && d.left <= 2) answer += EN ? `\n\n(${d.left} question${d.left > 1 ? 's' : ''} left today)` : `\n\n（今天還可以問 ${d.left} 題）`;
        } catch (_) { answer = T.offline; }
        pending.classList.remove('is-loading'); fill(pending, answer); log.scrollTop = log.scrollHeight;
        hopUntil = performance.now() + 420;
        busy = false;
        if (outOfQuota) { sendBtn.disabled = true; input.disabled = true; input.placeholder = EN ? 'See you tomorrow 🦐' : '今天的 6 題用完囉，明天見 🦐'; }
        else { sendBtn.disabled = false; input.focus({ preventScroll: true }); }
    });

    if (reduce) { state = 'idle'; draw(performance.now()); window.addEventListener('resize', () => draw(performance.now())); return; }
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; last = 0; }, { rootMargin: '120px' }).observe(title);
    else visible = true;
    requestAnimationFrame(loop);
})();

/*===== Halloween wardrobe: a new costume every day from 10/17 to 10/31 (Taipei time) =====*/
(() => {
    const box = document.querySelector('.hero__photo--chibi');
    const img = box && box.querySelector('img');
    if (!img) return;
    const EN = (document.documentElement.lang || '').toLowerCase().startsWith('en');
    // [file, 中文, English] — one per day, 10/17 … 10/31; the last two only appear when clicking through
    const C = [
        ['blackcat', '黑貓', 'Black Cat'], ['mushroom', '蘑菇精靈', 'Mushroom Sprite'], ['bee', '小蜜蜂', 'Bumblebee'],
        ['astronaut', '太空人', 'Astronaut'], ['robot', '機器人', 'Robot'], ['dinosaur', '恐龍睡衣', 'Dino Onesie'],
        ['pirate', '海盜', 'Pirate'], ['wizard', '巫師', 'Wizard'], ['jiangshi', '殭屍道長', 'Jiangshi'],
        ['mummy', '木乃伊', 'Mummy'], ['skeleton', '骷髏', 'Skeleton'], ['frankenstein', '科學怪人', 'Frankenstein'],
        ['pumpkin', '南瓜', 'Pumpkin'], ['vampire', '吸血鬼', 'Vampire'], ['pumpkinlord', '南瓜紳士', 'Pumpkin Lord'],
        ['diver', '復古潛水員', 'Retro Diver'], ['ghostchef', '幽靈甜點師', 'Ghost Pastry Chef'],
    ];
    const q = new URLSearchParams(location.search).get('hw');
    if (q === 'off') return;
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-').map(Number);
    let i = -1;
    if (parts[1] === 10 && parts[2] >= 17 && parts[2] <= 31) i = parts[2] - 17;
    const forced = C.findIndex(c => c[0] === q);
    if (forced >= 0) i = forced;
    if (i < 0) return;                       // outside the season: normal chibi + pull-ups

    // Cute Halloween sky in the hero: candy rain, floating ghosts, flapping bats
    (() => {
        const home = document.getElementById('home');
        if (!home || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const R = (a, b) => a + Math.random() * (b - a);
        const CANDY_C = [['#ff8fb1', '#ffd6e3'], ['#ffa94d', '#ffe0b8'], ['#b197fc', '#e5dbff'], ['#63e6be', '#c3fae8'], ['#ffd43b', '#fff3bf']];
        const ink = '#3b2f4a';
        const candy = (c) => `<svg viewBox="0 0 60 30"><path d="M14 15 2 5v20z M46 15 58 5v20z" fill="${c[0]}" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/><ellipse cx="30" cy="15" rx="17" ry="11" fill="${c[0]}" stroke="${ink}" stroke-width="2"/><path d="M22 6q-4 9 0 18M30 4q-4 11 0 22M38 6q-4 9 0 18" stroke="${c[1]}" stroke-width="3" fill="none"/></svg>`;
        const lolly = (c) => `<svg viewBox="0 0 40 60"><path d="M20 36v22" stroke="#e9e2d0" stroke-width="5" stroke-linecap="round"/><circle cx="20" cy="20" r="17" fill="${c[1]}" stroke="${ink}" stroke-width="2"/><path d="M20 20m-3 0a3 3 0 1 1 6 0a7 7 0 1 1-13 0a11 11 0 1 1 21 1" fill="none" stroke="${c[0]}" stroke-width="3.5" stroke-linecap="round"/></svg>`;
        const corn = () => `<svg viewBox="0 0 40 44"><path d="M20 3 37 39q-17 6-34 0z" fill="#fff8e7" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/><path d="M11.5 21 28.5 21 37 39q-17 6-34 0z" fill="#ffa94d"/><path d="M7 30 33 30 37 39q-17 6-34 0z" fill="#ffd43b"/><path d="M20 3 37 39q-17 6-34 0z" fill="none" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/></svg>`;
        const ghost = () => `<svg viewBox="0 0 80 90"><path d="M10 44a30 30 0 0 1 60 0v34l-8-6-8 8-7-8-7 8-8-8-8 6-8 6z" fill="#fff" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="30" cy="42" rx="4.5" ry="6" fill="${ink}"/><ellipse cx="50" cy="42" rx="4.5" ry="6" fill="${ink}"/><circle cx="31.5" cy="40" r="1.5" fill="#fff"/><circle cx="51.5" cy="40" r="1.5" fill="#fff"/><ellipse cx="22" cy="52" rx="5" ry="3" fill="#ffc9d9"/><ellipse cx="58" cy="52" rx="5" ry="3" fill="#ffc9d9"/><path d="M36 54q4 4 8 0" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/></svg>`;
        const bat = () => `<svg viewBox="0 0 100 50"><g class="hwfx-wing hwfx-wing--l"><path d="M42 24Q24 2 4 14q10 2 8 10 8-3 12 5 6-6 12 1z" fill="#5b4b8a" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/></g><g class="hwfx-wing hwfx-wing--r"><path d="M58 24Q76 2 96 14q-10 2-8 10-8-3-12 5-6-6-12 1z" fill="#5b4b8a" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/></g><path d="M40 16l3-9 5 6h4l5-6 3 9" fill="#5b4b8a" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="50" cy="26" rx="12" ry="13" fill="#5b4b8a" stroke="${ink}" stroke-width="2.5"/><circle cx="45" cy="23" r="3.2" fill="#fff"/><circle cx="55" cy="23" r="3.2" fill="#fff"/><circle cx="45.6" cy="23.6" r="1.6" fill="${ink}"/><circle cx="55.6" cy="23.6" r="1.6" fill="${ink}"/><path d="M47 31l1.5 2.5 1.5-2.5 1.5 2.5 1.5-2.5" fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
        const layer = document.createElement('div'); layer.className = 'hwfx'; layer.setAttribute('aria-hidden', 'true');
        const small = innerWidth < 700, add = (cls, html, css) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; Object.assign(d.style, css); layer.appendChild(d); return d; };
        for (let n = 0; n < (small ? 5 : 9); n++) {
            const c = CANDY_C[n % CANDY_C.length], kind = n % 5, dur = R(8, 14) / .7;
            const html = kind === 3 ? lolly(c) : kind === 4 ? corn() : candy(c);
            add('hwfx-fall', `<div class="hwfx-spin">${html}</div>`, { left: R(2, 96) + '%', width: (kind === 3 ? R(22, 30) : kind === 4 ? R(18, 24) : R(30, 42)) + 'px', animationDuration: dur + 's', animationDelay: -R(0, dur) + 's', '--sway': R(-40, 40) + 'px', '--spin': (R(0, 1) > .5 ? 1 : -1) * R(180, 540) + 'deg' });
        }
        for (let n = 0; n < (small ? 2 : 3); n++) {
            const dur = R(20, 30);
            add('hwfx-across hwfx-across--' + (n % 2 ? 'rtl' : 'ltr'), `<div class="hwfx-bob">${ghost()}</div>`, { top: R(10, 70) + '%', width: R(46, 64) + 'px', animationDuration: dur + 's', animationDelay: -R(0, dur) + 's' });
        }
        for (let n = 0; n < (small ? 2 : 3); n++) {
            const dur = R(11, 17);
            add('hwfx-across hwfx-bat hwfx-across--' + (n % 2 ? 'ltr' : 'rtl'), `<div class="hwfx-zig">${bat()}</div>`, { top: R(4, 40) + '%', width: R(54, 72) + 'px', animationDuration: dur + 's', animationDelay: -R(0, dur) + 's' });
        }
        home.prepend(layer);
        if ('IntersectionObserver' in window) new IntersectionObserver(es => layer.classList.toggle('is-paused', !es[0].isIntersecting)).observe(home);
    })();
    box.dataset.hw = '1';
    const homeEl = document.getElementById('home'); if (homeEl) homeEl.classList.add('hw-night');
    // Halloween music: two tracks taking turns, starts only when the visitor taps the button
    (() => {
        const tracks = ['assets/audio/halloween-cute-pumpkin.mp3', 'assets/audio/halloween-waltz.mp3'];
        const L = EN ? { on: '🎵 Halloween music', off: '🔇 Pause music', label: 'Play or pause Halloween music' }
                     : { on: '🎵 播放萬聖節音樂', off: '🔇 暫停音樂', label: '播放或暫停萬聖節音樂' };
        const audio = new Audio(); audio.preload = 'none'; audio.volume = .35;
        let t = 0, playing = false, resumeOnShow = false;
        const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'hw-music';
        btn.setAttribute('aria-label', L.label); btn.setAttribute('aria-pressed', 'false'); btn.textContent = L.on;
        document.body.appendChild(btn);
        const set = (on) => { playing = on; btn.textContent = on ? L.off : L.on; btn.setAttribute('aria-pressed', String(on)); btn.classList.toggle('is-on', on); };
        const start = () => { if (!audio.src) audio.src = tracks[t]; audio.play().then(() => set(true)).catch(() => set(false)); };
        audio.addEventListener('ended', () => { t = (t + 1) % tracks.length; audio.src = tracks[t]; audio.play().catch(() => set(false)); });
        btn.addEventListener('click', () => { if (playing) { audio.pause(); set(false); } else start(); });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && playing) { resumeOnShow = true; audio.pause(); set(false); }
            else if (!document.hidden && resumeOnShow) { resumeOnShow = false; start(); }
        });
    })();
    box.classList.add('is-halloween');
    const left = 31 - (parts[1] === 10 ? parts[2] : 31);
    const label = document.createElement('span'); label.className = 'hw-label'; label.setAttribute('aria-live', 'polite');
    box.appendChild(label);
    const show = (k) => {
        const c = C[k];
        img.src = `assets/img/halloween/${c[0]}.svg?v=1`;
        img.alt = EN ? `Elvis Chen dressed as a ${c[2]} for Halloween` : `陳俊智的萬聖節造型：${c[1]}`;
        img.removeAttribute('width'); img.removeAttribute('height');
        const name = EN ? c[2] : c[1];
        const tail = left > 0 ? (EN ? ` · ${left} day${left > 1 ? 's' : ''} to Halloween` : ` · 萬聖節倒數 ${left} 天`) : (EN ? ' · Happy Halloween!' : ' · 萬聖節快樂！');
        label.textContent = `🎃 ${k === i ? (EN ? 'Today: ' : '今日造型：') : ''}${name}${k === i ? tail : ''}`;
    };
    show(i);
    let k = i;
    box.setAttribute('role', 'button'); box.tabIndex = 0;
    box.setAttribute('aria-label', EN ? 'Try another Halloween costume' : '換一套萬聖節造型');
    const next = () => { k = (k + 1) % C.length; box.classList.remove('hw-pop'); void box.offsetWidth; box.classList.add('hw-pop'); show(k); };
    box.addEventListener('click', next);
    box.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } });
})();

/*===== Hero easter egg: the chibi does pull-ups (click / tap / Enter) =====*/
(() => {
    const box = document.querySelector('.hero__photo--chibi');
    const img = box && box.querySelector('img');
    if (!img || box.dataset.hw) return;
    const EN = (document.documentElement.lang || '').toLowerCase().startsWith('en');
    const T = EN ? { hint: 'Tap me 💪', label: 'Watch Elvis do pull-ups', done: 'He can do 20 in a row 💪' }
                 : { hint: '點我 💪', label: '看老師拉單槓', done: '老師一次能拉 20 下 💪' };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    box.classList.add('has-pullup');
    box.setAttribute('role', 'button'); box.tabIndex = 0; box.setAttribute('aria-label', T.label);
    const stage = document.createElement('div'); stage.className = 'pu-stage'; stage.setAttribute('aria-hidden', 'true');
    const bubble = document.createElement('span'); bubble.className = 'pu-bubble'; bubble.setAttribute('role', 'status'); bubble.setAttribute('aria-live', 'polite');
    const hint = document.createElement('span'); hint.className = 'pu-hint'; hint.textContent = T.hint;
    box.append(stage, bubble, hint);

    let svg, body, arms = [], busy = false;
    const SH = [[188, 388], [292, 388]], HAND = [[112, 70], [368, 70]], TOP = -285;
    const L0 = Math.hypot(SH[0][0] - HAND[0][0], SH[0][1] - HAND[0][1]);
    function pose(ty) {
        body.setAttribute('transform', `translate(0 ${ty.toFixed(1)})`);
        arms.forEach(p => {
            const i = p.classList.contains('pu-arm--l') ? 0 : 1, dir = i ? 1 : -1;
            const sx = SH[i][0], sy = SH[i][1] + ty, hx = HAND[i][0], hy = HAND[i][1];
            const d = Math.hypot(sx - hx, sy - hy), bend = Math.sqrt(Math.max(0, L0 * L0 - d * d)) * .55;
            const mx = (sx + hx) / 2 + dir * bend, my = (sy + hy) / 2;
            p.setAttribute('d', `M${sx} ${sy} Q${mx.toFixed(1)} ${my.toFixed(1)} ${hx} ${hy}`);
        });
    }
    async function load() {
        if (svg) return true;
        try {
            const r = await fetch('assets/img/chibi-pullup.svg?v=2'); if (!r.ok) return false;
            stage.innerHTML = await r.text(); svg = stage.querySelector('svg');
            body = svg.querySelector('.pu-body'); arms = [...svg.querySelectorAll('.pu-arm, .pu-arm-in')];
            pose(0); return true;
        } catch (e) { return false; }
    }
    const say = (t) => { bubble.textContent = t; bubble.classList.toggle('is-on', !!t); };
    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    function tween(from, to, ms) {
        return new Promise(res => {
            const t0 = performance.now();
            const step = (now) => {
                const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
                pose(from + (to - from) * e);
                k < 1 ? requestAnimationFrame(step) : res();
            };
            requestAnimationFrame(step);
        });
    }
    async function play() {
        if (busy) return; busy = true;
        if (!(await load())) { busy = false; return; }
        hint.classList.add('is-gone');
        box.classList.add('is-pulling');
        await wait(250);
        if (reduce) { pose(TOP); say(T.done); await wait(2200); }
        else {
            for (let n = 1; n <= 3; n++) { await tween(0, TOP, 520); say(String(n)); await wait(140); await tween(TOP, 0, 480); }
            say(T.done); await wait(1700);
        }
        say(''); box.classList.remove('is-pulling'); await wait(300); pose(0); busy = false;
    }
    box.addEventListener('click', play);
    box.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
})();
