import * as SQLite from "expo-sqlite";

export async function init() {
  const database = await SQLite.openDatabaseAsync("places.db");

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );
  `);

  return database;
}
