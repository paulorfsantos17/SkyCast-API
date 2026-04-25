// src/pages/dashboard/components/CitySelectionCard.tsx
import { useLocationContext } from "@/contexts/LocationContext";
import { Loader2, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import type { GooglePlacePrediction } from "../../../models/GooglePlaces";
import { useGooglePlacesViewModel } from "../../../services/viewmodels/useGooglePlacesViewModel";
import { useUserLocationsViewModel } from "../../../services/viewmodels/useUserLocationsViewModel";
import { CityAutocomplete } from "./CityAutocomplete";

// Importe a função 'cn' se você a tiver para condicionalmente aplicar classes
// Ex: import { cn } from "@/lib/utils";

export function CitySelectionCard() {
  const [selectedCity, setSelectedCity] = useState<GooglePlacePrediction | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  // Estado para controlar a animação
  const [showSelectedCityBlock, setShowSelectedCityBlock] = useState(false);

  const { setLocationId, placeId, setPlaceId } = useLocationContext();
  const { getPlaceDetails, isLoadingDetails } = useGooglePlacesViewModel();
  const { saveLocation, isCreating } = useUserLocationsViewModel();

  const handleSelectCity = async (prediction: GooglePlacePrediction) => {
    // Esconde o bloco antes de carregar a nova cidade para a animação
    setShowSelectedCityBlock(false);
    setSelectedCity(prediction);
    setPlaceId(prediction.place_id);

    const details = await getPlaceDetails(prediction.place_id);
    if (details) {
      const newCoords = {
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
      };
      setCoordinates(newCoords);

      const location = await saveLocation(details);
      if (location?.id) {
        setLocationId(location.location.id);
      }
      // Mostra o bloco com animação após carregar
      setShowSelectedCityBlock(true);
    }
  };

  const isLoading = isLoadingDetails || isCreating;

  const loadPersistedLocation = useCallback(async () => {
    if (!placeId) {
      setShowSelectedCityBlock(false); // Esconde se não houver cidade persistida
      return;
    }

    // Esconde o bloco antes de carregar a nova cidade para a animação
    setShowSelectedCityBlock(false);

    const details = await getPlaceDetails(placeId);
    if (!details) {
      setShowSelectedCityBlock(false);
      return;
    }

    const prediction: GooglePlacePrediction = {
      description: details.name || details.place_id,
      place_id: details.place_id,
      structured_formatting: {
        main_text: details.name || details.place_id,
        secondary_text: "",
      },
    };

    setSelectedCity(prediction);
    setCoordinates({
      lat: details.geometry.location.lat,
      lng: details.geometry.location.lng,
    });
    // Mostra o bloco com animação após carregar
    setShowSelectedCityBlock(true);
  }, [placeId, getPlaceDetails]);

  useEffect(() => {
    loadPersistedLocation();
  }, [loadPersistedLocation]);

  return (
    <Card className="w-full border border-border bg-card/80 ">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-sm font-semibold">
                Localização
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                Defina a cidade principal para o painel.
              </span>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Carregando…</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
          {/* Campo de busca */}
          <div className="w-full md:flex-1">
            <CityAutocomplete
              label="Cidade"
              placeholder="Buscar cidade..."
              onSelectCity={handleSelectCity}
              disabled={isLoading}
            />
          </div>

          {/* Card destacado da cidade selecionada */}
          {selectedCity && showSelectedCityBlock && ( // Condicional para a animação
            <div
              className="w-full md:flex-1 animate-fade-in-slide" // Aplica a classe de animação aqui
            >
              <div className="relative h-full overflow-hidden rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 md:px-5 md:py-4">
                <div className="absolute inset-y-0 right-0 w-24 opacity-10 pointer-events-none bg-gradient-to-l from-primary to-transparent" />

                <div className="relative flex h-full flex-col justify-between gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                        🌎
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-primary">
                          Cidade selecionada
                        </span>
                        <span className="text-sm font-semibold leading-tight">
                          {selectedCity.description}
                        </span>
                      </div>
                    </div>

                    {isLoading && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                  </div>

                  {coordinates && !isLoading && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/80">
                        Coordenadas:
                      </span>{" "}
                      {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                    </div>
                  )}

                  {!isLoading && (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Os gráficos e métricas do painel serão baseados nesta
                      localização.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}