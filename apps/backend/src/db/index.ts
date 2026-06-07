import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from './schema'
import postgres from "postgres";
import 'dotenv/config'


const connectionString = process.env.DATABASE_URL
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })

/** Close the Postgres pool so CLI scripts (e.g. `npm run agent`) can exit cleanly. */
export async function closeDb(): Promise<void> {
    await client.end({ timeout: 5 })
}