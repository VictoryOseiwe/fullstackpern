import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

//destructure environment variables
const { PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env;

// Create a Neon database connection
// Ensure that the environment variables are set correctly like the connection string
export const sql = neon(
  `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?sslmode=require`
);
