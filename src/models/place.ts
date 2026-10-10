import type { Place as PlaceType } from "@/types/place";

export default class Place implements PlaceType {
  id: string;
  title: string;
  imageUri: string;
  address?: string;
  location: PlaceType["location"];

  constructor(
    title: string,
    imageUri: string,
    address?: string,
    location?: PlaceType["location"],
  ) {
    this.id = `${Date.now()}-${Math.random()}`;
    this.title = title;
    this.imageUri = imageUri;
    this.address = address;
    this.location = location;
  }
}
