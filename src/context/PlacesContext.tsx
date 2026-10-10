import type { Place as PlaceType } from "@/types/place";
import { fetchPlaces, init } from "@/utils/database";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
  addPlace: (place: PlaceType) => void;
  draft: PlaceDraft;
  updateDraft: (changes: Partial<PlaceDraft>) => void;
  resetDraft: () => void;
};

const PlacesContext = createContext<PlacesContextValue | null>(null);

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [draft, setDraft] = useState<PlaceDraft>(createEmptyDraft);

  useEffect(() => {
    let active = true;
    async function loadPlaces() {
      try {
        await init();
        const savedPlaces = await fetchPlaces();
        if (active) {
          setPlaces((currentPlaces) => {
            const combined = new Map(savedPlaces.map((place) => [place.id, place]));
            currentPlaces.forEach((place) => combined.set(place.id, place));
            return [...combined.values()].sort(
              (first, second) => Number(second.id) - Number(first.id),
            );
          });
        }
      } catch (error) {
        console.error("Failed to initialize or load saved places:", error);
      }
    }
    void loadPlaces();
    return () => {
      active = false;
    };
  }, []);

  const addPlace = useCallback((place: PlaceType) => {
    setPlaces((currentPlaces) => [
      place,
      ...currentPlaces.filter((current) => current.id !== place.id),
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
