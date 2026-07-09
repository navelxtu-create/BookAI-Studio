from app.providers.base import AIProvider
from app.core.config import settings


class OllamaProvider(AIProvider):

    def generate(
        self,
        prompt: str
    ) -> str:

        return (
            f"Ollama model: {settings.ollama_model}\n\n"
            f"{prompt}"
        )
