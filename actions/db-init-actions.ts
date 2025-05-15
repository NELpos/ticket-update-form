"use server"

import { sql } from "@/db"

// Function to create all necessary tables
export async function createTables() {
  try {
    await sql`
      -- Create severity table
      CREATE TABLE IF NOT EXISTS severity (
        id SERIAL PRIMARY KEY,
        value VARCHAR(50) NOT NULL UNIQUE,
        label VARCHAR(50) NOT NULL
      );

      -- Create status table
      CREATE TABLE IF NOT EXISTS status (
        id SERIAL PRIMARY KEY,
        value VARCHAR(50) NOT NULL UNIQUE,
        label VARCHAR(50) NOT NULL
      );

      -- Create priority table
      CREATE TABLE IF NOT EXISTS priority (
        id SERIAL PRIMARY KEY,
        value VARCHAR(50) NOT NULL UNIQUE,
        label VARCHAR(50) NOT NULL
      );

      -- Create category table
      CREATE TABLE IF NOT EXISTS category (
        id SERIAL PRIMARY KEY,
        value VARCHAR(50) NOT NULL UNIQUE,
        label VARCHAR(50) NOT NULL
      );

      -- Create environment table
      CREATE TABLE IF NOT EXISTS environment (
        id SERIAL PRIMARY KEY,
        value VARCHAR(50) NOT NULL UNIQUE,
        label VARCHAR(50) NOT NULL
      );

      -- Create assignee table
      CREATE TABLE IF NOT EXISTS assignee (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );

      -- Create reporter table
      CREATE TABLE IF NOT EXISTS reporter (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );

      -- Create ticket table
      CREATE TABLE IF NOT EXISTS ticket (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(50) NOT NULL UNIQUE,
        name TEXT NOT NULL,
        severity VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        assignee VARCHAR(100) NOT NULL,
        priority VARCHAR(50) NOT NULL,
        due_date VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        environment VARCHAR(50) NOT NULL,
        estimated_time VARCHAR(50) NOT NULL,
        reporter VARCHAR(100) NOT NULL
      );
    `
    return { success: true, message: "Tables created successfully" }
  } catch (error) {
    console.error("Error creating tables:", error)
    return { success: false, message: `Error creating tables: ${error}` }
  }
}

// Function to seed the database with initial data
export async function seedDatabase() {
  try {
    // Seed severity options
    await sql`
      INSERT INTO severity (value, label)
      VALUES 
        ('낮음', '낮음'),
        ('중간', '중간'),
        ('높음', '높음'),
        ('긴급', '긴급')
      ON CONFLICT (value) DO NOTHING;
    `

    // Seed status options
    await sql`
      INSERT INTO status (value, label)
      VALUES 
        ('대기중', '대기중'),
        ('진행중', '진행중'),
        ('검토중', '검토중'),
        ('완료', '완료')
      ON CONFLICT (value) DO NOTHING;
    `

    // Seed priority options
    await sql`
      INSERT INTO priority (value, label)
      VALUES 
        ('낮음', '낮음'),
        ('보통', '보통'),
        ('높음', '높음'),
        ('최우선', '최우선')
      ON CONFLICT (value) DO NOTHING;
    `

    // Seed category options
    await sql`
      INSERT INTO category (value, label)
      VALUES 
        ('버그', '버그'),
        ('기능개선', '기능개선'),
        ('신규기능', '신규기능'),
        ('문서화', '문서화'),
        ('유지보수', '유지보수')
      ON CONFLICT (value) DO NOTHING;
    `

    // Seed environment options
    await sql`
      INSERT INTO environment (value, label)
      VALUES 
        ('개발', '개발'),
        ('테스트', '테스트'),
        ('스테이징', '스테이징'),
        ('운영', '운영')
      ON CONFLICT (value) DO NOTHING;
    `

    // Seed assignees
    await sql`
      INSERT INTO assignee (name)
      VALUES 
        ('김철수'),
        ('이영희'),
        ('박지민'),
        ('정민준'),
        ('최수진'),
        ('강동원'),
        ('윤서연'),
        ('한지훈'),
        ('송미나'),
        ('조현우')
      ON CONFLICT (name) DO NOTHING;
    `

    // Seed reporters
    await sql`
      INSERT INTO reporter (name)
      VALUES 
        ('김보고'),
        ('이슈진'),
        ('박문제'),
        ('정버그'),
        ('최오류'),
        ('강개선'),
        ('윤기능'),
        ('한테스트'),
        ('송품질'),
        ('조개발')
      ON CONFLICT (name) DO NOTHING;
    `

    return { success: true, message: "Database seeded successfully" }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, message: `Error seeding database: ${error}` }
  }
}
