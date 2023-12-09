import React from 'react';
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
} from '@chakra-ui/react'
import { useAuthContext } from '../state/useAuthContext';
import PlacesAutocompleteComponent from './test';

interface CreatePostProps {
  showing: boolean;
  hide: () => void
}

export function CreatePost( { hide, showing }:CreatePostProps) {
  const authContext = useAuthContext();
  const onSave = () => {

  };

  return (
    <Modal isOpen={showing} onClose={hide}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input placeholder='Post Title'/>
          <Input placeholder='Description' />
          <input type="date" name="date-needed"/>
          <Box padding={2}>
            <PlacesAutocompleteComponent />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

}