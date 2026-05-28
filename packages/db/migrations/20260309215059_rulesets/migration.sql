CREATE TABLE `rulesets` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`tip_rule_id` text NOT NULL,
	`joker_rule_id` text NOT NULL,
	`match_rule_id` text NOT NULL,
	`round_rule_id` text NOT NULL,
	`extra_question_rule_id` text NOT NULL
);
