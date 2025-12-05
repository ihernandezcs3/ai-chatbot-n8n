-- Migration: Create response_ratings table for RAG quality evaluation
-- This table stores user feedback on AI responses

-- Create response_ratings table
CREATE TABLE IF NOT EXISTS response_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  message_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  rating VARCHAR(20) NOT NULL CHECK (rating IN ('positive', 'negative')),
  feedback_text TEXT,
  message_content TEXT, -- Store the AI message that was rated
  user_question TEXT,   -- Store the user question that prompted the response
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate ratings on same message
  CONSTRAINT unique_message_rating UNIQUE (session_id, message_id, user_id)
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_ratings_session ON response_ratings(session_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON response_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_created ON response_ratings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_rating ON response_ratings(rating);

-- Add comments for documentation
COMMENT ON TABLE response_ratings IS 'Stores user feedback (thumbs up/down) on AI chat responses for RAG quality evaluation';
COMMENT ON COLUMN response_ratings.session_id IS 'Chat session identifier linking to conversations table';
COMMENT ON COLUMN response_ratings.message_id IS 'Unique identifier of the AI message being rated';
COMMENT ON COLUMN response_ratings.rating IS 'User rating: positive (thumbs up) or negative (thumbs down)';
COMMENT ON COLUMN response_ratings.message_content IS 'The AI response content that was rated';
COMMENT ON COLUMN response_ratings.user_question IS 'The user question that triggered the AI response';
