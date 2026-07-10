import type { Chapter } from "../types";
import { useState } from "react";
import { generateChapter } from "../services/ai";
import api from "../services/api";


interface Props {
  chapter: Chapter;
}


function ChapterView({
  chapter
}: Props) {


  const [content, setContent] =
    useState(chapter.content);


  const [loading, setLoading] =
    useState(false);



  async function extendChapter() {

    setLoading(true);
    
    console.log("Spúšťam AI pre kapitolu:", chapter);

    try {

      const result = await generateChapter(
        chapter.title,
        "Predĺž kapitolu a rozviň myšlienky."
      );


      setContent(result.content);


      await api.put(
        `/chapters/${chapter.id}`,
        {
          project_id: chapter.project_id,
          title: chapter.title,
          content: result.content
        }
      );





      console.log("Kapitola uložená");


    } catch(error) {

      console.error(
        "Chyba pri úprave kapitoly:",
        error
      );

    }


    setLoading(false);

  }



  return (

    <div
      style={{
        marginTop: "30px",
        padding: "20px",
        border: "1px solid #aaa",
        borderRadius: "10px"
      }}
    >

      <h2>
        📖 {chapter.title}
      </h2>


      <div
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.6"
        }}
      >
        {content}
      </div>



      <hr />



      <h3>
        🤖 AI nástroje
      </h3>



      <button
        onClick={extendChapter}
        disabled={loading}
      >

        {
          loading
            ? "AI píše..."
            : "Predĺžiť kapitolu"
        }

      </button>



      {" "}



      <button>
        Prepísať štýl
      </button>


    </div>

  );

}


export default ChapterView;
