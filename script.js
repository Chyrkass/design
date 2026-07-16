
(function() {
    // ===== THEME TOGGLE =====
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = body.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateParticleColors();
    });

    // ===== PARTICLES =====
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleColor = savedTheme === 'dark' ?
        'rgba(167, 139, 250, 0.3)' :
        'rgba(108, 60, 240, 0.25)';
    let particleColor2 = savedTheme === 'dark' ?
        'rgba(255, 107, 157, 0.25)' :
        'rgba(255, 60, 120, 0.18)';

    function updateParticleColors() {
        const theme = body.getAttribute('data-theme');
        particleColor = theme === 'dark' ?
            'rgba(167, 139, 250, 0.3)' :
            'rgba(108, 60, 240, 0.25)';
        particleColor2 = theme === 'dark' ?
            'rgba(255, 107, 157, 0.25)' :
            'rgba(255, 60, 120, 0.18)';
        // Update existing particles
        particles.forEach(p => {
            p.color = Math.random() < 0.5 ? particleColor : particleColor2;
        });
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    function initParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2.5 + 1,
                color: Math.random() < 0.5 ? particleColor : particleColor2,
            });
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -20) p.x = canvas.width + 20;
            if (p.x > canvas.width + 20) p.x = -20;
            if (p.y < -20) p.y = canvas.height + 20;
            if (p.y > canvas.height + 20) p.y = -20;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = particles[i].color.replace('0.3', '0.08')
                        .replace('0.25', '0.06').replace('0.18', '0.05');
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===== TYPING EFFECT =====
    const typingText = document.getElementById('typingText');
    const phrases = [
        'веб-дизайнер',
        'UI/UX проектировщик',
        'создаю красивые сайты',
        'фронтенд-разработчик',
        'дизайнер интерфейсов',
        'ваш будущий партнёр',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeLoop() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typingText.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 35;
        } else {
            typingText.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80 + Math.random() * 60;
        }
        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400;
        }
        setTimeout(typeLoop, typeSpeed);
    }
    typeLoop();

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate skill bars
                const skillFill = entry.target.querySelector('.skill-fill');
                if (skillFill) {
                    const width = skillFill.getAttribute('data-width');
                    setTimeout(() => { skillFill.style.width = width + '%'; }, 200);
                }
                // Animate stat counters
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.dataset.animated) {
                    statNumber.dataset.animated = 'true';
                    const target = parseInt(statNumber.getAttribute('data-count'));
                    animateCounter(statNumber, target);
                }
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));

    // Also observe skill bars separately
    document.querySelectorAll('.skill-fill').forEach(sf => {
        observer.observe(sf.closest('.reveal') || sf);
    });

    function animateCounter(el, target) {
        const duration = 1800;
        const start = 0;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(start + (target - start) * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + (target === 5 ? '+' : '+');
            }
        }
        requestAnimationFrame(update);
    }

    // ===== NAVIGATION =====
    const navbar = document.getElementById('navbar');
    const navLinks = navbar.querySelectorAll('a');
    const backToTop = document.getElementById('backToTop');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id], .hero[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Nav shadow
        if (scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        // Back to top
        if (scrollY > 600) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
        // Active link
        let current = '';
        sections.forEach(s => {
            const top = s.offsetTop - 200;
            if (scrollY >= top) current = s.getAttribute('id');
        });
        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) a.classList.add('active');
        });
    });

    // Back to top
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navbar.classList.toggle('mobile-open');
        mobileMenuBtn.textContent = navbar.classList.contains('mobile-open') ? '✕' : '☰';
    });
    navLinks.forEach(a => {
        a.addEventListener('click', () => {
            navbar.classList.remove('mobile-open');
            mobileMenuBtn.textContent = '☰';
        });
    });

    // ===== CONTACT FORM (REAL SUBMIT via FormSubmit) =====
window.handleSubmit = async function(e) {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    const successMsg = document.getElementById('formSuccess');

    // Блокируем кнопку и показываем индикатор
    btn.textContent = '⏳ Отправка...';
    btn.disabled = true;
    successMsg.style.display = 'none';

    // Собираем данные
    const formData = new FormData(form);

    try {
        const response = await fetch('https://formsubmit.co/angara.ilim.1947@mail.ru', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Успех
            form.reset();
            successMsg.style.display = 'block';
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 6000);
        } else {
            // Ошибка сервера
            alert('⚠️ Произошла ошибка при отправке. Попробуйте позже или напишите на почту напрямую.');
        }
    } catch (error) {
        // Ошибка сети
        alert('⚠️ Нет соединения с интернетом. Проверьте связь и попробуйте снова.');
        console.error('Ошибка отправки:', error);
    } finally {
        // Возвращаем кнопку в исходное состояние
        btn.textContent = originalText;
        btn.disabled = false;
    }
};

    // ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== INITIAL TRIGGER FOR VISIBLE ELEMENTS =====
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
                const skillFill = el.querySelector('.skill-fill');
                if (skillFill) {
                    skillFill.style.width = skillFill.getAttribute('data-width') + '%';
                }
                const statNumber = el.querySelector('.stat-number');
                if (statNumber && !statNumber.dataset.animated) {
                    statNumber.dataset.animated = 'true';
                    animateCounter(statNumber, parseInt(statNumber.getAttribute('data-count')));
                }
            }
        });
    }, 300);

    console.log('%c🦄 Сайт-визитка готов! %cЗамените фото в .photo-frame img на своё.',
        'font-size:1.2em;color:#a78bfa;', 'color:var(--text-secondary);');
    console.log('%c💡 Подсказка: %cтема сохраняется в localStorage, попробуйте переключить!',
        'color:#ff6b9d;', 'color:inherit;');
})();
const dot = document.getElementById('cursorDot');
const outline = document.getElementById('cursorOutline');
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', (e) => {
mouseX = e.clientX;
mouseY = e.clientY;
dot.style.left = mouseX + 'px';
dot.style.top = mouseY + 'px';
});

function animate() {
outlineX += (mouseX - outlineX) * 0.2;
outlineY += (mouseY - outlineY) * 0.2;
outline.style.left = outlineX + 'px';
outline.style.top = outlineY + 'px';
requestAnimationFrame(animate);
}
animate();

// Магнитный эффект на кнопках и ссылках
const magnets = document.querySelectorAll('a, button, .parallax-card-inner');
magnets.forEach(el => {
el.addEventListener('mouseenter', () => outline.classList.add('magnet'));
el.addEventListener('mouseleave', () => outline.classList.remove('magnet'));
});

// ===== PRICING CALCULATOR =====
const servicePrices = {
    landing: { 
        basic: 10000, 
        pro: 30000, 
        premium: 50000,
        description: 'Одностраничный сайт для презентации товара или услуги. Идеально для старта.',
        details: ['✔ Уникальный дизайн', '✔ Адаптивная вёрстка', '✔ Базовая SEO-оптимизация']
    },
    corporate: { 
        basic: 40000, 
        pro: 60000, 
        premium: 90000,
        description: 'Многостраничный сайт для компании. Включает разделы "О нас", "Услуги", "Контакты" и блог.',
        details: ['✔ Уникальный дизайн', '✔ Адаптивная вёрстка', '✔ Расширенное SEO', '✔ 3 месяца поддержки']
    },
    ecommerce: { 
        basic: 75000, 
        pro: 110000, 
        premium: 200000,
        description: 'Полноценный интернет-магазин с корзиной, личным кабинетом и интеграцией с CRM.',
        details: ['✔ Уникальный дизайн', '✔ Адаптивная вёрстка', '✔ Полное SEO', '✔ 6 месяцев поддержки', '✔ Интеграция с CRM']
    },
    updates: { 
        basic: 0, 
        pro: 0, 
        premium: 0,
        description: 'Единоразовая доработка сайта. Выберите необходимые элементы для изменения.',
        details: ['✔ Индивидуальный расчет', '✔ Гибкие условия', '✔ Быстрая реализация']
    },
    seo: { 
        basic: 10000, 
        pro: 20000, 
        premium: 35000,
        description: 'Комплексная SEO-оптимизация и продвижение сайта в поисковых системах.',
        details: ['✔ SEO-оптимизация', '✔ Анализ конкурентов', '✔ Отчетность']
    },
    support: { 
        basic: 5000, 
        pro: 15000, 
        premium: 25000,
        description: 'Техническая поддержка и обслуживание сайта: обновления, бэкапы, мониторинг, консультации.',
        details: ['✔ Ежемесячные обновления', '✔ Регулярные бэкапы', '✔ Мониторинг 24/7', '✔ Консультации', '✔ Приоритетная поддержка']
    }
};

const tariffDescriptions = {
    basic: 'Минимальная цена. Базовая SEO-оптимизация и 1 месяц поддержки.',
    pro: 'Расширенное SEO, 3 месяца поддержки, улучшенный дизайн и производительность.',
    premium: 'Максимальный пакет: полное SEO, длительная поддержка, приоритетная работа и лучшие технологии.'
};

const tariffDetails = {
    basic: ['✔ Базовая SEO-оптимизация', '✔ 1 месяц поддержки', '✔ Стандартный дизайн'],
    pro: ['✔ Расширенное SEO', '✔ 3 месяца поддержки', '✔ Улучшенный дизайн', '✔ Оптимизация скорости'],
    premium: ['✔ Полное SEO', '✔ 12 месяцев поддержки', '✔ Премиум дизайн', '✔ Максимальная производительность', '✔ Приоритетная разработка']
};

// Услуги, для которых показывается выбор тарифа
const servicesWithTariff = ['landing', 'corporate', 'ecommerce', 'support'];

// Базовое количество страниц и цена за доп. страницу для corporate и ecommerce
const basePages = { corporate: 5, ecommerce: 10 };
const extraPagePrice = { corporate: 5000, ecommerce: 8000 };
const pageCounts = { '1-5': 3, '6-10': 8, '11-20': 15, '21+': 25 };

// Множители
const urgencyMultiplier = { normal: 1, fast: 1.3, 'very-fast': 1.6 };
const languageMultiplier = { ru: 1, en: 1.2, multi: 1.5 };

// DOM Elements
const serviceType = document.getElementById('serviceType');
const tariffType = document.getElementById('tariffType');
const totalPrice = document.getElementById('totalPrice');
const serviceDescription = document.getElementById('serviceDescription');
const tariffDescription = document.getElementById('tariffDescription');
const priceDetails = document.getElementById('priceDetails');
const updatesOptions = document.getElementById('updatesOptions');
const seoOptions = document.getElementById('seoOptions');
const tariffGroup = document.getElementById('tariffGroup');
const updatesCount = document.getElementById('updatesCount');
const updateChecks = document.querySelectorAll('.update-check');
const seoPageBtns = document.querySelectorAll('.seo-page-btn');
const urgencyBtns = document.querySelectorAll('.urgency-btn');
const languageBtns = document.querySelectorAll('.language-btn');
const pagesBtns = document.querySelectorAll('.pages-btn');
const pagesOptions = document.getElementById('pagesOptions');

let selectedPages = 20;
let selectedUrgency = 'normal';
let selectedLanguage = 'ru';
let selectedPagesOption = '1-5';

// Функция для показа/скрытия выбора тарифа
function toggleTariffVisibility(service) {
    if (servicesWithTariff.includes(service)) {
        tariffGroup.style.display = 'block';
    } else {
        tariffGroup.style.display = 'none';
    }
}

// Функция для показа/скрытия количества страниц
function togglePagesVisibility(service) {
    if (service === 'corporate' || service === 'ecommerce') {
        pagesOptions.style.display = 'block';
        // Обновить описание
        const base = basePages[service] || 5;
        document.getElementById('pagesDescription').textContent = `Базовая цена включает до ${base} страниц. Дополнительная страница — ${extraPagePrice[service]} ₽`;
    } else {
        pagesOptions.style.display = 'none';
    }
}

// Update calculator
function updateCalculator() {
    const service = serviceType.value;
    const tariff = tariffType.value;

    // Показать/скрыть выбор тарифа
    toggleTariffVisibility(service);
    // Показать/скрыть количество страниц
    togglePagesVisibility(service);

    // Show/hide additional options
    updatesOptions.style.display = service === 'updates' ? 'block' : 'none';
    seoOptions.style.display = service === 'seo' ? 'block' : 'none';

    // Calculate base price
    let basePrice = servicePrices[service][tariff];

    // Calculate extra for pages (only for corporate and ecommerce)
    let extraPagesCost = 0;
    if (service === 'corporate' || service === 'ecommerce') {
        const base = basePages[service];
        const pageCount = pageCounts[selectedPagesOption] || 3;
        const extra = Math.max(0, pageCount - base);
        extraPagesCost = extra * extraPagePrice[service];
    }

    // Calculate updates price
    let updatesPrice = 0;
    if (service === 'updates') {
        updateChecks.forEach(checkbox => {
            if (checkbox.checked) {
                updatesPrice += parseInt(checkbox.value);
            }
        });
        updatesPrice += 3000; // Minimum fee for work
    }

    // Calculate SEO price
    let seoPrice = 0;
    if (service === 'seo') {
        const pricePerPage = 500;
        seoPrice = selectedPages * pricePerPage;
        
        if (document.getElementById('seoContent')?.checked) {
            seoPrice += 5000;
        }
        if (document.getElementById('seoAudit')?.checked) {
            seoPrice += 8000;
        }
        if (document.getElementById('seoLinks')?.checked) {
            seoPrice += 10000;
        }
    }

    // Apply urgency and language multipliers only for services with tariffs (except updates and seo)
    let multiplier = 1;
    if (service !== 'updates' && service !== 'seo') {
        multiplier = urgencyMultiplier[selectedUrgency] * languageMultiplier[selectedLanguage];
    }

    // Final price: (basePrice + extraPagesCost + updatesPrice + seoPrice) * multiplier
    let finalPrice = (basePrice + extraPagesCost + updatesPrice + seoPrice) * multiplier;

    // Display price
    if (service === 'updates') {
        // Для обновлений показываем без множителей (уже посчитано)
        finalPrice = updatesPrice; // updatesPrice уже включает базовую 3000
        totalPrice.textContent = finalPrice > 0 ? finalPrice.toLocaleString('ru-RU') + ' ₽' : 'от 3 000 ₽';
    } else if (service === 'seo') {
        // Для SEO показываем без множителей
        totalPrice.textContent = finalPrice > 0 ? finalPrice.toLocaleString('ru-RU') + ' ₽' : '15 000 ₽';
    } else {
        totalPrice.textContent = finalPrice.toLocaleString('ru-RU') + ' ₽';
    }

    // Update service description
    serviceDescription.textContent = servicePrices[service].description;

    // Update tariff description (только если тариф виден)
    if (servicesWithTariff.includes(service)) {
        tariffDescription.textContent = tariffDescriptions[tariff];
    }

    // Обновить описания для новых опций
    const urgencyText = { normal: 'Стандартные сроки разработки', fast: 'Ускоренная разработка (сроки сокращены на 30%)', 'very-fast': 'Максимально быстрая разработка (сроки сокращены на 60%)' };
    document.getElementById('urgencyDescription').textContent = urgencyText[selectedUrgency] || '';

    const langText = { ru: 'Сайт на русском языке', en: 'Сайт на английском языке', multi: 'Многоязычный сайт (русский + английский)' };
    document.getElementById('languageDescription').textContent = langText[selectedLanguage] || '';

    // Update price details
    const serviceDetails = servicePrices[service].details || [];
    const tariffDetailItems = servicesWithTariff.includes(service) ? (tariffDetails[tariff] || []) : [];

    let allDetails = [...serviceDetails];

    // Добавить информацию о количестве страниц, если применимо
    if (service === 'corporate' || service === 'ecommerce') {
        const pageCount = pageCounts[selectedPagesOption] || 3;
        allDetails.push(`✔ ${pageCount} страниц`);
    }

    // Add selected updates to details
    if (service === 'updates') {
        const selectedItems = [];
        updateChecks.forEach(checkbox => {
            if (checkbox.checked) {
                selectedItems.push('✔ ' + checkbox.dataset.name);
            }
        });
        if (selectedItems.length > 0) {
            allDetails = ['✔ Индивидуальный расчет', ...selectedItems];
        } else {
            allDetails = ['✔ Индивидуальный расчет', '✔ Выберите элементы для доработки'];
        }
    }

    // Add SEO details
    if (service === 'seo') {
        allDetails = [
            `✔ ${selectedPages} страниц оптимизации`,
            '✔ Технический аудит',
            '✔ Сбор семантического ядра'
        ];
        if (document.getElementById('seoContent')?.checked) allDetails.push('✔ Написание SEO-текстов');
        if (document.getElementById('seoAudit')?.checked) allDetails.push('✔ Анализ конкурентов');
        if (document.getElementById('seoLinks')?.checked) allDetails.push('✔ Ссылочное продвижение');
    }

    // Add tariff details (только если тариф виден)
    if (servicesWithTariff.includes(service)) {
        tariffDetailItems.forEach(item => {
            const itemText = item.replace('✔ ', '');
            const exists = allDetails.some(d => d.includes(itemText));
            if (!exists) {
                allDetails.push(item);
            }
        });
    }

    // Добавить информацию о срочности и языке (если не updates и seo)
    if (service !== 'updates' && service !== 'seo') {
        const urgencyLabel = { normal: 'Обычная срочность', fast: 'Срочная разработка', 'very-fast': 'Очень срочная' };
        const langLabel = { ru: 'Русский язык', en: 'Английский язык', multi: 'Многоязычный' };
        allDetails.push(`✔ Срочность: ${urgencyLabel[selectedUrgency]}`);
        allDetails.push(`✔ Язык: ${langLabel[selectedLanguage]}`);
    }

    // Update details display
    priceDetails.innerHTML = allDetails
        .slice(0, 8)
        .map(d => `<span class="detail-item">${d}</span>`)
        .join('');
}

// Event listeners for services
serviceType.addEventListener('change', updateCalculator);
tariffType.addEventListener('change', updateCalculator);

// Event listeners for updates
updateChecks.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const checked = document.querySelectorAll('.update-check:checked').length;
        updatesCount.textContent = checked;
        updateCalculator();
    });
});

// Event listeners for SEO pages
seoPageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        seoPageBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPages = parseInt(btn.dataset.pages);
        updateCalculator();
    });
});

// Event listeners for SEO additional
document.querySelectorAll('#seoContent, #seoAudit, #seoLinks').forEach(el => {
    el.addEventListener('change', updateCalculator);
});

// Event listeners for urgency
urgencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        urgencyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedUrgency = btn.dataset.urgency;
        updateCalculator();
    });
});

// Event listeners for language
languageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        languageBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedLanguage = btn.dataset.lang;
        updateCalculator();
    });
});

// Event listeners for pages
pagesBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        pagesBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPagesOption = btn.dataset.pages;
        updateCalculator();
    });
});

// Initial update
updateCalculator();

// ===== МОДАЛЬНОЕ ОКНО — ФИНАЛЬНАЯ ВЕРСИЯ =====
(function() {
    console.log('Инициализация модалки');

    const modal = document.getElementById('portfolioModal');
    if (!modal) {
        console.error('Модалка не найдена!');
        return;
    }

    const grid = document.getElementById('portfolioGrid');
    if (!grid) {
        console.error('Контейнер портфолио не найден!');
        return;
    }

    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalLink = document.getElementById('modalLink');
    const closeBtn = document.getElementById('modalClose');
    const overlay = document.querySelector('.modal-overlay');

    grid.addEventListener('click', function(e) {
        const card = e.target.closest('.portfolio-item');
        if (!card) return;
        // Игнорируем клик по оверлею и ссылкам внутри карточки
        if (e.target.closest('.portfolio-overlay') || e.target.closest('a')) return;

        console.log('Открываем модалку для карточки:', card);

        const img = card.querySelector('.port-img');
        const title = card.dataset.title || 'Проект';
        const description = card.dataset.description || 'Описание отсутствует';
        const link = card.dataset.link || '#';

        modalImg.src = img ? img.src : 'https://via.placeholder.com/600x400?text=Изображение';
        modalImg.alt = title;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalLink.href = link;

        if (link === '#') {
            modalLink.style.display = 'none';
        } else {
            modalLink.style.display = 'inline-flex';
        }

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        console.log('Модалка закрыта');
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    console.log('Модалка успешно инициализирована');
})();
