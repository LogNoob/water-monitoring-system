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