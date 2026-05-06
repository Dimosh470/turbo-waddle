// booking.js - Универсальный файл бронирования для всех услуг

// Данные бронирования
let bookingData = {
    roomType: 'standard',
    roomPrice: 2500,
    adults: 2,
    children: 0,
    nights: 3,
    beds: 1,
    totalPrice: 0
};

// Цены номеров
const roomPrices = {
    studio: 2000,
    standard: 2500,
    superior: 3500,
    luxury: 4500,
    family: 6000,
    presidential: 8500
};

// Названия номеров
const roomNames = {
    studio: 'Студия',
    standard: 'Стандартный номер',
    superior: 'Номер Superior',
    luxury: 'Люкс с видом на море',
    family: 'Семейный номер',
    presidential: 'Президентский люкс'
};

// Стоимость дополнительных опций
const extraPrices = {
    'offer-family': { price: 0.85, type: 'discount', name: 'Семейный пакет', discount: 0.85 },
    'offer-early': { price: 0.8, type: 'discount', name: 'Раннее бронирование', discount: 0.8 },
    'exp-beach': { price: 1500, type: 'once', name: 'Частный пляж' },
    'exp-aqua': { price: 2000, type: 'once', name: 'Аквапарк' },
    'exp-kids': { price: 1000, type: 'perNight', name: 'KiDS Club' },
    'exp-spa': { price: 3000, type: 'once', name: 'Talise Spa' },
    'tour-city': { price: 2500, type: 'once', name: 'Обзорная экскурсия по Сочи' },
    'tour-mountain': { price: 3500, type: 'once', name: 'Горная экскурсия' }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Находим все необходимые элементы
    if (document.getElementById('adults-count')) {
        document.getElementById('adults-count').textContent = bookingData.adults;
        document.getElementById('children-count').textContent = bookingData.children;
        document.getElementById('nights-count').textContent = bookingData.nights;
        document.getElementById('beds-count').textContent = bookingData.beds;
    }
    
    // Выбираем стандартный номер по умолчанию
    selectRoomType('standard');
    
    // Обновляем итоговую цену
    updateTotalPrice();
});

// Выбор типа номера
function selectRoomType(type) {
    bookingData.roomType = type;
    bookingData.roomPrice = roomPrices[type];
    
    // Визуальное обновление карточек номеров
    document.querySelectorAll('.room-selection-card').forEach(card => {
        card.style.borderColor = '#ddd';
        card.style.backgroundColor = 'transparent';
    });
    
    const selectedCard = document.getElementById('room-' + type);
    if (selectedCard) {
        selectedCard.style.borderColor = '#000';
        selectedCard.style.backgroundColor = '#f5f5f5';
    }
    
    // Обновляем сводку
    if (document.getElementById('summary-room')) {
        document.getElementById('summary-room').textContent = roomNames[type];
    }
    
    updateTotalPrice();
}

// Обновление количества (взрослые, дети, ночи, кровати)
function updateBooking(type, delta) {
    switch(type) {
        case 'adults':
            if (bookingData.adults + delta >= 1 && bookingData.adults + delta <= 10) {
                bookingData.adults += delta;
                if (document.getElementById('adults-count')) 
                    document.getElementById('adults-count').textContent = bookingData.adults;
            }
            break;
        case 'children':
            if (bookingData.children + delta >= 0 && bookingData.children + delta <= 10) {
                bookingData.children += delta;
                if (document.getElementById('children-count')) 
                    document.getElementById('children-count').textContent = bookingData.children;
            }
            break;
        case 'nights':
            if (bookingData.nights + delta >= 1 && bookingData.nights + delta <= 30) {
                bookingData.nights += delta;
                if (document.getElementById('nights-count')) 
                    document.getElementById('nights-count').textContent = bookingData.nights;
            }
            break;
        case 'beds':
            if (bookingData.beds + delta >= 1 && bookingData.beds + delta <= 10) {
                bookingData.beds += delta;
                if (document.getElementById('beds-count')) 
                    document.getElementById('beds-count').textContent = bookingData.beds;
            }
            break;
    }
    
    // Обновляем сводку
    if (document.getElementById('summary-nights')) {
        document.getElementById('summary-nights').textContent = bookingData.nights;
    }
    if (document.getElementById('summary-beds')) {
        document.getElementById('summary-beds').textContent = bookingData.beds;
    }
    if (document.getElementById('summary-guests')) {
        document.getElementById('summary-guests').textContent = bookingData.adults + ' ' + 
            (bookingData.adults === 1 ? 'взрослый' : 'взрослых') + ', ' + 
            bookingData.children + ' ' + (bookingData.children === 1 ? 'ребёнок' : 'детей');
    }
    
    updateTotalPrice();
}

// Обновление итоговой цены
function updateTotalPrice() {
    let basePrice = bookingData.roomPrice * bookingData.nights;
    let additionalPrice = 0;
    let discount = 1;
    
    // Проверяем все чекбоксы
    for (const [id, config] of Object.entries(extraPrices)) {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            if (config.type === 'perNight') {
                additionalPrice += config.price * bookingData.nights;
            } else if (config.type === 'once') {
                additionalPrice += config.price;
            } else if (config.type === 'discount') {
                discount *= config.discount;
            }
        }
    }
    
    // Доплата за дополнительных взрослых (после первого)
    let adultSurcharge = (bookingData.adults - 1) * 500 * bookingData.nights;
    
    // Доплата за детей
    let childSurcharge = bookingData.children * 300 * bookingData.nights;
    
    // Доплата за дополнительные кровати
    let bedSurcharge = (bookingData.beds - 1) * 400 * bookingData.nights;
    
    // Итоговая стоимость
    let total = (basePrice * discount) + adultSurcharge + childSurcharge + bedSurcharge + additionalPrice;
    bookingData.totalPrice = Math.round(total);
    
    // Обновляем отображение цены
    if (document.getElementById('total-price')) {
        document.getElementById('total-price').textContent = bookingData.totalPrice.toLocaleString('ru-RU') + ' ₽';
    }
    
    // Обновляем список выбранных опций
    updateSelectedItems();
}

// Обновление списка выбранных опций
function updateSelectedItems() {
    const container = document.getElementById('selected-offers');
    if (!container) return;
    
    let selectedItems = '';
    
    for (const [id, config] of Object.entries(extraPrices)) {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            if (config.type === 'perNight') {
                selectedItems += `<div>✓ ${config.name}: +${config.price.toLocaleString()} ₽/ночь</div>`;
            } else if (config.type === 'once') {
                selectedItems += `<div>✓ ${config.name}: +${config.price.toLocaleString()} ₽</div>`;
            } else if (config.type === 'discount') {
                let discountPercent = Math.round((1 - config.discount) * 100);
                selectedItems += `<div>✓ ${config.name}: -${discountPercent}%</div>`;
            }
        }
    }
    
    container.innerHTML = selectedItems || '<div style="color: #666;">Нет выбранных дополнительных услуг</div>';
}

// Подтверждение бронирования
function confirmBooking() {
    let message = 'Спасибо за бронирование! С вами свяжется наш менеджер для подтверждения.\n\n';
    message += 'Детали бронирования:\n';
    message += `• Номер: ${roomNames[bookingData.roomType]}\n`;
    message += `• Гости: ${bookingData.adults} взрослых, ${bookingData.children} детей\n`;
    message += `• Ночей: ${bookingData.nights}\n`;
    message += `• Кроватей: ${bookingData.beds}\n`;
    message += `\nИтоговая стоимость: ${bookingData.totalPrice.toLocaleString('ru-RU')} ₽`;
    
    alert(message);
}

// Сброс всех опций
function resetOptions() {
    for (const id of Object.keys(extraPrices)) {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = false;
    }
    updateTotalPrice();
}