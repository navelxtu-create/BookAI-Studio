from app.providers.base import AIProvider


class OllamaProvider(AIProvider):

    def generate(
        self,
        prompt: str
    ) -> str:

        return f"Ollama odpoveď:\n\n{prompt}"
