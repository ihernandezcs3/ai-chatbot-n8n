-- Migration: Create conversations table for managing user chat sessions
-- This table complements n8n's n8n_chat_histories table without modifying it

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call the function
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE conversations IS 'Stores metadata about chat conversations/sessions for each user';
COMMENT ON COLUMN conversations.session_id IS 'Unique session identifier used by n8n chat memory';
COMMENT ON COLUMN conversations.user_id IS 'User identifier (CliCod from UserData)';
COMMENT ON COLUMN conversations.title IS 'Conversation title, typically from first user message';
