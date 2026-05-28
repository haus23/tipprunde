CREATE TABLE `matches` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`round_id` integer NOT NULL,
	`nr` integer NOT NULL,
	`date` text,
	`league_id` text,
	`hometeam_id` text,
	`awayteam_id` text,
	`result` text,
	CONSTRAINT `fk_matches_round_id_rounds_id_fk` FOREIGN KEY (`round_id`) REFERENCES `rounds`(`id`),
	CONSTRAINT `fk_matches_league_id_leagues_id_fk` FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`),
	CONSTRAINT `fk_matches_hometeam_id_teams_id_fk` FOREIGN KEY (`hometeam_id`) REFERENCES `teams`(`id`),
	CONSTRAINT `fk_matches_awayteam_id_teams_id_fk` FOREIGN KEY (`awayteam_id`) REFERENCES `teams`(`id`)
);
--> statement-breakpoint
CREATE TABLE `rounds` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`championship_id` integer NOT NULL,
	`nr` integer NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`tips_published` integer DEFAULT false NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`is_double_round` integer,
	CONSTRAINT `fk_rounds_championship_id_championships_id_fk` FOREIGN KEY (`championship_id`) REFERENCES `championships`(`id`),
	CONSTRAINT `rounds_championship_id_nr_unique` UNIQUE(`championship_id`,`nr`)
);
