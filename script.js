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
    
    // Здесь можно добавить реальные звуки гитары
    // Пока просто вибрация
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
    });
    
    setTimeout(() => {
        strings.forEach(string => {
            string.classList.remove('active');
        });
        button.style.transform = '';
    }, 300);
    
    console.log(`Playing chord: ${chord}`);
}

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

// Обновляем функцию смены табов
function showTab(tabName) {
    // Скрываем все табы
    document.getElementById('code-tab').style.display = 'none';
    document.getElementById('music-tab').style.display = 'none';
    
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

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    
    // Добавляем анимацию для карточек портфолио
    document.querySelectorAll('.work-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Добавляем обработчики для социальных ссылок
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Здесь будет ссылка на твою социальную сеть!');
        });
    });
});

// Дополнительные эффекты при скролле
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.code-side, .music-side');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});
