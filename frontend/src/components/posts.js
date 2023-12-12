import React, {useEffect, useState} from 'react';
import { getPostsByUser, getAcceptedPurchase } from "../clients/post";
import PostSummary from './postSummary'
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { getLoggedInUserDetails } from '../clients/user';
import { useAuthContext } from '../state/useAuthContext';

function MyPostsComponent() {
    const [sortedPosts, setMyPosts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [purchased, setPurchase] = useState([]);
    const [accepted, setAccept] = useState([]);
    const [postType, setPostType] = useState("service");

    const authContext = useAuthContext();


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const userInfo = await getLoggedInUserDetails();
                console.log(`userInfo`, JSON.stringify(userInfo));

                setPostType(userInfo.userType === "seller" ? "service" : "favor");

                const response = await getPostsByUser();
                const acceptResponse = await getAcceptedPurchase();

                if (userInfo.userType === "seller") {
                    setMyPosts(response.services);

                } else {
                    setMyPosts(response.favors);
                }

                setPurchase(acceptResponse.services);
                setAccept(acceptResponse.favors);



            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        if (authContext.user) fetchPosts();
    }, [authContext.user]);
    console.log(`MyPosts`, JSON.stringify(sortedPosts));
    console.log(`Purchase`, JSON.stringify(purchased));
    console.log(`Accept`, JSON.stringify(accepted));

    return (
        <div>
            {authContext.user == null && <Navigate to='/login' />}
            <h3>My Posts</h3>
            <PostSummary sortedPosts={sortedPosts} postType={postType} />
            <h3>Favorited Posts</h3>
            <h3>Purchased Services</h3>
            <PostSummary sortedPosts={purchased} postType={"service"} />
            <h3>Accepted Favors</h3>
            <PostSummary sortedPosts={accepted} postType={"favor"} />
        </div>
    );
}

export default MyPostsComponent;