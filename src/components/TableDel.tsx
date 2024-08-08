import {
  useDisclosure,
  Button,
  ButtonProps,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  HStack,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import React from 'react';

interface IDelComponent {
  confirm: () => void;
  buttonProps?: ButtonProps;
}

const TableAlertDelComponent = ({ confirm, buttonProps }: IDelComponent) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        borderRadius="6px"
        border="1px solid #ff4d4f"
        bg="#ff4d4f"
        color="#fff"
        p="4px 15px"
        fontWeight="normal"
        {...buttonProps}
        _hover={{ bg: '#ff4d4f', color: '#fff' }}
        onClick={onOpen}
      >
        删除
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              删除
            </AlertDialogHeader>

            <AlertDialogBody>确定要删除吗?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                取消
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  confirm();
                  onClose();
                }}
                ml={3}
              >
                确定
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

const TableBaseDelComponent = ({
  confirm,
  onClick,
}: {
  confirm: () => void;
  onClick?: () => void;
}) => {
  return (
    <Popover isLazy>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <Box cursor="pointer" color="pri.red.600" onClick={onClick}>
              删除
            </Box>
          </PopoverTrigger>

          <PopoverContent w="40">
            <PopoverHeader textAlign="left">确定要删除吗?</PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton _focusVisible={{ boxShadow: 'none' }} />
            <PopoverFooter borderTop="none">
              <HStack>
                <Box
                  cursor="pointer"
                  onClick={() => {
                    onClose();
                  }}
                >
                  取消
                </Box>
                <Box
                  cursor="pointer"
                  color="pri.red.600"
                  onClick={() => {
                    onClose();
                    confirm();
                  }}
                >
                  删除
                </Box>
              </HStack>
            </PopoverFooter>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

export { TableAlertDelComponent, TableBaseDelComponent };
