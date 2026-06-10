CREATE TABLE `extra_points` (
	`extra_question_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`points` real NOT NULL,
	CONSTRAINT `extra_points_pk` PRIMARY KEY(`extra_question_id`, `user_id`),
	CONSTRAINT `fk_extra_points_extra_question_id_extra_questions_id_fk` FOREIGN KEY (`extra_question_id`) REFERENCES `extra_questions`(`id`),
	CONSTRAINT `fk_extra_points_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `extra_questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`championship_id` integer NOT NULL,
	`question` text NOT NULL,
	`description` text NOT NULL,
	`answer` text,
	CONSTRAINT `fk_extra_questions_championship_id_championships_id_fk` FOREIGN KEY (`championship_id`) REFERENCES `championships`(`id`)
);
