import type { Project, Chapter } from "../types";

interface Props {
  project: Project;
  selectedChapterId: number | null;
  onSelect: (chapter: Chapter) => void;
}

function ChapterList({ project, selectedChapterId, onSelect }: Props) {
  return (
    <div>
      <h2 className="panel-title">🧩 Kapitoly</h2>
      <p className="panel-subtitle">{project.title}</p>

      <div className="list-stack">
        {project.chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            className={`chapter-button ${selectedChapterId === chapter.id ? "is-active" : ""}`}
            onClick={() => onSelect(chapter)}
          >
            <span className="chapter-index">{index + 1}</span>
            <span>{chapter.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
