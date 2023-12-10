import React, { useEffect, useState } from "react";
import { Service } from "../../../shared/types/posts";
import { useParams } from "react-router";
import { getService, purchaseService } from "../clients/post";
import { Box, Button, Divider, Flex, Text, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../state/useAuthContext";

export function ServicePost() {
  const { serviceId } = useParams();
  const [currentService, setCurrentService] = useState<Service | undefined>();
  const authContext = useAuthContext();
  const [available, setAvailable] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {

    const getCurrentService = async () => {
      if (!serviceId) {
        setCurrentService(undefined);
        return;
      }

      const serviceFromBackend = await getService(serviceId);
      setCurrentService(serviceFromBackend);
      setAvailable(serviceFromBackend?.purchasedBy == null);
    }

    getCurrentService();
  }, [serviceId]);

  const handlePurchase = async () => {
    if (!serviceId || !currentService) return;
    try {
      const userInfo = await purchaseService(serviceId);
      setCurrentService({
        ...currentService,
        purchasedBy: userInfo.uid,
        purchasedByName: userInfo.name,
      })
      setAvailable(false);
    } catch {
      toast({
        title: 'Failed to purchase service',
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
      {serviceId && currentService && (
        <Box>
          <Text fontSize={18} fontWeight='bold'>
            {currentService.name}
          </Text>
          <Text color='gray'>
            Service Posting
          </Text>
          <Divider />
          <Box>
            <Text>{currentService.description}</Text>
            <Text>Posted at {currentService.datePosted.toString()}</Text>
            <Text>${currentService.price}</Text>
            <Text>
              Posted by: <Link color='blue' to={`/profile/${currentService.postedBy}`}>{currentService.postedByName}</Link>
            </Text>
            {!available && currentService.purchasedBy && (
              <Link color='blue' to={`/profile/${currentService.purchasedBy}`}>
                Purchased by {currentService.purchasedByName}
              </Link>)}
            {available && (
              <Text>
                Available
                <Button ms={2}
                  hidden={authContext.user?.uid === currentService.postedBy}
                  onClick={handlePurchase}
                >
                  Purchase
                </Button>
              </Text>

            )}
          </Box>
        </Box>
      )}
    </>
  )

}