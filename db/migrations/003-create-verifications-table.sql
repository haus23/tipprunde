-- Create verifications table
CREATE TABLE verifications (
  user_id INTEGER NOT NULL,
  method TEXT NOT NULL CHECK(method IN ('email', 'phone')),
  target TEXT NOT NULL,
  secret TEXT NOT NULL,
  algorithm TEXT NOT NULL,
  digits INTEGER NOT NULL,
  period INTEGER NOT NULL,
  char_set TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, method),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on expires_at for cleanup queries
CREATE INDEX idx_verifications_expires_at ON verifications(expires_at);

-- Create index on target for lookups
CREATE INDEX idx_verifications_target ON verifications(target);

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_verifications_updated_at
AFTER UPDATE ON verifications
FOR EACH ROW
BEGIN
  UPDATE verifications SET updated_at = CURRENT_TIMESTAMP WHERE user_id = OLD.user_id AND method = OLD.method;
END;
