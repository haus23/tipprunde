CREATE TABLE `players` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`championship_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`nr` integer NOT NULL,
	CONSTRAINT `fk_players_championship_id_championships_id_fk` FOREIGN KEY (`championship_id`) REFERENCES `championships`(`id`),
	CONSTRAINT `fk_players_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `players_championship_id_user_id_unique` UNIQUE(`championship_id`,`user_id`)
);
