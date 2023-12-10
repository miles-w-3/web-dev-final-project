import React, { useEffect, useState } from "react";
import { Favor } from "../../../shared/types/posts";
import { useParams } from "react-router";
import { getFavor, purchaseService } from "../clients/post";
import { Box, Button, Divider, Flex, Text, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../state/useAuthContext";

export function FavorPost() {
  const { serviceId } = useParams();
  const [currentFavor, setCurrentFavor] = useState<Favor | undefined>();
  const authContext = useAuthContext();
  const [available, setAvailable] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {

    const getCurrentService = async () => {
      if (!serviceId) {
        setCurrentFavor(undefined);
        return;
      }

      const favorFromBackend = await getFavor(serviceId);
      setCurrentFavor(favorFromBackend);
      setAvailable(favorFromBackend?.acceptedBy == null);
    }

    getCurrentService();
  }, [serviceId]);

  const handleAccept = async () => {
    if (!serviceId || !currentFavor) return;
    try {
      const userInfo = await purchaseService(serviceId);
      setCurrentFavor({
        ...currentFavor,
        acceptedBy: userInfo.uid,
        acceptedByName: userInfo.name,
      })
      setAvailable(false);
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
      {serviceId && currentFavor && (
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
              Posted by: <Link color='blue' to={`/profile/${currentFavor.postedBy}`}>{currentFavor.postedByName}</Link>
            </Text>
            {!available && currentFavor.acceptedBy && (
              <Link color='blue' to={`/profile/${currentFavor.acceptedBy}`}>
                Accepted by {currentFavor.acceptedByName}
              </Link>)}
            {available && (
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