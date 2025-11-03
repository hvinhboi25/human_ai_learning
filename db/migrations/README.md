# Database Migrations

This directory contains SQL migration scripts for the PostgreSQL database.

## Running Migrations

### Method 1: Using psql command line

```bash
psql -U username -d human_ai_learning -f 001_conversations.sql
```

### Method 2: Using Python script

```bash
cd be
python run_migrations.py
```

### Method 3: Direct PostgreSQL connection

Connect to your PostgreSQL database and run the SQL files in order.

## Migration Files

- `001_conversations.sql` - Creates conversations and sessions tables with indexes and triggers

## Database Schema

### sessions table
- Stores conversation sessions
- Tracks message count and metadata
- Auto-updates timestamp on changes

### conversations table
- Stores individual messages
- Links to sessions via foreign key
- Stores both user and AI audio URLs
- Includes metadata field for extensibility

## Notes

- Migrations should be run in numerical order
- Each migration is idempotent (can be run multiple times safely)
- Foreign key constraints ensure data integrity
- Indexes are created for optimal query performance

