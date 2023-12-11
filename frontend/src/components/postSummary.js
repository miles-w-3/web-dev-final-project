import { Box, Text, Link } from '@chakra-ui/react';
import React from 'react';
const PostSummary = ({sortedPosts, postType }) => {
    if (!sortedPosts) {
        return <></>;
    }

    return (
        <div className='d-flex flex-wrap'>
            {sortedPosts.map((post) => (
                <Box
                    key={post.id}
                    className='card m-2'
                    style={{ width: '16rem' }}
                >
                    <Box p={4}>
                        <Text fontSize='xl' fontWeight='bold' mb={2}>
                            {post.name}
                        </Text>
                        <Text mb={2}>{post.description}</Text>
                        {post.distance != null && <Text>Distance: {post.distance} miles</Text>}
                        <button
                            className="btn btn-warning">
                            <Link href={`/${postType}/${post.id}`} color='black'>
                                View Details
                            </Link>
                        </button>
                    </Box>
                </Box>
            ))}
        </div>
    );
};

export default PostSummary;
