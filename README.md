# 水資源監控系統

即時監控土壤濕度和水箱水位的系統，透過遠端 API 取得感測器數據。

## 功能

- 🌱 即時土壤濕度監測（兩個感測器）
- 💧 水箱水位追蹤
- 🚨 自動警報系統
- 📡 每 10 秒自動更新數據
- 🎯 視覺化狀態指示器

## 安裝

1. 安裝相依套件：
```bash
npm install
```

## 執行

### 命令列版本

開發模式：
```bash
npm run dev
```

建置後執行：
```bash
npm run build
npm start
```

### 網頁版本

直接在瀏覽器開啟 `index.html` 檔案即可查看網頁介面。

或使用任何靜態網頁伺服器，例如：

使用 Python：
```bash
python3 -m http.server 8000
```

使用 Node.js (需先安裝 http-server):
```bash
npx http-server
```

然後在瀏覽器開啟 http://localhost:8000

## 狀態指示器

### 土壤濕度
- ✅ 正常: ≥ 40%
- ⚠️ 警告: 20-39%
- 🚨 危險: < 20%

### 水位
- ✅ 正常: ≥ 70%
- ⚠️ 警告: 30-69%
- 🚨 危險: < 30%

## 專案結構

```
water-monitoring-system/
├── src/                # 命令列版本源碼
│   ├── index.ts        # 主程式
│   ├── api-client.ts   # API 客戶端
│   └── types.ts        # TypeScript 類型定義
├── index.html          # 網頁版本主頁
├── style.css           # 網頁樣式
├── app.js              # 網頁版本 JavaScript
├── tsconfig.json       # TypeScript 設定
├── package.json        # 專案設定
└── README.md          # 說明文件
```

## 功能特色

### 網頁版本
- 🎨 現代化響應式設計
- 📊 視覺化儀表板
- 🔄 即時資料更新
- 📱 支援行動裝置
- 🚦 動態狀態指示器
- 💧 水位視覺化顯示

### 命令列版本
- 📡 終端機即時監控
- 🖥️ 簡潔文字介面
- 🔄 自動資料更新

## 部署到 GitHub Pages

### Fork 專案

1. 點擊本專案頁面右上角的 **Fork** 按鈕
2. 選擇要 Fork 到的帳號或組織
3. 等待 Fork 完成

### 啟用 GitHub Pages

1. 進入你 Fork 的專案頁面
2. 點擊 **Settings** 標籤
3. 在左側選單找到 **Pages**
4. 在 **Source** 下拉選單中選擇 **Deploy from a branch**
5. 在 **Branch** 下拉選單中選擇 **main** (或 master)
6. 資料夾選擇 **/ (root)**
7. 點擊 **Save**
8. 等待幾分鐘後，你的網站會部署在：`https://[你的GitHub用戶名].github.io/water-monitoring-system/`

### 自訂 API 端點

如果你想使用自己的感測器數據：

1. 開啟 `app.js` 檔案
2. 找到第 1 行的 `API_URL` 變數
3. 將網址替換為你自己的 API 端點：
   ```javascript
   const API_URL = '你的API網址';
   ```
4. 確保你的 API 返回相同格式的 JSON 數據：
   ```json
   {
     "status": "success",
     "data": [{
       "Timestamp": "2024-01-01T00:00:00.000Z",
       "Soil1 (%)": 45,
       "Soil2 (%)": 38,
       "Water (%)": 75
     }]
   }
   ```

### 注意事項

- GitHub Pages 是免費的靜態網站託管服務
- 部署後可能需要等待 5-10 分鐘才能生效
- 如果看到 404 錯誤，請檢查是否已正確啟用 GitHub Pages
- 記得將專案設為 Public (公開) 才能使用免費的 GitHub Pages