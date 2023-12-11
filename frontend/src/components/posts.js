import React, {useEffect, useState} from 'react';
import { getPostsByUser, getAcceptedPurchase } from "../clients/post";
import PostSummary from './postSummary'
import { useNavigate, Link } from 'react-router-dom';
import { getLoggedInUserDetails } from '../clients/user';

function MyPostsComponent() {
    const [sortedPosts, setMyPosts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [purchasedAccept, setPurchaseAccept] = useState([]);
    const [postType, setPostType] = useState("service");


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const userInfo = await getLoggedInUserDetails();
                console.log(`userInfo`, JSON.stringify(userInfo));

                setPostType(userInfo.userType === "seller" ? "service" : "favor");

                const response = await getPostsByUser();
                console.log(`response`, response)

                if (userInfo.userType === "seller") {
                    setMyPosts(response.services);

                } else {
                    setMyPosts(response.favors);
                }
                // const acceptResponse = await getAcceptedPurchase();
                // console.log(`responseAccept`, acceptResponse)
                // setPurchaseAccept(acceptResponse);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);
    console.log(`MyPosts`, JSON.stringify(sortedPosts));
    // console.log(`AcceptedPosts`, JSON.stringify(purchasedAccept));

    return (
        <div>
            <h3>My Posts</h3>
            <PostSummary sortedPosts={sortedPosts} postType={postType} />
            <h3>Favorited Posts</h3>
            <h3>Accepted/Purchased Posts</h3>
        </div>
    );
}

export default MyPostsComponent;