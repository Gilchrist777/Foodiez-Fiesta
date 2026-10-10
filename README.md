# Foodiez Fiesta POS 🍔🍗🍹
### Mobile-First Pushcart Food Kiosk Order & Sales Tracker

A lightweight, zero-latency, 100% offline-first Progressive Web App (PWA) built specifically for pushcart food kiosks, street food stalls, and quick-service counters.

Designed with a sleek **Soft Whitesmoke, Deep Obsidian, and Rich Golden Gradient** palette, responsive for all devices including iPhone 14/15/16 (with safe-area notch & dynamic island adaptation) and Android.

---

## 🚀 Key Features

1. **Daily Sales Dashboard**:
   - Total Today's Sales live tally
   - Paid Orders count & breakdown by payment type (**Cash** vs **UPI / GPay / QR**)
   - Average Order Value
   - Quick reset for every new day (Order numbering starts fresh at **Order #1**)
   - Previous Day / Yesterday's sales summary to revisit whenever needed
   - Highly sold & less sold items analytics

2. **Order Taking (Color-Note Style)**:
   - Zero-save headache: auto-saves in real-time as you tap
   - Category filtering & instant search
   - Incremental `+` and `-` quantity buttons with tactile sound & haptic feedback
   - Bottom summary with instant total calculation
   - One-tap "Mark Paid" confirmation with payment method selection (Cash / UPI)
   - Seamless return to dashboard upon payment confirmation

3. **Master Menu Management**:
   - Add new custom menu items & extras (e.g. Mayonnaise ₹10, Extra Cheese, etc.)
   - Edit item prices on the fly
   - Toggle item availability (In-stock / Out-of-stock)
   - Delete items with confirmation

4. **Branding & Customization**:
   - Modern animated kiosk emblem
   - Upload custom logo (PNG/JPG/SVG) directly from phone
   - Opening splash transition animation

5. **Offline & Zero-Cost**:
   - 100% operational offline without internet connection (uses local storage)
   - Progressive Web App installable directly to iOS & Android home screens
   - Ready for zero-cost free hosting (Vercel, GitHub Pages, Netlify)

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or bun or yarn

### Installation
1. Clone or extract this project folder to your local computer:
   ```bash
   cd foodiez-fiesta-pos
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
   Or access the Network URL printed in your terminal on your mobile phone on the same Wi-Fi!

---

## 🏗️ Build & Deploy for Free

### Production Build
```bash
npm run build
```
The output will be in the `dist` folder.

### Free Hosting Options (100% Free Forever):
- **Vercel**: Import this project folder or push to GitHub and connect to [vercel.com](https://vercel.com). Framework preset: Vite.
- **GitHub Pages**: Build and deploy `dist` branch or configure GitHub Actions.
- **Netlify**: Drag and drop the `dist/` folder or connect your Git repo on [netlify.com](https://netlify.com).

---

## 📱 How to Install on Mobile (PWA)

### iPhone / iPad (Safari)
1. Open the app link in Safari.
2. Tap the **Share** button (box with upward arrow at bottom).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add** in the top right.

### Android (Chrome)
1. Open the app link in Chrome.
2. Tap the **⋮ (three dots)** menu in the top right.
3. Tap **"Install App"** or **"Add to Home screen"**.

---

## 📂 Project Structure
```
├── public/                 # Static assets, icons, manifest
├── scripts/                # Utility scripts (icon generation, zip packager)
├── src/
│   ├── components/         # UI components (Header, Dashboard, Order screen, etc.)
│   ├── data/               # Default menu items & category configs
│   ├── hooks/              # useOnlineStatus, usePWAInstall
│   ├── types/              # TypeScript models for Orders, MenuItems, etc.
│   ├── utils/              # Sound/haptics, LocalStorage engine, formatters
│   ├── App.tsx             # Root application orchestrator
│   ├── index.css           # Tailwind CSS styles & safe-area utilities
│   └── main.tsx            # React root mount
├── index.html              # HTML entry with mobile viewport & PWA meta
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration with PWA plugin
```
