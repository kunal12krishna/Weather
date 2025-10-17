// Weather App JavaScript
const API_BASE = '/api';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const loading = document.getElementById('loading');
const currentWeather = document.getElementById('currentWeather');
const forecastCard = document.getElementById('forecastCard');
const errorMessage = document.getElementById('errorMessage');

// Weather data elements
const currentLocation = document.getElementById('currentLocation');
const currentTemp = document.getElementById('currentTemp');
const currentCondition = document.getElementById('currentCondition');
const currentIcon = document.getElementById('currentIcon');
const feelsLike = document.getElementById('feelsLike');
const weatherBadge = document.getElementById('weatherBadge');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');
const pressure = document.getElementById('pressure');
const forecastList = document.getElementById('forecastList');
const hourlyPanel = document.getElementById('hourlyPanel');
const hourlyTitle = document.getElementById('hourlyTitle');
const hourlyList = document.getElementById('hourlyList');
const bgLayer = document.getElementById('bg');

// Theme toggle
const themeToggle = document.getElementById('themeToggle');

let lastForecastData = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Load weather for default city
    loadWeatherData('Bengaluru');
    
    // Setup search form
    searchForm.addEventListener('submit', handleSearch);

    // Initialize theme
    initTheme();
    themeToggle && themeToggle.addEventListener('click', toggleTheme);
});

// Handle search form submission
function handleSearch(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        loadWeatherData(query);
        searchInput.value = '';
    }
}

// Load weather data for a city
async function loadWeatherData(city) {
    showLoading();
    hideError();
    
    try {
        // Fetch current weather and forecast
        const [currentData, forecastData] = await Promise.all([
            fetchCurrentWeather(city),
            fetchForecast(city)
        ]);
        
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        applyBackgroundAnimation(currentData);
        hideLoading();
        
    } catch (error) {
        console.error('Error loading weather data:', error);
        showError();
        hideLoading();
    }
}

// Background animation based on condition
function applyBackgroundAnimation(currentData) {
    if (!bgLayer) return;
    const main = (currentData.weather && currentData.weather[0] && currentData.weather[0].main || '').toLowerCase();
    bgLayer.className = 'bg-anim';
    if (main.includes('clear')) {
        bgLayer.classList.add('bg-clear');
    } else if (main.includes('cloud')) {
        bgLayer.classList.add('bg-clouds');
    } else if (main.includes('rain') || main.includes('drizzle')) {
        bgLayer.classList.add('bg-rain');
    } else if (main.includes('snow')) {
        bgLayer.classList.add('bg-snow');
    } else if (main.includes('night')) {
        bgLayer.classList.add('bg-night');
    }
}

// Fetch current weather data via server proxy
async function fetchCurrentWeather(city) {
    const url = `${API_BASE}/weather?q=${encodeURIComponent(city)}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
    }
    
    return await response.json();
}

// Fetch 5-day forecast data via server proxy
async function fetchForecast(city) {
    const url = `${API_BASE}/forecast?q=${encodeURIComponent(city)}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
    }
    
    return await response.json();
}

// Display current weather
function displayCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main;
    const description = data.weather[0].description;
    const location = data.name + ', ' + data.sys.country;
    
    currentLocation.textContent = location;
    currentTemp.textContent = temp + '°C';
    currentTemp.classList.remove('temp-cold','temp-mild','temp-warm','temp-hot');
    if (temp <= 10) currentTemp.classList.add('temp-cold');
    else if (temp <= 20) currentTemp.classList.add('temp-mild');
    else if (temp <= 30) currentTemp.classList.add('temp-warm');
    else currentTemp.classList.add('temp-hot');
    currentCondition.textContent = condition;
    feelsLike.textContent = Math.round(data.main.feels_like) + '°C';
    weatherBadge.textContent = description;
    humidity.textContent = data.main.humidity + '%';
    windSpeed.textContent = Math.round(data.wind.speed * 3.6) + ' km/h';
    visibility.textContent = Math.round(data.visibility / 1000) + ' km';
    pressure.textContent = data.main.pressure + ' hPa';
    
    // Update weather icon
    updateWeatherIcon(currentIcon, condition);
    
    // Show current weather card
    currentWeather.style.display = 'block';
}

// Display 5-day forecast
function displayForecast(data) {
    // Clear existing forecast
    forecastList.innerHTML = '';
    
    // Group forecast by day (API returns 3-hour intervals)
    lastForecastData = data.list;
    const dailyForecasts = groupForecastByDay(data.list);
    
    dailyForecasts.forEach(day => {
        const forecastElement = createForecastElement(day);
        forecastElement.setAttribute('title', 'Click to see hourly');
        forecastElement.addEventListener('click', function() {
            showHourlyForDate(day.date);
        });
        forecastList.appendChild(forecastElement);
    });
    
    // Show forecast card
    forecastCard.style.display = 'block';
}

// Group forecast data by day
function groupForecastByDay(forecastList) {
    const grouped = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        
        if (!grouped[date]) {
            grouped[date] = {
                date: new Date(item.dt * 1000),
                temps: [],
                conditions: [],
                main: item.weather[0].main,
                description: item.weather[0].description
            };
        }
        
        grouped[date].temps.push(item.main.temp);
        grouped[date].conditions.push(item.weather[0].main);
    });
    
    // Convert to array and calculate highs/lows
    return Object.values(grouped).slice(0, 5).map(day => ({
        date: day.date,
        high: Math.round(Math.max(...day.temps)),
        low: Math.round(Math.min(...day.temps)),
        condition: getMostCommonCondition(day.conditions),
        description: day.description
    }));
}

// Show hourly panel for a given date
function showHourlyForDate(dateObj) {
    if (!lastForecastData) return;
    const targetKey = new Date(dateObj).toDateString();
    const items = lastForecastData.filter(item => new Date(item.dt * 1000).toDateString() === targetKey);
    hourlyList.innerHTML = '';
    hourlyTitle.textContent = `Hourly • ${dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`;
    items.forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const temperature = Math.round(item.main.temp);
        const condition = item.weather[0].main;
        const description = item.weather[0].description;
        const row = document.createElement('div');
        row.className = 'hourly-item';
        row.innerHTML = `
            <div class="hourly-time">${time}</div>
            <div class="hourly-weather">
                ${getWeatherIconHTML(condition, 'hourly-icon')}
                <div>
                    <div class="hourly-condition">${condition}</div>
                    <div class="hourly-description">${description}</div>
                </div>
            </div>
            <div class="hourly-temp">${temperature}°C</div>
        `;
        hourlyList.appendChild(row);
    });
    hourlyPanel.style.display = 'block';
    // scroll into view for convenience
    hourlyPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Theme handling
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark');
    } else if (saved === 'light') {
        document.body.classList.remove('dark');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Get most common weather condition for the day
function getMostCommonCondition(conditions) {
    const counts = {};
    conditions.forEach(condition => {
        counts[condition] = (counts[condition] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

// Create forecast element
function createForecastElement(day) {
    const item = document.createElement('div');
    item.className = 'forecast-item';
    item.style.cursor = 'pointer';
    
    const formattedDate = day.date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    
    const tempClass = day.high <= 10 ? 'temp-cold' : day.high <= 20 ? 'temp-mild' : day.high <= 30 ? 'temp-warm' : 'temp-hot';
    item.innerHTML = `
        <div class="forecast-left">
            <div class="forecast-date">${formattedDate}</div>
            <div class="forecast-weather">
                ${getWeatherIconHTML(day.condition, 'forecast-icon')}
                <div>
                    <div class="forecast-condition">${day.condition}</div>
                    <div class="forecast-description">${day.description}</div>
                </div>
            </div>
        </div>
        <div class="forecast-temps">
            <div class="forecast-high ${tempClass}">${day.high}°C</div>
            <div class="forecast-low">${day.low}°</div>
        </div>
    `;
    
    return item;
}

// Update weather icon
function updateWeatherIcon(iconElement, condition) {
    iconElement.innerHTML = getWeatherIconHTML(condition, getIconColorClass(condition));
}

// Get weather icon HTML
function getWeatherIconHTML(condition, className = '') {
    const iconClass = `${className} ${getIconColorClass(condition)}`;
    
    switch (condition.toLowerCase()) {
        case 'clear':
        case 'sunny':
            return `<svg class="${iconClass}" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>`;
        
        case 'clouds':
        case 'cloudy':
            return `<svg class="${iconClass}" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"></path>
            </svg>`;
        
        case 'rain':
        case 'drizzle':
            return `<svg class="${iconClass}" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="16" y1="13" x2="16" y2="21"></line>
                <line x1="8" y1="13" x2="8" y2="21"></line>
                <line x1="12" y1="15" x2="12" y2="23"></line>
                <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25"></path>
            </svg>`;
        
        case 'snow':
            return `<svg class="${iconClass}" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25"></path>
                <line x1="8" y1="16" x2="8.01" y2="16"></line>
                <line x1="8" y1="20" x2="8.01" y2="20"></line>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
                <line x1="12" y1="22" x2="12.01" y2="22"></line>
                <line x1="16" y1="16" x2="16.01" y2="16"></line>
                <line x1="16" y1="20" x2="16.01" y2="20"></line>
            </svg>`;
        
        default:
            return `<svg class="${iconClass}" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>`;
    }
}

// Get icon color class
function getIconColorClass(condition) {
    switch (condition.toLowerCase()) {
        case 'clear':
        case 'sunny':
            return 'icon-sunny';
        case 'clouds':
        case 'cloudy':
            return 'icon-cloudy';
        case 'rain':
        case 'drizzle':
            return 'icon-rainy';
        case 'snow':
            return 'icon-snowy';
        default:
            return 'icon-sunny';
    }
}

// Utility functions
function showLoading() {
    loading.style.display = 'flex';
    currentWeather.style.display = 'none';
    forecastCard.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError() {
    errorMessage.style.display = 'block';
    currentWeather.style.display = 'none';
    forecastCard.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}