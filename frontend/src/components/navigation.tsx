import { Box, Button, Collapse, Flex, Stack, Text } from '@chakra-ui/react';
import { FaBars, FaTimes } from 'react-icons/fa';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../state/useAuthContext';
import { AuthContextFields } from '../state/AuthContext';
import { CreatePost } from './createPost';

function NavItem({ to, name }:{ to: string, name: string}) {
    return (
    <Link to={to}>
      <Text display="block" color="whitesmoke" mb={0}>
        {name}
      </Text>
    </Link>
  );
}



function AccountButton({ authContext }: { authContext: AuthContextFields }) {
  const text = authContext.user ? "Welcome, " + authContext.user.email : 'Log In / Sign Up';
  const dest = authContext.user ? '/profile' : '/login';

  return (
    <Button justifyContent='end' color='green.800'>
      <Link to={dest} color='white'>
        {text}
      </Link>
    </Button>
  );
}

export function Navigation() {
  const authContext = useAuthContext();
    const options: Record<string, string> = {
    'Home': '/', 'My Posts': '/posts',
    'Search': `/search`
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  
  return (
        <Flex
id='navbar'
      as="header"
      align='center'
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={4}
      bgColor='green.600'
      position='sticky'
      top={0}
      zIndex={100}
    >
      <Flex align='center' flexGrow={1} flex-direction='row'>

        <Link to='/'>
          <Text display="block" color='whitesmoke' fontWeight='bold'>
            Collide
          </Text>
        </Link>

        <Box
          display={{ base: "block", md: "none" }}
          ml="auto"
        >
          <FaBars onClick={toggleCollapse} style={{ cursor: 'pointer', color: 'whitesmoke' }} />
        </Box>
      </Flex>

      <Box
        display={{ base: "block", md: "none" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Collapse in={isOpen}>
          <Stack
            spacing={4}
            align="center"
            justify="flex-end"
            direction="column"
            pt={4}
          >
            <AccountButton authContext={authContext} />
            {Object.keys(options).map((title: string) => (
  <NavItem
    key={title}
    to={options[title]}
    name={title}
  />
))}
          </Stack>
        </Collapse>
      </Box>

      <Box
        display={{ base: "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Stack
          spacing={8}
          align="center"
          direction={["column", "row", "row", "row"]}
          justify="center"
        >{Object.keys(options).map((title: string) => (
          <NavItem
            key={title}
            to={options[title]}
            name={title}
          />
        ))}
          <AccountButton authContext={authContext} />
        </Stack>
      </Box>
    </Flex>
  );
}
