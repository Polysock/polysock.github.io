// Менеджер аудио для управления воспроизведением
const audioManager = {
    currentPlaying: null,
    
    playAudio(audioElement) {
        // Если уже что-то играет, останавливаем
        if (this.currentPlaying && this.currentPlaying !== audioElement) {
            this.currentPlaying.pause();
            this.currentPlaying.currentTime = 0;
        }
        
        this.currentPlaying = audioElement;
    }
};

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

    document.querySelectorAll('.work-card, .footer-section').forEach((el, index) => {
        el.style.opacity = '0';
        el.dataset.delay = `${index * 0.2}s`;
        observer.observe(el);
    });
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

// Инициализация аудио плееров с менеджером
function initAudioPlayers() {
    const audioPlayers = document.querySelectorAll('audio');
    audioPlayers.forEach(audio => {
        audio.controls = true;
        audio.preload = 'metadata';
        
        // Добавляем обработчик для управления воспроизведением
        audio.addEventListener('play', function() {
            audioManager.playAudio(this);
        });
        
        // Добавляем обработчик окончания трека
        audio.addEventListener('ended', function() {
            audioManager.currentPlaying = null;
        });
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initAudioPlayers();
    
    // Добавляем анимацию для карточек портфолио
    document.querySelectorAll('.work-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Добавляем обработчики для табов
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                const tabName = onclickAttr.match(/showTab\('(\w+)'\)/)[1];
                showTab(tabName);
            }
        });
    });
    
    // Инициализируем первую вкладку
    showTab('code');
});

// Дополнительные эффекты для улучшения UX
function enhanceUserExperience() {
    const elementsToAnimate = document.querySelectorAll('.hero, .portfolio');
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

// Обработка кликов по кнопкам в герое-секции
function initHeroButtons() {
    const heroButtons = document.querySelectorAll('.hero .btn');
    
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#portfolio') {
                e.preventDefault();
                
                // Плавный скролл к портфолио
                const portfolioSection = document.getElementById('portfolio');
                if (portfolioSection) {
                    portfolioSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Если это кнопка "Мои записи", переключаем на музыку
                    if (this.textContent.includes('записи')) {
                        setTimeout(() => {
                            showTab('music');
                        }, 800);
                    } else if (this.textContent.includes('проекты')) {
                        setTimeout(() => {
                            showTab('code');
                        }, 800);
                    }
                }
            }
        });
    });
}
