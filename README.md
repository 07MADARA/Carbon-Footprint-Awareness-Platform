# Carbon Footprint Awareness Platform

## 🚀 Live Demo
- **Frontend (Web App)**: [https://carbon-footprint-awarene-e3068.web.app](https://carbon-footprint-awarene-e3068.web.app)
- **Backend (API)**: [https://carbon-footprint-awareness-platform-243330449820.us-central1.run.app](https://carbon-footprint-awareness-platform-243330449820.us-central1.run.app)

**Sustainability / Climate Action**

## Approach & Logic
This project aims to provide users with a clean, dynamic, and visually engaging way to understand their carbon footprint based on daily habits.
The app consists of a multi-step React frontend form and a FastAPI backend calculation engine.

### Frontend
- Built with **React** and **Vite**.
- Styled using **Tailwind CSS** for a premium "dark mode" aesthetic, complete with `animate-fade-in` transitions to provide a "wow" factor.
- Utilizes an interactive, multi-step flow so users are not overwhelmed with a large form.
- Implements loading states to handle network latency gracefully and error states to inform the user if the backend is down.

### Backend
- Built with **FastAPI** (Python).
- Contains a `/calculate` endpoint that takes the user's Transport (miles), Diet (frequency), and Energy (kWh) data.
- It calculates the estimated CO2 footprint in kilograms.
- **Assumptions / Multipliers:**
  - *Transport*: 0.4 kg CO2 per mile.
  - *Diet*: Base scaling footprint ranging from 20 kg to 150 kg per month based on meat consumption.
  - *Energy*: 0.9 kg CO2 per kWh.
- The backend analyzes the largest emission source and returns three practical, actionable tips dynamically based on the highest category.

## Prerequisites
- Node.js (v18+)
- Python 3.8+

## How It Works / Setup

### 1. Run the Backend
Navigate to the `backend` folder, install requirements, and run the server:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The API will run at `http://localhost:8000`.

### 2. Run the Frontend
Navigate to the `frontend` folder, install dependencies, and start Vite:
```bash
cd frontend
npm install
npm run dev
```
Open the provided `localhost` link (usually `http://localhost:5173`) in your browser to view the application.

## Best Practices Implemented
- **Error Handling**: A simulated delay highlights a smooth loading spinner on the frontend. If the API fails, a friendly error state is shown instead of crashing.
- **Code Quality**: Separated state logic, reusable UI functional components (inline SVG icons for speed and zero dependencies), and clean structure.
- **No Console Errors**: Strict control over element keys and hooks. No unused imports.
- **Wow Factor**: Sleek, fully responsive UI, custom scrollbars, and dynamic tip generation based on actual user data.
