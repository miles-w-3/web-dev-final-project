import React, {useEffect, useState} from 'react';
import { getPostsByUser, getAcceptedPurchase } from "../clients/post";
import PostSummary from './postSummary'
import { useNavigate, Link } from 'react-router-dom';

function MyPostsComponent() {
    const [sortedPosts, setMyPosts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [purchasedAccept, setPurchaseAccept] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getPostsByUser();
                console.log(`response`, response)
                setMyPosts(response);
                const acceptResponse = await getAcceptedPurchase();
                console.log(`responseAccept`, acceptResponse)
                setPurchaseAccept(acceptResponse);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);
    console.log(`MyPosts`, JSON.stringify(sortedPosts));
    console.log(`AcceptedPosts`, JSON.stringify(purchasedAccept));

    return (
        <div>
            <h3>My Posts</h3>
            {sortedPosts.length > 0 ? (
                <PostSummary sortedPosts={sortedPosts} postType="service" />
            ) : (
                <p>Loading...</p>
            )}
            <h3>Favorited Posts</h3>
            <h3>Accepted/Purchased Posts</h3>
        </div>
    );
}

export default MyPostsComponent;