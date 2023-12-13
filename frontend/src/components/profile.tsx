// TODO: If profile from params is defined, show that user's profile instead
// of the logged in user. helpful because we can reuse components but

import { Navigate, useNavigate, useParams } from "react-router";
import { useAuthContext } from "../state/useAuthContext";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  getAnonymousDetails,
  getUserDetails,
  updateUserDetails,
} from "../clients/user";
import { UserDetails } from "../../../shared/types/users";
import { CreatePost } from "./createPost";

// we don't want to show logout button when showing someone else's user
export default function UserProfile() {
  const userContext = useAuthContext();
  const [userDetails, setUserDetails] = useState<UserDetails>({
    uid: "",
    email: "",
    name: "",
    userType: "requestor",
  });
  const [currentUser, setCurrentUser] = useState<string | undefined>();
  const [showingCreatePost, setShowingCreatePost] = useState<boolean>(false);
  let { profileId } = useParams();

  const toast = useToast();

  // hook to load user details
  useEffect(() => {
    // defer to the url, otherwise look at the logged in user
    const newCurrentUser = profileId ?? userContext.user?.uid;

    setCurrentUser(newCurrentUser);

    const handleUserDetails = async () => {
      if (!currentUser) return;
      let result;
      // if we are logged in, get full details of a user
      if (userContext.user) {
        result = await getUserDetails(currentUser);
      } else {
        // otherwise, get the filtered results
        result = await getAnonymousDetails(currentUser);
      }

      console.log(`in hud, Got user details ${JSON.stringify(result)}`);
      if (result && result.data) {
        setUserDetails(result.data);
      }
    };

    if (currentUser) handleUserDetails();
  }, [profileId, userContext.user, currentUser, setUserDetails]);

  const handleSave = async () => {
    try {
      await updateUserDetails(userDetails);
    } catch {
      toast({
        title: "Failed To save updates",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Successfully updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleLogout = async () => {
    await userContext.logOut();
  };

  const handleNameUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLButtonElement).value;
    setUserDetails({ ...userDetails, name: value });
  };

  return (
    <>
      {!profileId && !userContext.user && <Navigate to="/login" />}
      <CreatePost
        userType={userDetails.userType}
        showing={showingCreatePost}
        hide={() => setShowingCreatePost(false)}
      />
      <Flex
        flexDirection="column"
        width="100"
        height="100vh"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
        >
          <Heading color="green.600">
            {currentUser === userContext.user?.uid ? "Manage" : "View"} Account
          </Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <form>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <Flex align="center" justify="start">
                  {currentUser === userContext.user?.uid ? (
                    <>
                    <Text mb={0}>Name: </Text>
                    <Input
                      ms={2}
                      type="text"
                      placeholder="Name"
                      value={userDetails.name}
                      onChange={(event) => handleNameUpdate(event)}
                    />
                    </>
                  ) : (
                    <Text fontSize={28} fontWeight={"bold"}>{userDetails.name}</Text>
                  )}
                </Flex>
                <div>
                  <p>Email: {userDetails.email}</p>
                  <p>Account type: {userDetails.userType}</p>
                </div>

                
                <Button
                  hidden={currentUser !== userContext.user?.uid}
                  borderRadius={0}
                  variant="solid"
                  colorScheme="green"
                  width="full"
                  onClick={handleSave}
                >
                  Save
                </Button>

                <Button
                  hidden={currentUser !== userContext.user?.uid}
                  borderRadius={0}
                  variant="solid"
                  colorScheme="blue"
                  width="full"
                  onClick={() => setShowingCreatePost(true)}
                >
                  Create New Post
                </Button>

                <Button
                  hidden={currentUser !== userContext.user?.uid}
                  borderRadius={0}
                  variant="solid"
                  colorScheme="teal"
                  width="full"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
