CREATE TABLE `tips` (
	`match_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`tip` text,
	`points` integer,
	`joker` integer,
	CONSTRAINT `tips_pk` PRIMARY KEY(`match_id`, `user_id`),
	CONSTRAINT `fk_tips_match_id_matches_id_fk` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`),
	CONSTRAINT `fk_tips_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
