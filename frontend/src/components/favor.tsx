import React, { useEffect, useState } from "react";
import { Favor } from "../../../shared/types/posts";
import { useParams } from "react-router";
import {
  getFavor,
  acceptFavor,
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

export function FavorPost() {
  const { favorId } = useParams();
  const [currentFavor, setCurrentFavor] = useState<Favor | undefined>();
  const authContext = useAuthContext();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const getCurrentService = async () => {
      if (!favorId) {
        setCurrentFavor(undefined);
        return;
      }

      const favorFromBackend = await getFavor(favorId);
      setCurrentFavor(favorFromBackend);
    };

    getCurrentService();
  }, [favorId]);

  const handleAccept = async () => {
    if (!favorId || !currentFavor) return;
    try {
      const userInfo = await acceptFavor(favorId);
      const updatedFavor = {
        ...currentFavor,
        acceptedBy: userInfo.uid,
        acceptedByName: userInfo.name,
      };
      setCurrentFavor(updatedFavor);
    } catch {
      toast({
        title: "Failed to accept favor",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  };

  const handleFavorite = async () => {
    if (!favorId) return;
    if (isFavorite) {
      await removeFavorite(favorId);
      setIsFavorite(false);
    } else {
      // adding a favorite
      try {
        await addFavorite(favorId);
        setIsFavorite(true);
      } catch {
        toast({
          title: "Failed to add favor to favorites",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      {favorId && currentFavor && (
        <div className="d-flex justify-content-center">
          <div className="d-flex justify-content-center align-items-start pt-5">
            <Box style={{ width: "600px" }}>
              <Flex p={4} align="flex-start" justify="space-between">
                <Flex direction="column">
                  <Text fontSize={24} fontWeight="bold">
                    {currentFavor.name}
                  </Text>
                  <Text color="gray">Favor</Text>
                  <Text>{currentFavor.description}</Text>
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
                  <Flex justify="space-between" align="center">
                    <Text fontSize="lg" color="gray">
                      Posted by:{" "}
                      <Link
                        color="green.600"
                        href={`/profile/${currentFavor.postedBy}`}
                      >
                        {currentFavor.postedByName}
                      </Link>
                    </Text>
                    {!currentFavor.acceptedBy && (
                      <Badge colorScheme="green" fontSize="sm">
                        Available
                        <Button
                          ml={2}
                          hidden={
                            authContext.user?.uid === currentFavor.postedBy
                          }
                          onClick={handleAccept}
                        >
                          Accept
                        </Button>
                      </Badge>
                    )}
                  </Flex>

                  <Text fontSize="sm" color="gray">
                    Posted at{" "}
                    {new Date(currentFavor.datePosted).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </Text>
                  <Text fontSize="sm" color="gray">
                    Needed by{" "}
                    {new Date(currentFavor.dateNeeded).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </Text>

                  {currentFavor.acceptedBy && (
                    <Text fontSize="sm" color="gray">
                      Accepted by:{" "}
                      <Link
                        color="green.600"
                        href={`/profile/${currentFavor.acceptedBy}`}
                      >
                        {currentFavor.acceptedByName}
                      </Link>
                    </Text>
                  )}
                </Flex>
              </Box>
            </Box>
          </div>
        </div>
      )}
    </>
  );
}
