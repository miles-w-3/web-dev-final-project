
// TODO: If profile from params is defined, show that user's profile instead
// of the logged in user. helpful because we can reuse components but

import { Navigate, useNavigate, useParams } from "react-router"
import { useAuthContext } from "../state/useAuthContext";
import { Box, Button, Flex, FormControl, Heading, Input, InputGroup, Stack, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getUserDetails, updateUserDetails } from "../clients/user";
import { UserDetails } from "../../../shared/types/users";
import { CreatePost } from "./createPost";

// we don't want to show logout button when showing someone else's user
export default function UserProfile() {
  const userContext = useAuthContext();
  const [userDetails, setUserDetails] = useState<UserDetails>({ uid: '', email: '', name: '', userType: 'requestor'});
  const [currentUser, setCurrentUser] = useState<string | undefined>(userContext.user?.uid);
  const [showingCreatePost, setShowingCreatePost] = useState<boolean>(false);
  const [userPosts, setUserPosts] = useState([]);
  let { profile } = useParams();
  console.log(`Profile is ${JSON.stringify(profile)}`);

  const toast = useToast();
  // hook to make sure that we don't see this page when logged out
  useEffect(() => {

    const handleUserDetails = async (uid: string) => {
      console.log(`About to get user details for ${uid}`);
      const result = await getUserDetails(uid);
      console.log(`in hud, Got user details ${JSON.stringify(result)}`)
      if (result && result.data){
        setUserDetails(result.data);
        // const postsResult = await getPostsForUser(uid);
        // console.log(`User posts: ${JSON.stringify(postsResult)}`);
        // if (postsResult && postsResult.data) {
        //   setUserPosts(postsResult.data);
        // }
      }
    }
    // leave this page if we are logged in

    if (currentUser) handleUserDetails(currentUser);

  }, [userContext, currentUser, setUserDetails]);


  const handleSave = async () => {
    try {
      await updateUserDetails(userDetails);
    } catch {
      toast({
        title: 'Failed To save updates',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: 'Successfully updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }

  const handleLogout = async () => {
    await userContext.logOut();
  }


  const handleNameUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLButtonElement).value;
    setUserDetails({...userDetails, name: value});
  }

  return (
    <>
      <CreatePost userType={userDetails.userType} showing={showingCreatePost} hide={() => setShowingCreatePost(false)} />
      <Flex
        flexDirection="column"
        width="100wh"
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
          <Heading color="green.600"> {'User'}'s Account</Heading>
          <Box minW={{ base: "90%", md: "468px" }}>

            <form>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <div>
                  <p>Email: {userDetails.email}</p>
                  <p>Account type: {userDetails.userType}</p>
                </div>

                <InputGroup>
                  <Input
                    disabled={currentUser !== userContext.user?.uid}
                    type='text'
                    placeholder="Name"
                    value={userDetails.name}
                    onChange={event => handleNameUpdate(event)}
                  />
                </InputGroup>

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
                  borderRadius={0}
                  variant="solid"
                  colorScheme="gray"
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
  )
}