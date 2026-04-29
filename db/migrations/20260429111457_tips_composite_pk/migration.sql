PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_players` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`championship_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`nr` integer NOT NULL,
	CONSTRAINT `fk_players_championship_id_championships_id_fk` FOREIGN KEY (`championship_id`) REFERENCES `championships`(`id`),
	CONSTRAINT `fk_players_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `players_championship_user_uniq` UNIQUE(`championship_id`,`user_id`)
);
--> statement-breakpoint
INSERT INTO `__new_players`(`id`, `championship_id`, `user_id`, `nr`) SELECT `id`, `championship_id`, `user_id`, `nr` FROM `players`;--> statement-breakpoint
DROP TABLE `players`;--> statement-breakpoint
ALTER TABLE `__new_players` RENAME TO `players`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_rounds` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`championship_id` integer NOT NULL,
	`nr` integer NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`tips_published` integer DEFAULT false NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`is_double_round` integer,
	CONSTRAINT `fk_rounds_championship_id_championships_id_fk` FOREIGN KEY (`championship_id`) REFERENCES `championships`(`id`),
	CONSTRAINT `rounds_championship_nr_uniq` UNIQUE(`championship_id`,`nr`)
);
--> statement-breakpoint
INSERT INTO `__new_rounds`(`id`, `championship_id`, `nr`, `published`, `tips_published`, `completed`, `is_double_round`) SELECT `id`, `championship_id`, `nr`, `published`, `tips_published`, `completed`, `is_double_round` FROM `rounds`;--> statement-breakpoint
DROP TABLE `rounds`;--> statement-breakpoint
ALTER TABLE `__new_rounds` RENAME TO `rounds`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tips` (
	`match_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`tip` text,
	`points` integer,
	`joker` integer,
	CONSTRAINT `tips_pk` PRIMARY KEY(`match_id`, `user_id`),
	CONSTRAINT `fk_tips_match_id_matches_id_fk` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`),
	CONSTRAINT `fk_tips_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_tips`(`match_id`, `user_id`, `tip`, `points`, `joker`) SELECT `match_id`, `user_id`, `tip`, `points`, `joker` FROM `tips`;--> statement-breakpoint
DROP TABLE `tips`;--> statement-breakpoint
ALTER TABLE `__new_tips` RENAME TO `tips`;--> statement-breakpoint
PRAGMA foreign_keys=ON;