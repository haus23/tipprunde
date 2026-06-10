ALTER TABLE `extra_points` RENAME TO `extra_answers`;--> statement-breakpoint
ALTER TABLE `extra_answers` ADD `answer` text;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_extra_answers` (
	`extra_question_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`answer` text,
	`points` real,
	CONSTRAINT `extra_points_pk` PRIMARY KEY(`extra_question_id`, `user_id`),
	CONSTRAINT `fk_extra_points_extra_question_id_extra_questions_id_fk` FOREIGN KEY (`extra_question_id`) REFERENCES `extra_questions`(`id`),
	CONSTRAINT `fk_extra_points_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_extra_answers`(`extra_question_id`, `user_id`, `points`) SELECT `extra_question_id`, `user_id`, `points` FROM `extra_answers`;--> statement-breakpoint
DROP TABLE `extra_answers`;--> statement-breakpoint
ALTER TABLE `__new_extra_answers` RENAME TO `extra_answers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;