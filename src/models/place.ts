export type Location = {
  latitude: number;
  longitude: number;
  address?: string;
};

export default class Place {
  id: string;
  title: string;
  imageUri: string;
  address: string;
  location: Location;

  constructor(
    title: string,
    imageUri: string,
    address: string,
    location: Location,
  ) {
    this.id = `${Date.now()}-${Math.random()}`;
    this.title = title;
    this.imageUri = imageUri;
    this.address = address;
    this.location = location;
  }
}
