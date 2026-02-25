import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/http";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error(
    "Missing required environment variables: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set."
  );
}

const client = createClient({ url, authToken });

export const db = drizzle(client, { schema });
