import { embed, embedMany } from "ai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";
import { db } from "../db";

const embeddingModel = "openai/text-embedding-ada-002";

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

// generate multiple embeddings to store relevant content
export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ embedding: e, content: chunks[i] }));
};

// generate a single embedding of a query to find relevant content
export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddingsTable.embedding,
    userQueryEmbedded
  )})`;
  const similarGuides = await db
    .select({ name: embeddingsTable.content, similarity })
    .from(embeddingsTable)
    .where(gt(similarity, 0.3))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarGuides;
};
