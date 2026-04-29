CREATE TABLE `tips` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`match_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`tip` text,
	`points` integer,
	`joker` integer,
	CONSTRAINT `fk_tips_match_id_matches_id_fk` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`),
	CONSTRAINT `fk_tips_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `tips_match_id_user_id_unique` UNIQUE(`match_id`,`user_id`)
);
