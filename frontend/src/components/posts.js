import React, { useEffect, useState } from "react";
import {
  getPostsByUser,
  getAcceptedPurchase,
  getIsFavorite,
} from "../clients/post";
import PostSummary from "./postSummary";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { getLoggedInUserDetails, getUserFavorites } from "../clients/user";
import { useAuthContext } from "../state/useAuthContext";

function MyPostsComponent() {
  const [sortedPosts, setMyPosts] = useState([]);
  const [favoritesServices, setFavoritesServices] = useState([]);
  const [purchased, setPurchase] = useState([]);
  const [accepted, setAccept] = useState([]);
  const [postType, setPostType] = useState("service");

  const authContext = useAuthContext();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userInfo = await getLoggedInUserDetails();
        console.log(`userInfo`, JSON.stringify(userInfo));

        setPostType(userInfo.userType === "seller" ? "service" : "favor");

        const response = await getPostsByUser();
        const acceptResponse = await getAcceptedPurchase();

        if (userInfo.userType === "seller") {
          setMyPosts(response.services);
        } else {
          setMyPosts(response.favors);
        }

        setPurchase(acceptResponse.services);
        setAccept(acceptResponse.favors);

        const result = await getUserFavorites();
        if (!result) return;
        // Service and Favors

        // check service
        setFavoritesServices(result.favors.concat(result.services));

      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    console.log(`UserContext is ${authContext.user}`);
    if (authContext.user) fetchPosts();
  }, [authContext.user]);

  console.log(`MyPosts`, JSON.stringify(sortedPosts));
  console.log(`Purchase`, JSON.stringify(purchased));
  console.log(`Accept`, JSON.stringify(accepted));
  console.log(`Favorites`, JSON.stringify(favoritesServices));

  return (
    <div className="d-flex flex-column align-items-center ">
      {authContext.user == null && <Navigate to="/login" />}
      <div className="w-75 p-4">
        <h3 className="fw-light">My Posts</h3>
        <PostSummary sortedPosts={sortedPosts} postType={postType} />

        <h3 className="fw-light">Favorited Posts</h3>
        <PostSummary sortedPosts={favoritesServices} postType={"service"} />

        <h3 className="fw-light">Purchased Services</h3>
        <PostSummary sortedPosts={purchased} postType={"service"} />

        <h3 className="fw-light">Accepted Favors</h3>
        <PostSummary sortedPosts={accepted} postType={"favor"} />
      </div>
    </div>
  );
}

export default MyPostsComponent;
