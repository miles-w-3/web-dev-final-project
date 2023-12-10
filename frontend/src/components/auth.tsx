import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
  FormControl,
  InputRightElement,
  RadioGroup,
  Radio,
  useToast,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useAuthContext } from "../state/useAuthContext";
import { FirebaseError } from "firebase/app";
import { UserType } from "../../../shared/types/users";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

// page for user login and signin

export default function UserAuth() {
  const [showingPassword, setShowingPassword] = useState(false);
  // modify the form if signing up
  const [signingUp, setSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userContext = useAuthContext();

  // sign up state fields
  const [userType, setUserType] = useState<UserType>('requestor');
  const [name, setName] = useState('');
  const [authorized, setAuthorized] = useState(userContext.user != null);
  const toast = useToast();


  async function handleSubmit() {
    if (signingUp) {
      console.log('In here!');
      try {
        // first, add the user to the auth side
        await userContext.signUp(email, password, userType, name);
        // we set authorized here because that means register cookie exchange with backend has finished
        setAuthorized(true);
      } catch(err) {
        let reason = 'Failed to create account'
        if (err instanceof FirebaseError) {
          console.error(`Error while creating account: ${err.message}`);
          reason = err.message;
        }
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
      await userContext.logIn(email, password);
      // we set authorized here because that means login cookie exchange with backend has finished
      setAuthorized(true);
    } catch (err) {
      toast({
        title: 'Unable to log in',
        description: "Make sure your username and password are correct",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      if (err instanceof FirebaseError) console.log(`Got the following err when signing in: ${JSON.stringify(err.message)}`);
    }
  }


  return (
    <>
      {authorized && <Navigate to='/profile' />}
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
                      onChange={event => {
                        const val = event.target.value
                        if (typeof val === 'string') setEmail(val);
                      }}
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
                {signingUp && <RadioGroup onChange={ (val) => setUserType(val as UserType)} value={userType}>
                  User Type:
                  <Stack direction='row'>
                    <Radio value='requestor'>Requestor</Radio>
                    <Radio value='seller'>Seller</Radio>
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

          </Box>
        </Stack>
      </Flex>
    </>
  )
}