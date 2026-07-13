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

    def check_connection(self) -> dict[str, str | bool]:
        try:
            response = requests.get(
                f"{settings.ollama_url}/api/tags",
                timeout=15,
            )
            response.raise_for_status()

            data = response.json()
            models = [model.get("name", "") for model in data.get("models", [])]
            has_model = any(settings.ollama_model in name for name in models)

            if has_model:
                message = f"Ollama dostupná a model {settings.ollama_model} je pripravený"
            else:
                message = (
                    "Ollama je dostupná, ale model nie je stiahnutý. "
                    f"Spusti: ollama pull {settings.ollama_model}"
                )

            return {
                "configured": True,
                "connected": has_model,
                "message": message,
            }
        except Exception as error:
            return {
                "configured": True,
                "connected": False,
                "message": f"Ollama chyba: {error}",
            }
