import { Box, Text, Link, Avatar, Flex, Button } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import React from "react";
import { useAuthContext } from "../state/useAuthContext";

const PostSummary = ({ sortedPosts, postType }) => {
  const authContext = useAuthContext();

  if (!sortedPosts) {
    return <></>;
  }

  return (
    <div className="w-75 d-flex flex-wrap justify-content-start mb-5">
      {sortedPosts.map((post) => (
        <div className="card m-2" style={{ width: "16rem", height: "10rem" }}>
          /* To do: disable this when */
          <ChakraLink
            key={post.id}
            href={authContext.user == null ? "" : `/${postType}/${post.id}`}
            color="black"
            _hover={{ textDecor: "none" }}
          >
            <Box p={4}>
              <Flex align="center" justify="space-between">
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  {post.name}
                </Text>
                <Button bgColor="white">
                  <Link href={`/profile/${post.postedBy}`}>
                    <Avatar size="sm" bg="green.600" />
                  </Link>
                </Button>
              </Flex>
              <Text noOfLines={3} mb={2}>
                {post.description}
              </Text>
            </Box>
          </ChakraLink>
        </div>
      ))}
    </div>
  );
};

export default PostSummary;
