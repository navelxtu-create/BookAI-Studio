import api from "./api";


export async function generateChapter(
  title: string,
  instruction: string
) {

  const response = await api.post(
    "/ai/chapter",
    {
      title,
      instruction
    }
  );


  return response.data;

}
