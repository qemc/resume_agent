CREATE TABLE "contact_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"resume_lang" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"linkedin" text NOT NULL,
	"github" text NOT NULL,
	"website" text NOT NULL,
	"location" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"university" text NOT NULL,
	"degree" text NOT NULL,
	"resume_lang" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"current" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"resume_lang" text NOT NULL,
	"interest" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"resume_lang" text NOT NULL,
	"name" text NOT NULL,
	"level" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"resume_lang" text NOT NULL,
	"skill" text NOT NULL,
	"level" text,
	"category" text
);
--> statement-breakpoint
DROP TABLE "resumes" CASCADE;--> statement-breakpoint
TRUNCATE TABLE "certificates" CASCADE;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "certificate_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "issuer" text NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "issue_date" text NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "expiry_date" text NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "credential_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "url" text NOT NULL;--> statement-breakpoint
TRUNCATE TABLE "experiences" CASCADE;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "company" text NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "position" text NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "start_date" text NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "end_date" text NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "current" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
TRUNCATE TABLE "projects" CASCADE;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "project_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "url" text NOT NULL;--> statement-breakpoint
TRUNCATE TABLE "topics" CASCADE;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "topic_text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "topic_quotes" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_data" ADD CONSTRAINT "contact_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interests" ADD CONSTRAINT "interests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "languages" ADD CONSTRAINT "languages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" DROP COLUMN "certificate";--> statement-breakpoint
ALTER TABLE "experiences" DROP COLUMN "experience";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "project";--> statement-breakpoint
ALTER TABLE "topics" DROP COLUMN "topic";