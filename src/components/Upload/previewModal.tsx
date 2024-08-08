import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Image,
} from '@chakra-ui/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const PreviewModal = ({ isOpen, onClose, url }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="90%" borderRadius="10px" id="ccccccccccccccccccc">
        <ModalHeader
          borderTopRadius="10px"
          py="0"
          textAlign="left"
          lineHeight="2.75rem"
          fontSize="lg"
          bg="pri.gray.100"
        >
          预览
        </ModalHeader>
        <ModalCloseButton
          h="11"
          top="0"
          lineHeight="2.75rem"
          _focusVisible={{ boxShadow: 'none' }}
        />
        <ModalBody bg="pri.white.100" px="0" py="0" borderBottomRadius="10px" overflow="hidden">
          <Box h="80vh">
            <Image src={url} alt="空" objectFit="fill" w="100%" h="full" display="block" />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PreviewModal;
