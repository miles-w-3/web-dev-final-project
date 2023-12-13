import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchComponent from "./components/search";
import UserAuth from './components/auth';
import { Box, ChakraProvider, Container } from '@chakra-ui/react';
import { AuthProvider } from './state/AuthProvider';
import UserProfile from './components/profile';
import { Navigation } from './components/navigation';
import { ServicePost } from './components/service';
import { FavorPost } from './components/favor';
import MyPostsComponent from './components/posts';
import Home from './components/home';
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
    return (
        <Router>
            <AuthProvider>
                <ChakraProvider>
                    <div className="App">
                        <Navigation />
                        <Box >
                            <Routes>
                                <Route path='/search' element={<SearchComponent />} />
                                <Route path='/login' element={<UserAuth />} />
                                <Route path='/profile' element={<UserProfile />} />
                                <Route path='/profile/:profileId' element={<UserProfile />} />
                                <Route path='/service/:serviceId' element={<ServicePost />} />
                                <Route path='/favor/:favorId' element={<FavorPost />} />
                                <Route path='/posts' element={<MyPostsComponent />} />
                                <Route path='/*' element={<Home />} />
                            </Routes>
                        </Box>
                    </div>
                </ChakraProvider>
            </AuthProvider>
        </Router >

    );
}

export default App;
