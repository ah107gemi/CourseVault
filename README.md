# CourseVault 🎓

> A lightweight, clean, and modern standalone Progressive Web App (PWA) to organize, track, and watch your curated YouTube courses, tutorials, and masterclasses offline.

[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue.svg)](https://ah107gemi.github.io/CourseVault/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-purple.svg)](https://ah107gemi.github.io/CourseVault/)

---

## 📱 Live Demo & Installation

CourseVault is hosted on **GitHub Pages**:
🔗 **[https://ah107gemi.github.io/CourseVault/](https://ah107gemi.github.io/CourseVault/)**

### 📲 How to Install on Mobile

#### iOS (Safari)
1. Open **[https://ah107gemi.github.io/CourseVault/](https://ah107gemi.github.io/CourseVault/)** in Safari.
2. Tap the **Share** button (box with an arrow pointing up at the bottom).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the top-right corner. CourseVault will now run in standalone fullscreen mode without Safari URL bars!

#### Android (Chrome / Brave / Edge)
1. Open **[https://ah107gemi.github.io/CourseVault/](https://ah107gemi.github.io/CourseVault/)** in Chrome.
2. Tap the **Install App** banner or the three dots (**⋮**) in the top-right.
3. Tap **Add to Home screen** / **Install app**.
4. CourseVault will launch like a native application with offline support.

---

## ✨ Key Features

- **📱 Standalone Mobile PWA**: Offline-first service worker caching (`sw.js`) and W3C Web App Manifest (`manifest.json`) for instant launch.
- **🎨 Modern Dark Palette**: Designed for readability with high-contrast accent tags, glassmorphism headers, and smooth transitions.
- **🖼️ Smart Cover Art**:
  - Automatically extracts video IDs and fetches official high-res YouTube thumbnails (`hqdefault.jpg`).
  - Supports **Custom Cover Image URLs** with live real-time previews.
  - Graceful fallback for playlists without individual video IDs.
- **🗂️ Dynamic Channels & Categories**:
  - Organize courses into channels (CCNA, Python, SQL, Power BI, AI Automation, Web Dev, or your own custom topics).
  - Add, edit, and delete custom categories with customizable color badges.
- **⚡ Learning Status Tracking**: Toggle each course between *Want to Learn*, *In Progress*, and *Completed*.
- **🛡️ Duplicate URL Detection**: Automatically normalizes links (cleans `?si=...`, timestamps `&t=...`, mobile vs. desktop subdomains) and alerts before duplicate saves.
- **💾 100% Local & Private (Backup & Restore)**:
  - All data is saved directly in your browser's `localStorage` — no external accounts or paid databases required.
  - One-click **Export JSON** to back up your courses.
  - One-click **Import JSON** to restore or merge courses seamlessly.

---

## 🛠️ Project Structure

```text
CourseVault/
├── index.html        # App Shell & UI Structure
├── style.css         # Dark theme & responsive design styles
├── app.js            # App logic, PWA installation, & local persistence
├── manifest.json     # PWA manifest (standalone mode)
├── sw.js             # Service Worker caching for offline launch
├── icons/            # App icons (192x192, 512x512, SVG)
│   ├── icon.svg
│   ├── icon-192.png
│   └── icon-512.png
├── .gitignore        # Git ignore rules
└── README.md         # Documentation & installation guide
```

---

## 💻 Local Development

Run with any static file server:

```bash
# Python 3
python -m http.server 3000

# or Node.js / npx
npx serve .
```

Open `http://localhost:3000` in your browser.
