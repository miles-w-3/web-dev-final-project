/* global google */
import React, {useEffect, useState} from 'react';
import { getAllData } from "../clients/post";
import { useNavigate, Link } from 'react-router-dom';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostSummary from './postSummary'
function SearchComponent() {
    const [address, setAddress] = useState('');
    const [keyword, setKeyword] = useState('');
    const [postType, setPostType] = useState("service");
    const [posts, setPosts] = useState(undefined);
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
                let updatedPosts;

                console.log(`handleResults`, postType);
                if (posts === undefined) {
                    updatedPosts = [];
                }
                else if (postType === "favor") {
                    updatedPosts = [...posts.favors];
                    console.log(`updatedFavors is now`, JSON.stringify(updatedPosts))
                } else {
                    updatedPosts = [...posts.services];
                    console.log(`updatedServices is now`, JSON.stringify(updatedPosts))
                }

                console.log(JSON.stringify(updatedPosts));

                if(keyword) {
                    updatedPosts = updatedPosts.filter (
                        (post) =>
                            post.name.toLowerCase().includes(keyword.toLowerCase())
                    )
                }

                const results = await geocodeByAddress(address);
                const selectedLatLng = await getLatLng(results[0]);

                console.log(`Before1`, JSON.stringify(updatedPosts));

                updatedPosts = await Promise.all(
                    updatedPosts.map(async (post) => {
                        const distance = await calculateDistance(
                            selectedLatLng,
                            post.location
                        );
                        console.log(`Distance`, distance);
                        return { ...post, distance };
                    })
                );



                console.log(`Before`, JSON.stringify(updatedPosts));
                updatedPosts.sort((a, b) => a.distance - b.distance);
                console.log(`After`, JSON.stringify(updatedPosts));

                setSortedPosts(updatedPosts);
                localStorage.setItem('searchResults', JSON.stringify(updatedPosts));

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
        const fetchPosts = async () => {
            try {
                const response = await getAllData();
                setPosts(response);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
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
                    <option value="service">Service</option>
                    <option value="favor">Favor</option>
                </select>

            </div>
            <button className= "btn btn-primary" onClick={handleGoToSearchResults} disabled={!address}>
                Go to Search Results
            </button>
            {sortedPosts.length > 0 && (
                <PostSummary sortedPosts={sortedPosts} postType={postType} />
            )}
            {sortedPosts.length === 0 && <p>No results found, please try again.</p>}
        </div>
    );
}

export default SearchComponent;
