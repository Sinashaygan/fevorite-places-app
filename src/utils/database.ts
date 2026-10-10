import type { Place } from "@/types/place";
import * as SQLite from "expo-sqlite";

type NewPlace = Pick<Place, "title" | "imageUri" | "location"> & {
  address?: string;
};

const databasePromise = SQLite.openDatabaseAsync("places.db");

export async function init() {
  const database = await databasePromise;

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      address TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );
  `);

  return database;
}

export async function insertPlace(place: NewPlace) {
  const database = await databasePromise;

  if (!place.location) {
    throw new Error("Cannot insert a place without a location.");
  }

  const result = await database.runAsync(
    `
      INSERT INTO places (
        title,
        imageUri,
        address,
        latitude,
        longitude
      )
      VALUES (?, ?, ?, ?, ?);
    `,
    place.title,
    place.imageUri,
    place.address ?? "Address unavailable",
    place.location.latitude,
    place.location.longitude,
  );

  return result.lastInsertRowId;
}
