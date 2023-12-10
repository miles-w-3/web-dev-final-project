/* global google */
import React, {useState} from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';


function PlacesAutocompleteComponent({ setSelectedLatLang }) {
    const [address, setAddress] = useState('');
    const handleSelect = async (selectedAddress) => {
        const results = await geocodeByAddress(selectedAddress);
        const selectedLatLng = await getLatLng(results[0]);
        console.log(`setting lat lng to ${JSON.stringify(selectedLatLng)}`)
        setSelectedLatLang(selectedLatLng);
        setAddress(selectedAddress);
    };

    return (
        <div>
            <PlacesAutocomplete
                value={address}
                onChange={(newAddress) => setAddress(newAddress)}
                onSelect={handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: 'Enter an address...',
                                className: 'location-search-input',
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion) => (
                                <div
                                    {...getSuggestionItemProps(suggestion)}
                                    key={suggestion.placeId}
                                >
                                    {suggestion.description}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        </div>
    );
}

export default PlacesAutocompleteComponent;
