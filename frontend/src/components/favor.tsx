import React, { useEffect, useState } from "react";
import { Favor } from "../../../shared/types/posts";
import { useParams } from "react-router";
import { getFavor, acceptFavor } from "../clients/post";
import { Box, Button, Divider, Flex, Text, Link, useToast } from "@chakra-ui/react";
import { useAuthContext } from "../state/useAuthContext";

export function FavorPost() {
  const { favorId } = useParams();
  const [currentFavor, setCurrentFavor] = useState<Favor | undefined>();
  const authContext = useAuthContext();
  const toast = useToast();

  useEffect(() => {

    const getCurrentService = async () => {
      if (!favorId) {
        setCurrentFavor(undefined);
        return;
      }

      const favorFromBackend = await getFavor(favorId);
      setCurrentFavor(favorFromBackend);
    }

    getCurrentService();
  }, [favorId]);

  const handleAccept = async () => {
    if (!favorId || !currentFavor) return;
    try {
      const userInfo = await acceptFavor(favorId);
      const updatedFavor = {...currentFavor,
        acceptedBy: userInfo.uid,
        acceptedByName: userInfo.name,
      };
      setCurrentFavor(updatedFavor);
    } catch {
      toast({
        title: 'Failed to accept favor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  }

  const handleFavorite = async () => {
    // TODO:
  }

  return (
    <>
      {favorId && currentFavor && (
        <Box>
          <Text fontSize={18} fontWeight='bold'>
            {currentFavor.name}
          </Text>
          <Text color='gray'>
            Service Posting
          </Text>
          <Divider />
          <Box>
            <Text>{currentFavor.description}</Text>
            <Text>Posted at {currentFavor.datePosted.toString()}</Text>
            <Text>Needed by {currentFavor.dateNeeded.toString()}</Text>
            <Text>
              Posted by: <Link color='green.600' href={`/profile/${currentFavor.postedBy}`}>{currentFavor.postedByName}</Link>
            </Text>
            {currentFavor.acceptedBy && (
              <Text>
                Accepted by: <Link color='green.600' href={`/profile/${currentFavor.acceptedBy}`}>
                  {currentFavor.acceptedByName}
                </Link>
              </Text>)}
            {!currentFavor.acceptedBy && (
              <Text>
                Available
                <Button ms={2}
                  hidden={authContext.user?.uid === currentFavor.postedBy}
                  onClick={handleAccept}
                >
                  Accept
                </Button>
              </Text>
            )}
          </Box>
        </Box>
      )}
    </>
  )

}