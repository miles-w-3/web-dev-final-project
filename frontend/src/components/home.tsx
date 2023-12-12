import React, { useEffect, useState } from "react";
import { Box, Text, Badge, Link } from "@chakra-ui/react";
import { useAuthContext } from "../state/useAuthContext";
import { Posts, SerializedFavor, SerializedService } from "../../../shared/types/posts";
import { getAnonymousPosts } from "../clients/post";
import PostSummary from "./postSummary";

function Home(): JSX.Element {
    const [servicePosts, setServicePosts] = useState<SerializedService[]>([]);
    const [favorPosts, setFavorPosts] = useState<SerializedFavor[]>([]);

  const { user } = useAuthContext();

  useEffect(() => {
    const handleAnonymous = async () => {
      const result = await getAnonymousPosts();
      if (!result) return;
      setServicePosts(result.services);
      setFavorPosts(result.favors);
    }

    // for anonymous user, load recent posts
    if (!user) {
      handleAnonymous();
    }
  }, [user])

  return (
    <div className="d-flex flex-column align-items-center ">
      <div className="bg-light-subtle d-flex flex-column align-items-center">
        <div className="text-center ps-5 pe-5 pt-3 pb-1 w-75 bg-light-subtle">
          <h1 className="fw-semibold">Welcome to Collide!</h1>
          <h2 className="fw-light">
            This is your place to find any services you need from your fellow
            Huskies on campus!
          </h2>
          <div className="m-5">
            <Link color="green.600" href="/search" fontSize={24}>
              Search for what you need
            </Link>
          </div>
        </div>
      </div>
      <div className="w-75 p-4">
        <h3 className="fw-light">
          {user
            ? 'Favorite Service Posts'
            : 'Recent Service Posts'}
          <PostSummary postType='service' sortedPosts={servicePosts} />
        </h3>
        <h3 className="fw-light">
          {user
            ? 'Favorite Favor Posts'
            : 'Recent Favor Posts'}
          <PostSummary postType='favor' sortedPosts={favorPosts} />
        </h3>
      </div>
    </div>
  );
}

export default Home;
