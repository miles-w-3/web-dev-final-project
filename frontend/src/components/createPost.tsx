import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useAuthContext } from "../state/useAuthContext";
import PlacesAutocompleteComponent from "./autocomplete";
import { Location, Service, Favor } from "../../../shared/types/posts";
import { addFavor, addService } from "../clients/post";
import { UserType } from "../../../shared/types/users";

interface CreatePostProps {
  showing: boolean;
  userType: UserType;
  hide: () => void;
}

export function CreatePost({ hide, showing, userType }: CreatePostProps) {
  const authContext = useAuthContext();
  const [postTitle, setPostTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [selectedLatLang, setSelectedLatLang] = useState<Location>();
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [selectedPrice, setSelectedPrice] = useState<number>(0.0);

  const toast = useToast();

  function dateValue(date: Date) {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":00"
    );
  }

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(new Date(e.target.value));
  };
  const format = (val: number) => `$${val}`;

  const onSave = async () => {
    if (!selectedLatLang || !postTitle || !description) {
      return;
    }
    try {
      if (userType === "requestor") {
        const favorPost: Favor = {
          name: postTitle ?? "",
          description: description ?? "",
          dateNeeded: selectedTime,
          datePosted: new Date(),
          postedBy: authContext?.user?.uid ?? "",
          location: selectedLatLang,
        };
        await addFavor(favorPost);
      } else {
        const servicePost: Service = {
          name: postTitle ?? "",
          description: description ?? "",
          datePosted: new Date(),
          postedBy: authContext?.user?.uid ?? "",
          location: selectedLatLang,
          price: selectedPrice,
        };
        await addService(servicePost);
      }
    } catch {
      toast({
        title: "Failed to create post",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setPostTitle("");
    setDescription("");
    setSelectedPrice(0);

    toast({
      title: "Successfully created post",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    hide();
  };

  return (
    <Modal isOpen={showing} onClose={hide}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader style={{ textTransform: "capitalize" }}>
          Create {userType} Post
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Post Title</Text>
          <Input
            mb={4}
            placeholder="Post Title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <Text>Post Description</Text>

          <Input
            mb={4}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {userType === "requestor" && (
            <input
              type="datetime-local"
              name="date-needed"
              value={dateValue(selectedTime)}
              onChange={onDateChange}
            />
          )}
          {userType === "seller" && (
            <Flex alignItems="center">
              <Text mb={0} pe={2}>
                Price:
              </Text>
              <NumberInput
                value={format(selectedPrice)}
                onChange={(_, asNum) => setSelectedPrice(asNum)}
                min={0}
                max={1000}
                mb={4}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
          )}
          <Flex alignItems="center">
            <Text mb={0} pe={2}>
              Address:
            </Text>
            <Box  padding={2} className="border rounded" flexGrow={1}>
              <PlacesAutocompleteComponent
                setSelectedLatLang={setSelectedLatLang}
              />
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={onSave}
            isDisabled={!selectedLatLang || !postTitle || !description}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
