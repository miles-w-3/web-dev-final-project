import React, { useEffect, useState } from "react";
import { Favor } from "../../../shared/types/posts";
import { useNavigate, useParams } from "react-router";
import {
  getFavor,
  acceptFavor,
  removeFavorite,
  addFavorite,
  removeFavor,
  getIsFavorite,
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
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";

export function FavorPost() {
  let { favorId } = useParams();
  const [currentFavorId, setCurrentFavorId] = useState<string | undefined>(favorId)
  const [currentFavor, setCurrentFavor] = useState<Favor | undefined>();
  const authContext = useAuthContext();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentFavor = async () => {
      if (!currentFavorId) {
        navigate('/');
        return;
      }

      const favorFromBackend = await getFavor(currentFavorId);
      if (!favorFromBackend) {
        navigate('/');
        return;
      }

      setCurrentFavor(favorFromBackend);
      setIsFavorite(await getIsFavorite(currentFavorId));
    };

    getCurrentFavor();
  }, [currentFavorId, navigate]);

  const handleAccept = async () => {
    if (!currentFavorId || !currentFavor) return;
    try {
      const userInfo = await acceptFavor(currentFavorId);
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
    if (!currentFavorId) return;
    if (isFavorite) {
      await removeFavorite(currentFavorId);
      setIsFavorite(false);
    } else {
      // adding a favorite
      try {
        await addFavorite(currentFavorId);
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

  const handleDelete = async () => {
    if (!currentFavorId) return;
    try {
      await removeFavor(currentFavorId);
      toast({
        title: `Deleted favor post ${currentFavor?.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setCurrentFavorId(undefined); // force navigation away from page
    }
    catch {
      toast({
        title: "Failed to delete favor post",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      {currentFavorId && currentFavor && (
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
                <Box>
                  <IconButton
                    className="ms-4"
                    icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
                    onClick={handleFavorite}
                    aria-label={isFavorite ? "Unfavorite" : "Favorite"}
                  />
                  {currentFavor.postedBy === authContext.user?.uid && <IconButton
                    className="ms-4"
                    colorScheme="red"
                    icon={<FaTrash />}
                    onClick={handleDelete}
                    aria-label="delete-favor"
                  />}
                </Box>
              </Flex>
              <Divider />
              <Box p={4}>
                <Flex direction="column">
                  <Flex justify="space-between" align="start">
                    <Text fontSize="lg" color="gray">
                      Posted by:{" "}
                      <Link
                        color="green.600"
                        href={`/profile/${currentFavor.postedBy}`}
                      >
                        {currentFavor.postedByName}
                      </Link>
                    </Text>
                    {currentFavor.acceptedBy && (
                      <Badge colorScheme="red" fontSize="sm">
                        Accepted by:{" "}
                        <Link
                          color="green.600"
                          href={`/profile/${currentFavor.acceptedBy}`}
                        >
                          {currentFavor.acceptedByName}
                        </Link>
                      </Badge>
                    )}
                    {!currentFavor.acceptedBy && (
                      <Button
                        ml={2}
                        hidden={authContext.user?.uid === currentFavor.postedBy}
                        onClick={handleAccept}
                      >
                        Accept
                      </Button>
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
                </Flex>
              </Box>
            </Box>
          </div>
        </div>
      )}
    </>
  );
}
