import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlacesAutocompleteComponent from './webpages/test';
import UserAuth from './webpages/auth';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
    return (
        <ChakraProvider>
            <div className="App">
                <Router>
                    <Routes>
                        <Route path='/search' element={<PlacesAutocompleteComponent />} />
                        <Route path='/auth' element={<UserAuth />} />
                    </Routes>
                </Router>
            </div>
        </ChakraProvider>
    );
}

export default App;
