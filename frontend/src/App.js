import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlacesAutocompleteComponent from './components/autocomplete';
import SearchComponent from "./components/search";
import UserAuth from './components/auth';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './state/AuthProvider';
import UserProfile from './components/profile';
import { Navigation } from './components/navigation';
import DetailComponent from './components/details'

function App() {
    const storedURL = localStorage.getItem('searchCriteria');
    return (
        <Router>
            <AuthProvider>
                <ChakraProvider>
                    <div className="App">
                        <Navigation searchCriteria={storedURL}/>
                        <Routes>
                            <Route path='/search' element={<SearchComponent />} />
                            <Route path='/login' element={<UserAuth />} />
                            <Route path='/profile' element={<UserProfile />} />
                            <Route path='/profile/:uid' element={<UserProfile />} />
                            <Route path='/details/:id' element={<DetailComponent />} />
                            <Route path='/*' element={<div>Placeholder for homepage</div>} />
                        </Routes>
                    </div>
                </ChakraProvider>
            </AuthProvider>
        </Router >

    );
}

export default App;
