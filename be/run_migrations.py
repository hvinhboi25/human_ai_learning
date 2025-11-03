"""
Script to run database migrations
"""
import psycopg2
from pathlib import Path
from app.config import settings


def run_migrations():
    """Run all SQL migration files in order"""
    
    # Connect to database
    conn = psycopg2.connect(settings.database_url)
    cur = conn.cursor()
    
    try:
        # Get migration files
        migrations_dir = Path(__file__).parent.parent / "db" / "migrations"
        migration_files = sorted(migrations_dir.glob("*.sql"))
        
        print(f"Found {len(migration_files)} migration file(s)")
        
        for migration_file in migration_files:
            print(f"Running migration: {migration_file.name}")
            
            # Read and execute migration
            with open(migration_file, 'r', encoding='utf-8') as f:
                sql = f.read()
                cur.execute(sql)
            
            print(f"✓ Completed: {migration_file.name}")
        
        # Commit all changes
        conn.commit()
        print("\n✓ All migrations completed successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"\n✗ Migration failed: {str(e)}")
        raise
    
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    run_migrations()

