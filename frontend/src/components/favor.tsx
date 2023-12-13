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
  const [currentFavorId, setCurrentFavorId] = useState<string | undefined>(
    favorId
  );
  const [currentFavor, setCurrentFavor] = useState<Favor | undefined>();
  const authContext = useAuthContext();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState<string | undefined>();

  function getAddress(location: any): Promise<string> {
    const geocoder = new google.maps.Geocoder();
    const lat = location.lat;
    const lng = location.lng;
    const latlng = { lat, lng };

    return new Promise<string>((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const stateResult = results[0].address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          );
          const state = stateResult ? stateResult.long_name : "";
          const cityResult = results[0].address_components.find((component) =>
            component.types.includes("locality")
          );
          const city = cityResult ? cityResult.long_name : "";
          const countryResult = results[0].address_components.find(
            (component) => component.types.includes("country")
          );
          const country = countryResult ? countryResult.long_name : "";
          const postLocation = city.concat(", " + state).concat(", " + country);
          resolve(postLocation);
        } else {
          reject(`Geocoder failed`);
        }
      });
    });
  }

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (currentFavor) {
          const result = await getAddress(currentFavor.location);
          setAddress(result);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, [currentFavor]);

  useEffect(() => {
    const getCurrentFavor = async () => {
      if (!currentFavorId) {
        navigate("/");
        return;
      }

      const favorFromBackend = await getFavor(currentFavorId);
      if (!favorFromBackend) {
        navigate("/");
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
    } catch {
      toast({
        title: "Failed to delete favor post",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {currentFavorId && currentFavor && (
        <Flex justify="center">
          <Box width="600px" p={4}>
            <Flex align="start" justify="space-between" mb={4}>
              <Box>
                <Text fontSize={24} fontWeight="bold">
                  {currentFavor.name}
                </Text>
              </Box>
              <Flex>
                <IconButton
                  className="ms-4"
                  icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
                  onClick={handleFavorite}
                  aria-label={isFavorite ? "Unfavorite" : "Favorite"}
                />
                {currentFavor.postedBy === authContext.user?.uid && (
                  <IconButton
                    className="ms-4"
                    colorScheme="red"
                    icon={<FaTrash />}
                    onClick={handleDelete}
                    aria-label="delete-favor"
                  />
                )}
              </Flex>
            </Flex>

            <Flex justify="space-between" mb={4}>
              <Text color="gray">Favor</Text>
            </Flex>
            <Box>
              <Text>{currentFavor.description}</Text>
            </Box>
            <Divider />

            <Box mt={4}>
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
                  Location: {address}
                </Text>
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
        </Flex>
      )}
    </>
  );
}
