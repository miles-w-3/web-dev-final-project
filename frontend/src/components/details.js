import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

function DetailComponent () {
    const { postId } = useParams();
    console.log('postId:', postId);
    const [posts] = useState([
        {
            name: 'Sample Service',
            description: 'This is a sample service post.',
            location: { lat: 37.7749, lng: -122.4194 },
            datePosted: new Date(),
            dateNeeded: new Date(),
            postedBy: 'John Doe',
            acceptedBy: '',
        },
        {
            name: 'Sample Favor',
            description: 'This is a sample favor post.',
            location: { lat: 34.0522, lng: -118.2437 },
            datePosted: new Date(),
            dateNeeded: new Date(),
            postedBy: 'Jane Doe',
            acceptedBy: '',
        },
    ]);


    console.log('All posts:', posts);
    const selectedPost = posts.find((post) => post.name === postId);
    console.log('Selected Post:', selectedPost);

    return (
        <div>
            {selectedPost ? (
                <div>
                    <h2>{selectedPost.name}</h2>
                    <p>{selectedPost.description}</p>
                </div>
            ) : (
                <p>Post not found</p>
            )}
        </div>
    );
}

export default DetailComponent;