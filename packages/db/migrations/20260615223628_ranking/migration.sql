ALTER TABLE `championships` RENAME COLUMN `extra_questions_published` TO `extra_question_points_published`;--> statement-breakpoint
ALTER TABLE `players` ADD `rank` integer;--> statement-breakpoint
ALTER TABLE `players` ADD `tip_points` integer;--> statement-breakpoint
ALTER TABLE `players` ADD `extra_question_points` integer;--> statement-breakpoint
ALTER TABLE `players` ADD `round_points` integer;--> statement-breakpoint
ALTER TABLE `players` ADD `total` integer;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_rounds` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`championship_id` integer NOT NULL,
	`nr` integer NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`tips_published` integer DEFAULT false NOT NULL,
	`completed` integer,
	`is_double_round` integer,
	CONSTRAINT `fk_rounds_championship_id_championships_id_fk` FOREIGN KEY (`championship_id`) REFERENCES `championships`(`id`),
	CONSTRAINT `rounds_championship_id_nr_unique` UNIQUE(`championship_id`,`nr`)
);
--> statement-breakpoint
INSERT INTO `__new_rounds`(`id`, `championship_id`, `nr`, `published`, `tips_published`, `completed`, `is_double_round`) SELECT `id`, `championship_id`, `nr`, `published`, `tips_published`, `completed`, `is_double_round` FROM `rounds`;--> statement-breakpoint
DROP TABLE `rounds`;--> statement-breakpoint
ALTER TABLE `__new_rounds` RENAME TO `rounds`;--> statement-breakpoint
PRAGMA foreign_keys=ON;