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

// Функции для гитары (ИСПРАВЛЕННЫЕ)
function playNote(stringElement) {
    // Убираем активный класс у всех струн
    document.querySelectorAll('.string').forEach(str => {
        str.classList.remove('active');
    });
    
    // Добавляем активный класс к нажатой струне
    stringElement.classList.add('active');
    
    // Создаем звуковую волну (визуальный эффект)
    createSoundWave(stringElement);
    
    // Убираем активный класс через время
    setTimeout(() => {
        stringElement.classList.remove('active');
    }, 300);
    
    console.log(`Playing note: ${stringElement.dataset.note}`);
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
        pointer-events: none;
    `;
    
    element.appendChild(wave);
    
    setTimeout(() => {
        if (wave.parentNode === element) {
            wave.remove();
        }
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
    const targetTab = document.getElementById(tabName + '-tab');
    if (targetTab) {
        targetTab.style.display = 'grid';
    }
    
    // Активируем кнопку
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Запускаем анимации для новых элементов
    setTimeout(initScrollAnimations, 100);
}

// Случайные гитарные риффы при наведении
function initGuitarEffects() {
    const guitar = document.querySelector('.guitar');
    const strings = document.querySelectorAll('.string');
    
    if (guitar && strings.length > 0) {
        guitar.addEventListener('mouseenter', () => {
            // Случайно играем несколько нот при наведении на гитару
            for (let i = 0; i < 2; i++) {
                setTimeout(() => {
                    const randomString = strings[Math.floor(Math.random() * strings.length)];
                    playNote(randomString);
                }, i * 300);
            }
        });
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initGuitarEffects();
    
    // Добавляем анимацию для карточек портфолио
    document.querySelectorAll('.work-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Добавляем обработчики для табов (на случай если JS не сработает через onclick)
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('onclick').match(/showTab\('(\w+)'\)/)[1];
            showTab(tabName);
        });
    });
    
    // Инициализируем первую вкладку
    showTab('code');
});

// Дополнительные эффекты для улучшения UX
function enhanceUserExperience() {
    // Добавляем плавное появление элементов при загрузке
    const elementsToAnimate = document.querySelectorAll('.hero, .portfolio, .guitar-section');
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + index * 200);
    });
}

// Запускаем улучшения после полной загрузки страницы
window.addEventListener('load', enhanceUserExperience);
