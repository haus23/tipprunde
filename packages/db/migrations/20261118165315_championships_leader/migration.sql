ALTER TABLE `championships` ADD `leader_id` integer REFERENCES users(id);
--> statement-breakpoint
-- Hand-added: every championship so far was run by Wolfgang. Resolved by slug,
-- not by id, so the same statement fits dev and prod. New championships get
-- their leader from the manager form, which requires one.
UPDATE `championships` SET `leader_id` = (SELECT `id` FROM `users` WHERE `slug` = 'wolfgang') WHERE `leader_id` IS NULL;
