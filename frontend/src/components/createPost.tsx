import React, { useState } from 'react';
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
import PlacesAutocompleteComponent from './autocomplete';
import { Location } from '../../../shared/types/posts';

interface CreatePostProps {
  showing: boolean;
  hide: () => void
}

export function CreatePost( { hide, showing }:CreatePostProps) {
  const authContext = useAuthContext();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [selectedLatLang, setSelectedLatLang] = useState<Location>();
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  function dateValue(date: Date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":00"
  }

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(new Date(e.target.value));

  }

  console.log('Test is ' + JSON.stringify((!selectedLatLang || !title || !description)));

  const onSave = () => {

  };
  console.log(`Title is ${JSON.stringify(title)}`)
  return (
    <Modal isOpen={showing} onClose={hide}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input placeholder='Post Title' value={title} onChange={e => setTitle(e.target.value)}/>
          <Input placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} />
          <input type="datetime-local" name="date-needed" value={dateValue(selectedTime)} onChange={onDateChange} />
          <Box padding={2}>
            <PlacesAutocompleteComponent setSelectedLatLang={setSelectedLatLang}/>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={onSave}
            hidden={!selectedLatLang || !title || !description}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

}