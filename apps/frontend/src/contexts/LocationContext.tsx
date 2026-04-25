import { createContext, useContext, useState, type ReactNode } from "react";

interface LocationContextData {
  locationId: string | null;
  setLocationId: (id: string) => void;
  placeId: string | null
  setPlaceId: (id: string) => void
}

const LocationContext = createContext<LocationContextData | null>(null);

const STORAGE_KEY = 'weather:locationId';

export function LocationProvider({ children }: { children: ReactNode }) {
  const [locationId, setLocationIdState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY) ?? null;
  });

  const [placeId, setPlaceIdState] = useState<string | null>(() => {
    return localStorage.getItem('weather:placeId') ?? null;
  });

  const setLocationId = (id: string) => {
    localStorage.setItem(STORAGE_KEY, id); 
    setLocationIdState(id);
  };

  const setPlaceId = (id: string) => {
    localStorage.setItem('weather:placeId', id); 
    setPlaceIdState(id);
  };

  return (
    <LocationContext.Provider value={{ locationId, setLocationId , placeId, setPlaceId}}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}