import { useEffect, useState } from "react";
import type { Chapter } from "../types";
import { generateChapter } from "../services/ai";
import api from "../services/api";

interface Props {
  chapter: Chapter;
}

function ChapterView({ chapter }: Props) {
  const [content, setContent] = useState(chapter.content);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(chapter.content);
  }, [chapter.id, chapter.content]);

  async function extendChapter() {
    setLoading(true);

    try {
      const result = await generateChapter(
        chapter.title,
        "Predĺž kapitolu, rozviň myšlienky a udrž dejovú kontinuitu.",
      );

      setContent(result.content);

      await api.put(`/chapters/${chapter.id}`, {
        project_id: chapter.project_id,
        title: chapter.title,
        content: result.content,
      });
    } catch (error) {
      console.error("Chyba pri úprave kapitoly:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chapter-view">
      <div className="chapter-view-head">
        <h2>📖 {chapter.title}</h2>
      </div>

      <div className="chapter-content">{content}</div>

      <div className="chapter-tools">
        <span>🤖 AI nástroje</span>
        <div className="chapter-tools-actions">
          <button className="btn btn-primary" onClick={extendChapter} disabled={loading}>
            {loading ? "AI píše..." : "Predĺžiť kapitolu"}
          </button>
          <button className="btn" disabled>
            Prepísať štýl (čoskoro)
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChapterView;
