import { Document, DocumentInput, documentSchema } from "@/lib/types/document";

/**
 * Normalizes structured JSON data into Document format
 * Generic approach: converts each row to natural language for embedding
 * Works with any JSON structure - no field name assumptions
 */
export function normalizeJson(
  data: unknown,
  metadata?: Partial<Document>
): Document[] {
  if (!Array.isArray(data)) {
    throw new Error("JSON data must be an array of objects");
  }

  return data.map((row, index) => {
    if (typeof row !== "object" || row === null) {
      throw new Error(`Row ${index} must be an object`);
    }

    const rowObj = row as Record<string, unknown>;

    // Convert all fields to natural language format
    // Format: "field1: value1, field2: value2, ..."
    // This works for any structure - embeddings will handle semantic matching
    const fields = Object.entries(rowObj)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    // Include JSON for structured queries, plus natural language for semantic search
    const content = `${fields}. ${JSON.stringify(rowObj)}`;

    // Use first non-empty string field as title, or fallback
    const titleField = Object.entries(rowObj).find(
      ([, value]) => typeof value === "string" && value.length > 0
    );
    const title = titleField
      ? String(titleField[1])
      : metadata?.title || `Row ${index + 1}`;

    return documentSchema.parse({
      content,
      title,
      source: metadata?.source || "json-import",
      ...metadata,
    });
  });
}

/**
 * Normalizes CSV data into Document format
 * Each row becomes a separate document with natural language summary
 */
export function normalizeCsv(
  csvText: string,
  metadata?: Partial<Document>
): Document[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header and one data row");
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const documents: Document[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length !== headers.length) {
      continue; // Skip malformed rows
    }

    // Create object from row
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx];
    });

    // Generate natural language summary
    const summary = headers
      .map((header) => `${header}: ${row[header]}`)
      .join(", ");

    documents.push(
      documentSchema.parse({
        content: `${JSON.stringify(row)}. ${summary}.`,
        title: metadata?.title || `Row ${i}`,
        source: metadata?.source || "csv-import",
        ...metadata,
      })
    );
  }

  return documents;
}

/**
 * Normalizes plain text into Document format
 */
export function normalizeText(
  text: string,
  metadata?: Partial<Document>
): Document {
  return documentSchema.parse({
    content: text,
    title: metadata?.title || "Untitled Document",
    source: metadata?.source || "text-import",
    ...metadata,
  });
}

/**
 * Main normalization function - routes to appropriate parser based on input type
 */
export async function normalizeDocument(
  input: DocumentInput
): Promise<Document[]> {
  switch (input.type) {
    case "text":
      return [normalizeText(input.content, input.metadata)];

    case "json":
      return normalizeJson(input.data, input.metadata);

    case "csv":
      return normalizeCsv(input.data, input.metadata);

    case "file":
      // TODO: Add DOCX/PDF parsing
      const text = await input.file.text();
      return [
        normalizeText(text, { ...input.metadata, source: input.file.name }),
      ];

    default:
      throw new Error(
        `Unsupported input type: ${(input as DocumentInput).type}`
      );
  }
}
