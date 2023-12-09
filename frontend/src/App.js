import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlacesAutocompleteComponent from './components/autocomplete';
import UserAuth from './components/auth';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './state/AuthProvider';
import UserProfile from './components/profile';
import { Navigation } from './components/navigation';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ChakraProvider>
                    <div className="App">
                        <Navigation />
                        <Routes>
                            <Route path='/search' element={<PlacesAutocompleteComponent />} />
                            <Route path='/auth' element={<UserAuth />} />
                            <Route path='/profile' element={<UserProfile />} />
                            <Route path='/profile/:uid' element={<UserProfile />} />
                        </Routes>
                    </div>
                </ChakraProvider>
            </AuthProvider>
        </Router >

    );
}

export default App;
