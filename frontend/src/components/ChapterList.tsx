import { useState } from "react";
import type { Project, Chapter } from "../types";
import ChapterView from "./ChapterView";


interface Props {
  project: Project;
  onSelect: (chapter: Chapter) => void;
}


function ChapterList({
  project,
  onSelect
}: Props) {


  const [selectedChapter, setSelectedChapter] =
    useState<Chapter | null>(null);



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
                setSelectedChapter(chapter);
                onSelect(chapter);
              }}
            >

              📄 {chapter.title}

            </li>

          ))
        }

      </ul>



      {
        selectedChapter && (

          <ChapterView
            chapter={selectedChapter}
          />

        )
      }


    </div>

  );

}


export default ChapterList;
