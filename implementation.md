# YOLO Food Detection Implementation Guide

This document outlines the steps to train a custom YOLO model (YOLOv8/11) on a food dataset and integrate it into the GutSense app.

## 1. Prerequisites
- **Python 3.11** (Installed)
- **CUDA Toolkit** (Optional, for GPU acceleration)
- **Ultralytics**: `pip install ultralytics`
- **LabelImg** or **Roboflow**: For data annotation (if creating custom dataset).

## 2. Dataset Preparation
We will use a Kaggle dataset (e.g., "Food Image Dataset" or "Food-101" converted to YOLO format).

### Directory Structure
```
backend/
  datasets/
    food_data/
      train/
        images/
        labels/
      val/
        images/
        labels/
      data.yaml  <-- Dataset config
```

### `data.yaml` Example
```yaml
path: ../datasets/food_data
train: train/images
val: val/images
names:
  0: Pizza
  1: Burger
  2: Salad
  ...
```

## 3. Training the Model
We will use the `ultralytics` library to train a YOLOv8 Nano model (optimized for speed/mobile).

### Training Script (`backend/train.py`)
```python
from ultralytics import YOLO

# Load a model
model = YOLO('yolov8n.pt')  # load a pretrained model (recommended for training)

# Train the model
results = model.train(
    data='datasets/food_data/data.yaml', 
    epochs=50, 
    imgsz=640, 
    device='0', # or 'cpu'
    project='gutsense_food',
    name='yolov8n_food'
)
```

## 4. Serving the Model (Backend API)
We will create a FastAPI server to receive images from the React Native app and return predictions.

### `backend/main.py`
```python
from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import io
from PIL import Image

app = FastAPI()
model = YOLO('gutsense_food/yolov8n_food/weights/best.pt')

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))
    
    results = model(image)
    
    # Process results
    detections = []
    for result in results:
        for box in result.boxes:
            detections.append({
                "class": model.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy.tolist()
            })
            
    # Calculate gut health based on detections (Mock logic for now or specific mapping)
    return {
        "foodDetected": detections[0]['class'] if detections else "Unknown",
        "predictedGutHealth": 85, 
        "predictedBrainFocus": 90,
        "detections": detections
    }
```

## 5. App Integration
Update `CameraView.tsx` to upload the image to this API instead of the mock.

### `CameraView.tsx`
```typescript
const formData = new FormData();
formData.append('file', {
    uri: photo.uri,
    name: 'food.jpg',
    type: 'image/jpeg',
} as any);

const response = await fetch('http://YOUR_PC_IP:8000/predict', {
    method: 'POST',
    body: formData,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
```

## Next Steps
1.  Download dataset.
2.  Run `train.py`.
3.  Start `main.py` server.
4.  Update app to call API.
