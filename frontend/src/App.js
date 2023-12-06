import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlacesAutocompleteComponent from './components/test';
import UserAuth from './components/auth';
import { ChakraProvider } from '@chakra-ui/react';
import { UserAuthContextProvider } from './state/currentUserContext';
import UserProfile from './components/profile';

function App() {
    return (
        <UserAuthContextProvider>
            <ChakraProvider>
                <div className="App">
                    <Router>
                        <Routes>
                            <Route path='/search' element={<PlacesAutocompleteComponent />} />
                            <Route path='/auth' element={<UserAuth />} />
                            <Route path='/profile' element={<UserProfile />} />
                            <Route path='/profile/:uid' element={<UserProfile />} />
                        </Routes>
                    </Router>
                </div>
            </ChakraProvider>
        </UserAuthContextProvider>
    );
}

export default App;
