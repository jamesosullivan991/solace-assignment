CREATE TABLE IF NOT EXISTS "advocates" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"degree" varchar(200) NOT NULL,
	"specialties" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"years_of_experience" integer NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "advocates_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "advocates" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "city_idx" ON "advocates" USING btree ("city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_search_idx" ON "advocates" USING btree (to_tsvector('english', first_name || ' ' || last_name));