/* global google */
import React, { useCallback, useEffect, useState } from 'react';
import { getAllData } from "../clients/post";
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostSummary from './postSummary'
import { useAuthContext } from '../state/useAuthContext';

function SearchComponent() {
  const authContext = useAuthContext();
  const [address, setAddress] = useState('');
  const [keyword, setKeyword] = useState('');
  const [postType, setPostType] = useState("service");
  const [posts, setPosts] = useState(undefined);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasSearched, setHasSearched] = useSearchParams(false);

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
            console.log("Value result is ", response);
            if (response.rows[0].elements[0].distance) {
              const distance = response.rows[0].elements[0].distance;
              resolve(distance);
            }
            resolve({text: 'too far', value: 99999999999});
          } else {
            reject(new Error('Error calculating distance'));
          }
        }
      );
    });
  }

  const handleSelectPostType = async (selectPostType) => {
    setPostType(selectPostType);
  };

  const handleUpdateParams = () => {
    setSearchParams({ searchType: postType, searchKeyword: keyword ?? '', searchAddress: address });
  }

  // updates the posts whenever they change
  useEffect(() => {
    // if (!authContext.user) return;
    // sample posts for now
    const fetchPosts = async () => {
      try {
        const response = await getAllData();
        setPosts(response);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [authContext.user]);


  // update search params when url changes, and render results
  useEffect(() => {

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

    if (!posts) return;

    const handleGoToSearchResults = async () => {
      console.log(`Running handleGoto`)

      try {
        let updatedPosts;

        if (searchType === "service") {
          updatedPosts = [...posts.services];
        }
        else if (searchType === "favor") {
          updatedPosts = [...posts.favors];
        } else {
          updatedPosts = [];
        }

        if (searchKeyword) {
          updatedPosts = updatedPosts.filter(
            (post) =>
              post.name.toLowerCase().includes(searchKeyword.toLowerCase())
          )
        }

        const results = await geocodeByAddress(searchAddress);
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

        updatedPosts.sort((a, b) => a.distance.value - b.distance.value);

        setSortedPosts(updatedPosts);
      } catch (error) {
        console.error('Error during search:', error);
      }
    };

    if (searchAddress) handleGoToSearchResults();

    // we don't want goToSearchresults to be a dep here, we just want to run search results whenever url changes
  }, [searchParams, posts]);

  return (
    <>
    {/*{!authContext.user && <Navigate to='/login' />}*/}
      <div className='container mt-4'>
        <div className='row align-items-center pb-4 border-bottom '>
          <div className='col-md-4'>
            <label htmlFor='address'>Location:</label>
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
              <option value='service'>Service</option>
              <option value='favor'>Favor</option>
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
        {sortedPosts.length === 0 && <p>0 results found</p>}
      </div>
    </>
  );
}

export default SearchComponent;
