from app.providers.factory import get_provider


class AIWriter:

    def __init__(self):
        self.provider = get_provider()


    def create_outline(self, topic: str):

        prompt = (
            f"Vytvor osnovu knihy na tému: {topic}. "
            "Vráť názov knihy a zoznam kapitol."
        )

        return {
            "title": topic,
            "chapters": [
                "Úvod",
                "Hlavná myšlienka",
                "Rozvinutie témy",
                "Záver"
            ],
            "provider": self.provider.__class__.__name__
        }


    def write_chapter(
        self,
        title: str,
        instruction: str
    ):

        prompt = (
            f"Napíš kapitolu s názvom: {title}\n\n"
            f"Pokyny: {instruction}"
        )

        return self.provider.generate(prompt)


writer = AIWriter()
