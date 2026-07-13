from app.core.config import settings
from app.providers.factory import get_provider_chain


class AIWriter:

    def __init__(self):
        self.providers = get_provider_chain()
        self.provider = self.providers[0]

    def refresh_provider(self):
        self.providers = get_provider_chain()
        self.provider = self.providers[0]


    def create_outline(
        self,
        topic: str,
        chapter_count: int = 6,
        genre: str = "román",
        tone: str = "pútavý",
    ):

        safe_chapter_count = max(3, min(chapter_count, 20))

        base_titles = [
            "Prológ",
            "Začiatok cesty",
            "Prvé konflikty",
            "Bod zlomu",
            "Temná noc duše",
            "Nová nádej",
            "Vyvrcholenie",
            "Rozuzlenie",
            "Epilóg",
        ]

        chapters: list[str] = []
        for index in range(safe_chapter_count):
            if index < len(base_titles):
                chapters.append(base_titles[index])
            else:
                chapters.append(f"Kapitola {index + 1}")

        title = f"{topic} ({genre})"

        return {
            "title": title,
            "chapters": chapters,
            "provider": self.provider.__class__.__name__,
            "tone": tone,
            "genre": genre,
        }


    def write_chapter(
        self,
        title: str,
        instruction: str,
        style: str = "literárny",
        tone: str = "pútavý"
    ):

        prompt = (
            "Napíš kapitolu knihy v slovenčine.\n\n"
            f"Názov kapitoly: {title}\n\n"
            f"Štýl písania: {style}\n"
            f"Tón textu: {tone}\n\n"
            f"Pokyny autora:\n{instruction}\n\n"
            "Text má byť vhodný pre skutočnú knihu, mať plynulý dej a dobré prechody medzi odsekmi."
        )

        errors: list[str] = []

        for provider in self.providers:
            try:
                result = provider.generate(prompt)
                self.provider = provider
                return result
            except Exception as error:
                errors.append(f"{provider.__class__.__name__}: {error}")

        raise RuntimeError(" ; ".join(errors))

    def get_provider_status(self):
        active_status = self.provider.check_connection()
        chain_status = []

        for provider in self.providers:
            status = provider.check_connection()
            status["provider_class"] = provider.__class__.__name__
            chain_status.append(status)

        active_status["provider"] = settings.ai_provider
        active_status["active_provider_class"] = self.provider.__class__.__name__
        active_status["provider_chain"] = chain_status
        active_status["openai_model"] = settings.openai_model
        active_status["ollama_model"] = settings.ollama_model
        active_status["ollama_url"] = settings.ollama_url

        return active_status


writer = AIWriter()
