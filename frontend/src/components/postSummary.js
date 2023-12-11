import React from 'react';
import { Link } from 'react-router-dom';
const PostSummary = ({sortedPosts, postType }) => {
    if (!sortedPosts) {
        return <></>;
    }




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
                            className="btn btn-warning">
                            <Link to= {`/${postType}/${post.id}`} color='white'>
                                View Details
                            </Link>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostSummary;
