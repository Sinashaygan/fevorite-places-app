import Place from "@/models/place";
import type { Place as PlaceType } from "@/types/place";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type NewPlace = Omit<PlaceType, "id">;

type PlaceDraft = {
  title: PlaceType["title"];
  imageUri: PlaceType["imageUri"];
  address?: PlaceType["address"];
  location?: PlaceType["location"];
};

function createEmptyDraft(): PlaceDraft {
  return {
    title: "",
    imageUri: "",
    address: "",
  };
}

type PlacesContextValue = {
  places: PlaceType[];
  addPlace: (place: NewPlace) => void;
  draft: PlaceDraft;
  updateDraft: (changes: Partial<PlaceDraft>) => void;
  resetDraft: () => void;
};

const PlacesContext = createContext<PlacesContextValue | null>(null);

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [draft, setDraft] = useState<PlaceDraft>(createEmptyDraft);

  const addPlace = useCallback((place: NewPlace) => {
    setPlaces((currentPlaces) => [
      new Place(place.title, place.imageUri, place.address, place.location),
      ...currentPlaces,
    ]);
  }, []);

  const updateDraft = useCallback((changes: Partial<PlaceDraft>) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      ...changes,
    }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(createEmptyDraft());
  }, []);

  const value = useMemo(
    () => ({
      places,
      addPlace,
      draft,
      updateDraft,
      resetDraft,
    }),
    [places, addPlace, draft, updateDraft, resetDraft],
  );

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
