-- Create verifications table
CREATE TABLE verifications (
  userId INTEGER PRIMARY KEY,
  identifier TEXT NOT NULL,
  secret TEXT NOT NULL,
  algorithm TEXT NOT NULL,
  digits INTEGER NOT NULL,
  period INTEGER NOT NULL,
  charSet TEXT NOT NULL,
  expiresAt TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on expiresAt for cleanup queries
CREATE INDEX idx_verifications_expiresAt ON verifications(expiresAt);

-- Create index on identifier for lookups
CREATE INDEX idx_verifications_identifier ON verifications(identifier);

-- Create trigger to automatically update updatedAt timestamp
CREATE TRIGGER update_verifications_updatedAt
AFTER UPDATE ON verifications
FOR EACH ROW
BEGIN
  UPDATE verifications SET updatedAt = CURRENT_TIMESTAMP WHERE userId = OLD.userId;
END;
