/**
 * Seed script to populate database with priority-clients and industry-leads data
 *
 * Run with: tsx lib/db/seed.ts
 */

import { priorityClients } from "@/data/priority-clients";
import { industryLeads } from "@/data/industry-leads";
import { ingestDocument } from "../actions/ingest";

async function seed() {
  console.log("=== Seeding Database ===\n");

  // Seed priority-clients
  console.log("1. Seeding priority-clients...");
  try {
    const result = await ingestDocument(
      {
        type: "json",
        data: priorityClients,
        metadata: {
          title: "Priority Clients Database",
          source: "priority-clients.ts",
        },
      },
      { skipDuplicate: true }
    );

    if (result.success) {
      console.log(`✅ ${result.message}`);
      if ("created" in result) {
        console.log(
          `   Created: ${result.created}, Skipped: ${
            result.skipped || 0
          }, Failed: ${result.failed}`
        );
      } else {
        console.log(`   Resource ID: ${result.resourceId}`);
        if (result.skipped) {
          console.log(`   ⚠️  Skipped (already exists)`);
        }
      }
    } else {
      console.error(`❌ Failed: ${result.message}`);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("❌ Error seeding priority-clients:", error);
    throw error;
  }

  console.log("\n2. Seeding industry-leads...");
  try {
    const result = await ingestDocument(
      {
        type: "json",
        data: industryLeads,
        metadata: {
          title: "Industry Leads Database",
          source: "industry-leads.ts",
        },
      },
      { skipDuplicate: true }
    );

    if (result.success) {
      console.log(`✅ ${result.message}`);
      if ("created" in result) {
        console.log(
          `   Created: ${result.created}, Skipped: ${
            result.skipped || 0
          }, Failed: ${result.failed}`
        );
      } else {
        console.log(`   Resource ID: ${result.resourceId}`);
        if (result.skipped) {
          console.log(`   ⚠️  Skipped (already exists)`);
        }
      }
    } else {
      console.error(`❌ Failed: ${result.message}`);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("❌ Error seeding industry-leads:", error);
    throw error;
  }

  console.log("\n=== Seed Complete ===");
  console.log("✅ All datasets seeded successfully");
  console.log("✅ Duplicate prevention enabled - safe to rerun");
}

// Run seed
seed()
  .then(() => {
    console.log("\n✅ Seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });
