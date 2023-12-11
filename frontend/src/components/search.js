/* global google */
import React, { useCallback, useEffect, useState } from 'react';
import { getAllData } from "../clients/post";
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box, Text, Badge } from '@chakra-ui/react'; // Assuming Chakra UI for styling
import PostSummary from './postSummary'

function SearchComponent() {
  const [address, setAddress] = useState('');
  const [keyword, setKeyword] = useState('');
  const [postType, setPostType] = useState("service");
  const [posts, setPosts] = useState(undefined);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
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
          travelMode: 'DRIVING',
          unitSystem: google.maps.UnitSystem.IMPERIAL,
        },
        (response, status) => {
          if (
            status === 'OK' &&
            response.rows.length > 0 &&
            response.rows[0].elements.length > 0
          ) {
            const distance = Math.round(
              response.rows[0].elements[0].distance.value * 0.000621371
            );
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
  };

  const handleUpdateParams = () => {
    setSearchParams({ searchType: postType, searchKeyword: keyword ?? '', searchAddress: address });
    handleGoToSearchResults();
  }

  const handleGoToSearchResults = useCallback(async () => {
    console.log(`Running handleGoto`)
    if (address) {
      try {
        let updatedPosts;

        console.log(`handleResults`, postType);
        if (posts === undefined) {
          updatedPosts = [];
        }
        else if (postType === "favor") {
          updatedPosts = [...posts.favors];
        } else {
          updatedPosts = [...posts.services];
        }

        if (keyword) {
          updatedPosts = updatedPosts.filter(
            (post) =>
              post.name.toLowerCase().includes(keyword.toLowerCase())
          )
        }

        const results = await geocodeByAddress(address);
        const selectedLatLng = await getLatLng(results[0]);

        updatedPosts = await Promise.all(
          updatedPosts.map(async (post) => {
            const distance = await calculateDistance(
              selectedLatLng,
              post.location
            );
            return { ...post, distance };
          })
        );

        updatedPosts.sort((a, b) => a.distance - b.distance);

        setSortedPosts(updatedPosts);
      } catch (error) {
        console.error('Error during search:', error);
      }
    }
  }, [address, postType, keyword, posts]);

  // updates the posts whenever they change
  useEffect(() => {
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

  // update search params when url changes
  useEffect(() => {
    console.log(`SearchParams is now ${JSON.stringify(searchParams)}`);
    const searchAddress = searchParams.get('searchAddress');
    if (searchAddress) {
      setAddress(searchAddress);
    }
    const searchKeyword = searchParams.get('searchKeyword')
    if (searchKeyword) setKeyword(searchKeyword);

    const searchType = searchParams.get('searchType');
    if (searchType) {
      setPostType(searchType);
    }
  }, [searchParams, sortedPosts]);

  return (
    <>
      <div className='container mt-4'>
        <div className='row align-items-center pb-4 border-bottom '>
          <div className='col-md-4'>
            <label htmlFor='address'>Address:</label>
            <PlacesAutocomplete
              value={address}
              onChange={(newAddress) => setAddress(newAddress)}
              onSelect={handleSelect}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <input
                    {...getInputProps({
                      placeholder: 'Enter an address...',
                      className: 'form-control',
                      id: 'address',
                    })}
                  />
                  {loading && <div>Loading...</div>}
                  {suggestions.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '100%',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {suggestions.map((suggestion) => (
                        <div
                          {...getSuggestionItemProps(suggestion)}
                          style={{
                            padding: '8px',
                            cursor: 'pointer',
                            ':hover': {
                              backgroundColor: '#f0f0f0',
                            },
                          }}
                          key={suggestion.placeId}
                        >
                          {suggestion.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </PlacesAutocomplete>
          </div>
          <div className='col-md-4'>
            <label htmlFor='keyword'>Keyword:</label>
            <input
              type='text'
              placeholder='Search By Keyword'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className='form-control'
              id='keyword'
            />
          </div>
          <div className='col-md-3'>
            <label htmlFor='postType'>Post Type:</label>
            <select
              value={postType}
              onChange={(e) => handleSelectPostType(e.target.value)}
              className='form-control'
              id='postType'
            >
              <option value='Service'>Service</option>
              <option value='Favor'>Favor</option>
            </select>
          </div>
          <div className='col-md-1'>
            <label>&nbsp;</label> {/* Empty label for spacing */}
            <button
              className='btn btn-primary'
              onClick={handleUpdateParams}
              disabled={!address}
            >
              Search
            </button>
          </div>
        </div>
        {sortedPosts.length > 0 && (
          <div>
            <h3 className='fw-light m-4'>Search Results:</h3>
            <PostSummary postType={postType} sortedPosts={sortedPosts}/>
          </div>
        )}
        {sortedPosts.length === 0 && <p>0 results found, please try again.</p>}
      </div>
    </>
  );
}

export default SearchComponent;
