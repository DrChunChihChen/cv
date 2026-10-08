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
const sr = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 2000,
    reset: true
})

/*SCROLL HOME*/
sr.reveal('.home__title', {});
sr.reveal('.home__scroll', { delay: 200 });
sr.reveal('.home__img', { origin: '100px', delay: 400 });


/*SCROLL ABOUT*/
sr.reveal('.about__img', {delay: 500})
sr.reveal('.about__subtitle', {delay: 300})
sr.reveal('.about__profession', {delay: 400})
sr.reveal('.about__text', {delay: 500})
sr.reveal('.about__social-icon', {delay: 600, interval: 200})

/*SCROLL SKILLS*/
sr.reveal('.skills__subtitle', {})
sr.reveal('.skills__name', {distance: '20px', delay: 50, interval: 100})
sr.reveal('.skills__img', {delay: 400})

/*SCROLL PORTFOLIO*/
sr.reveal('.portfolio__img', {interval: 200})

/*SCROLL CONTACT*/
sr.reveal('.contact__subtitle', {})
sr.reveal('.contact__text', {interval: 200})
sr.reveal('.contact__input', {delay: 400})
sr.reveal('.contact__button', {delay: 600})
