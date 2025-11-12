-- Create users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'USER' CHECK(role IN ('USER', 'MANAGER', 'ADMIN')),
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on slug for faster lookups
CREATE INDEX idx_users_slug ON users(slug);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create trigger to automatically update updatedAt timestamp
CREATE TRIGGER update_users_updatedAt
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
