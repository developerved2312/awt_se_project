"""
HaritAyan AI - Gemini Multimodal Client
Orchestrates foliar image analysis using Google's Gemini 3.8 Flash Vision Model.
"""

import os
import io
import base64
from typing import Optional, Dict, Any
from .prompts import AGRO_DIAGNOSTIC_SYSTEM_PROMPT
from .response_parser import parse_diagnostic_response

class HaritAyanGeminiClient:
    """
    Multimodal Vision AI Client for HaritAyan Plant Pathology.
    Connects to Gemini 3.8 Flash API with fallback safety.
    """

    def __init__(self, api_key: Optional[str] = None, model_name: str = "gemini-3.8-flash"):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", model_name)

    def diagnose_crop_image(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> Dict[str, Any]:
        """
        Submits image bytes to Gemini Vision model for comprehensive plant disease diagnostics.
        """
        if not self.api_key:
            return {
                "success": False,
                "error": "GEMINI_API_KEY is not configured in environment.",
                "source": "client_error"
            }

        try:
            # We import google.generativeai dynamically so module works even if SDK is installed lazily
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)

            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=AGRO_DIAGNOSTIC_SYSTEM_PROMPT,
                generation_config={
                    "temperature": 0.2,
                    "top_p": 0.85,
                    "response_mime_type": "application/json"
                }
            )

            image_part = {
                "mime_type": mime_type,
                "data": image_bytes
            }

            user_prompt = (
                "Diagnose this plant/crop leaf image. Return comprehensive disease diagnosis, "
                "pathogen identification, and biological/chemical protocols in English and Gujarati."
            )

            response = model.generate_content([image_part, user_prompt])
            parsed = parse_diagnostic_response(response.text)

            return {
                "success": True,
                "model": self.model_name,
                "data": parsed
            }

        except Exception as exc:
            return {
                "success": False,
                "error": str(exc),
                "model": self.model_name
            }
