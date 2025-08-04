const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjP-aKTJZOWlfMlf3MN8Q-ZEXYYpb_JPs3pfaath3CJgSnZQTq7GB18tHoYIHyTDX2x2P8kzU2s2HmbraAdQeow4vgo_0BH2vryVdEj3w77kA7FZMLJ5zwhZ1bZMWLmWhtWMl1N6ROC7WMbo91f5Gec8Ov3tXl8CU1M-dq6f6mbJKIvnHg1_QJPA0gsnPmASBEgTLuD-QY-n_q-YbbIclg1U0EVI0BaOHbe5uT_NlnKASr_Sz-di3DCl81peKGsmk0uoaDvuefAfHiz-qfw89dMgiHbraT89wpUaYC6JEwaJ7LXbS448vVtkhuRzQ&lib=MCC5bLc50ZFODe96WpOUGNhPhwEhFYfKz';

// DOM 元素
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

// 倒數計時相關變數
let countdownInterval;
let currentCountdown = 10;

// 格式化時間
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-TW', { 
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// 取得狀態資訊
function getStatus(value, type) {
    if (type === 'soil') {
        if (value >= 40) return { icon: '✅', text: '正常', class: 'status-normal' };
        if (value >= 20) return { icon: '⚠️', text: '警告', class: 'status-warning' };
        return { icon: '🚨', text: '危險', class: 'status-critical' };
    } else {
        if (value >= 70) return { icon: '✅', text: '正常', class: 'status-normal' };
        if (value >= 30) return { icon: '⚠️', text: '警告', class: 'status-warning' };
        return { icon: '🚨', text: '危險', class: 'status-critical' };
    }
}

// 更新感測器卡片
function updateSensorCard(cardElement, valueElement, statusElement, progressElement, value, type) {
    const status = getStatus(value, type);
    
    valueElement.textContent = value;
    statusElement.innerHTML = `
        <span class="status-icon">${status.icon}</span>
        <span class="status-text ${status.class}">${status.text}</span>
    `;
    
    progressElement.style.width = `${value}%`;
    progressElement.className = 'progress-fill';
    if (status.class === 'status-warning') progressElement.classList.add('warning');
    if (status.class === 'status-critical') progressElement.classList.add('critical');
    
    // 移除所有狀態類別
    cardElement.classList.remove('status-normal', 'status-warning', 'status-critical');
    cardElement.classList.add(status.class);
}

// 更新警報
function updateAlerts(data) {
    const alerts = [];
    
    if (data['Soil1 (%)'] < 20) {
        alerts.push({ type: 'critical', icon: '🚨', text: '土壤感測器 1 濕度過低' });
    }
    if (data['Soil2 (%)'] < 20) {
        alerts.push({ type: 'critical', icon: '🚨', text: '土壤感測器 2 濕度過低' });
    }
    if (data['Water (%)'] < 30) {
        alerts.push({ type: 'critical', icon: '🚨', text: '水箱水位過低' });
    }
    
    if (alerts.length === 0) {
        elements.alertsContainer.innerHTML = '<div class="no-alerts">✅ 無警報</div>';
    } else {
        elements.alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <span class="alert-icon">${alert.icon}</span>
                <span class="alert-text">${alert.text}</span>
            </div>
        `).join('');
    }
}

// 更新顯示
function updateDisplay(data) {
    // 更新時間
    elements.updateTime.textContent = formatTimestamp(data.Timestamp);
    elements.lastUpdate.textContent = `最後更新: ${new Date().toLocaleTimeString('zh-TW')}`;
    
    // 更新土壤濕度
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
    
    // 更新水位
    const waterValue = data['Water (%)'];
    const waterStatus = getStatus(waterValue, 'water');
    
    elements.waterValue.textContent = waterValue;
    elements.waterStatus.innerHTML = `
        <span class="status-icon">${waterStatus.icon}</span>
        <span class="status-text ${waterStatus.class}">${waterStatus.text}</span>
    `;
    
    elements.waterLevel.style.height = `${waterValue}%`;
    elements.waterCard.classList.remove('status-normal', 'status-warning', 'status-critical');
    elements.waterCard.classList.add(waterStatus.class);
    
    // 更新警報
    updateAlerts(data);
}

// 取得資料
async function fetchData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success' && result.data.length > 0) {
            updateDisplay(result.data[0]);
            elements.connectionStatus.innerHTML = '🟢 連線正常';
            // 第一次載入成功後隱藏載入畫面
            if (elements.loader && !elements.loader.classList.contains('hidden')) {
                setTimeout(() => {
                    elements.loader.classList.add('hidden');
                }, 500);
            }
            // 重置倒數計時
            startCountdown();
        } else {
            throw new Error('無效的資料格式');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        elements.connectionStatus.innerHTML = '🔴 連線錯誤';
        elements.alertsContainer.innerHTML = `
            <div class="alert-item critical">
                <span class="alert-icon">❌</span>
                <span class="alert-text">無法取得資料: ${error.message}</span>
            </div>
        `;
    }
}

// 開始倒數計時
function startCountdown() {
    currentCountdown = 10;
    updateCountdownDisplay();
    
    // 清除舊的計時器
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // 開始新的倒數
    countdownInterval = setInterval(() => {
        currentCountdown--;
        updateCountdownDisplay();
        
        if (currentCountdown <= 0) {
            currentCountdown = 10;
            fetchData();
        }
    }, 1000);
}

// 更新倒數顯示
function updateCountdownDisplay() {
    if (elements.countdown) {
        elements.countdown.textContent = currentCountdown;
    }
    
    if (elements.countdownProgress) {
        const circumference = 2 * Math.PI * 26; // 圓周長
        const offset = circumference - (currentCountdown / 10) * circumference;
        elements.countdownProgress.style.strokeDashoffset = offset;
    }
}

// 初始化
function init() {
    // 立即取得第一次資料
    fetchData();
    
    // 開始倒數計時
    startCountdown();
}

// 當頁面載入完成後開始
document.addEventListener('DOMContentLoaded', init);