"""
GutSense — YOLO11m Food Detection Training Script
Trains a YOLO11 Medium model on the food detection dataset.
Optimized for RTX 5060 (8GB VRAM) with 85+ food classes.
"""
from ultralytics import YOLO
import os
import torch


def train():
    # Check GPU
    device = "0" if torch.cuda.is_available() else "cpu"
    gpu_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
    print(f"Training device: {gpu_name} ({'GPU' if device == '0' else 'CPU'})")

    # Dataset config path
    data_yaml = os.path.join(os.path.dirname(__file__), "datasets", "food_data", "data.yaml")
    
    if not os.path.exists(data_yaml):
        print("ERROR: data.yaml not found!")
        print(f"Expected at: {data_yaml}")
        print("Run 'python setup_dataset.py' first to create the dataset structure.")
        return

    # Load a pretrained YOLO11 Medium model (best accuracy/speed for server inference)
    model = YOLO("yolo11m.pt")

    # Train the model — tuned for 85+ food classes on RTX 5060 (8GB VRAM)
    results = model.train(
        data=data_yaml,
        epochs=80,            # More epochs for 85+ classes
        imgsz=640,
        batch=8,              # Lower batch for medium model on 8GB VRAM
        device=device,
        project="runs",
        name="gutsense_food",
        patience=15,          # Early stopping if no improvement for 15 epochs
        save=True,
        save_period=10,       # Save checkpoint every 10 epochs
        plots=True,           # Generate training plots
        verbose=True,
        augment=True,         # Enable augmentation for better generalization
        mosaic=1.0,           # Mosaic augmentation for multi-food scenes
        mixup=0.1,            # Mild mixup augmentation
        hsv_h=0.015,          # Color jitter — food colors vary a lot
        hsv_s=0.5,
        hsv_v=0.3,
        degrees=10.0,         # Slight rotation
        flipud=0.0,           # No vertical flip (food doesn't flip upside down)
        fliplr=0.5,           # Horizontal flip is fine
    )

    print("\n" + "=" * 60)
    print("TRAINING COMPLETE!")
    print("=" * 60)
    
    # Find best weights
    best_weights = os.path.join("runs", "gutsense_food", "weights", "best.pt")
    if os.path.exists(best_weights):
        print(f"Best model saved at: {best_weights}")
    else:
        # Check for numbered directories (gutsense_food2, gutsense_food3, etc.)
        runs_dir = "runs"
        if os.path.exists(runs_dir):
            for d in sorted(os.listdir(runs_dir), reverse=True):
                if d.startswith("gutsense_food"):
                    candidate = os.path.join(runs_dir, d, "weights", "best.pt")
                    if os.path.exists(candidate):
                        print(f"Best model saved at: {candidate}")
                        break

    print("\nNext step: Start the API server with:")
    print("  python main.py")


if __name__ == "__main__":
    train()
