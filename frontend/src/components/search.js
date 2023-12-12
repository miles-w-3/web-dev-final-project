/* global google */
import React, { useCallback, useEffect, useState } from 'react';
import { getAllData } from "../clients/post";
import { Navigate, useSearchParams } from 'react-router-dom';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostSummary from './postSummary'
import { useAuthContext } from '../state/useAuthContext';

function SearchComponent() {
  const [address, setAddress] = useState('');
  const [keyword, setKeyword] = useState('');
  const [postType, setPostType] = useState("service");
  const [posts, setPosts] = useState(undefined);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const authContext = useAuthContext();

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
    console.log(`In plain useEffect`)
    setPosts({ "services": [{ "postedBy": "LTmhfVtr8wY7uhsXr3MntA1kfwS2", "price": 1, "name": "Can Opener", "description": "Can Opener", "location": { "lng": -71.06532159999999, "lat": 42.3616256 }, "datePosted": "2023-12-11T16:48:02.145Z", "id": "9Iv4S9WmjiUjoHTqBoiR" }, { "postedBy": "LTmhfVtr8wY7uhsXr3MntA1kfwS2", "price": 11, "name": "Dog walking", "description": "sample desc", "location": { "lng": -71.0588801, "lat": 42.3600825 }, "datePosted": "2023-12-10T15:36:13.505Z", "purchasedBy": "CBzwKmEr3OaOOWv9NoARo2Sj6dh1", "id": "LMlZ8HRRhVXQTYrU7FGl" }, { "postedBy": "S8Ok5Rb8fFh9g81OvVlyUtPvf033", "price": 26, "name": "I want stuff", "description": "stuff", "location": { "lng": -75.69719309999999, "lat": 45.4215296 }, "datePosted": "2023-12-11T01:19:08.780Z", "purchasedBy": "LTmhfVtr8wY7uhsXr3MntA1kfwS2", "id": "OqL7YM3uAIMttrqdhNi5" }, { "postedBy": "S8Ok5Rb8fFh9g81OvVlyUtPvf033", "price": 4, "name": "g", "description": "g", "location": { "lng": -71.08761439999999, "lat": 42.3718494 }, "datePosted": "2023-12-11T01:13:01.440Z", "id": "VbfQ8v2IKEHyJmxZ6Pk5" }, { "postedBy": "LTmhfVtr8wY7uhsXr3MntA1kfwS2", "price": 1000, "name": "Test seller ", "description": "Testing seller desc", "location": { "lng": -71.0588801, "lat": 42.3600825 }, "datePosted": "2023-12-10T04:09:14.467Z", "id": "dGfJNm0CMmOP6I99zNne" }], "favors": [{ "postedBy": "PW6RWFkr7uXa1sKWuUY9du7vsKP2", "dateNeeded": "2023-12-11T01:11:37.185Z", "name": "r", "description": "r", "location": { "lng": -71.1439322, "lat": 42.3566466 }, "datePosted": "2023-12-11T01:11:47.529Z", "id": "949NAxCHwX7SVjJjxpRN" }, { "postedBy": "zdkvuKonbSbS4BHfcXLZYCrv5Lw1", "dateNeeded": "2023-12-11T01:27:22.695Z", "name": "Test", "description": "Test", "location": { "lng": -71.062146, "lat": 42.366198 }, "datePosted": "2023-12-11T01:27:45.746Z", "id": "AYcdsOSBOnzPYEyKgqOP" }, { "postedBy": "CBzwKmEr3OaOOWv9NoARo2Sj6dh1", "dateNeeded": "2023-12-10T15:36:50.850Z", "name": "Need a drill", "description": "help", "location": { "lng": -71.0588801, "lat": 42.3600825 }, "datePosted": "2023-12-10T15:37:06.438Z", "acceptedBy": "LTmhfVtr8wY7uhsXr3MntA1kfwS2", "id": "CsQlfo4xNRhbXQNFpryV" }, { "postedBy": "zdkvuKonbSbS4BHfcXLZYCrv5Lw1", "dateNeeded": "2023-12-11T01:22:36.801Z", "name": "Test req", "description": "test req", "location": { "lng": -97.7430608, "lat": 30.267153 }, "datePosted": "2023-12-11T01:22:49.933Z", "id": "Gb4JGc1MFFPgonNCIYNU" }, { "postedBy": "PW6RWFkr7uXa1sKWuUY9du7vsKP2", "dateNeeded": "2023-12-11T01:11:01.530Z", "name": "i want stuff", "description": "stuff", "location": { "lng": -71.0590624, "lat": 42.3604802 }, "datePosted": "2023-12-11T01:11:18.824Z", "id": "MJ2gRU4ae58aEAW5HdqB" }, { "postedBy": "CBzwKmEr3OaOOWv9NoARo2Sj6dh1", "dateNeeded": "2023-12-17T04:10:00.000Z", "name": "Test req", "description": "req desc", "location": { "lng": -71.0588801, "lat": 42.3600825 }, "datePosted": "2023-12-10T04:10:48.329Z", "id": "Tsc4lf7UR4F5bTuIOfmS" }, { "postedBy": "tB7u6JQvoic0vgZiKA1SJ72TlKc2", "dateNeeded": "2023-12-11T23:16:31.536Z", "name": "Testing", "description": "My Tests", "location": { "lng": -71.0853789, "lat": 42.3428657 }, "datePosted": "2023-12-11T23:17:51.124Z", "id": "VISRnQzDjKNeEskae31N" }, { "postedBy": "pbGXylT8jbMUMbMiYcSbEfEDO3j1", "dateNeeded": "2023-12-11T01:07:11.642Z", "name": "Need stuff", "description": "stuff", "location": { "lng": -71.06532159999999, "lat": 42.3616256 }, "datePosted": "2023-12-11T01:07:24.854Z", "id": "XIARWphWgn8KbZUZ9DNk" }, { "postedBy": "pbGXylT8jbMUMbMiYcSbEfEDO3j1", "dateNeeded": "2023-12-11T01:08:14.970Z", "name": "Test Request", "description": "Test", "location": { "lng": -71.04552149999999, "lat": 42.3516339 }, "datePosted": "2023-12-11T01:08:59.586Z", "id": "yrBhyVLPHHFDwRgvktJq" }] });
    const fetchPosts = async () => {
      try {
        const response = await getAllData();
        setPosts(response);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    //fetchPosts();

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
    // run the search results
    handleGoToSearchResults();
  }, [searchParams]);

  return (
    <>
      {!authContext.user && <Navigate to='/login' />}
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
        {sortedPosts.length === 0 && <p>0 results found, please try again.</p>}
      </div>
    </>
  );
}

export default SearchComponent;
