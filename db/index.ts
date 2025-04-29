import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Get the database connection string from environment variables
const connectionString = process.env.DATABASE_URL

// Create a SQL executor using neon
export const sql = neon(connectionString as string)

// Create a Drizzle instance
export const db = drizzle(sql, { schema })
