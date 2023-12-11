import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostSummary = ({ sortedPosts, postType }) => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Search Results:</h2>
            <ul className="list-group">
                {sortedPosts.map((post) => (
                    <li key={post.id} className="list-group-item">
                        <h3>{post.name}</h3>
                        <p>{post.description}</p>
                        <p>Distance: {post.distance} miles</p>
                        <button
                            className="btn btn-warning"
                            onClick={() => navigate(`/${postType}/${post.id}`)}
                        >
                            View Details
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostSummary;
