-- Day 11: Basic database schema
-- Run: psql -U postgres -d human_ai_learning -f db/schema_day11.sql

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_conversations_created_at 
ON conversations(created_at DESC);

-- Comments
COMMENT ON TABLE conversations IS 'Day 11: Store basic chat conversations';
COMMENT ON COLUMN conversations.user_message IS 'User input text';
COMMENT ON COLUMN conversations.ai_response IS 'AI response from Groq';
COMMENT ON COLUMN conversations.created_at IS 'Message timestamp';

-- Success message
SELECT 'Day 11: Database schema created successfully!' as message;

