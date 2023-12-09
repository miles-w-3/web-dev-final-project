import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../state/useAuthContext';
import { AuthContextFields } from '../state/AuthContext';

function NavItem({ to, name }:{ to: string, name: string}) {
  return (
    <Link to={to}>
      <Text display="block" color='whitesmoke'>
        {name}
      </Text>
    </Link>
  )
}

function AccountButton({ authContext }:{ authContext: AuthContextFields}) {
  const text = authContext.user ? "Welcome, " + authContext.user.email : 'Log In / Sign Up';
  const dest = authContext.user ? '/profile' : '/auth';

  return (
    <Button
      justifyContent='end'
      color='green.800'>
      <Link to={dest} color='white'>
        {text}
      </Link>
    </Button>
  )
}

export function Navigation() {
  const authContext = useAuthContext();
  const location = useLocation();
  const options: Record<string, string> = {
    'Home': '/', 'Posts': '/posts', 'Users': '/users',
    'Location Search': '/search'
  };
  return (
    <Flex
      as="nav"
      align='center'
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={4}
      bgColor='green.600'
    >
      <Link to='/'>
        <Text display="block" color='whitesmoke' fontWeight='bold'>
          Collide
        </Text>
      </Link>


      <Box
        display={{ base: "block", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Stack
          spacing={8}
          align="center"
          justify={["center", "space-between", "flex-end", "flex-end"]}
          direction={["column", "row", "row", "row"]}
          pt={[4, 4, 0, 0]}
        >
          {Object.keys(options).map((title: string) => (
            <NavItem key={title} to={options[title]} name={title}/>
          ))}

        </Stack>
      </Box>
      <AccountButton authContext={authContext} />

    </Flex>
  )
}