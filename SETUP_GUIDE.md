# Conversation Management Setup Guide

This guide explains how to set up and configure the conversation management system.

## Prerequisites

- Supabase account and project
- PostgreSQL database connection string
- Node.js and npm installed

## Step 1: Database Setup

### 1.1 Add Environment Variables

Add the following to your `.env` file (or create it if it doesn't exist):

```env
DATABASE_URL=postgresql://postgres.xayauswyapivqmzzlmnc:RepUm28VvIpkxfeK@aws-0-us-west-2.pooler.supabase.com:5432/postgres
```

### 1.2 Run Database Migration

You need to execute the SQL migration script in your Supabase database:

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `migrations/001_create_conversations.sql`
4. Paste and execute the SQL

**Option B: Using psql Command Line**

```bash
psql "postgresql://postgres.xayauswyapivqmzzlmnc:RepUm28VvIpkxfeK@aws-0-us-west-2.pooler.supabase.com:5432/postgres" -f migrations/001_create_conversations.sql
```

## Step 2: Verify Installation

### 2.1 Check Database Connection

The application will automatically test the database connection when starting the API routes.

### 2.2 Test API Endpoints

After starting your development server (`npm run dev`), you can test the endpoints:

**Create a conversation:**

```bash
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-session-1","userId":"99999999999","title":"Test conversation"}'
```

**List conversations:**

```bash
curl http://localhost:3000/api/conversations?userId=99999999999
```

## Step 3: How It Works

### Data Flow

1. **New Conversation:**

   - User opens chatbot → generates unique `sessionId`
   - User sends first message → creates conversation record in `conversations` table
   - n8n receives message → stores in `n8n_chat_histories` table

2. **Loading Previous Conversation:**

   - User clicks conversation in sidebar
   - Frontend queries `conversations` table by user ID
   - Retrieves `session_id` and queries `n8n_chat_histories`
   - Displays messages and continues using same `session_id`

3. **Multi-User Support:**
   - Each conversation is associated with `user_id` (CliCod)
   - Users only see their own conversations
   - n8n maintains conversation context using `session_id`

### Database Schema

**conversations table:**

- `id` - UUID primary key
- `session_id` - Unique session identifier (used by n8n)
- `user_id` - User identifier from CliCod
- `title` - Conversation title (from first message)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `is_active` - Soft delete flag

**n8n_chat_histories table (existing, managed by n8n):**

- `id` - Auto-increment ID
- `session_id` - Links to conversations table
- `message` - JSONB containing message data

## Troubleshooting

### Database Connection Errors

If you see connection errors, verify:

1. `DATABASE_URL` is correctly set in `.env`
2. Your IP is whitelisted in Supabase (check project settings)
3. The connection string has the correct password

### Conversations Not Loading

1. Check browser console for errors
2. Verify the migration script was executed successfully
3. Check API route logs for database query errors

### Messages Not Appearing

1. Verify n8n workflow is running
2. Check that `session_id` matches between `conversations` and `n8n_chat_histories`
3. Ensure n8n is correctly storing messages in the database

## Security Notes

⚠️ **Important:** The `.env` file contains sensitive credentials and should never be committed to version control. Make sure `.env` is in your `.gitignore` file.
