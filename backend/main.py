"""
GutSense — FastAPI Backend Server
Serves the trained YOLO11m food detection model via REST API.

Usage:
    python main.py
    # or
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""
import os
import io
import glob

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from ultralytics import YOLO

from food_health_map import get_health_scores, get_combined_health_scores


# ─── Find best model weights ─────────────────────────────────────────────────
def find_best_weights() -> str:
    """Find the best trained model weights, falling back to pretrained if needed."""
    
    # Check for trained model in runs directory
    runs_dir = os.path.join(os.path.dirname(__file__), "runs")
    if os.path.exists(runs_dir):
        # Look for best.pt in any gutsense_food* directory
        pattern = os.path.join(runs_dir, "gutsense_food*", "weights", "best.pt")
        matches = sorted(glob.glob(pattern), reverse=True)
        if matches:
            print(f"✅ Using trained model: {matches[0]}")
            return matches[0]
    
    # Fallback to pretrained YOLO11m (general object detection, includes some food)
    pretrained = os.path.join(os.path.dirname(__file__), "yolo11m.pt")
    if os.path.exists(pretrained):
        print(f"⚠️  No trained model found. Using pretrained: {pretrained}")
        return pretrained

    # Download pretrained model
    print("⚠️  No model found. Downloading pretrained YOLO11m...")
    return "yolo11m.pt"


# ─── Initialize FastAPI ──────────────────────────────────────────────────────
app = FastAPI(
    title="GutSense Food Detection API",
    description="YOLO11m-based food detection with gut health & brain focus scoring (85+ food classes)",
    version="1.0.0",
)

# Enable CORS for React Native / Expo app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
model_path = find_best_weights()
model = YOLO(model_path)
print(f"🚀 Model loaded: {model_path}")
print(f"📋 Classes: {model.names}")


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "model": model_path,
        "classes": model.names,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an image upload and returns food detections with health scores.
    
    Returns:
        {
            "foodDetected": "pizza",
            "predictedGutHealth": 40,
            "predictedBrainFocus": 45,
            "confidence": 0.87,
            "detections": [
                {"class": "pizza", "confidence": 0.87, "bbox": [...]}
            ]
        }
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image (JPEG, PNG, etc.)",
        )
    
    try:
        # Read and open image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Run YOLO inference
        results = model(image, verbose=False)
        
        # Process results
        detections = []
        for result in results:
            for box in result.boxes:
                class_name = model.names[int(box.cls)]
                confidence = float(box.conf)
                detections.append({
                    "class": class_name,
                    "confidence": round(confidence, 3),
                    "bbox": box.xyxy.tolist()[0] if len(box.xyxy.tolist()) > 0 else [],
                })
        
        # Sort by confidence (highest first)
        detections.sort(key=lambda x: x["confidence"], reverse=True)
        
        # Calculate health scores
        if detections:
            health_scores = get_combined_health_scores(detections)
            top_food = detections[0]["class"]
            top_confidence = detections[0]["confidence"]
        else:
            health_scores = get_health_scores("unknown")
            top_food = "Unknown Food"
            top_confidence = 0.0
        
        return {
            "foodDetected": top_food,
            "predictedGutHealth": health_scores["gut_health"],
            "predictedBrainFocus": health_scores["brain_focus"],
            "confidence": top_confidence,
            "detections": detections,
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}",
        )


# ─── Run Server ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    
    print("\n" + "=" * 50)
    print("  GutSense Food Detection API")
    print("  http://0.0.0.0:8000")
    print("  Docs: http://0.0.0.0:8000/docs")
    print("=" * 50 + "\n")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
