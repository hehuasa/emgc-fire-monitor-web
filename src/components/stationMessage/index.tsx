import Null from '@/assets/layout/null.png';
import { Read, Unread } from '@/components/Icons';
import Pagination from '@/components/Pagination';
import { messageItemType } from '@/models/stationMessage';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Highlight,
  HStack,
  List,
  ListIcon,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useMemoizedFn } from 'ahooks';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export type pageStateType = {
  currentPage: number;
  pageSize: number;
  total: number;
};

type PropTypes = {
  messagesList: messageItemType[];
  type: string;
  pageState: pageStateType;
  getData: (arg?: boolean) => void;
  setPageState: React.Dispatch<pageStateType>;
  handleSetRead: (arg: string) => void;
  handleDelete: (arg: string) => void;
  handleReadDetail: (msgId: string, recId: string) => void;
};
const MessageItem = ({
  messagesList,
  type,
  pageState,
  getData,
  setPageState,
  handleSetRead,
  handleDelete,
  handleReadDetail,
}: PropTypes) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentRow, setCurrentRow] = useState<messageItemType>();

  const handleReadDetail__ = useMemoizedFn((message: messageItemType) => {
    setCurrentRow(message);
    handleReadDetail(message.messageId, message.recordId);
    onOpen();
  });

  const handleRouter = useMemoizedFn(() => {
    router.push('/sms/breakDown');
  });

  return (
    <>
      <List>
        {messagesList.map((message) => (
          <ListItem w={'full'} key={message.messageId}>
            <HStack w={'full'}>
              {message.haveRead ? (
                <ListIcon w={6} h={6} as={Read} color={'pri.gray.800'}></ListIcon>
              ) : (
                <ListIcon w={6} h={6} as={Unread} color={'pri.green.200'}></ListIcon>
              )}
              <HStack w={'full'} justifyContent={'space-between'}>
                <Box
                  w={'142'}
                  whiteSpace={'nowrap'}
                  textOverflow={'ellipsis'}
                  overflow={'hidden'}
                  color={message.haveRead ? 'pri.gray.800' : ''}
                >
                  {message.title}
                </Box>
                <Box w={50} ml={4} color={message.haveRead ? 'pri.gray.800' : ''}>
                  {message.sendTime}
                </Box>
                <HStack justifyContent={'flex-end'}>
                  <Button
                    variant={'unstyled'}
                    fontWeight={0}
                    fontSize={'14px'}
                    color="pri.blue.100"
                    onClick={() => handleReadDetail__(message)}
                  >
                    查看
                  </Button>
                  <Center h="20px">
                    <Divider orientation="vertical" />
                  </Center>
                  <Menu isLazy>
                    <MenuButton color="pri.blue.100" fontSize={'14px'}>
                      更多
                    </MenuButton>
                    <MenuList>
                      {!message.haveRead && (
                        <MenuItem fontSize={'14px'} onClick={() => handleSetRead(message.recordId)}>
                          设为已读
                        </MenuItem>
                      )}
                      <MenuItem fontSize={'14px'} onClick={() => handleDelete(message.recordId)}>
                        删除
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </HStack>
            </HStack>
          </ListItem>
        ))}
        {messagesList.length == 0 && (
          <Box textAlign="center" width={'48'} m="auto">
            <Image src={Null} quality="100" objectFit="cover" alt="空状态" />
            <Text fontSize={'16px'} color="font.100">
              暂无消息
            </Text>
          </Box>
        )}
      </List>
      <Flex
        w="full"
        h="12"
        py="8"
        pr={5}
        borderTop="1px"
        borderColor="pri.gray.200"
        alignItems="center"
        justifyContent="right"
      >
        <Pagination
          defaultCurrent={pageState.currentPage}
          current={pageState.currentPage}
          total={pageState.total}
          paginationProps={{
            display: 'flex',
          }}
          onChange={(current) => {
            if (current) {
              pageState.currentPage = current;
              setPageState({
                ...pageState,
              });
              if (type === 'all') {
                getData();
              }
              if (type === 'unRead') {
                getData(false);
              }
            }
          }}
          pageSize={pageState.pageSize}
          pageSizeOptions={[10, 20, 50]}
          onShowSizeChange={(current, size) => {
            if (size) {
              pageState.pageSize = size;
              pageState.currentPage = 1;
              setPageState({
                ...pageState,
              });
              if (type === 'all') {
                getData();
              }
              if (type === 'unRead') {
                getData(false);
              }
            }
          }}
          showTotal={(total) => (
            <Text color="pri.dark.100" px="4">
              <Highlight query={String(total)} styles={{ px: '1', py: '1', color: 'pri.blue.100' }}>
                {`共 ${total} 条数据`}
              </Highlight>
            </Text>
          )}
          showSizeChanger
          pageNeighbours={1}
        />
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          <ModalHeader fontWeight={'normal'}>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            {currentRow?.content}
            <ModalFooter>
              {currentRow?.messageType === 'ALARM_TROUBLE_SHOOTING' &&
                process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'zk' && (
                  <HStack justifyContent={'flex-end'}>
                    <Button onClick={onClose}>关闭</Button>
                    <Button colorScheme={'blue'} onClick={handleRouter}>
                      处理
                    </Button>
                  </HStack>
                )}
              {currentRow?.messageType !== 'ALARM_TROUBLE_SHOOTING' && (
                <HStack justifyContent={'flex-end'}>
                  <Button onClick={onClose}>关闭</Button>
                </HStack>
              )}
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MessageItem;
