-- Run this once against your database to create the push_subscriptions table.
-- You can run it via: psql $DATABASE_URL -f push_subscriptions_migration.sql

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint    TEXT    NOT NULL UNIQUE,
  p256dh      TEXT    NOT NULL,
  auth        TEXT    NOT NULL,
  timezone    TEXT    NOT NULL DEFAULT 'UTC',
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
