CREATE TABLE `verifications` (
	`email` text PRIMARY KEY NOT NULL,
	`secret` text NOT NULL,
	`algorithm` text NOT NULL,
	`digits` integer NOT NULL,
	`period` integer NOT NULL,
	`char_set` text NOT NULL,
	`expires_at` integer NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT current_timestamp NOT NULL,
	`updated_at` integer DEFAULT current_timestamp NOT NULL
);
