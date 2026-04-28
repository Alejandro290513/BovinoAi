# 🚩 STATE CHECKPOINT: BovinoAI Project

## 🛠️ Tech Stack
- **Backend:** Java 21, Spring Boot 4.0.6, PostgreSQL (Port 5432), Maven.
- **Frontend:** React 19, Vite (Port 5173), Axios, Chart.js.
- **API Port:** 8081.

## ✅ Completed Features
- **Core Management:** CRUD for Animals, Breeds (Razas), Weights (Pesajes), and Costs.
- **Financial Engine:** `CalculadorCostos` for break-even and feed conversion logic.
- **Dashboard (Resumen):** Executive view with GDP average, total investment, and biometric distribution charts.
- **AI Engine (Infraestructura):**
    - `AnalisisController`: Endpoint `/api/analisis/{idAnimal}`.
    - `PromptBuilder`: Generates professional zootecnia prompts for LLMs.
    - `AnalisisService`: Logic for data aggregation and response mapping.
    - `AnalisisResponseDTO`: Structured output (Diagnosis, Recommendations, Score A-F, etc.).

## 📍 Current State
- **Frontend:** The `Resumen.jsx` page is fully connected to the backend and displays real-time alerts.
- **AI Module:** The system is functional using a **simulation mode** in `AnalisisService`. It is ready to switch to the real Claude API by adding the key to `application.properties` (`ai.claude.api.key`).

## 🚀 Next Steps
1. **AI Integration:** Replace `simulateAIResponse` in `AnalisisService` with a real HTTP call to Claude/OpenAI using the generated prompt.
2. **AI Frontend View:** Create a dedicated UI page or modal to display the detailed AI Analysis (the `AnalisisResponseDTO` data).
3. **Validation:** Implement input validation for the market price (`precioMercadoCop`) in the frontend.

## 📂 Key Files for Reference
- `backend/.../controller/AnalisisController.java`
- `backend/.../service/AnalisisService.java`
- `backend/.../logic/PromptBuilder.java`
- `frontend/src/pages/Resumen.jsx`
- `frontend/src/services/api.js`
