import React, { useState } from "react";
import { Box, Text, Flex, Badge, Link } from "@chakra-ui/react";
import { useAuthContext } from "../state/useAuthContext";
import { AuthContextFields } from "../state/AuthContext";

function Home(): JSX.Element {
  // TODO: Pull from backend
  const [posts] = useState([
    {
      name: "Sample Service",
      description: "This is a sample service post.",
      location: { lat: 41.836828, lng: -71.993255 },
      datePosted: new Date(),
      postedBy: null,
      price: 20,
      purchasedBy: "",
      postedByName: "",
      purchasedByName: "",
    },
    {
      name: "Sample Favor",
      description: "This is a sample favor testing to se legnth of this post.",
      location: { lat: 34.0522, lng: -118.2437 },
      datePosted: new Date(),
      dateNeeded: new Date(),
      postedBy: "Jane Doe",
      acceptedBy: "",
      postedByName: "",
      acceptedByName: "",
    },
    {
      name: "Sample Favor",
      description: "This is a sample favor post.",
      location: { lat: 34.0522, lng: -118.2437 },
      datePosted: new Date(),
      dateNeeded: new Date(),
      postedBy: "Jane Doe",
      acceptedBy: "",
      postedByName: "",
      acceptedByName: "",
    },
  ]);
  const { user } = useAuthContext();

  const displayPosts = user
    ? posts.filter((post) => post.postedBy === user.displayName)
    : posts;

  const isUserLoggedIn = !!user;

  return (
    <div className="d-flex flex-column align-items-center ">
      <div className="bg-light-subtle d-flex flex-column align-items-center">
        <div className="text-center p-5 w-75 bg-light-subtle">
          <h1 className="fw-semibold">Welcome to Collide!</h1>
          <h2 className="fw-light">
            This is your place to find any services you need from your fellow
            Huskies on campus!
          </h2>
          <div className="m-5">
            <Link
              color='green.600'
              href='/search'
              fontSize={24}>
              Search for what you need
            </Link>
          </div>
        </div>
      </div>
      <div className="w-75 p-4">
        <h3 className="fw-light">
          {isUserLoggedIn
            ? "Here are your recent posts"
            : "Here are some posts recently made by our users"}
        </h3>
      </div>
      <div className="w-75 d-flex flex-wrap justify-content-start">
        {displayPosts.map((post, index) => (
          <div key={index} className="card m-2" style={{ width: "16rem" }}>
            <Box p={4}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                {post.name}
              </Text>
              <Text mb={2}>Posted by {post.postedByName || post.postedBy}</Text>
              <Text mb={4}>{post.description}</Text>
              {post.price && (
                <Text>
                  Price: <Badge variant="outline">{`$${post.price}`}</Badge>
                </Text>
              )}
              {post.dateNeeded && (
                <Text>Date Needed: {post.dateNeeded.toDateString()}</Text>
              )}
              {post.purchasedBy && (
                <Text>
                  Purchased by {post.purchasedByName || post.purchasedBy}
                </Text>
              )}
            </Box>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
