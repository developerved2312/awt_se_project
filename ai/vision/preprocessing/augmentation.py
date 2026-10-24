"""
HaritAyan AI - Foliar Data Augmentation
Pipelines for crop disease model training, cross-validation, and benchmarking.
"""

from typing import List, Any

class FoliarAugmentationPipeline:
    """
    Standard agricultural image augmentation policies simulating varying
    field lighting, camera angles, and outdoor weather conditions.
    """

    def __init__(self, rotation_range: int = 30, horizontal_flip: bool = True):
        self.rotation_range = rotation_range
        self.horizontal_flip = horizontal_flip

    def apply(self, pil_image) -> List[Any]:
        """Generates augmented variants of an input foliar image."""
        variants = [pil_image]
        try:
            from PIL import ImageEnhance

            # 1. Horizontal Flip (simulating opposite leaf surface)
            if self.horizontal_flip:
                variants.append(pil_image.transpose(0))

            # 2. Lighting shift (harsh Vadodara noon sun vs overcast monsoon)
            enhancer = ImageEnhance.Brightness(pil_image)
            variants.append(enhancer.enhance(1.25))
            variants.append(enhancer.enhance(0.85))

            # 3. Slight rotation
            variants.append(pil_image.rotate(15))
            variants.append(pil_image.rotate(-15))
        except Exception:
            pass

        return variants
