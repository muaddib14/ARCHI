import { db } from '../src/lib/db';

async function testDatabase() {
  console.log('🧪 Testing Neon Database Connection...\n');

  try {
    // Test 1: Connection
    console.log('1️⃣ Testing connection...');
    const result = await db.query('SELECT NOW()');
    console.log('✅ Connection OK:', result[0]);

    // Test 2: Tables exist
    console.log('\n2️⃣ Checking tables...');
    const tables = await db.query(
      `SELECT tablename FROM pg_tables WHERE schemaname='public'`
    );
    console.log('✅ Tables found:', tables.map((t: any) => t.tablename));

    // Test 3: Schema
    console.log('\n3️⃣ Checking schema...');
    const agents = await db.query('SELECT COUNT(*) as count FROM agents');
    console.log('✅ Agents table:', agents[0]);

    console.log('\n✅ Database is ready!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
