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
document.querySelectorAll('.ib-video__frame[data-yt]').forEach(btn => {
    btn.addEventListener('click', () => {
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
});

/*===== Lab mascot: a parcel-bot that strolls along the Lab card =====*/
(() => {
    const host = document.querySelector('#laboratory .lab2');
    if (!host) return;
    const BOTS = [
        { name: 'Lister', zh: '上架', c: '#6c63ff', icon: c => `<path d="M141 141h15l14 14-12 12-14-14z" fill="${c}"/><circle cx="148" cy="148" r="3.2" fill="#fff"/>`, line: '我是上架 Agent，英日德三語商品頁一次寫好！' },
        { name: 'Scout', zh: '選品', c: '#38bdf8', icon: c => `<circle cx="153" cy="145" r="10" fill="none" stroke="${c}" stroke-width="5"/><line x1="160" y1="152" x2="169" y2="161" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`, line: '我是選品 Agent，專門從差評裡挖商機。' },
        { name: 'Buzz', zh: '行銷', c: '#ec4899', icon: c => `<path d="M140 145h13l17-10v30l-17-10h-13z" fill="${c}"/><rect x="144" y="155" width="7" height="11" rx="2" fill="${c}"/>`, line: '我是行銷 Agent，短影音、廣告投放交給我！' },
        { name: 'Chatty', zh: '客服', c: '#10b981', icon: c => `<rect x="139" y="135" width="38" height="25" rx="8" fill="${c}"/><path d="M147 159v9l9-9z" fill="${c}"/><circle cx="149" cy="147.5" r="2.6" fill="#fff"/><circle cx="158" cy="147.5" r="2.6" fill="#fff"/><circle cx="167" cy="147.5" r="2.6" fill="#fff"/>`, line: '我是客服 Agent，海外詢盤 24 小時回覆。' },
        { name: 'Quote', zh: '報價', c: '#f59e0b', icon: c => `<circle cx="158" cy="150" r="15" fill="${c}"/><text x="158" y="157.5" text-anchor="middle" font-size="21" font-weight="900" fill="#fff" font-family="Arial, sans-serif">€</text>`, line: '我是報價 Agent，匯率一變就幫你守住毛利。' },
        { name: 'Cargo', zh: '物流', c: '#f97316', icon: c => `<rect x="145" y="138" width="11" height="11" rx="1.5" fill="${c}"/><rect x="158" y="138" width="11" height="11" rx="1.5" fill="${c}"/><path d="M137 152h42l-7 13h-28z" fill="${c}"/>`, line: '我是物流關務 Agent，HS Code 和訂艙包在我身上。' },
    ];
    const EXTRA = ['你有點子，老師有 Token！', '歡迎加入 ICMA Lab 👋', '點我換下一位 Agent！'];
    const svg = b => `<svg viewBox="0 0 200 220" aria-hidden="true">
        <g class="lw-legs"><rect class="lw-leg lw-leg--l" x="66" y="176" width="18" height="30" rx="8" fill="#17133a"/><rect class="lw-leg lw-leg--r" x="116" y="176" width="18" height="30" rx="8" fill="#17133a"/></g>
        <g class="lw-body">
          <line x1="100" y1="42" x2="100" y2="20" stroke="#17133a" stroke-width="6" stroke-linecap="round"/>
          <circle cx="100" cy="15" r="10" fill="${b.c}" stroke="#17133a" stroke-width="5"/>
          <rect x="28" y="40" width="144" height="142" rx="36" fill="${b.c}"/>
          <rect x="89" y="40" width="22" height="142" fill="#fff" opacity=".22"/>
          <rect x="46" y="66" width="108" height="70" rx="22" fill="#17133a"/>
          <g class="lw-eyes"><ellipse cx="80" cy="96" rx="9" ry="12" fill="#fff"/><ellipse cx="120" cy="96" rx="9" ry="12" fill="#fff"/></g>
          <path d="M87 116q13 10 26 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
          <g class="lw-arm"><rect x="164" y="104" width="34" height="16" rx="8" fill="${b.c}" stroke="#17133a" stroke-width="4"/></g>
          <circle cx="158" cy="150" r="29" fill="#fff" stroke="${b.c}" stroke-width="5"/>${b.icon(b.c)}
        </g></svg>`;

    const lane = document.createElement('div');
    lane.className = 'lab-walker';
    lane.innerHTML = '<div class="lw-bubble" role="status" aria-live="polite"></div><button type="button" class="lw-bot" aria-label="和實驗室的 AI Agent 打招呼"></button>';
    host.appendChild(lane);
    const bot = lane.querySelector('.lw-bot'), bubble = lane.querySelector('.lw-bubble');
    let idx = 0;
    const paint = () => { bot.innerHTML = svg(BOTS[idx]); };
    paint();

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const W = 64;
    let x = 24, target = 24, dir = 1, state = 'idle', until = 0, last = 0, visible = false, bubbleUntil = 0, hopUntil = 0;
    const laneW = () => lane.clientWidth;
    const place = (t) => {
        const walking = state === 'walk';
        const bob = walking ? Math.abs(Math.sin(t / 110)) * 4 : 0;
        const hop = t < hopUntil ? Math.sin((1 - (hopUntil - t) / 420) * Math.PI) * 26 : 0;
        bot.style.transform = `translate(${x}px, ${-bob - hop}px)`;
        bot.querySelector('svg').style.transform = `scaleX(${dir})`;
        bot.classList.toggle('is-walking', walking);
        bot.classList.toggle('is-waving', state === 'wave' || t < bubbleUntil);
        const bw = bubble.offsetWidth || 200;
        bubble.style.transform = `translate(${Math.max(0, Math.min(laneW() - bw, x + W / 2 - bw / 2))}px, 0)`;
        bubble.classList.toggle('is-on', t < bubbleUntil);
    };
    const pick = (t) => {
        const r = Math.random();
        if (r < .62) { state = 'walk'; target = 8 + Math.random() * Math.max(10, laneW() - W - 16); dir = target > x ? 1 : -1; }
        else if (r < .82) { state = 'wave'; until = t + 1400; }
        else { state = 'idle'; until = t + 1200 + Math.random() * 1600; }
    };
    const say = (t, text) => { bubble.textContent = text; bubbleUntil = t + 3200; hopUntil = t + 420; };
    const loop = (t) => {
        const dt = Math.min(50, t - (last || t)); last = t;
        if (visible) {
            if (state === 'walk') {
                const step = .07 * dt;
                if (Math.abs(target - x) <= step) { x = target; state = 'idle'; until = t + 600 + Math.random() * 1400; }
                else x += Math.sign(target - x) * step;
            } else if (t > until && t > bubbleUntil) pick(t);
            x = Math.max(0, Math.min(laneW() - W, x));
            place(t);
        }
        requestAnimationFrame(loop);
    };
    const greet = () => {
        const t = performance.now();
        idx = (idx + 1) % BOTS.length; paint();
        const text = Math.random() < .25 ? EXTRA[Math.floor(Math.random() * EXTRA.length)] : BOTS[idx].line;
        state = 'idle'; until = t + 3200;
        say(t, text); if (reduce) place(t);
    };
    bot.addEventListener('click', greet);
    bot.addEventListener('mouseenter', () => { const t = performance.now(); if (t > bubbleUntil) { state = 'idle'; until = t + 2600; say(t, BOTS[idx].line); if (reduce) place(t); } });

    if (reduce) { x = 24; place(performance.now()); return; }
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; last = 0; }, { rootMargin: '100px' }).observe(lane);
    else visible = true;
    requestAnimationFrame(loop);
})();
