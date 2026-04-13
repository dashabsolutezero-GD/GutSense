"""
GutSense — Dataset Download Script
Downloads a food detection dataset from Ultralytics hub or uses a local YOLO dataset.
For simplicity, we use the Ultralytics built-in food dataset approach.
"""
import os
import shutil
import urllib.request
import zipfile
import yaml


DATASET_DIR = os.path.join(os.path.dirname(__file__), "datasets", "food_data")


def download_and_setup_roboflow_dataset():
    """
    Downloads a food detection dataset from Roboflow (public, no API key needed).
    Using the 'food-detection' dataset with 12 food classes in YOLOv8 format.
    """
    try:
        from roboflow import Roboflow
        rf = Roboflow(api_key="")  # Public dataset, no key needed for download
        project = rf.workspace().project("food-detection-ixnhm")
        version = project.version(1)
        dataset = version.download("yolov8", location=DATASET_DIR)
        print(f"Dataset downloaded to: {DATASET_DIR}")
        return True
    except Exception as e:
        print(f"Roboflow download failed: {e}")
        return False


def create_sample_dataset():
    """
    Creates a minimal sample dataset structure for testing.
    In production, replace this with a real dataset download.
    
    For actual training, download one of these datasets:
    1. Kaggle: 'food-detection-yolov12' 
    2. Roboflow: 'food-detection' (12 classes)
    3. Ultralytics built-in datasets
    
    Place images in datasets/food_data/train/images/ and labels in datasets/food_data/train/labels/
    """
    os.makedirs(os.path.join(DATASET_DIR, "train", "images"), exist_ok=True)
    os.makedirs(os.path.join(DATASET_DIR, "train", "labels"), exist_ok=True)
    os.makedirs(os.path.join(DATASET_DIR, "val", "images"), exist_ok=True)
    os.makedirs(os.path.join(DATASET_DIR, "val", "labels"), exist_ok=True)

    # Create data.yaml
    data_config = {
        "path": os.path.abspath(DATASET_DIR),
        "train": "train/images",
        "val": "val/images",
        "names": {
            0: "pizza",
            1: "burger",
            2: "salad",
            3: "rice",
            4: "pasta",
            5: "sandwich",
            6: "soup",
            7: "fruit",
            8: "vegetable",
            9: "egg",
            10: "chicken",
            11: "fish",
        }
    }

    yaml_path = os.path.join(DATASET_DIR, "data.yaml")
    with open(yaml_path, "w") as f:
        yaml.dump(data_config, f, default_flow_style=False)
    
    print(f"Dataset structure created at: {DATASET_DIR}")
    print(f"data.yaml created at: {yaml_path}")
    print()
    print("=" * 60)
    print("IMPORTANT: You need to add actual images and labels!")
    print("=" * 60)
    print()
    print("Options to get data:")
    print("1. Download from Kaggle: https://www.kaggle.com/datasets/")
    print("   Search for 'food detection YOLO format'")
    print("2. Download from Roboflow Universe (free, no API key):")
    print("   https://universe.roboflow.com/ - search 'food detection'")
    print("   Export in 'YOLOv8' format")
    print("3. Use Ultralytics built-in: modify train.py to use 'coco128.yaml'")
    print()
    print("Place files as:")
    print(f"  Images → {os.path.join(DATASET_DIR, 'train', 'images')}/")
    print(f"  Labels → {os.path.join(DATASET_DIR, 'train', 'labels')}/")
    
    return yaml_path


if __name__ == "__main__":
    print("GutSense Dataset Setup")
    print("=" * 40)
    
    yaml_path = create_sample_dataset()
    print(f"\nDataset config: {yaml_path}")
