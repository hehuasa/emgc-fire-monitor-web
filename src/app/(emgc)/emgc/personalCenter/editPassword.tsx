import { request } from '@/utils/request';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { useMemoizedFn } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const EditPassword = () => {
  const toast = useToast();
  const route = useRouter();
  const method = useForm();
  const {
    register,
    setValue,
    getValues,
    reset,
    formState: { errors },
    handleSubmit,
  } = method;
  const [passShow, setPassShow] = useState(false);
  const [newpassShow, setNewPassShow] = useState(false);
  const handlePassShow = useCallback(() => setPassShow(!passShow), [passShow]);
  const handleNewPassShow = useCallback(() => setNewPassShow(!newpassShow), [newpassShow]);
  const handleCancelEdit = useMemoizedFn(async () => {
    route.back();
  });

  const handleSubmitPassword = useMemoizedFn(async () => {
    const infoStr: string = localStorage.getItem('emgc_web_currentUserInfo') ?? '';
    const userInfo = JSON.parse(infoStr);
    const oldPassword = getValues('oldPassword');
    const Password = getValues('Password');
    const { code, msg } = await request({
      url: `/ms-system/user/set-pwd/${userInfo.userId}?oldPassword=${oldPassword}&newPassword=${Password}`,
      options: {
        method: 'post',
      },
    });
    if (code === 200) {
      toast({
        status: 'success',
        title: '修改成功',
        duration: 1500,
        position: 'top',
        isClosable: true,
      });
      reset({
        oldPassword: '',
        Password: '',
      });
    } else {
      toast({
        status: 'error',
        title: msg,
        duration: 1500,
        position: 'top',
        isClosable: true,
      });
    }
  });

  const handleReset = useCallback(async () => {
    const infoStr: string = localStorage.getItem('emgc_web_currentUserInfo') ?? '';
    const userInfo = JSON.parse(infoStr);
    const { code, msg } = await request({
      url: `/ms-system/user/reset-pwd/${userInfo.userId}`,
      options: {
        method: 'post',
      },
    });
    if (code == 200) {
      toast({
        status: 'success',
        title: '重置成功',
        duration: 1000,
        position: 'top',
      });
    } else {
      toast({
        status: 'error',
        title: msg,
        duration: 1000,
        position: 'top',
      });
    }
  }, []);

  return (
    <>
      <Box p={3}>
        <HStack mb="8">
          <Box bg="pri.blue.100" w="1.5" h="4" borderRadius="6px" mr="1"></Box>
          <Box fontSize="20px" fontWeight="500">
            修改密码
          </Box>
        </HStack>
        <FormProvider {...method}>
          <FormControl isRequired mt={2}>
            <HStack>
              <FormLabel w={20}>旧密码：</FormLabel>
              <InputGroup w={'30%'}>
                <Input
                  type={passShow ? 'text' : 'password'}
                  placeholder="请输入旧密码"
                  {...register('oldPassword', {
                    required: '请输入旧密码',
                  })}
                ></Input>
                <InputRightElement width="4.5rem">
                  <IconButton
                    aria-label="show password"
                    icon={passShow ? <ViewIcon /> : <ViewOffIcon />}
                    h="1.75rem"
                    size="sm"
                    bg="transparent"
                    onClick={handlePassShow}
                  />
                </InputRightElement>
              </InputGroup>
            </HStack>
            <FormErrorMessage mt={0} pl="84px">
              {errors.oldPassword ? (errors.oldPassword.message as unknown as string) : null}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired mt={2}>
            <HStack>
              <FormLabel w={20}>新密码：</FormLabel>
              <InputGroup w={'30%'}>
                <Input
                  type={newpassShow ? 'text' : 'password'}
                  placeholder="请输入新密码"
                  {...register('Password', {
                    required: '请输入新密码',
                  })}
                ></Input>
                <InputRightElement width="4.5rem">
                  <IconButton
                    aria-label="show password"
                    icon={newpassShow ? <ViewIcon /> : <ViewOffIcon />}
                    h="1.75rem"
                    size="sm"
                    bg="transparent"
                    onClick={handleNewPassShow}
                  />
                </InputRightElement>
              </InputGroup>
            </HStack>
            <FormErrorMessage mt={0} pl="84px">
              {errors.Password ? (errors.Password.message as unknown as string) : null}
            </FormErrorMessage>
          </FormControl>
        </FormProvider>
        <HStack mt={6}>
          <Button colorScheme="gray" borderRadius={'10px'} size={'sm'} onClick={handleCancelEdit}>
            取消
          </Button>
          <Button
            colorScheme="blue"
            borderRadius={'10px'}
            size={'sm'}
            onClick={handleSubmit(handleSubmitPassword)}
          >
            确定
          </Button>
        </HStack>
        {/* <Button
          ml="3"
          leftIcon={<AiOutlineReload />}
          _hover={{
            bg: 'pri.red.300',
            color: 'backs.200',
            fill: 'backs.200',
          }}
          fill="pri.red.300"
          bg="pri.red.200"
          color="pri.red.300"
          onClick={handleReset}
        >
          重置密码
        </Button> */}
      </Box>
    </>
  );
};

export default EditPassword;
