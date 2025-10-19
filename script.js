// Менеджер аудио для управления воспроизведением
const audioManager = {
    currentPlaying: null,
    
    playAudio(audioElement) {
        // Если уже что-то играет, останавливаем
        if (this.currentPlaying && this.currentPlaying !== audioElement) {
            this.currentPlaying.pause();
            this.currentPlaying.currentTime = 0;
            
            // Сбрасываем кнопку предыдущего плеера
            const prevButton = this.currentPlaying.parentNode.querySelector('button');
            if (prevButton) {
                prevButton.innerHTML = '▶';
            }
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

// Инициализация кастомных аудио-контролов
function initCustomAudioControls() {
    const audioElements = document.querySelectorAll('audio');
    
    audioElements.forEach(audio => {
        // Скрываем стандартный аудио-элемент
        audio.style.display = 'none';
        
        // Создаем кастомную обертку
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-audio-player';
        
        // Создаем кнопку воспроизведения
        const playButton = document.createElement('button');
        playButton.innerHTML = '▶';
        
        // Создаем индикатор прогресса
        const progress = document.createElement('div');
        progress.className = 'progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        progress.appendChild(progressBar);
        
        // Обработчики событий
        playButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                audioManager.playAudio(audio);
            } else {
                audio.pause();
            }
        });
        
        audio.addEventListener('play', () => {
            playButton.innerHTML = '⏸';
        });
        
        audio.addEventListener('pause', () => {
            playButton.innerHTML = '▶';
        });
        
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = percent + '%';
            }
        });
        
        audio.addEventListener('ended', () => {
            playButton.innerHTML = '▶';
            progressBar.style.width = '0%';
            audioManager.currentPlaying = null;
        });
        
        // Вставляем элементы
        wrapper.appendChild(playButton);
        wrapper.appendChild(progress);
        
        // Вставляем кастомный плеер после аудио-элемента
        audio.parentNode.insertBefore(wrapper, audio.nextSibling);
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initCustomAudioControls();
    
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
