document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initMobileNav();
    initBookingForm();
    initSmoothScroll();
    initParallax();
    initLightbox();
});

function initNavigation() {
    var nav = document.getElementById('nav');
    var floating = document.getElementById('floatingBook');
    window.addEventListener('scroll', function() {
        var s = window.pageYOffset;
        nav.classList.toggle('scrolled', s > 60);
        if (floating) floating.classList.toggle('visible', s > 400);
    }, { passive: true });
}

function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function() {
        toggle.classList.toggle('open');
        links.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    links.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
            toggle.classList.remove('open');
            links.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

function initScrollAnimations() {
    var selectors = ['.about-text', '.about-image', '.suite-card', '.card', '.amenity-card', '.testimonial-card', '.contact-info', '.contact-form-wrapper', '.section-header', '.gallery-item', '.hero-scroll', '.hero-stats'];
    for (var s = 0; s < selectors.length; s++) {
        var elements = document.querySelectorAll(selectors[s]);
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.add('reveal');
            if (i > 0) elements[i].classList.add('reveal-delay-' + Math.min(i, 3));
        }
    }
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var navHeight = document.getElementById('nav').offsetHeight;
                window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navHeight, behavior: 'smooth' });
            }
        });
    });
}

function initBookingForm() {
    var form = document.getElementById('bookingForm');
    if (!form) return;
    var today = new Date().toISOString().split('T')[0];
    var checkinInput = document.getElementById('checkin');
    var checkoutInput = document.getElementById('checkout');
    if (checkinInput) {
        checkinInput.setAttribute('min', today);
        checkinInput.addEventListener('change', function() {
            if (checkoutInput && checkinInput.value) checkoutInput.setAttribute('min', checkinInput.value);
        });
    }
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var submitBtn = form.querySelector('button[type="submit"]');
        var captcha = form.querySelector('#captcha');
        if (captcha && captcha.value.trim() !== '7') {
            captcha.style.borderColor = '#e74c3c';
            captcha.focus();
            return;
        }
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        fetch('https://formsubmit.co/ajax/isakzv@gmail.com', { method: 'POST', body: new FormData(form) })
        .then(function(response) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Reservation Request';
            if (response.ok) showFormConfirmation(form);
            else showToast('Error sending. Please email us at isakzv@gmail.com');
        })
        .catch(function() {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Reservation Request';
            showToast('Error sending. Please email us at isakzv@gmail.com');
        });
    });
}

function showFormConfirmation(form) {
    var html = form.innerHTML;
    form.innerHTML = '<div style="text-align:center;padding:40px 20px;"><div style="font-size:3rem;margin-bottom:16px;">&#10003;</div><h3 style="font-family:var(--font-serif);font-size:1.5rem;color:var(--green-900);margin-bottom:12px;">Thank You!</h3><p style="color:var(--neutral-600);line-height:1.6;">Your request has been sent. We\'ll respond within 24 hours.</p></div>';
    form.setAttribute('data-original-html', html);
}

function initParallax() {
    var hero = document.querySelector('.hero-content');
    if (!hero) return;
    window.addEventListener('scroll', function() {
        var s = window.pageYOffset;
        if (s < window.innerHeight) {
            hero.style.transform = 'translateY(' + (s * 0.25) + 'px)';
            hero.style.opacity = 1 - (s / window.innerHeight) * 0.4;
        }
    }, { passive: true });
}

function initLightbox() {
    var items = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    if (!lightbox || !items.length) return;
    var lightboxImg = document.getElementById('lightboxImage');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxCounter = document.getElementById('lightboxCounter');
    var currentIndex = 0;
    var images = [];
    items.forEach(function(item, i) {
        var img = item.querySelector('img');
        var label = item.querySelector('.gallery-label');
        images.push({ src: img.src, alt: img.alt, label: label ? label.textContent : '' });
        item.addEventListener('click', function() { openLightbox(i); });
    });
    function openLightbox(index) { currentIndex = index; updateLightbox(); lightbox.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function closeLightbox() { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
    function updateLightbox() { lightboxImg.src = images[currentIndex].src; lightboxImg.alt = images[currentIndex].alt; lightboxCaption.textContent = images[currentIndex].label; lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length; }
    function nextImage() { currentIndex = (currentIndex + 1) % images.length; updateLightbox(); }
    function prevImage() { currentIndex = (currentIndex - 1 + images.length) % images.length; updateLightbox(); }
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxNext').addEventListener('click', function(e) { e.stopPropagation(); nextImage(); });
    document.getElementById('lightboxPrev').addEventListener('click', function(e) { e.stopPropagation(); prevImage(); });
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    lightbox.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) { if (diff > 0) nextImage(); else prevImage(); }
    }, { passive: true });
}

function revealContact(el) {
    var val = el.getAttribute('data-value');
    var type = el.getAttribute('data-type');
    el.innerHTML = type === 'email' ? '<a href="mailto:' + val + '" style="color:inherit">' + val + '</a>' : '<a href="tel:' + val.replace(/\s/g, '') + '" style="color:inherit">' + val + '</a>';
    el.style.cursor = 'default';
    el.onclick = null;
}

var toastTimer;
function showToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

function handleGuideForm(f) {
    f.querySelector('[type=submit]').disabled = true;
    f.querySelector('[type=submit]').textContent = 'Sending...';
    var i = f.querySelector('#interestsInput');
    if (i) {
        var s = [];
        f.querySelectorAll('.guide-tag.selected').forEach(function(t) { s.push(t.textContent.trim()); });
        i.value = s.join(', ');
    }
}

function updateInterests(el) {
    var input = document.getElementById('interestsInput');
    if (!input) return;
    var tags = document.querySelectorAll('.guide-tag.selected');
    var interests = [];
    tags.forEach(function(t) { interests.push(t.textContent.trim()); });
    input.value = interests.join(', ');
}