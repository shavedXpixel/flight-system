# ✈️ Sky Link

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-React_Node_Firebase-blue?style=for-the-badge)

**Sky Link** is a real-time flight telemetry dashboard that mimics a futuristic airport control tower. It uses a decoupled architecture to push instant flight status updates to all connected users without refreshing the page.

🔗 **[Live Demo](https://flight-system-details.netlify.app/)**

---

## ✨ Key Features

* **⚡ Real-Time Sync:** Flight status changes (Delayed, Boarding) update instantly across all devices using **Firebase Firestore listeners**.
* **🌍 Live Data:** Integrated with **AviationStack API** to pull real-world flight schedules.
* **📱 Mobile Responsive:** Adaptive layout that transforms from a desktop data table to mobile flight cards.
* **🛡️ Admin Panel:** Secure "Glassmorphism" interface for manually adding flights and overriding statuses.
* **🎨 Cyberpunk UI:** Custom physics-based starfall animations and neon aesthetics.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), CSS Grid, Glassmorphism
* **Backend:** Node.js, Express
* **Database:** Firebase Firestore (NoSQL)
* **Deployment:** Vercel (Client) + Render (Server)

---

## 📂 Project Structure

```bash
flight-system/
├── client/              # React Frontend
│   ├── src/components/  # UI Components (FlightBoard, AdminPanel)
│   └── src/App.jsx      # Main Layout & Grid Logic
└── server/              # Node.js Backend
    └── index.js         # API Routes & AviationStack Integration
```
## 🚀 Getting Started

1. Clone the Repo
 ```bash
   git clone [https://github.com/your-username/flight-system.git](https://github.com/your-username/flight-system.git)
   cd flight-system
   ```
2. Setup Backend
 ```bash
    cd server
    npm install
    # Create a .env file with: PORT=5000 and AVIATION_STACK_KEY=your_key
    npm run dev
  ```
3. Setup Frontend
   ```bash
   cd ../client
   npm install
   # Update firebase.js with your config
   npm run dev
   ```
Made with ❤️ using React & Firebase.
