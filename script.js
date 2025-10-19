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

// Конфигурация для Калининграда
const KALININGRAD_CONFIG = {
    lat: 54.7104,
    lon: 20.4522,
    city: "Калининград",
    timezone: "Europe/Kaliningrad"
};

// Функции для времени и погоды Калининграда
function updateTime() {
    const now = new Date();
    
    // Устанавливаем временную зону Калининграда (GMT+2)
    const options = { 
        timeZone: 'Europe/Kaliningrad',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const timeString = now.toLocaleTimeString('ru-RU', options);
    const dateString = now.toLocaleDateString('ru-RU', {
        timeZone: 'Europe/Kaliningrad',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const dayOfWeek = days[now.getDay()];
    
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    const dayElement = document.getElementById('day-of-week');
    
    if (timeElement) timeElement.textContent = timeString;
    if (dateElement) dateElement.textContent = dateString;
    if (dayElement) dayElement.textContent = dayOfWeek;
}

// Функция для получения погоды с OpenWeatherMap API
async function updateWeather() {
    const btn = document.querySelector('.weather-btn');
    const apiKey = 'your_api_key_here'; // Замените на ваш API ключ
    
    // Для демо используем бесплатный API без ключа (ограничения)
    try {
        btn.classList.add('updating');
        btn.textContent = '🔄 Загрузка...';
        
        // Используем бесплатный API погоды (можно заменить на OpenWeatherMap с ключом)
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=54.71&longitude=20.51&current_weather=true&timezone=Europe%2FMoscow`);
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки погоды');
        }
        
        const data = await response.json();
        
        if (data.current_weather) {
            updateWeatherUI(data.current_weather);
            showNotification('Погода обновлена!');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        // Fallback - демо данные для Калининграда
        updateWeatherWithDemoData();
        showNotification('Используются демо-данные');
    } finally {
        btn.classList.remove('updating');
        btn.textContent = '🔄 Обновить погоду';
    }
}

// Функция для обновления интерфейса погоды
function updateWeatherUI(weatherData) {
    const temp = document.getElementById('temperature');
    const condition = document.getElementById('weather-condition');
    const feels = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind-speed');
    const icon = document.getElementById('weather-icon');
    
    const temperature = Math.round(weatherData.temperature);
    const windSpeed = Math.round(weatherData.windspeed);
    
    // Определяем описание погоды по коду (WMO codes)
    const weatherInfo = getWeatherDescription(weatherData.weathercode);
    
    if (temp) temp.textContent = `${temperature}°C`;
    if (condition) condition.textContent = weatherInfo.description;
    if (feels) feels.textContent = `Ощущается как ${temperature}°C`;
    if (wind) wind.textContent = `${windSpeed} м/с`;
    if (icon) icon.textContent = weatherInfo.icon;
    
    // Влажность не в этом API, используем примерное значение
    if (humidity) humidity.textContent = `${Math.floor(Math.random() * 30) + 60}%`;
}

// Функция для определения описания погоды по коду
function getWeatherDescription(weatherCode) {
    const codes = {
        0: { description: 'Ясно', icon: '☀️' },
        1: { description: 'Преимущественно ясно', icon: '🌤️' },
        2: { description: 'Переменная облачность', icon: '⛅' },
        3: { description: 'Пасмурно', icon: '☁️' },
        45: { description: 'Туман', icon: '🌫️' },
        48: { description: 'Изморозь', icon: '🌫️' },
        51: { description: 'Лекая морось', icon: '🌦️' },
        53: { description: 'Умеренная морось', icon: '🌦️' },
        55: { description: 'Сильная морось', icon: '🌧️' },
        61: { description: 'Небольшой дождь', icon: '🌦️' },
        63: { description: 'Умеренный дождь', icon: '🌧️' },
        65: { description: 'Сильный дождь', icon: '⛈️' },
        80: { description: 'Ливень', icon: '🌧️' },
        95: { description: 'Гроза', icon: '⛈️' }
    };
    
    return codes[weatherCode] || { description: 'Облачно', icon: '🌤️' };
}

// Функция для получения погоды по местоположению
function getLocationWeather() {
    if (!navigator.geolocation) {
        showNotification('Геолокация не поддерживается браузером');
        return;
    }
    
    showNotification('Определяем ваше местоположение...');
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            try {
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                const data = await response.json();
                
                if (data.current_weather) {
                    updateWeatherUI(data.current_weather);
                    showNotification('Погода для вашей локации загружена!');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                showNotification('Ошибка загрузки погоды для локации');
            }
        },
        (error) => {
            console.error('Ошибка геолокации:', error);
            showNotification('Не удалось определить местоположение');
        }
    );
}

// Демо-данные для Калининграда (на случай ошибки API)
function updateWeatherWithDemoData() {
    const temperatures = [12, 13, 14, 15, 16, 17, 18, 19];
    const conditions = [
        { text: 'Ясно', icon: '☀️' },
        { text: 'Облачно', icon: '🌤️' },
        { text: 'Пасмурно', icon: '☁️' },
        { text: 'Небольшой дождь', icon: '🌦️' }
    ];
    
    const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomWind = (Math.random() * 5 + 2).toFixed(1);
    const randomHumidity = Math.floor(Math.random() * 20) + 65;
    
    const temp = document.getElementById('temperature');
    const condition = document.getElementById('weather-condition');
    const feels = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind-speed');
    const icon = document.getElementById('weather-icon');
    
    if (temp) temp.textContent = `${randomTemp}°C`;
    if (condition) condition.textContent = randomCondition.text;
    if (feels) feels.textContent = `Ощущается как ${randomTemp}°C`;
    if (humidity) humidity.textContent = `${randomHumidity}%`;
    if (wind) wind.textContent = `${randomWind} м/с`;
    if (icon) icon.textContent = randomCondition.icon;
}

// Функция для уведомлений
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--aquamarine);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(42, 157, 143, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Инициализация времени и погоды для Калининграда
function initCityTab() {
    updateTime();
    setInterval(updateTime, 1000);
    
    // Загружаем погоду при открытии вкладки
    setTimeout(updateWeather, 500);
}

// Обновляем функцию showTab для инициализации вкладки города
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
        
        // Если это вкладка города, инициализируем её
        if (tabName === 'city') {
            setTimeout(initCityTab, 100);
        }
    }
    
    // Активируем кнопку
    if (event && event.target) {
        event.target.classList.add('active');
    }
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
