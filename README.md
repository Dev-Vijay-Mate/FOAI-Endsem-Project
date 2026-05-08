# 🌌 SpacePulse Dashboard

**SpacePulse Dashboard** is a production-quality, responsive React application providing real-time intelligence on the International Space Station (ISS), space news, and a contextual AI assistant. 

Featuring a modern, futuristic glassmorphism UI, this application is designed to act as a sleek "Mission Control" center right in your browser.

---

## ✨ Key Features

- **🛰️ Live ISS Tracking:** Real-time polling (every 15s) of the ISS coordinates, rendered on an interactive map with historical trajectory paths.
- **🚀 Advanced Telemetry:** Dynamic calculation of ISS speed (using the Haversine formula) and live reverse-geocoding to display what ocean or country the station is currently flying over.
- **👨‍🚀 Live Astronaut Data:** Real-time tracking of all individuals currently in space, including their names and spacecraft.
- **📰 Space News Hub:** Dual-category news dashboard (Technology & Space Science) powered by GNews, complete with search, sorting, and caching to minimize API usage.
- **🤖 SpacePulse AI Assistant:** A floating, context-aware chatbot powered by Hugging Face (`Qwen2.5-Coder-32B-Instruct`). The AI strictly answers questions based *only* on real-time dashboard telemetry and news data.
- **📊 Interactive Analytics:** Live Recharts visualizations for ISS speed velocity over time and a dynamic news distribution pie chart.
- **🎨 Premium UI/UX:** Responsive glassmorphism design, seamless Dark/Light mode transitions, animated skeleton loaders, and interactive hover states.

---

## 🛠️ Technology Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Maps:** [React Leaflet](https://react-leaflet.js.org/) + [Leaflet](https://leafletjs.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **AI Integration:** [@huggingface/inference SDK](https://huggingface.co/docs/huggingface.js/inference/README)
- **Data Fetching:** [Axios](https://axios-http.com/)
- **Notifications:** [react-hot-toast](https://react-hot-toast.com/)

---

## 🚀 Getting Started

### Prerequisites

You will need [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/Dev-Vijay-Mate/FOAI-Endsem-Project.git
cd FOAI-Endsem-Project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env` file in the root directory and add your API keys:
```env
# Required for the News Hub
VITE_NEWS_API_KEY=your_gnews_api_key

# Required for the SpacePulse AI Chatbot
VITE_AI_TOKEN=your_huggingface_token
```

> **Note:** Do not share your `.env` file or commit it to version control.

### 4. Run the Development Server
```bash
npm run dev
```
The application will start, typically on `http://localhost:5173/`. 

*Note: The application uses a Vite dev-server proxy to route `open-notify.org` and `nominatim.openstreetmap.org` API requests to bypass CORS limitations in the browser.*

---

## 📂 Project Structure

- `/src/components` - Reusable UI components (Sidebar, Header, Maps, Skeletons, etc.)
- `/src/pages` - Main dashboard views (Dashboard, ISS Tracker, News Hub, Analytics)
- `/src/services` - API integration logic (ISS data, News fetcher, HuggingFace inference)
- `/src/context` - React Context providers for global state management (Theme, Dashboard Data)
- `/src/hooks` - Custom React hooks for animations and chatbot logic
- `/src/charts` - Recharts component configurations

---

## 🛡️ License

This project was built for educational purposes and is open source. 
