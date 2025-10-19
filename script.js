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
}