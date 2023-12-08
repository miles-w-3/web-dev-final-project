import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
  RadioGroup,
  Radio,
  useToast
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useAuthContext } from "../state/useAuthContext";
import { FirebaseError } from "firebase/app";
import { logInUser, registerUser } from "../clients/user";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

// page for user login and signin

export default function UserAuth() {
  const [showingPassword, setShowingPassword] = useState(false);
  // modify the form if signing up
  const [signingUp, setSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // sign up state fields
  const [userType, setUserType] = useState('finder');
  const [name, setName] = useState('');
  const toast = useToast();

  const userContext = useAuthContext();
  const navigate = useNavigate();

  async function handleSubmit() {
    if (signingUp) {
      console.log('In here!');
      try {
        // first, add the user to the auth side
        const signedInUser = await userContext.signUp(email, password);
        console.log(`Sign in is ${JSON.stringify(signedInUser)}`);
        const idToken = await userContext.user.getIdToken();
        // sign in to the backend as well
        await registerUser(email, userType, name, signedInUser.user.uid, idToken);
        // TODO: Create route to the backend
      } catch(err) {
        let reason = 'Failed to create account'
        if (err instanceof FirebaseError) {
          reason = err.message;
        }
        console.error(`Error while creating account: ${err.message}`);
        toast({
          title: 'Account Creation Error',
          description: reason,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
      return;
    }

    // handling log in
    console.log(`Logging in email ${email}`);
    try {
      const loggedInUser = await userContext.logIn(email, password);
      console.log(`got loggedin user ${JSON.stringify(loggedInUser)}`);
      const idToken = await loggedInUser.user.stsTokenManager.accessToken;
      console.log(`Token is ${idToken}`)
      await logInUser(idToken);
      navigate('/profile');
    } catch (err) {
      toast({
        title: 'Invalid Credentials',
        description: "Make sure your username and password are correct",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      console.log(`Got the following err when signing in: ${JSON.stringify(err.message)}`)
    }
  }

  // hook to make sure that we don't see this page when logged in
  useEffect(() => {
    // leave this page if we are logged in
    if (userContext.user) {
      navigate('/profile')
    }
  }, [navigate, userContext])


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
        <Heading color="green.600">Account</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          { !userContext.user &&
            <form>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input
                      type="email"
                      placeholder="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<CFaLock color="gray.300" />}
                    />
                    <Input
                      type={showingPassword ? "text" : "password"}
                      placeholder="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={() => setShowingPassword(!showingPassword)}>
                        {showingPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                {signingUp && (
                  <InputGroup>
                    <Input
                      type='text'
                      placeholder="Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </InputGroup>
                )}
                {signingUp && <RadioGroup onChange={setUserType} value={userType}>
                  User Type:
                  <Stack direction='row'>
                    <Radio value='finder'>Finder</Radio>
                    <Radio value='asker'>Asker</Radio>
                  </Stack>
                </RadioGroup>}

                <Button
                  borderRadius={0}
                  variant="solid"
                  colorScheme="green"
                  width="full"
                  onClick={handleSubmit}
                >
                  {signingUp ? 'Sign Up' : 'Log In'}
                </Button>
                <Button
                  borderRadius={0}
                  variant="solid"
                  colorScheme="gray"
                  width="full"
                  onClick={() => setSigningUp(!signingUp)}
                >
                {signingUp? 'Existing account? Log In' : 'Sign Up'}
                </Button>
              </Stack>
            </form>
          }
        </Box>
      </Stack>
    </Flex>
  )
}