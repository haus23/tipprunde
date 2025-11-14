-- Tipprunde Core Tables Migration
-- Creates all tables for the tipping system

-- Rules Configuration
CREATE TABLE rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  tipRuleId TEXT NOT NULL,
  jokerRuleId TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER rules_updated_at
AFTER UPDATE ON rules
BEGIN
  UPDATE rules SET updatedAt = datetime('now') WHERE id = NEW.id;
END;

-- Leagues (Master Data)
CREATE TABLE leagues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  shortname TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER leagues_updated_at
AFTER UPDATE ON leagues
BEGIN
  UPDATE leagues SET updatedAt = datetime('now') WHERE id = NEW.id;
END;

-- Teams (Master Data)
CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  shortname TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER teams_updated_at
AFTER UPDATE ON teams
BEGIN
  UPDATE teams SET updatedAt = datetime('now') WHERE id = NEW.id;
END;

-- Championships
CREATE TABLE championships (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nr INTEGER NOT NULL,
  ruleId TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  extraPointsPublished INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (ruleId) REFERENCES rules(id)
);

CREATE TRIGGER championships_updated_at
AFTER UPDATE ON championships
BEGIN
  UPDATE championships SET updatedAt = datetime('now') WHERE id = NEW.id;
END;

-- Rounds
CREATE TABLE rounds (
  id INTEGER PRIMARY KEY,
  nr INTEGER NOT NULL,
  championshipId TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (championshipId) REFERENCES championships(id)
);

CREATE TRIGGER rounds_updated_at
AFTER UPDATE ON rounds
BEGIN
  UPDATE rounds SET updatedAt = datetime('now') WHERE id = NEW.id;
END;

-- Matches
CREATE TABLE matches (
  id INTEGER PRIMARY KEY,
  nr INTEGER NOT NULL,
  roundId INTEGER NOT NULL,
  hometeamId TEXT,
  awayteamId TEXT,
  leagueId TEXT,
  date TEXT,
  homegoals INTEGER,
  awaygoals INTEGER,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (roundId) REFERENCES rounds(id),
  FOREIGN KEY (hometeamId) REFERENCES teams(id),
  FOREIGN KEY (awayteamId) REFERENCES teams(id),
  FOREIGN KEY (leagueId) REFERENCES leagues(id)
);

CREATE TRIGGER matches_updated_at
AFTER UPDATE ON matches
BEGIN
  UPDATE matches SET updatedAt = datetime('now') WHERE id = NEW.id;
END;

-- Players (Users participating in Championships)
CREATE TABLE players (
  userId INTEGER NOT NULL,
  championshipId TEXT NOT NULL,
  tipPoints INTEGER NOT NULL DEFAULT 0,
  totalPoints INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (userId, championshipId),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (championshipId) REFERENCES championships(id)
);

CREATE TRIGGER players_updated_at
AFTER UPDATE ON players
BEGIN
  UPDATE players SET updatedAt = datetime('now')
  WHERE userId = NEW.userId AND championshipId = NEW.championshipId;
END;

-- Tips
CREATE TABLE tips (
  userId INTEGER NOT NULL,
  championshipId TEXT NOT NULL,
  matchId INTEGER NOT NULL,
  homegoals INTEGER,
  awaygoals INTEGER,
  joker INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (userId, championshipId, matchId),
  FOREIGN KEY (userId, championshipId) REFERENCES players(userId, championshipId),
  FOREIGN KEY (matchId) REFERENCES matches(id)
);

CREATE TRIGGER tips_updated_at
AFTER UPDATE ON tips
BEGIN
  UPDATE tips SET updatedAt = datetime('now')
  WHERE userId = NEW.userId
    AND championshipId = NEW.championshipId
    AND matchId = NEW.matchId;
END;

-- Indexes for Performance
CREATE INDEX idx_rounds_championship ON rounds(championshipId);
CREATE INDEX idx_matches_round ON matches(roundId);
CREATE INDEX idx_matches_hometeam ON matches(hometeamId);
CREATE INDEX idx_matches_awayteam ON matches(awayteamId);
CREATE INDEX idx_matches_league ON matches(leagueId);
CREATE INDEX idx_players_championship ON players(championshipId);
CREATE INDEX idx_tips_match ON tips(matchId);
CREATE INDEX idx_tips_player ON tips(userId, championshipId);
