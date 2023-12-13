import React, { useEffect, useState } from "react";
import { Box, Text, Badge, Link, Divider } from "@chakra-ui/react";
import { useAuthContext } from "../state/useAuthContext";
import { Posts, SerializedFavor, SerializedService } from "../../../shared/types/posts";
import { getAnonymousPosts } from "../clients/post";
import PostSummary from "./postSummary";
import { getUserFavorites } from "../clients/user";

function Home(): JSX.Element {
    const [posts, setPosts] = useState<(SerializedService | SerializedFavor)[]>([]);
    const [service, setService] = useState<(SerializedService | SerializedFavor)[]>([]);
    const [favor, setFavor] = useState<(SerializedService | SerializedFavor)[]>([]);

  const { user } = useAuthContext();

  useEffect(() => {
    const handleAnonymous = async () => {
      const result = await getAnonymousPosts();
      if (!result) return;
      setPosts([...result.services, ...result.favors]);
      setService(result.services);
      setFavor(result.favors)
    }

    const handleFavorites = async () => {
      const result = await getUserFavorites();
      console.log("Result is ", result)
      if (!result) return;
      // check service
      setPosts([...result.services, ...result.favors]);
      setService(result.services);
      setFavor(result.favors)
    }

    // for anonymous user, load recent posts
    if (!user) {
      handleAnonymous();
    } else {
      handleFavorites();
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
          {service.length > 0 && (
            <>
            <Text>{user ? 'Favorite Service Posts': 'Recent Service Posts'}</Text>
            <PostSummary postType='service' sortedPosts={service} />
            </>
          )}
          {
            service.length === 0 && user && 'Your Favorite Services Will Appear Here'
          }
          <Divider />
          {favor.length > 0 && (
              <>
                <Text>{user ? 'Favorite Favor Posts' : 'Recent Favor Posts'}</Text>
                <PostSummary postType='favor' sortedPosts={favor} />
              </>
          )}
          {
            favor.length === 0 && user && 'Your Favorite Favors Will Appear Here'
          }
        </h3>
      </div>
    </div>
  );
}

export default Home;
