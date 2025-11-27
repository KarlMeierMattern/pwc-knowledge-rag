"use server";

import { DocumentInput } from "@/lib/types/document";
import { normalizeDocument } from "@/lib/utils/normalize";
import {
  createResourceFromDocument,
  createResourcesFromDocuments,
} from "./resources";

/**
 * Main ingestion function - normalizes input and creates resources
 * This is the entry point for all document ingestion
 */
export async function ingestDocument(
  input: DocumentInput,
  options?: { skipDuplicate?: boolean }
) {
  try {
    const documents = await normalizeDocument(input);

    if (documents.length === 1) {
      const result = await createResourceFromDocument(documents[0], options);
      return {
        success: true,
        message: result.skipped
          ? "Document already exists, skipped."
          : "Document successfully ingested and embedded.",
        resourceId: result.resourceId,
        skipped: result.skipped,
      };
    } else {
      const result = await createResourcesFromDocuments(documents, options);
      return {
        success: true,
        message: result.message,
        created: result.created,
        skipped: result.skipped,
        failed: result.failed,
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error && error.message.length > 0
          ? error.message
          : "Error ingesting document, please try again.",
    };
  }
}
