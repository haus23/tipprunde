CREATE TABLE `championships` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`slug` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`nr` integer NOT NULL UNIQUE,
	`ruleset_id` text NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`extra_questions_published` integer DEFAULT false NOT NULL,
	CONSTRAINT `fk_championships_ruleset_id_rulesets_id_fk` FOREIGN KEY (`ruleset_id`) REFERENCES `rulesets`(`id`)
);
