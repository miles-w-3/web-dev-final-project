
// TODO: If profile from params is defined, show that user's profile instead
// of the logged in user. helpful because we can reuse components but

import { useNavigate, useParams } from "react-router"
import { useUserContext } from "../state/currentUserContext";
import { Box, Button, Flex, FormControl, Heading, Input, InputGroup, InputLeftElement, Stack } from "@chakra-ui/react";

// we don't want to show logout button when showing someone else's user
export default function UserProfile() {
  const userContext = useUserContext();
  const navigate = useNavigate();
  let { profile } = useParams();


  // if no one is logged in, bail out to login page
  if (!userContext.user) {
    navigate('/auth');
    return <></>;
  }

  // if url didn't provide a profile, set to the logged in user
  if (!profile) profile = userContext.user;

  // TODO: need to pull the rest of the user info from the db
  const handleSubmit = () => {
    // TODO: update fields in db
  }

  const handleLogout = async () => {
    await userContext.logOut();
    navigate('/auth');
  }


  // provide an editable profile for our user
  if (profile.uid === userContext.user.uid) {
    console.log(`In here, but profile is ${JSON.stringify(profile)}`)
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
          <Heading color="green.600"> {profile.displayName ?? 'User'}'s Account</Heading>
          <Box minW={{ base: "90%", md: "468px" }}>

            <form>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >

                <div>
                  Email: {profile.email}
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