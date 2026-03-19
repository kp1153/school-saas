CREATE TABLE `fees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer,
	`amount` real NOT NULL,
	`due_date` integer NOT NULL,
	`paid_date` integer,
	`status` text DEFAULT 'pending',
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`class` text NOT NULL,
	`section` text,
	`roll_number` text,
	`parent_name` text,
	`parent_phone` text,
	`fee_status` text DEFAULT 'pending',
	`admission_date` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_roll_number_unique` ON `students` (`roll_number`);--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`subject` text NOT NULL,
	`qualification` text,
	`phone` text,
	`email` text,
	`joining_date` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
