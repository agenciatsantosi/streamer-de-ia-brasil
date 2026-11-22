CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS avatars (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(100) NOT NULL,
 personality TEXT NOT NULL DEFAULT '',
 voice VARCHAR(100) NOT NULL DEFAULT 'pt-BR-AntonioNeural',
 active BOOLEAN NOT NULL DEFAULT false,
 cover_url TEXT,
 rest_video_url TEXT,
 talk_video_url TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS avatars_created_idx ON avatars(created_at DESC);
