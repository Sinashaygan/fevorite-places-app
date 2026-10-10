export type PlaceLocation = {
  latitude: number;
  longitude: number;
};

export type Place = {
  id: string;
  title: string;
  imageUri: string;
  address?: string;
  location?: PlaceLocation;
};
