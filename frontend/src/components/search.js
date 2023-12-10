/* global google */
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
function SearchComponent() {
    const [address, setAddress] = useState('');
    const [keyword, setKeyword] = useState('');
    const [postType, setPostType] = useState(null);
    const [posts] = useState([
        {
            name: 'Sample Service',
            description: 'This is a sample service post.',
            location: { lat: 41.836828, lng: -71.993255 },
            datePosted: new Date(),
            postedBy: 'John Doe',
            price: 20,
            purchasedBy: '',
            postedByName: '',
            purchasedByName: '',
        },
        {
            name: 'Sample Favor',
            description: 'This is a sample favor post.',
            location: { lat: 34.0522, lng: -118.2437 },
            datePosted: new Date(),
            dateNeeded: new Date(),
            postedBy: 'Jane Doe',
            acceptedBy: '',
            postedByName: '',
            acceptedByName: '',
        },
    ]);
    const [sortedPosts, setSortedPosts] = useState([]);
    const navigate = useNavigate();

    const handleSelect = async (selectedAddress) => {
        const results = await geocodeByAddress(selectedAddress);
        await getLatLng(results[0]);
        setAddress(selectedAddress);
        localStorage.setItem('searchAddress', selectedAddress);

    };
    async function calculateDistance(address1, address2) {
        const service = new google.maps.DistanceMatrixService();
        return new Promise((resolve, reject) => {
            service.getDistanceMatrix(
                {
                    origins: [address1],
                    destinations: [address2],
                    travelMode : 'DRIVING',
                    unitSystem: google.maps.UnitSystem.IMPERIAL,
                },
                (response, status) => {
                    if (status === 'OK' && response.rows.length > 0 && response.rows[0].elements.length > 0) {
                        const distance = Math.round(response.rows[0].elements[0].distance.value * 0.000621371);
                        resolve(distance);
                    } else {
                        reject(new Error('Error calculating distance'));
                    }
                }
            );
        });
    }

    const handleSelectPostType = async (selectPostType) => {
        console.log(selectPostType);
        setPostType(selectPostType);
        localStorage.setItem('postType', selectPostType)
    }

    const handleGoToSearchResults = async () => {
        if (address) {
            try {
                const results = await geocodeByAddress(address);
                const selectedLatLng = await getLatLng(results[0]);

                const updatedPosts = await Promise.all(
                    posts.map(async (post) => {
                        const distance = await calculateDistance(
                            selectedLatLng,
                            post.location
                        );
                        return { ...post, distance };
                    })
                );

                let sortedPosts = updatedPosts.sort((a, b) => a.distance - b.distance);

                sortedPosts = sortedPosts.filter((post) => {
                    if (postType === 'Service') {
                        return 'price' in post;
                    } else if (postType === 'Favor') {
                        return 'dateNeeded' in post;
                    }
                    return true;
                });

                if(keyword) {
                    sortedPosts = sortedPosts.filter (
                        (post) =>
                            post.name.toLowerCase().includes(keyword.toLowerCase())
                    )
                }

                setSortedPosts(sortedPosts);
                localStorage.setItem('searchResults', JSON.stringify(sortedPosts));

                navigate(`/search?criteria=${address || ''}&keyword=${keyword || ''}&searchType=${postType || ''}`);

                const criteria = new URLSearchParams(window.location.search).get('criteria');
                localStorage.setItem('searchCriteria', criteria);
                const searchKeyword = new URLSearchParams(window.location.search).get('keyword');
                localStorage.setItem('searchKeyword', searchKeyword);
                const searchType = new URLSearchParams(window.location.search).get('searchType');
                localStorage.setItem('searchType', searchType)

            } catch (error) {
                console.error('Error during search:', error);
            }
        }
    };


    useEffect(() => {
        const storedResults = JSON.parse(localStorage.getItem('searchResults'));
        if (storedResults) {
            setSortedPosts(storedResults);
        }
        const storedAddress = localStorage.getItem('searchAddress');
        if (storedAddress) {
            setAddress(storedAddress);
        }
        const storedKeyword = localStorage.getItem('searchKeyword');
        if (storedKeyword) {
            setKeyword(storedKeyword);
        }
        const storedSearchType = localStorage.getItem('searchType');
        if (storedSearchType) {
            setPostType(storedSearchType);
        }
        const storedURL = localStorage.getItem('searchCriteria');
        if (storedURL) {
            navigate(`/search?criteria=${storedURL}&keyword=${storedKeyword}&searchType=${storedSearchType}`);
        }
    }, []);

    return (
        <div>
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
                <input
                    type="text"
                    placeholder="Search By Keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <select
                    value={postType}
                    onChange={(e) => handleSelectPostType(e.target.value)}
                >
                    <option value="" disabled>Search For ...</option>
                    <option value="Service">Service</option>
                    <option value="Favor">Favor</option>
                </select>

            </div>
            <button className= "btn btn-primary" onClick={handleGoToSearchResults} disabled={!address}>
                Go to Search Results
            </button>
            {sortedPosts.length > 0 && (
                <div>
                    <h2>Search Results:</h2>
                    <ul className="list-group">
                        {sortedPosts.map((post) => (
                            <li key={post.name} className="list-group-item">
                                <h3>{post.name}</h3>
                                <p>{post.description}</p>
                                <p>Distance: {post.distance} miles</p>
                                <button className="btn btn-warning" onClick={() =>
                                    navigate(`/details/${post.name}`)}>View Details
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {sortedPosts.length === 0 && (
                <p>0 results found, please try again.</p>
            )}
        </div>
    );
}

export default SearchComponent;
