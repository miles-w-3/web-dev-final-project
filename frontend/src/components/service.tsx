import React, { useEffect, useState } from "react";
import { Service } from "../../../shared/types/posts";
import { useParams } from "react-router";
import { getService, purchaseService } from "../clients/post";
import { Box, Button, Divider, Flex, Text, useToast, Link } from "@chakra-ui/react";
import { useAuthContext } from "../state/useAuthContext";

export function ServicePost() {
  const { serviceId } = useParams();
  const [currentService, setCurrentService] = useState<Service | undefined>();
  const authContext = useAuthContext();
  const toast = useToast();

  useEffect(() => {
    const getCurrentService = async () => {
      if (!serviceId) {
        setCurrentService(undefined);
        return;
      }

      const serviceFromBackend = await getService(serviceId);
      setCurrentService(serviceFromBackend);
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
            <Text>
              Posted by: <Link color='green.600' href={`/profile/${currentService.postedBy}`}>{currentService.postedByName}</Link>
            </Text>
            {currentService.purchasedBy && (
              <Text>
                Accepted by: <Link color='green.600' href={`/profile/${currentService.purchasedBy}`}>
                  {currentService.purchasedByName}
                </Link>
              </Text>)}
            {!currentService.purchasedBy && (
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