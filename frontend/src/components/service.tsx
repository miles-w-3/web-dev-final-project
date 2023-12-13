import React, { useEffect, useState } from "react";
import { Service, Location } from "../../../shared/types/posts";
import { useNavigate, useParams } from "react-router";
import {
  getService,
  purchaseService,
  getIsFavorite,
  removeFavorite,
  addFavorite,
  removeService,
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


export function ServicePost() {
  const { serviceId } = useParams();
  const [currentServiceId, setCurrentServiceId] = useState<string|undefined>(serviceId);
  const [currentService, setCurrentService] = useState<Service | undefined>();
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
        if (status === 'OK' && results && results[0]) {
          const stateResult = results[0].address_components.find(component => component.types.includes('administrative_area_level_1'));
          const state = stateResult ? stateResult.long_name : '';
          const cityResult = results[0].address_components.find(component => component.types.includes('locality'));
          const city = cityResult ? cityResult.long_name : '';
          const countryResult = results[0].address_components.find(component => component.types.includes('country'));
          const country = countryResult ? countryResult.long_name : '';
          const postLocation = city.concat(", " + state).concat(", " + country)
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
        if (currentService) {
          const result = await getAddress(currentService.location);
          setAddress(result);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };

    fetchAddress();
  }, [currentService]);

  // hook on service id selection
  useEffect(() => {
    const getCurrentService = async () => {
      if (!currentServiceId) {
        navigate('/');
        return;
      }

      const serviceFromBackend = await getService(currentServiceId);
      if (!serviceFromBackend) {
        navigate('/');
        return;
      }

      setIsFavorite(await getIsFavorite(currentServiceId));
      setCurrentService(serviceFromBackend);
    };

    getCurrentService();
  }, [currentServiceId]);

  const handlePurchase = async () => {
    if (!currentServiceId || !currentService) return;
    try {
      const userInfo = await purchaseService(currentServiceId);
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
    if (!currentServiceId) return;
    if (isFavorite) {
      await removeFavorite(currentServiceId);
      setIsFavorite(false);
    } else {
      // adding a favorite
      try {
        await addFavorite(currentServiceId);
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

  const handleDelete = async () => {
    if (!currentServiceId) return;
    try {
      await removeService(currentServiceId);
      toast({
        title: `Deleted service post ${currentService?.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setCurrentServiceId(undefined); // force navigation away from page
    }
    catch {
      toast({
        title: "Failed to delete service post",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }


 

return (
  <>
    {currentServiceId && currentService && (
      <Flex justify="center">
        <Box width="600px" p={4}>
          <Flex align="start" justify="space-between" mb={4}>
            <Box>
              <Text fontSize={24} fontWeight="bold">
                {currentService.name}
              </Text>
            </Box>
            <Flex>
              <IconButton
                className="ms-4"
                icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
                onClick={handleFavorite}
                aria-label={isFavorite ? "Unfavorite" : "Favorite"}
              />
              {currentService.postedBy === authContext.user?.uid && (
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
          <Text color="gray">Service</Text>
            {currentService.price != null && (
              <Text color="gray">
                Price: <Badge variant="outline">{`$${currentService.price}`}</Badge>
              </Text>
            )}
          </Flex>

          <Box>
            <Text>{currentService.description}</Text>
          </Box>

          <Divider />

          <Box mt={4}>
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
                    hidden={authContext.user?.uid === currentService.postedBy}
                    onClick={handlePurchase}
                  >
                    Purchase
                  </Button>
                )}
              </Flex>
              <Text fontSize="sm" color="gray">
                Location: {address}
              </Text>
              <Text fontSize="sm" color="gray">
                Posted at{" "}
                {new Date(currentService.datePosted).toLocaleString("en-US", {
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
