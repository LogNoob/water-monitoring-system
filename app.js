const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjP-aKTJZOWlfMlf3MN8Q-ZEXYYpb_JPs3pfaath3CJgSnZQTq7GB18tHoYIHyTDX2x2P8kzU2s2HmbraAdQeow4vgo_0BH2vryVdEj3w77kA7FZMLJ5zwhZ1bZMWLmWhtWMl1N6ROC7WMbo91f5Gec8Ov3tXl8CU1M-dq6f6mbJKIvnHg1_QJPA0gsnPmASBEgTLuD-QY-n_q-YbbIclg1U0EVI0BaOHbe5uT_NlnKASr_Sz-di3DCl81peKGsmk0uoaDvuefAfHiz-qfw89dMgiHbraT89wpUaYC6JEwaJ7LXbS448vVtkhuRzQ&lib=MCC5bLc50ZFODe96WpOUGNhPhwEhFYfKz';

// DOM Elements
const elements = {
    loader: document.getElementById('loader'),
    updateTime: document.getElementById('updateTime'),
    countdown: document.getElementById('countdown'),
    countdownProgress: document.getElementById('countdown-progress'),
    soil1Value: document.getElementById('soil1Value'),
    soil1Status: document.getElementById('soil1Status'),
    soil1Progress: document.getElementById('soil1Progress'),
    soil1Card: document.getElementById('soil1Card'),
    soil2Value: document.getElementById('soil2Value'),
    soil2Status: document.getElementById('soil2Status'),
    soil2Progress: document.getElementById('soil2Progress'),
    soil2Card: document.getElementById('soil2Card'),
    waterValue: document.getElementById('waterValue'),
    waterStatus: document.getElementById('waterStatus'),
    waterLevel: document.getElementById('waterLevel'),
    waterCard: document.getElementById('waterCard'),
    alertsContainer: document.getElementById('alertsContainer'),
    connectionStatus: document.getElementById('connectionStatus'),
    lastUpdate: document.getElementById('lastUpdate')
};

// Countdown related variables
let countdownInterval;
let currentCountdown = 11;

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    // 使用 toLocaleString 取得格式化的時間字串
    const formattedDate = date.toLocaleString('en-US', {
        timeZone: 'Asia/Taipei', // 確保使用正確的時區
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // 確保顯示 AM/PM
    });
    
    // 在格式化的時間字串後面加上 '(GMT+8)'
    return formattedDate + ' (GMT+8)';
}

// Get status information
function getStatus(value, type) {
    if (type === 'soil') {
        if (value >= 40) return { icon: '✅', text: 'Normal', class: 'status-normal' };
        if (value >= 20) return { icon: '⚠️', text: 'Warning', class: 'status-warning' };
        return { icon: '🚨', text: 'Critical', class: 'status-critical' };
    } else { // water
        if (value >= 70) return { icon: '✅', text: 'Normal', class: 'status-normal' };
        if (value >= 30) return { icon: '⚠️', text: 'Warning', class: 'status-warning' };
        return { icon: '🚨', text: 'Critical', class: 'status-critical' };
    }
}

// Update a sensor card
function updateSensorCard(cardElement, valueElement, statusElement, progressElement, value, type) {
    const status = getStatus(value, type);

    valueElement.textContent = value;
    statusElement.innerHTML = `
        <span class="status-icon">${status.icon}</span>
        <span class="status-text ${status.class}">${status.text}</span>
    `;

    progressElement.style.width = `${value}%`;
    progressElement.className = 'progress-fill'; // Reset classes first
    if (status.class === 'status-warning') progressElement.classList.add('warning');
    if (status.class === 'status-critical') progressElement.classList.add('critical');

    // Remove all status classes from the card and add the current one
    cardElement.classList.remove('status-normal', 'status-warning', 'status-critical');
    cardElement.classList.add(status.class);
}

// Update alerts section
function updateAlerts(data) {
    const alerts = [];

    if (data['Soil1 (%)'] < 20) {
        alerts.push({ type: 'critical', icon: '🚨', text: 'Soil Sensor 1 moisture is too low' });
    }
    if (data['Soil2 (%)'] < 20) {
        alerts.push({ type: 'critical', icon: '🚨', text: 'Soil Sensor 2 moisture is too low' });
    }
    if (data['Water (%)'] < 30) {
        alerts.push({ type: 'critical', icon: '🚨', text: 'Water tank level is too low' });
    }

    if (alerts.length === 0) {
        elements.alertsContainer.innerHTML = '<div class="no-alerts">✅ No Alerts</div>';
    } else {
        elements.alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <span class="alert-icon">${alert.icon}</span>
                <span class="alert-text">${alert.text}</span>
            </div>
        `).join('');
    }
}

// Update the entire display with new data
function updateDisplay(data) {
    // Update time
    elements.updateTime.textContent = formatTimestamp(data.Timestamp);
    // Also update the footer timestamp with English format
    elements.lastUpdate.textContent = `Last update: ${new Date().toLocaleTimeString('en-US')}`;

    // Update soil moisture sensors
    updateSensorCard(
        elements.soil1Card,
        elements.soil1Value,
        elements.soil1Status,
        elements.soil1Progress,
        data['Soil1 (%)'],
        'soil'
    );

    updateSensorCard(
        elements.soil2Card,
        elements.soil2Value,
        elements.soil2Status,
        elements.soil2Progress,
        data['Soil2 (%)'],
        'soil'
    );

    // Update water level
    const waterValue = data['Water (%)'];
    const waterStatus = getStatus(waterValue, 'water');

    elements.waterValue.textContent = waterValue;
    elements.waterStatus.innerHTML = `
        <span class="status-icon">${waterStatus.icon}</span>
        <span class="status-text ${waterStatus.class}">${waterStatus.text}</span>
    `;

    elements.waterLevel.style.height = `${waterValue}%`;
    elements.waterCard.dataset.status = waterStatus.class; // Set data-status attribute
    elements.waterCard.classList.remove('status-normal', 'status-warning', 'status-critical');
    elements.waterCard.classList.add(waterStatus.class);

    // Update alerts
    updateAlerts(data);
}

// Fetch data from the API
async function fetchData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success' && result.data.length > 0) {
            updateDisplay(result.data[0]);
            elements.connectionStatus.innerHTML = '🟢 Connection Normal';
            // Hide loader after first successful load
            if (elements.loader && !elements.loader.classList.contains('hidden')) {
                setTimeout(() => {
                    elements.loader.classList.add('hidden');
                }, 500);
            }
            // Reset countdown on successful fetch
            startCountdown();
        } else {
            throw new Error('Invalid data format');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        elements.connectionStatus.innerHTML = '🔴 Connection Error';
        elements.alertsContainer.innerHTML = `
            <div class="alert-item critical">
                <span class="alert-icon">❌</span>
                <span class="alert-text">Could not fetch data: ${error.message}</span>
            </div>
        `;
    }
}

// Start the countdown timer
function startCountdown() {
    currentCountdown = 11;
    updateCountdownDisplay();

    // Clear the old interval if it exists
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    // Start a new interval
    countdownInterval = setInterval(() => {
        currentCountdown--;
        updateCountdownDisplay();

        if (currentCountdown <= 0) {
            currentCountdown = 11; // Reset for the next fetch cycle
            fetchData();
        }
    }, 1000);
}

// Update the countdown visual display
function updateCountdownDisplay() {
    if (elements.countdown) {
        // Display counts down from 10, but the cycle is actually 11 seconds
        const displayCount = currentCountdown > 10 ? 10 : currentCountdown;
        elements.countdown.textContent = displayCount;
    }

    if (elements.countdownProgress) {
        const circumference = 2 * Math.PI * 26; // The circle's circumference
        const displayCount = currentCountdown > 10 ? 10 : currentCountdown;
        const offset = circumference - (displayCount / 10) * circumference;
        elements.countdownProgress.style.strokeDashoffset = offset;
    }
}

// Initialize the application
function init() {
    // Fetch initial data immediately
    fetchData();
}

// Start when the page content is loaded
document.addEventListener('DOMContentLoaded', init);
