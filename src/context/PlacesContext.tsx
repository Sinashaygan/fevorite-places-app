import Place from "@/models/place";
import type { Place as PlaceType } from "@/types/place";
import { createContext, useContext, useMemo, useState } from "react";

type NewPlace = Omit<PlaceType, "id">;

type PlacesContextValue = {
  places: PlaceType[];
  addPlace: (place: NewPlace) => void;
};

const PlacesContext = createContext<PlacesContextValue | null>(null);

export function PlacesProvider({ children }: { children: React.ReactNode }) {
  const [places, setPlaces] = useState<PlaceType[]>([]);

  function addPlace(place: NewPlace) {
    setPlaces((currentPlaces) => [
      new Place(place.title, place.imageUri, place.address, place.location),
      ...currentPlaces,
    ]);
  }

  const value = useMemo(() => ({ places, addPlace }), [places]);

  return (
    <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>
  );
}

export function usePlaces() {
  const context = useContext(PlacesContext);

  if (!context) {
    throw new Error("usePlaces must be used inside a PlacesProvider");
  }

  return context;
}
