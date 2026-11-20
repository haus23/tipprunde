ALTER TABLE `matches` ADD `result_entered_by` integer REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `matches` ADD `result_entered_at` text;--> statement-breakpoint
ALTER TABLE `matches` ADD `result_approved_by` integer REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `rounds` ADD `starts_at` text;--> statement-breakpoint
ALTER TABLE `sessions` ADD `user_agent` text;--> statement-breakpoint
ALTER TABLE `tips` ADD `updated_by` integer REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `tips` ADD `updated_at` text;--> statement-breakpoint
ALTER TABLE `users` ADD `can_enter_results` integer DEFAULT false NOT NULL;