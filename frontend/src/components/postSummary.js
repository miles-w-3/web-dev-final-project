import { Box, Text, Link, Avatar, Flex, Button, Badge } from "@chakra-ui/react";
import React from "react";
import { useAuthContext } from "../state/useAuthContext";

const PostSummary = ({ sortedPosts, postType }) => {
  const authContext = useAuthContext();

  if (!sortedPosts) {
    return <></>;
  }

  return (
    <Flex flexWrap="wrap" justifyContent='start' mb={5}>
      {sortedPosts.map((post) => (
        <div
          key={post.id}
          className="card m-3"
          style={{ width: "18rem", height: "16rem", display: "flex", flexDirection: "column" }}        >
          <Box p={4} style={{ flex: 1 }}>
            <Flex align="center" justify="space-between">
              {authContext.user && (
                <Link href={`/${postType}/${post.id}`}>
                  <Text fontSize="xl"  noOfLines={1} fontWeight="bold" mb={2}>
                    {post.name}
                  </Text>
                </Link>
              )}
              {!authContext.user && (
                <Text noOfLines={1} fontSize="xl" fontWeight="bold" mb={2}>
                  {post.name}
                </Text>
              )}

              <Button bgColor="white">
                <Link href={`/profile/${post.postedBy}`}>
                  <Avatar size="sm" bg="green.600" />
                </Link>
              </Button>
            </Flex>
            <Text noOfLines={3} mb={2} fontSize={18}>
              {post.description}
            </Text>
            </Box>
            <Box p={4} >
            {post.distance != null && post.distance.text && (
              <Text fontSize={12} mb={2}>Distance: {post.distance.text}</Text>
            )}
            {post.price != null && (
              <Text fontSize={12} mb={2}>
                Price: <Badge variant="outline">{`$${post.price}`}</Badge>
              </Text>
            )}
          </Box>
        </div>
      ))}
    </Flex>
  );
};

export default PostSummary;
