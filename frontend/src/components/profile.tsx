
// TODO: If profile from params is defined, show that user's profile instead
// of the logged in user. helpful because we can reuse components but

import { Navigate, useNavigate, useParams } from "react-router"
import { useAuthContext } from "../state/useAuthContext";
import { Box, Button, Flex, FormControl, Heading, Input, InputGroup, InputLeftElement, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getLoggedInUserDetails, listUsers } from "../clients/user";
import { UserDetails } from "../../../shared/types/users";

// we don't want to show logout button when showing someone else's user
export default function UserProfile() {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const userContext = useAuthContext();
  const navigate = useNavigate();
  let { profile } = useParams();

  // hook to make sure that we don't see this page when logged out
  // useEffect(() => {
  //   // leave this page if we are logged in
  //   if (!userContext.user) {
  //     navigate('/auth')
  //     return
  //   }
  // }, [navigate, userContext]);
  // // if no one is logged in, bail out to login page
  if (!userContext.user) {
    return <Navigate to="/auth" />;
  }

  // if url didn't provide a profile, set to the logged in user
  if (!profile) profile = userContext.user.uid;

  //getLoggedInUserDetails();

  // TODO: need to pull the rest of the user info from the db
  const handleSubmit = () => {
    // TODO: update fields in db
  }

  const handleLogout = async () => {
    await userContext.logOut();
  }

  const handleTest = async () => {
    await listUsers();
  }

  const handleTestTwo = async () => {
    getLoggedInUserDetails();
  }


  // provide an editable profile for our user
  if (profile === userContext.user.uid) {
    return (
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
                  Email: todo
                  User type: todo
                </div>

                <InputGroup>
                  <Input
                    type='text'
                    placeholder="Name"
                    value={''}
                  />
                </InputGroup>


                <Button
                  borderRadius={0}
                  variant="solid"
                  colorScheme="green"
                  width="full"
                  onClick={handleSubmit}
                >
                  Save
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
                <Button
                  borderRadius={0}
                  variant="solid"
                  colorScheme="gray"
                  width="full"
                  onClick={handleTest}
                >
                  Test
                </Button>
                <Button
                  borderRadius={0}
                  variant="solid"
                  colorScheme="gray"
                  width="full"
                  onClick={handleTestTwo}
                >
                  Test
                </Button>
              </Stack>
            </form>

          </Box>
        </Stack>
      </Flex>
    )
  }
  // provide a static profile view for other users
  return <></>;
}