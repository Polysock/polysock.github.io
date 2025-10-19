// Аудио контекст для гитары
let audioContext;
let guitarSounds = {};

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
    },
    
    stopAll() {
        if (this.currentPlaying) {
            this.currentPlaying.pause();
            this.currentPlaying.currentTime = 0;
        }
        this.currentPlaying = null;
    }
};

// Инициализация звуков гитары
function initGuitarSounds() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Создаем звуки для каждой струны (синусоидальные волны)
        const frequencies = {
            'E2': 82.41,
            'A2': 110.00,
            'D3': 146.83,
            'G3': 196.00,
            'B3': 246.94,
            'E4': 329.63
        };

        Object.keys(frequencies).forEach(note => {
            guitarSounds[note] = frequencies[note];
        });
        
        console.log('Гитара настроена и готова к игре!');
    } catch (e) {
        console.log('Аудио не поддерживается в этом браузере');
    }
}

// Воспроизведение звука гитары
function playGuitarSound(frequency) {
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Ошибка воспроизведения звука:', e);
    }
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

// Функции для гитары (ИСПРАВЛЕННЫЕ С ЗВУКОМ)
function playNote(stringElement) {
    // Убираем активный класс у всех струн
    document.querySelectorAll('.string').forEach(str => {
        str.classList.remove('active');
    });
    
    // Добавляем активный класс к нажатой струне
    stringElement.classList.add('active');
    
    // Создаем звуковую волну (визуальный эффект)
    createSoundWave(stringElement);
    
    // Воспроизводим звук гитары
    const note = stringElement.dataset.note;
    if (audioContext && guitarSounds[note]) {
        // Активируем аудиоконтекст при первом взаимодействии
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        playGuitarSound(guitarSounds[note]);
    }
    
    // Убираем активный класс через время
    setTimeout(() => {
        stringElement.classList.remove('active');
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
    
    // Воспроизводим арпеджио аккорда
    if (audioContext) {
        const chordNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
        chordNotes.forEach((note, index) => {
            setTimeout(() => {
                if (guitarSounds[note]) {
                    playGuitarSound(guitarSounds[note]);
                }
            }, index * 100);
        });
    }
    
    setTimeout(() => {
        strings.forEach(string => {
            string.classList.remove('active');
        });
        button.style.transform = '';
    }, 600);
    
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
            // Активируем аудиоконтекст при первом взаимодействии
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
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

// Инициализация аудио плееров с менеджером
function initAudioPlayers() {
    const audioPlayers = document.querySelectorAll('audio');
    audioPlayers.forEach(audio => {
        audio.controls = true;
        audio.preload = 'metadata';
        
        // Добавляем обработчик для безопасного воспроизведения
        audio.addEventListener('play', function() {
            // Активируем аудиоконтекст при первом взаимодействии
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // Используем менеджер для управления воспроизведением
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
    initGuitarEffects();
    initGuitarSounds();
    initAudioPlayers();
    
    // Добавляем анимацию для карточек портфолио
    document.querySelectorAll('.work-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Добавляем обработчики для табов (на случай если JS не сработает через onclick)
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

// Обработчик для активации аудио контекста при любом клике (требование браузеров)
document.addEventListener('click', function() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });
