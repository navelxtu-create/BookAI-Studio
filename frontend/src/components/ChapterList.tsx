import type { Project, Chapter } from "../types";


interface Props {
  project: Project;
  onSelect: (chapter: Chapter) => void;
}


function ChapterList({
  project,
  onSelect
}: Props) {


  return (

    <div>

      <h2>
        📖 {project.title}
      </h2>


      <h3>
        Kapitoly:
      </h3>


      <ul>

        {
          project.chapters.map(chapter => (

            <li
              key={chapter.id}
              style={{
                cursor: "pointer",
                marginBottom: "8px"
              }}
              onClick={() => {
                onSelect(chapter);
              }}
            >

              📄 {chapter.title}

            </li>

          ))
        }

      </ul>


    </div>

  );

}


export default ChapterList;
