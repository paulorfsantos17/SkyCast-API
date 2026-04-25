// apps/frontend/src/components/google-places/CityAutocomplete.tsx
import { Input } from '@/components/ui/input';
import type { GooglePlacePrediction } from '@/models/GooglePlaces';
import { useGooglePlacesViewModel } from '@/services/viewmodels/useGooglePlacesViewModel';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Label } from 'recharts';

interface CityAutocompleteProps {
  onSelectCity: (prediction: GooglePlacePrediction) => void;
  label?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
}

export function CityAutocomplete({
  onSelectCity,
  label = 'Cidade',
  placeholder = 'Digite o nome da cidade...',
  value = '',
  disabled = false,
}: CityAutocompleteProps) {
  const { predictions, isSearching, searchCities, clearPredictions } =
    useGooglePlacesViewModel();



  const [inputValue, setInputValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce: busca após 500ms de inatividade
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim().length >= 3) {
        searchCities(inputValue.trim());
        setShowDropdown(true);
      } else {
        clearPredictions();
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, searchCities, clearPredictions]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atualiza input quando value externo muda
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSelectCity = (prediction: GooglePlacePrediction) => {
    setInputValue(prediction.description);
    setShowDropdown(false);
    onSelectCity(prediction);
  };

  const handleInputFocus = () => {
    if (predictions.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      {label && <Label >{label}</Label>}

      {/* Input */}
      <div className="relative">
        <Input
          id="city-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="mt-1"
        />

        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Dropdown de sugestões */}
      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction) => {


            return (
              <button
                key={prediction.place_id}
                type="button"
                onClick={() => handleSelectCity(prediction)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0 flex items-start justify-between gap-2"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {prediction.structured_formatting.main_text}
                  </div>
                  {prediction.structured_formatting.secondary_text && (
                    <div className="text-sm text-gray-500 mt-0.5">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  )}
                </div>

          
              </button>
            );
          })}
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {showDropdown &&
        !isSearching &&
        predictions.length === 0 &&
        inputValue.length >= 3 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
            Nenhuma cidade encontrada
          </div>
        )}

      {/* Mensagem de validação */}
      {inputValue.length > 0 && inputValue.length < 3 && (
        <p className="text-xs text-gray-500 mt-1">
          Digite pelo menos 3 caracteres para buscar
        </p>
      )}
    </div>
  );
}
