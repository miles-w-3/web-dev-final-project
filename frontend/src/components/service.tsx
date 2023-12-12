import React, { useEffect, useState } from "react";
import { Service } from "../../../shared/types/posts";
import { useParams } from "react-router";
import {
  getService,
  purchaseService,
  getIsFavorite,
  removeFavorite,
  addFavorite,
} from "../clients/post";
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  Link,
  useToast,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { useAuthContext } from "../state/useAuthContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export function ServicePost() {
  const { serviceId } = useParams();
  const [currentService, setCurrentService] = useState<Service | undefined>();
  const authContext = useAuthContext();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const toast = useToast();

  // hook on service id selection
  useEffect(() => {
    const getCurrentService = async () => {
      if (!serviceId) {
        setCurrentService(undefined);
        return;
      }

      setIsFavorite(await getIsFavorite(serviceId));

      const serviceFromBackend = await getService(serviceId);
      setCurrentService(serviceFromBackend);
    };

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
      });
    } catch {
      toast({
        title: "Failed to purchase service",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  };

  const handleFavorite = async () => {
    if (!serviceId) return;
    if (isFavorite) {
      await removeFavorite(serviceId);
      setIsFavorite(false);
    } else {
      // adding a favorite
      try {
        await addFavorite(serviceId);
        setIsFavorite(true);
      } catch {
        toast({
          title: "Failed to add service to favorites",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      {serviceId && currentService && (
        <div className="d-flex justify-content-center">
          <div className="d-flex justify-content-center align-items-start pt-5">
            <Box style={{ width: "600px" }}>
              <Flex p={4} align="flex-start" justify="space-between">
                <Flex direction="column">
                  <Text fontSize={24} fontWeight="bold">
                    {currentService.name}
                  </Text>
                  <Text color="gray">Service</Text>
                  <Text>{currentService.description}</Text>
                </Flex>
                <IconButton
                  className="ms-4"
                  icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
                  onClick={handleFavorite}
                  aria-label={isFavorite ? "Unfavorite" : "Favorite"}
                />
              </Flex>
              <Divider />
              <Box p={4}>
                <Flex direction="column">
                  <Flex justify="space-between" align="start">
                    <Text fontSize="lg" color="gray">
                      Posted by:{" "}
                      <Link
                        color="green.600"
                        href={`/profile/${currentService.postedBy}`}
                      >
                        {currentService.postedByName}
                      </Link>
                    </Text>

                    {currentService.purchasedBy && (
                      <Badge colorScheme="red" fontSize="sm">
                        Purchased by:{" "}
                        <Link
                          color="green.600"
                          href={`/profile/${currentService.purchasedBy}`}
                        >
                          {currentService.purchasedByName}
                        </Link>
                      </Badge>
                    )}
                    {!currentService.purchasedBy && (
                      <Button
                        ml={2}
                        hidden={
                          authContext.user?.uid === currentService.postedBy
                        }
                        onClick={handlePurchase}
                      >
                        Purchase
                      </Button>
                    )}
                  </Flex>
                  <Text fontSize="sm" color="gray">
                    Posted at{" "}
                    {new Date(currentService.datePosted).toLocaleString(
                      "en-US",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }
                    )}
                  </Text>
                </Flex>
              </Box>
            </Box>
          </div>
        </div>
      )}
    </>
  );
}
