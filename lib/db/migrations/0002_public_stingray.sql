ALTER TABLE "resources" ADD COLUMN "title" varchar(500);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "source" varchar(500);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "confidentiality" varchar(50);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "policy_type" varchar(100);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "effective_date" timestamp;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "audience" varchar(200);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "region" varchar(100);