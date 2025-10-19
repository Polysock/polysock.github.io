// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeToggle(savedTheme);
}

// Переключение темы
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
}

// Обновление иконки переключателя темы
function updateThemeToggle(theme) {
    const toggle = document.getElementById('themeToggle');
    toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// Анимация появления элементов при скролле
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease-out ${entry.target.dataset.delay || '0s'} both`;
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.work-card, .guitar-section, .chords, .footer-section').forEach((el, index) => {
        el.style.opacity = '0';
        el.dataset.delay = `${index * 0.2}s`;
        observer.observe(el);
    });
}

// Функции для гитары
function playNote(note) {
    const string = document.querySelector(`[data-note="${note}"]`);
    string.classList.add('active');
    
    // Создаем звуковую волну (визуальный эффект)
    createSoundWave(string);
    
    setTimeout(() => {
        string.classList.remove('active');
    }, 300);
    
    console.log(`Playing note: ${note}`);
}

function playChord(chord) {
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    
    // Анимация аккорда - вибрируем все струны
    const strings = document.querySelectorAll('.string');
    strings.forEach(string => {
        string.classList.add('active');
        createSoundWave(string);
    });
    
    setTimeout(() => {
        strings.forEach(string => {
            string.classList.remove('active');
        });
        button.style.transform = '';
    }, 500);
    
    console.log(`Playing chord: ${chord}`);
}

// Визуальный эффект звуковой волны
function createSoundWave(element) {
    const wave = document.createElement('div');
    wave.style.cssText = `
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--aquamarine), transparent);
        transform: scaleX(0);
        animation: soundWave 0.5s ease-out;
        border-radius: 50%;
    `;
    
    element.appendChild(wave);
    
    setTimeout(() => {
        wave.remove();
    }, 500);
}

// Добавляем CSS для звуковой волны
const waveStyle = document.createElement('style');
waveStyle.textContent = `
    @keyframes soundWave {
        0% { transform: scaleX(0); opacity: 1; }
        100% { transform: scaleX(1); opacity: 0; }
    }
`;
document.head.appendChild(waveStyle);

// Плавный скролл для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Функция смены вкладок
function showTab(tabName) {
    // Скрываем все табы
    document.getElementById('code-tab').style.display = 'none';
    document.getElementById('music-tab').style.display = 'none';
    document.getElementById('city-tab').style.display = 'none';
    
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показываем нужный таб и активируем кнопку
    document.getElementById(tabName + '-tab').style.display = 'grid';
    event.target.classList.add('active');
    
    // Запускаем анимации для новых элементов
    setTimeout(initScrollAnimations, 100);
}

// Параллакс эффект для герой-секции
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.code-side, .music-side');
        
        parallaxElements.forEach(element => {
            const speed = 0.3;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Случайные гитарные риффы при наведении
function initGuitarEffects() {
    const guitar = document.querySelector('.guitar');
    const notes = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];
    
    guitar.addEventListener('mouseenter', () => {
        // Случайно играем несколько нот при наведении на гитару
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const randomNote = notes[Math.floor(Math.random() * notes.length)];
                playNote(randomNote);
            }, i * 200);
        }
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initScrollAnimations();
    initParallax();
    initGuitarEffects();
    
    // Добавляем обработчик для переключателя темы
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Добавляем анимацию для карточек портфолио
    document.querySelectorAll('.work-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Добавляем реальные ссылки на социальные сети
    const socialLinks = {
        telegram: 'https://t.me/your_telegram',
        github: 'https://github.com/your_github',
        youtube: 'https://youtube.com/your_channel',
        soundcloud: 'https://soundcloud.com/your_profile'
    };
    
    // Можно раскомментировать и заполнить своими ссылками:
    /*
    document.querySelector('a[href*="telegram"]').href = socialLinks.telegram;
    document.querySelector('a[href*="github"]').href = socialLinks.github;
    document.querySelector('a[href*="youtube"]').href = socialLinks.youtube;
    document.querySelector('a[href*="soundcloud"]').href = socialLinks.soundcloud;
    */
});

// Дополнительные эффекты
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Можно добавить печатный эффект для заголовков
// Например, при загрузке страницы:
// typeWriter(document.querySelector('.code-side h1'), 'Polysok / Yuaself');
