# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

水資源監控系統 (Water Monitoring System) - A real-time monitoring system for soil moisture and water tank levels. This is a static web application that fetches sensor data from a remote Google Apps Script API.

## Commands

### Web Version
- Open `index.html` directly in a browser
- Or serve with Python: `python3 -m http.server 8000`
- Or serve with Node.js: `npx http-server`

### Command Line Version (Not Currently Implemented)
The README mentions a TypeScript-based command line version, but the source files are not present in the repository.

## Architecture

### Core Components

1. **Frontend Architecture**
   - Single-page application with vanilla JavaScript
   - No build process or bundler required
   - Auto-refreshes data every 10 seconds
   - Responsive design with dark theme

2. **Data Flow**
   - Fetches from Google Apps Script API endpoint
   - API returns JSON with sensor readings: `Soil1 (%)`, `Soil2 (%)`, `Water (%)`, and `Timestamp`
   - Updates UI with real-time countdown timer

3. **Key Files**
   - `index.html`: Main HTML structure with sensor cards and status displays
   - `app.js`: Core application logic, API client, and UI updates
   - `style.css`: Styling with CSS Grid, animations, and responsive design

### Status Thresholds

**Soil Moisture:**
- Normal: ≥ 40%
- Warning: 20-39%
- Critical: < 20%

**Water Level:**
- Normal: ≥ 70%
- Warning: 30-69%
- Critical: < 30%

### API Integration
The system fetches data from a Google Apps Script endpoint that returns:
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