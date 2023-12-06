import React, { useState, useEffect } from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

function PlacesAutocompleteComponent() {
    const [address, setAddress] = useState('');

    const handleSelect = async (selectedAddress, placeId) => {
        try {
            const results = await geocodeByAddress(selectedAddress);
            const latLng = await getLatLng(results[0]);
            console.log('Selected address:', selectedAddress);
            console.log('Latlng:', latLng);
            setAddress(selectedAddress); // Autofill the input with the selected address
        } catch (error) {
            console.error('Error selecting address', error);
        }
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const geocoder = new window.google.maps.Geocoder();
                        const latLng = { lat: latitude, lng: longitude };

                        geocoder.geocode({ location: latLng }, (results, status) => {
                            if (status === 'OK') {
                                if (results[0]) {
                                    const address = results[0].formatted_address;
                                    setAddress(address);
                                } else {
                                    console.error('No results found');
                                }
                            } else {
                                console.error('Geocoder failed due to: ' + status);
                            }
                        });
                    } catch (error) {
                        console.error('Error getting address from coordinates', error);
                    }
                },
                (error) => {
                    console.error('Error getting current location', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by your browser');
        }
    };

    useEffect(() => {
        // Ensure that the Google Maps API is loaded before using it
        if (!window.google) {
            console.error('Google Maps API not loaded.');
        }
    }, []);

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

            <button onClick={handleGetCurrentLocation}>Get Current Location</button>
        </div>
    );
}

export default PlacesAutocompleteComponent;
