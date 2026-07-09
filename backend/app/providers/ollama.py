import requests

from app.providers.base import AIProvider
from app.core.config import settings


class OllamaProvider(AIProvider):

    def generate(self, prompt: str) -> str:

        response = requests.post(
            f"{settings.ollama_url}/api/generate",
            json={
                "model": settings.ollama_model,
                "prompt": prompt,
                "stream": False,
            },
            timeout=300,
        )

        response.raise_for_status()

        return response.json()["response"]
