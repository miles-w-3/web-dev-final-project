import { Box, Text, Link, Badge, Flex, Button, Avatar } from '@chakra-ui/react';
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
                        <Flex
                            align='center'
                            justify='space-between'
                        >
                            <Text fontSize='xl' fontWeight='bold' mb={2}>
                                {post.name}
                            </Text>
                            <Button bgColor='white'>
                                <Link href={`/profile/${post.postedBy}`}>
                                    <Avatar size='sm' bg='green.600' />
                                </Link>
                            </Button>
                        </Flex>
                        <Text mb={2}>{post.description}</Text>
                        {post.distance != null && <Text>Distance: {post.distance} miles</Text>}
                        {post.price != null && <Text> Price: <Badge variant="outline">{`$${post.price}`}</Badge></Text>}
                        <Button
                            colorScheme='cyan'>
                            <Link href={`/${postType}/${post.id}`} color='black'>
                                View Details
                            </Link>
                        </Button>
                    </Box>
                </Box>
            ))}
        </div>
    );
};

export default PostSummary;
