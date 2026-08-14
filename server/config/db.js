const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const connectDB = async () => {
    try {
        const client = await pool.connect();

        console.log("✅ Supabase PostgreSQL Connected");

        client.release();
    } catch (error) {
        console.error("❌ Database Connection Error");
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = { pool, connectDB };