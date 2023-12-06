import { useState } from "react";
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
  Radio
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useUserContext } from "../state/currentUserContext";

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

  const userContext = useUserContext();
  const navigate = useNavigate();

  async function handleSubmit() {
    console.log('handling submit!');
    if (signingUp) {
      console.log('In here!');
      userContext.signUp();
      return;
    }
    console.log(`Logging in email ${email}`);
    try {
      await userContext.logIn(email, password);
      navigate('/account');
    } catch (err) {
      console.log(`Got the following err when signing in: ${JSON.stringify(err.message)}`)
    }
  }

  // leave this page if we are logged in
  if (userContext.user) {
    navigate('/profile')
  }

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