#! /usr/bin/env node
import { argv } from "node:process";
import { Client } from "pg";
import "dotenv/config";

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname VARCHAR ( 255 ) NOT NULL,
  lastname VARCHAR ( 255 ) NOT NULL,
  username VARCHAR ( 255 ) UNIQUE NOT NULL,
  password VARCHAR ( 255 ) NOT NULL,
  member BOOLEAN NOT NULL,
  admin BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 255 ) NOT NULL,
  text TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
`;


async function main() {
    const db = argv[2];
    let client;

    if (!db) {
        client = new Client({
            connectionString: process.env.DB_URI
        })
    }
    else {
        client = new Client({
            connectionString: db,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }
    console.log("seeding...");
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();

