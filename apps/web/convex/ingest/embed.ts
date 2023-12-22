import OpenAI from "openai";

export async function embedTexts(texts: string[]) {
  if (texts.length === 0) return [];
  const openai = new OpenAI();
  const { data } = await openai.embeddings.create({
    input: texts,
    model: "text-embedding-ada-002",
  });
  return data.map(({ embedding }) => embedding);
}

export async function embedText(text: string) {
  if (text.length === 0) return [];
  const openai = new OpenAI();
  const { data } = await openai.embeddings.create({
    input: text,
    model: "text-embedding-ada-002",
  });
  return data.map(({ embedding }) => embedding);
}
