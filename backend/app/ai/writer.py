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
        instruction: str,
        style: str = "literárny",
        tone: str = "pútavý"
    ):

        prompt = (
            "Napíš kapitolu knihy.\n\n"
            f"Názov kapitoly: {title}\n\n"
            f"Štýl písania: {style}\n"
            f"Tón textu: {tone}\n\n"
            f"Pokyny autora:\n{instruction}\n\n"
            "Text má byť vhodný pre skutočnú knihu."
        )

        return self.provider.generate(prompt)


writer = AIWriter()
