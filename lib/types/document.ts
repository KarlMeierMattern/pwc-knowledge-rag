import { z } from "zod";

/**
 * Canonical Document type that normalizes all input formats
 * This is what we store in the database after parsing various file types
 */
export const documentSchema = z.object({
  content: z.string().min(1),
  title: z.string().optional(),
  source: z.string().optional(),
});

export type Document = z.infer<typeof documentSchema>;

/**
 * Input types we support for ingestion
 */
export type DocumentInput =
  | { type: "text"; content: string; metadata?: Partial<Document> }
  | { type: "json"; data: unknown; metadata?: Partial<Document> }
  | { type: "csv"; data: string; metadata?: Partial<Document> }
  | { type: "file"; file: File; metadata?: Partial<Document> };
