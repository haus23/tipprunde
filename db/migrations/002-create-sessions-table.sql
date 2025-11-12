-- Create sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  expiresAt TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  userId INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on userId for faster lookups
CREATE INDEX idx_sessions_userId ON sessions(userId);

-- Create index on expiresAt for cleanup queries
CREATE INDEX idx_sessions_expiresAt ON sessions(expiresAt);

-- Create trigger to automatically update updatedAt timestamp
CREATE TRIGGER update_sessions_updatedAt
AFTER UPDATE ON sessions
FOR EACH ROW
BEGIN
  UPDATE sessions SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
