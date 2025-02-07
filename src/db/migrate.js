const { drizzle } = require("drizzle-orm/postgres-js");
const { migrate } = require("drizzle-orm/postgres-js/migrator");
const postgres = require("postgres");
require('dotenv').config();

const runMigration = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  let sql;
  try {
    sql = postgres(databaseUrl, { 
      max: 1,
      ssl: process.env.NODE_ENV === 'production',
    });

    const db = drizzle(sql);
    console.log('Starting database migration...');
    
    await migrate(db, { 
      migrationsFolder: "drizzle",
      migrationsTable: "migrations" 
    });
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  } finally {
    if (sql) {
      await sql.end();
      console.log('Database connection closed');
    }
  }
};

(async () => {
  try {
    await runMigration();
    process.exit(0);
  } catch (error) {
    console.error('Migration script failed:', error);
    process.exit(1);
  }
})();
