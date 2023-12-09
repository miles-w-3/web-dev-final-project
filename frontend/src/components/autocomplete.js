/* global google */
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';


function PlacesAutocompleteComponent({ setSelectedLatLang }) {
    const [address, setAddress] = useState('');
    const [posts] = useState([
        {
            name: 'Sample Service',
            description: 'This is a sample service post.',
            location: { lat: 37.7749, lng: -122.4194 },
            datePosted: new Date(),
            dateNeeded: new Date(),
            postedBy: 'John Doe',
            acceptedBy: '',
        },
        {
            name: 'Sample Favor',
            description: 'This is a sample favor post.',
            location: { lat: 34.0522, lng: -118.2437 },
            datePosted: new Date(),
            dateNeeded: new Date(),
            postedBy: 'Jane Doe',
            acceptedBy: '',
        },
    ]);
    const [sortedPosts, setSortedPosts] = useState([]);
    const navigate = useNavigate();

    const handleSelect = async (selectedAddress) => {
        const results = await geocodeByAddress(selectedAddress);
        await getLatLng(results[0]);
        setAddress(selectedAddress);

    };
    async function calculateDistance(address1, address2) {
        const service = new google.maps.DistanceMatrixService();
        return new Promise((resolve, reject) => {
            service.getDistanceMatrix(
                {
                    origins: [address1],
                    destinations: [address2],
                    travelMode : 'DRIVING'
                },
                (response, status) => {
                    if (status === 'OK' && response.rows.length > 0 && response.rows[0].elements.length > 0) {
                        const distance = response.rows[0].elements[0].distance.value;
                        resolve(distance);
                    } else {
                        reject(new Error('Error calculating distance'));
                    }
                }
            );
        });
    }

    const handleGoToSearchResults = async () => {
        if (address) {
            try {
                const results = await geocodeByAddress(address);
                const selectedLatLng = await getLatLng(results[0]);
                console.log(`Selected lat lang is ${selectedLatLng}`);
                if (setSelectedLatLang) setSelectedLatLang(selectedLatLng);

                const updatedPosts = await Promise.all(
                    posts.map(async (post) => {
                        const distance = await calculateDistance(
                            selectedLatLng,
                            post.location || { lat: 0, lng: 0 }
                        );
                        return { ...post, distance };
                    })
                );
                const sortedPosts = updatedPosts.sort((a, b) => a.distance - b.distance);
                setSortedPosts(sortedPosts);
                navigate(`/search?criteria=${address}`);
            } catch (error) {
                console.error('Error during search:', error);
            }
        }
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
            <button className= "btn btn-primary" onClick={handleGoToSearchResults} disabled={!address}>
                Go to Search Results
            </button>
            {sortedPosts.length > 0 && (
                <div>
                    <h2>Search Results:</h2>
                    {sortedPosts.map((post) => (
                        <div key={post.name}>
                            <h3>{post.name}</h3>
                            <p>{post.description}</p>
                            <p>Distance: {post.distance} meters</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PlacesAutocompleteComponent;
