import { Box, Text, Link, Avatar, Flex, Button } from "@chakra-ui/react";
import React from "react";
import { useAuthContext } from "../state/useAuthContext";

const PostSummary = ({ sortedPosts, postType }) => {
  const authContext = useAuthContext();

  if (!sortedPosts) {
    return <></>;
  }

  return (
    <Flex>
      {sortedPosts.map((post) => (
        <div key={post.id} className="card m-2" style={{ width: "16rem", height: "10rem" }}>
        <Box p={4}>
            <Flex align="center" justify="space-between">
            {authContext.user && (
                <Link href={`/#/${postType}/${post.id}`} >
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                        {post.name}
                    </Text>
                </Link>
            )}
            {!authContext.user && (
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                    {post.name}
                </Text>
            )}

            <Button bgColor="white">
                <Link href={`/#/profile/${post.postedBy}`}>
                <Avatar size="sm" bg="green.600" />
                </Link>
            </Button>
            </Flex>
            <Text noOfLines={3} mb={2} fontSize={18}>
            {post.description}
            </Text>
        </Box>
        </div>
      ))}
    </Flex>
  );
};

export default PostSummary;
