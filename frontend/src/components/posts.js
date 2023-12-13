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
  const [favoritesFavors, setFavoriteFavors] = useState([])
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
        // check service
        setFavoritesServices(result.services);
        setFavoriteFavors(result.favors);



      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    console.log(`UserContext is ${authContext.user}`);
    if (authContext.user) fetchPosts();
  }, [authContext.user]);

  return (
    <div className="d-flex flex-column align-items-center ">
      {authContext.user == null && <Navigate to="/login" />}
      <div className='container mt-4'>
        <h3 className="fw-light">My Posts</h3>
        <PostSummary sortedPosts={sortedPosts} postType={postType} />

        <h3 className="fw-light">Favorited Posts</h3>
        <PostSummary sortedPosts={favoritesServices} postType={"service"} />
        <PostSummary sortedPosts={favoritesFavors} postType={"favor"} />

        <h3 className="fw-light">Purchased Services</h3>
        <PostSummary sortedPosts={purchased} postType={"service"} />

        <h3 className="fw-light">Accepted Favors</h3>
        <PostSummary sortedPosts={accepted} postType={"favor"} />
      </div>
    </div>
  );
}

export default MyPostsComponent;
