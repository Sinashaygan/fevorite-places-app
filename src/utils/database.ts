import type { Place } from "@/types/place";
import * as SQLite from "expo-sqlite";

type PlaceRow = {
  id: string;
  title: string;
  imageUri: string;
  address: string | null;
  latitude: number;
  longitude: number;
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

export async function insertPlace(place: Omit<Place, "id">) {
  const database = await databasePromise;

  if (!place.location) {
    throw new Error("Place location is required.");
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

export async function fetchPlaces(): Promise<Place[]> {
  const database = await databasePromise;

  const rows = await database.getAllAsync<PlaceRow>(`
    SELECT
      id,
      title,
      imageUri,
      address,
      latitude,
      longitude
    FROM places
    ORDER BY id DESC;
  `);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    imageUri: row.imageUri,
    address: row.address ?? "Address unavailable",
    location: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
  }));
}
