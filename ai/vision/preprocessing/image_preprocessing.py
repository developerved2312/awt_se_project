"""
HaritAyan AI - Foliar Image Preprocessing
Utilities for leaf normalization, EXIF auto-orientation, and lesion contrast enhancement.
"""

from typing import Tuple, Optional
import io

def preprocess_leaf_image(image_bytes: bytes, target_size: Tuple[int, int] = (640, 640)) -> bytes:
    """
    Standardizes foliar images before feeding into inference pipelines:
    - Auto-orients based on camera EXIF tags
    - Resizes to standard dimension while maintaining aspect ratio
    - Converts RGBA/Grayscale to standard 3-channel RGB
    """
    try:
        from PIL import Image, ImageOps

        image = Image.open(io.BytesIO(image_bytes))
        # Handle smartphone camera EXIF orientation
        image = ImageOps.exif_transpose(image)

        if image.mode != "RGB":
            image = image.convert("RGB")

        image = ImageOps.fit(image, target_size, method=Image.Resampling.LANCZOS)

        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=90)
        return buffer.getvalue()
    except Exception:
        # Fall back to original bytes if Pillow is absent or fails
        return image_bytes

def compute_green_leaf_index(rgb_array) -> float:
    """
    Computes normalized Excess Green Index: ExG = 2*G - R - B
    Used to distinguish green vegetation from soil, background, and hands.
    """
    import numpy as np
    r = rgb_array[:, :, 0].astype(float)
    g = rgb_array[:, :, 1].astype(float)
    b = rgb_array[:, :, 2].astype(float)
    exg = 2 * g - r - b
    return float(np.mean(exg > 20))
