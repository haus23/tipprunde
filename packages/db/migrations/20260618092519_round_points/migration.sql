CREATE TABLE `round_points` (
	`round_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`points` integer NOT NULL,
	CONSTRAINT `round_points_pk` PRIMARY KEY(`round_id`, `user_id`),
	CONSTRAINT `fk_round_points_round_id_rounds_id_fk` FOREIGN KEY (`round_id`) REFERENCES `rounds`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_round_points_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
