# GutSense — Full Project Memory 🧠

> This file captures everything that has been built, every decision made, and every future plan for the GutSense project.  
> **Last Updated:** April 9, 2026

---

## 📌 Project Overview

**GutSense** is an AI-powered gut health food tracker. The user takes a photo of their food with their phone; the app runs it through a YOLO object detection model, identifies the food, and returns predicted **Gut Health** and **Brain Focus** scores. The user can also log how they feel after eating (mood, digestion) via a feedback modal.

**Tech Stack:**
| Layer | Technology |
|---|---|
| Mobile App | React Native + Expo (TypeScript) |
| Styling | NativeWind v4 (Tailwind CSS) |
| Routing | Expo Router (file-based) |
| Database | Supabase (configured, not yet connected) |
| AI Model | YOLOv8n (Ultralytics) |
| Backend API | FastAPI (Python 3.11) |
| Hardware | NVIDIA RTX 5060 (8GB VRAM), CUDA |

---

## ✅ Phase 1 — App Scaffolding (COMPLETED)

### What Was Built
The entire GutSense React Native app was initialized from scratch.

#### Project Initialization
- Created Expo project at `c:\Gut Related Project\GutSense\` using `create-expo-app` with a TypeScript blank template.
- Installed **NativeWind v4** + **Tailwind CSS** for styling.
- Installed `expo-camera`, `@supabase/supabase-js`, `expo-router`.
- Configured `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `global.css`, `nativewind-env.d.ts`.

#### Color Theme (Dark Minimal)
Defined in `src/theme/colors.ts`:
- Background: `#0A0F0A` (near-black green)
- Surface: `#141F14` (dark forest)
- Primary: `#2DD881` (vibrant green accent)
- Text: `#E8F5E8` (soft green-white)
- Muted: `#4A6B4A` (muted green)

#### Screens & Components Created
| File | Purpose |
|---|---|
| `app/_layout.tsx` | Root layout with navigation |
| `app/index.tsx` | Dashboard (home) screen |
| `app/camera.tsx` | Camera screen |
| `app/api/analyze+api.ts` | **Mock** API route (returns fake scores) |
| `src/components/CameraView.tsx` | Full-screen camera, capture button, prediction overlay |
| `src/components/PredictionCard.tsx` | Glassmorphic card with animated Gut Health & Brain Focus bars |
| `src/components/LastMealCard.tsx` | Dashboard card showing last meal summary |
| `src/components/FeedbackModal.tsx` | Bottom-sheet modal with Mood & Digestion sliders |
| `src/lib/supabase.ts` | Supabase client (placeholder credentials) |
| `src/theme/colors.ts` | Dark green/black palette definitions |

#### Mock AI Flow (Temporary)
`analyzeFood()` in `CameraView.tsx` calls the local Expo API route (`app/api/analyze+api.ts`) which responds with hardcoded/random scores:
```json
{
  "predictedGutHealth": 78,
  "predictedBrainFocus": 85,
  "foodDetected": "Grilled Chicken Salad",
  "confidence": 0.92
}
```
This was a **placeholder** to test the UI before the real model was ready.

#### How to Run the App (Current State)
```bash
cd "c:\Gut Related Project\GutSense"
npx expo start
```
- Scan QR code in **Expo Go** app on phone (same Wi-Fi).
- Or press `a` for Android emulator / `i` for iOS simulator.

---

## ✅ Phase 2 — AI Backend Setup (PARTIALLY COMPLETED)

### Python Environment
- **Python 3.11.9** confirmed installed.
- **pip 24.0** confirmed.
- Created virtual environment at `backend/venv/`.
- `requirements.txt` created with:
  ```
  ultralytics
  fastapi
  uvicorn
  python-multipart
  Pillow
  ```
- `backend/check_gpu.py` created to verify CUDA availability.

### Backend Files Created
| File | Status | Purpose |
|---|---|---|
| `backend/requirements.txt` | ✅ Created | Python dependencies |
| `backend/venv/` | ✅ Created | Isolated Python environment |
| `backend/check_gpu.py` | ✅ Created | Verifies RTX 5060 CUDA availability |
| `backend/train.py` | ✅ Created | YOLOv8n training script (50 epochs, imgsz=640, GPU) |
| `backend/food_health_map.py` | ✅ Created | Maps detected food classes → Gut Health & Brain Focus scores |
| `backend/main.py` | ✅ Created | FastAPI server with `/predict` and `/health` endpoints |
| `backend/setup_dataset.py` | ✅ Created | Script to download/organize the Kaggle food dataset |
| `backend/datasets/food_data/` | ⏳ Pending | Dataset not yet downloaded |

### Dataset Plan
- **Chosen Dataset**: "Food Detection (YOLOv12)" from Kaggle.
- **Food Classes**: carrot, cheese, cucumber, egg, eggplant, milk, potato, tomato.
- **YOLO Directory Format**:
  ```
  backend/datasets/food_data/
    train/images/   train/labels/
    val/images/     val/labels/
    data.yaml
  ```
- **Download Method**: Requires Kaggle API key (`kaggle.json`) OR manual download.

### Training Configuration
In `backend/train.py`:
```python
model = YOLO('yolov8n.pt')  # Nano — fast, mobile-optimized
model.train(
    data='datasets/food_data/data.yaml',
    epochs=50,
    imgsz=640,
    device='0'  # RTX 5060
)
# Expected training time: 15–30 minutes
# Target mAP50 > 0.5
```

### FastAPI Backend (`backend/main.py`)
- **`POST /predict`**: Accepts food image → runs YOLO inference → returns JSON with detected foods and health scores.
- **`GET /health`**: Returns `{"status": "ok"}` — used to verify server is running.
- CORS middleware enabled so the React Native app can make cross-origin requests.
- Loads weights from `backend/runs/…/best.pt` (trained model), falls back to generic `yolov8n.pt`.

### Food Health Scoring (`backend/food_health_map.py`)
Maps YOLO-detected class names to scores, e.g.:
- `carrot` → 90 gut health, 85 brain focus
- `egg` → 80 gut health, 88 brain focus
- Unknown food → default moderate scores

---

## ⏳ Phase 3 — App ↔ Backend Integration (NOT YET DONE)

### What Needs to Be Changed

#### 1. `src/lib/config.ts` (NEEDS CREATION)
Central config file with the backend URL:
```typescript
export const API_BASE_URL = 'http://192.168.x.x:8000'; // Your PC's LAN IP
export const ENDPOINTS = {
  predict: `${API_BASE_URL}/predict`,
  health:  `${API_BASE_URL}/health`,
};
```
⚠️ The IP must be updated to match the developer's actual LAN IP before testing on a physical device.

#### 2. `src/components/CameraView.tsx` (NEEDS MODIFICATION)
Replace the mock `analyzeFood()` with a real API call:
```typescript
const formData = new FormData();
formData.append('file', {
    uri: photo.uri,
    name: 'food.jpg',
    type: 'image/jpeg',
} as any);
const response = await fetch(ENDPOINTS.predict, {
    method: 'POST',
    body: formData,
});
const data = await response.json();
```

#### 3. `app/api/analyze+api.ts` (NEEDS DELETION)
The mock Expo API file is no longer needed once the real FastAPI backend is live.

---

## 🔮 Future Plans

### Immediate Next Steps (To Complete the MVP)
1. **Download the food dataset** into `backend/datasets/food_data/` (via Kaggle API or manually).
2. **Activate the venv** and install dependencies:
   ```bash
   cd backend
   .\\venv\\Scripts\\activate
   pip install -r requirements.txt
   ```
3. **Verify GPU** is accessible: `python check_gpu.py`
4. **Run model training**: `python train.py` (~15–30 mins on RTX 5060)
5. **Start the FastAPI server**: `python -m uvicorn main:app --host 0.0.0.0 --port 8000`
6. **Test the API**:
   ```bash
   curl http://localhost:8000/health
   curl -X POST "http://localhost:8000/predict" -F "file=@test_image.jpg"
   ```
7. **Create `src/lib/config.ts`** with real PC LAN IP.
8. **Update `CameraView.tsx`** to call real backend (remove mock logic).
9. **Delete `app/api/analyze+api.ts`** (mock route).
10. **End-to-end test**: Open app → take food photo → see real YOLO detections and health scores.

### Medium-Term Plans
- **Supabase Integration**: Connect `src/lib/supabase.ts` to a real Supabase project to store meals and feedback data persistently.
- **Feedback Loop**: Save "How do I feel?" slider responses to Supabase and use them to personalize health scores over time.
- **Meal History**: Build a history screen showing all logged meals with their gut/brain scores.
- **Expand Food Classes**: Train on a larger dataset with more food categories, especially Indian cuisine.

### Long-Term Vision
- **Personalized AI**: Use the collected feedback (mood, digestion) to fine-tune predictions per user.
- **Trend Analysis**: Charts and weekly/monthly gut health trend visualizations.
- **Notifications**: Remind users to log meals and check in on how they feel.
- **Production Deployment**: Move FastAPI backend from local LAN to a cloud server (e.g., GCP, AWS, Railway) so the app works from anywhere, not just on the same Wi-Fi.
- **App Store Release**: Package GutSense as a standalone APK/IPA for distribution.

---

## 📁 Current File Structure

```
c:\Gut Related Project\GutSense\
├── app/
│   ├── _layout.tsx          ✅ Root layout
│   ├── index.tsx            ✅ Dashboard
│   ├── camera.tsx           ✅ Camera screen
│   └── api/
│       └── analyze+api.ts   ✅ Mock API (to be deleted)
├── src/
│   ├── components/
│   │   ├── CameraView.tsx       ✅ Camera UI (mock AI, needs real API)
│   │   ├── PredictionCard.tsx   ✅ Results card
│   │   ├── LastMealCard.tsx     ✅ Dashboard summary card
│   │   └── FeedbackModal.tsx    ✅ Mood/Digestion modal
│   ├── lib/
│   │   ├── supabase.ts          ✅ Supabase client (placeholder keys)
│   │   └── config.ts            ❌ NOT YET CREATED (needed for backend URL)
│   └── theme/
│       └── colors.ts            ✅ Dark green palette
├── backend/
│   ├── venv/                    ✅ Python virtual environment
│   ├── requirements.txt         ✅ Python dependencies
│   ├── check_gpu.py             ✅ GPU check script
│   ├── train.py                 ✅ YOLOv8n training script
│   ├── food_health_map.py       ✅ Food → health score mapping
│   ├── main.py                  ✅ FastAPI server
│   ├── setup_dataset.py         ✅ Dataset download helper
│   └── datasets/
│       └── food_data/           ❌ EMPTY — dataset not downloaded yet
├── package.json
├── tailwind.config.js
├── global.css
├── babel.config.js
├── metro.config.js
└── app.json
```

---

## 🔑 Key Notes & Gotchas

- **Same Wi-Fi Required**: The phone and PC must be on the same local network for the app to reach the FastAPI backend.
- **LAN IP Must Be Set**: Update `API_BASE_URL` in `config.ts` to your actual IPv4 address (find with `ipconfig` on Windows).
- **Kaggle API Key**: Needed to automate dataset download via `setup_dataset.py`. Alternatively, download manually from Kaggle and unzip into `backend/datasets/food_data/`.
- **Venv Must Be Activated**: Always activate `.\\venv\\Scripts\\activate` before running any Python backend commands.
- **Model Weights Path**: After training, `main.py` expects the best weights at `backend/runs/detect/gutsense_food*/weights/best.pt`.
- **Supabase Keys Are Placeholders**: `src/lib/supabase.ts` uses dummy keys. Real data persistence requires a Supabase project setup.
