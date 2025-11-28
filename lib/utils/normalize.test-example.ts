/**
 * Example usage of normalization functions
 * This file demonstrates how to use the normalization system
 *
 * To test: import and call these functions in your code
 */

import { priorityClients } from "@/data/priority-clients";
import { industryLeads } from "@/data/industry-leads";
import { normalizeJson, normalizeCsv, normalizeText } from "./normalize";

// Example 1: Normalize priority-clients JSON data
export function exampleNormalizePriorityClients() {
  const documents = normalizeJson(priorityClients, {
    title: "Priority Clients Database",
    source: "priority-clients.ts",
  });

  console.log(`Created ${documents.length} documents from priority clients`);

  // Example: Find Remgro document
  const remgroDoc = documents.find((doc) => doc.content.includes("Remgro"));

  if (remgroDoc) {
    console.log("Remgro document:", remgroDoc.content);
    // This should contain: "partner: Tertius van Dijk"
  }

  return documents;
}

// Example 2: Normalize industry-leads JSON data (different structure)
export function exampleNormalizeIndustryLeads() {
  const documents = normalizeJson(industryLeads, {
    title: "Industry Leads Database",
    source: "industry-leads.ts",
  });

  console.log(`Created ${documents.length} documents from industry leads`);

  // Example: Find Tertius van Dijk document
  const tertiusDoc = documents.find((doc) =>
    doc.content.includes("Tertius van Dijk")
  );

  if (tertiusDoc) {
    console.log("Tertius van Dijk document:", tertiusDoc.content);
    // Should contain: "partner: Tertius van Dijk, industry: CIPS"
  }

  return documents;
}

// Example 3: Normalize CSV data
export function exampleNormalizeCsv() {
  const csvData = `name,industry,partner
Remgro,CIPS,Tertius van Dijk
Sasol,EU&R,Johan Schutte`;

  const documents = normalizeCsv(csvData, {
    title: "Client List",
    source: "clients.csv",
  });

  console.log("   First document:", documents[0]?.content.substring(0, 100));

  return documents;
}

// Example 4: Normalize plain text
export function exampleNormalizeText() {
  const document = normalizeText(
    "This is a company policy about leave. Employees get 20 days annual leave.",
    {
      title: "Leave Policy",
    }
  );

  return document;
}

// Run examples when executed directly
async function runExamples() {
  console.log("");
  console.log("=== Testing Normalization Functions ===\n");

  console.log("1. Testing priority-clients JSON normalization:");
  console.log(
    "   Structure: priority_account, industry, partner, priority, type"
  );
  try {
    const docs = exampleNormalizePriorityClients();
    console.log(`✅ Created ${docs.length} documents`);
    console.log("");
  } catch (error) {
    console.error("❌ Error:", error);
  }

  console.log("2. Testing industry-leads JSON normalization:");
  console.log("   Structure: partner, industry, subIndustry");
  try {
    const leadsDocs = exampleNormalizeIndustryLeads();
    console.log(`✅ Created ${leadsDocs.length} documents`);
    console.log("");
  } catch (error) {
    console.error("❌ Error:", error);
  }

  console.log("3. Testing CSV normalization:");
  try {
    const csvDocs = exampleNormalizeCsv();
    console.log(`✅ Created ${csvDocs.length} documents`);
    console.log("");
  } catch (error) {
    console.error("❌ Error:", error);
  }

  console.log("4. Testing text normalization:");
  try {
    const textDoc = exampleNormalizeText();
    console.log(
      "✅ Created document:",
      textDoc.content.substring(0, 50) + "...\n"
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run if this file is executed directly
runExamples();
