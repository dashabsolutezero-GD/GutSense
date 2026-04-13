"""
GutSense — Food Dataset Downloader (Multi-Source Strategy)
Downloads and organizes food detection datasets for 89 classes.
Priority: Indian food datasets first, then global food coverage.

Dataset sources:
  1. Indian Food Detection — Roboflow Universe (Indian dishes)
  2. Food Detection — Roboflow Universe (global foods)
  3. Open Images v7 — Google (vegetables, fruits, proteins)
  4. Manual collection guide for missing classes

Usage:
    python download_dataset.py
"""
import os
import zipfile
import urllib.request
import shutil
import json

DATASET_DIR = os.path.join(os.path.dirname(__file__), "datasets", "food_data")

# ── Dataset Sources ──────────────────────────────────────────────────────────
# These are public Roboflow datasets. If direct download fails, use manual method.
DATASET_SOURCES = [
    {
        "name": "Indian Food Detection",
        "url": "https://universe.roboflow.com/indian-food-detection/indian-food-dataset",
        "classes": [
            "dal", "roti", "naan", "paratha", "dosa", "idli", "sambar",
            "biryani", "paneer", "curry", "raita", "pakora", "samosa",
            "pav-bhaji", "chole", "palak-paneer", "tandoori-chicken",
            "khichdi", "upma", "poha", "uttapam", "vada", "gulab-jamun",
            "jalebi", "kheer", "lassi",
        ],
        "format": "yolov8",
    },
    {
        "name": "Food Detection (Global)",
        "url": "https://universe.roboflow.com/food-detection/food-detection-yolov12",
        "classes": [
            "pizza", "burger", "salad", "rice", "pasta", "sandwich",
            "soup", "fruit", "vegetable", "egg", "chicken", "fish",
        ],
        "format": "yolov8",
    },
    {
        "name": "Fruits & Vegetables Detection",
        "url": "https://universe.roboflow.com/fruits-and-vegetables/fruits-vegetables-detection",
        "classes": [
            "apple", "banana", "orange", "mango", "grapes", "watermelon",
            "papaya", "pomegranate", "broccoli", "spinach", "carrot",
            "cucumber", "tomato", "potato", "cauliflower", "eggplant",
            "onion", "bell-pepper", "cabbage", "beans",
        ],
        "format": "yolov8",
    },
]


def check_dataset_exists() -> dict:
    """Return counts of existing train and val images."""
    train_imgs = os.path.join(DATASET_DIR, "train", "images")
    val_imgs = os.path.join(DATASET_DIR, "val", "images")
    train_count = len(os.listdir(train_imgs)) if os.path.exists(train_imgs) else 0
    val_count = len(os.listdir(val_imgs)) if os.path.exists(val_imgs) else 0
    print(f"Images found — train: {train_count}, val: {val_count}")
    return {"train": train_count, "val": val_count}


def ensure_dirs():
    """Create dataset directory structure."""
    for split in ("train", "val"):
        for kind in ("images", "labels"):
            os.makedirs(os.path.join(DATASET_DIR, split, kind), exist_ok=True)


def download_with_progress(url: str, dest: str):
    """Download a file and show progress."""
    def progress(block_num, block_size, total_size):
        downloaded = block_num * block_size
        pct = min(100, downloaded * 100 // total_size) if total_size > 0 else 0
        print(f"\r  Downloading... {pct}%", end="", flush=True)

    print(f"Fetching: {url}")
    urllib.request.urlretrieve(url, dest, reporthook=progress)
    print()


def try_download_roboflow(source: dict) -> bool:
    """
    Attempt to download a dataset from Roboflow Universe.
    Returns True on success.
    """
    zip_path = os.path.join(DATASET_DIR, "temp_dataset.zip")
    extract_dir = os.path.join(DATASET_DIR, "_extracted")

    # Try the download URL with YOLOv8 format
    download_url = source["url"] + "/dataset/1/download/yolov8"

    try:
        download_with_progress(download_url, zip_path)
        print("  Extracting...")
        with zipfile.ZipFile(zip_path, "r") as z:
            z.extractall(extract_dir)

        _merge_extracted(extract_dir)
        os.remove(zip_path)
        shutil.rmtree(extract_dir, ignore_errors=True)
        return True
    except Exception as e:
        print(f"  Auto-download failed: {e}")
        if os.path.exists(zip_path):
            os.remove(zip_path)
        if os.path.exists(extract_dir):
            shutil.rmtree(extract_dir, ignore_errors=True)

    return False


def _merge_extracted(extract_dir: str):
    """
    Merge images and labels from an extracted dataset into the main
    food_data/train/ and food_data/val/ directories.
    Handles Roboflow naming conventions (valid → val, test → val).
    """
    for split in ("train", "valid", "val", "test"):
        for kind in ("images", "labels"):
            src = os.path.join(extract_dir, split, kind)
            # Normalize: 'valid' and 'test' both go into 'val'
            dest_split = "val" if split in ("valid", "test") else split
            dest = os.path.join(DATASET_DIR, dest_split, kind)
            if os.path.exists(src):
                os.makedirs(dest, exist_ok=True)
                count = 0
                for f in os.listdir(src):
                    src_file = os.path.join(src, f)
                    dest_file = os.path.join(dest, f)
                    # Skip if file already exists (avoid overwriting from other datasets)
                    if not os.path.exists(dest_file):
                        shutil.copy2(src_file, dest_file)
                        count += 1
                if count > 0:
                    print(f"  Copied {count} files: {split}/{kind} → {dest_split}/{kind}")


def print_manual_instructions():
    """Print detailed manual download instructions for all dataset sources."""
    print("\n" + "=" * 70)
    print("  MANUAL DATASET DOWNLOAD INSTRUCTIONS")
    print("  GutSense needs images for 89 food classes (Indian + Global)")
    print("=" * 70)

    print("""
Auto-download requires a free Roboflow account. You can either:

  A) Use Roboflow (recommended — free account):
     1. Create account at https://roboflow.com (free tier works)
     2. Download each dataset below in YOLOv8 format

  B) Use Kaggle:
     1. Search for "Indian food detection YOLO" on kaggle.com
     2. Download in YOLO/VOC format and convert labels

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━""")

    for i, source in enumerate(DATASET_SOURCES, 1):
        classes_str = ", ".join(source["classes"][:8])
        if len(source["classes"]) > 8:
            classes_str += f", ... ({len(source['classes'])} total)"
        print(f"""
  SOURCE {i}: {source['name']}
  URL:     {source['url']}
  Classes: {classes_str}
  Format:  Download as → YOLOv8""")

    print(f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  AFTER DOWNLOADING, place files here:

  train images → {os.path.join(DATASET_DIR, "train", "images")}
  train labels → {os.path.join(DATASET_DIR, "train", "labels")}
  val images   → {os.path.join(DATASET_DIR, "val", "images")}
  val labels   → {os.path.join(DATASET_DIR, "val", "labels")}

  IMPORTANT: Label files (.txt) must use class IDs from data.yaml.
  If datasets use different class numbering, you'll need to remap them.
  Run: python remap_labels.py (coming soon) to auto-remap.

  Once placed, run: python train.py

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  TIPS FOR MISSING CLASSES:

  For classes not covered by any dataset (korma, tikka, khichdi, etc.):
  1. Use Roboflow to manually annotate ~50-100 images per class
  2. Use Google Images + a labeling tool (LabelImg, Roboflow Annotate)
  3. Start with fewer classes and expand over time

  Minimum recommended: ~100 images per class for decent accuracy
  Ideal: 300-500 images per class for production quality
""")
    print("=" * 70)


def print_dataset_summary():
    """Print summary of what's in the dataset directory."""
    print("\n── Dataset Summary ──")
    for split in ("train", "val"):
        img_dir = os.path.join(DATASET_DIR, split, "images")
        lbl_dir = os.path.join(DATASET_DIR, split, "labels")
        img_count = len(os.listdir(img_dir)) if os.path.exists(img_dir) else 0
        lbl_count = len(os.listdir(lbl_dir)) if os.path.exists(lbl_dir) else 0
        print(f"  {split}: {img_count} images, {lbl_count} labels")


if __name__ == "__main__":
    print("GutSense — Food Dataset Downloader")
    print("YOLO11m | 89 food classes | Indian-first + Global")
    print("=" * 50)

    ensure_dirs()
    counts = check_dataset_exists()

    if counts["train"] > 50 and counts["val"] > 10:
        print(f"\n✅ Dataset already populated!")
        print_dataset_summary()
        print("\nReady to train: python train.py")
    else:
        print("\nAttempting automatic download from Roboflow...")
        any_success = False

        for source in DATASET_SOURCES:
            print(f"\n── {source['name']} ──")
            if try_download_roboflow(source):
                any_success = True
                print(f"  ✅ {source['name']} downloaded!")
            else:
                print(f"  ⚠️  {source['name']} — manual download needed")

        counts = check_dataset_exists()
        if counts["train"] > 50:
            print(f"\n✅ Dataset ready!")
            print_dataset_summary()
            print("\nRun: python train.py")
        else:
            if any_success:
                print("\nPartial download succeeded. Some datasets need manual setup.")
            print_manual_instructions()
