'use client';
import ProductTable from './productInstanceTable';
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import { useForm } from 'react-hook-form';
import { deviceInfoType, pageLoadingModal, productTableType } from '@/models/product';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { request, requestDownload } from '@/utils/request';
import { IPageData, initPageData } from '@/utils/publicData';
import { useCallback, useRef } from 'react';
import Loading from '@/components/Loading/Spin';
import AddModal, { modalRef } from '@/components/deviceInstance/add';
import EditModal from '@/components/deviceInstance/edit';
import Info from './info';

interface Ilink {
  id: string;
  protocol: string;
  name: string;
}

export interface Keyword {
  currentPage?: number;
  pageSize?: number;
  otherParams?: {
    protocol?: string;
    productId?: string;
  };
}

const BtnStyleProps = {
  borderRadius: '4px',
  color: 'pri.blue.400',
  bg: 'pri.blue.300',
  fontWeight: 0,
  _hover: {
    color: '#FFF',
    bg: 'pri.blue.400',
  },
  ps: 3,
};

const ProductManage = () => {
  const methods = useForm();
  const addMethods = useForm();
  const { register, getValues, setValue } = methods;
  const [tableData, setTableData] = useSafeState<IPageData<productTableType[]>>(initPageData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: infoIsOpen, onOpen: infoOnOpen, onClose: infoOnClose } = useDisclosure();

  // const linkList = useRecoilValue(linkListModal);
  const otherParamsRef = useRef<Keyword['otherParams']>({});
  const loading = useRecoilValue(pageLoadingModal);
  const setLoading = useSetRecoilState(pageLoadingModal);
  const toast = useToast();
  const addRef = useRef<modalRef | null>(null);
  const editRef = useRef<modalRef | null>(null);
  const [currentProduct, setCurrentProduct] = useSafeState<deviceInfoType | null>(null);
  const [info, setInfo] = useSafeState<deviceInfoType | null>(null);
  const [product, setProduct] = useSafeState<Ilink[]>([]);
  useMount(() => {
    // getLinkList();
    getProductId();
    getTableData({ currentPage: 1, pageSize: 10 });
  });

  const getProductId = useMemoizedFn(async () => {
    const { code, msg, data } = await request<Ilink[]>({
      url: `/device-manger/product/list`,
      options: {
        method: 'post',
        body: JSON.stringify({}),
      },
    });
    if (code === 200) {
      setProduct(data);
    }
  });

  const getTableData = useMemoizedFn(async ({ currentPage, pageSize, otherParams }: Keyword) => {
    if (otherParams) {
      otherParamsRef.current = otherParams;
    }
    const { code, data } = await request<IPageData<productTableType[]>>({
      url: `/device-manger/device/page`,
      options: {
        method: 'POST',
        body: JSON.stringify({
          ...otherParamsRef.current,
          pageBean: {
            currentPage: currentPage || tableData.current,
            pageSize: pageSize || tableData.size,
          },
        }),
      },
    });
    if (code === 200) {
      setTableData(data);
    }
  });

  const handleSearch = async () => {
    const productId = getValues('productId');
    const currentProduct = product.find((v) => v.id == productId);
    console.log('查询', currentProduct);
    if (currentProduct) {
      await getTableData({
        currentPage: 1,
        pageSize: tableData.size,
        otherParams: { productId, protocol: currentProduct.protocol },
      });
    }
  };

  const handleReset = () => {
    otherParamsRef.current = {};
    setValue('productId', '');
    getTableData({ currentPage: 1, pageSize: tableData.size });
  };
  const handleAdd = useMemoizedFn(() => {
    onOpen();
  });
  const handleAddLink = useMemoizedFn(() => {
    addRef.current
      ?.submit()
      .then(() => {
        onClose();
        getTableData({ currentPage: 1, pageSize: 10 });
      })
      .catch(() => {
        toast({
          status: 'warning',
          title: '请按要求输入字段值',
          position: 'top',
          duration: 1500,
        });
      });
  });
  const handleEditLink = useMemoizedFn(() => {
    editRef.current?.submit().then(() => {
      onCloseEdit();

      getTableData({ currentPage: 1, pageSize: 10 });
    });
  });

  const del = useMemoizedFn(async (id: string) => {
    setLoading(true);
    try {
      const { code, msg } = await request({
        url: `/device-manger/device/delete?id=${id}`,
      });
      if (code === 200) {
        console.log('成功');
        toast({
          title: `删除成功`,
          status: 'success',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
        handleSearch();
      } else {
        toast({
          title: msg,
          status: 'error',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      //
    }
    setLoading(false);
  });

  const goEdit = useMemoizedFn((row: deviceInfoType) => {
    // setInfo(row);
    setCurrentProduct(row);
    onOpenEdit();
  });

  const openInfo = useMemoizedFn((item) => {
    setInfo(item);
    infoOnOpen();
  });

  const handleleExport = useCallback(async () => {
    await requestDownload({
      url: `/device-manger/device/device_excel`,
      options: {
        method: 'post',
        name: '设备列表.xlsx',
      },
    });
  }, []);

  return (
    <Loading spin={loading}>
      <Box w="full" p="4">
        {/* <Box role={'toolbar'} w="full">
          <FormProvider {...methods}>
            <form>
              <Flex alignItems={'center'}>
                <FormControl w={'360px'}>
                  <HStack>
                    <FormLabel whiteSpace={'nowrap'}>所属产品：</FormLabel>
                    <Select {...register('productId')} placeholder="请选择所属分类">
                      {product &&
                        product.map((link) => (
                          <option value={link.id} key={link.id}>
                            {link.name}
                          </option>
                        ))}
                    </Select>
                  </HStack>
                </FormControl>

                <FormControl ml={5}>
                  <HStack>
                    <Button
                      size="sm"
                      color={'pri.white.100'}
                      _hover={{
                        bg: 'blue.400',
                      }}
                      bg="pri.blue.100"
                      // {...BtnStyleProps} 
                      leftIcon={<SearchIcon />} onClick={handleSearch}>
                      查询
                    </Button>
                    <Button
                      size="sm"

                      // {...BtnStyleProps}
                      _hover={{
                        bg: 'blue.400',
                      }}
                      leftIcon={<RepeatIcon />} onClick={handleReset}>
                      重置
                    </Button>
                    <Button
                      size="sm"
                      color={'pri.white.100'}
                      _hover={{
                        bg: 'blue.400',
                      }}
                      bg="pri.green.200"



                      // {...BtnStyleProps} 
                      leftIcon={<SmallAddIcon />} onClick={handleAdd}>
                      新增
                    </Button>
                    <Button
                      size="sm"
                      color={'pri.white.100'}
                      _hover={{
                        bg: 'blue.400',
                      }}
                      bg="pri.green.200"
                      // {...BtnStyleProps} 
                      leftIcon={<ArrowDownIcon />} onClick={handleleExport}>
                      导出设备
                    </Button>
                  </HStack>
                </FormControl>
              </Flex>
            </form>
          </FormProvider>
        </Box> */}
        <Box mt={2}>
          <ProductTable
            openInfo={openInfo}
            data={tableData}
            getTableData={getTableData}
            goEdit={goEdit}
            del={del}
          />
        </Box>
        {/* 新增设备 */}
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
          <ModalOverlay></ModalOverlay>
          <ModalContent>
            <ModalHeader>新增设备</ModalHeader>
            <ModalCloseButton></ModalCloseButton>
            <ModalBody>
              <AddModal ref={addRef} />
            </ModalBody>
            <ModalFooter>
              <HStack justifyContent={'flex-end'} alignItems="center">
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleAddLink}>确定</Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* 修改设备 */}
        <Modal isOpen={isOpenEdit} onClose={onCloseEdit} size="4xl">
          <ModalOverlay></ModalOverlay>
          <ModalContent>
            <ModalHeader>修改设备</ModalHeader>
            <ModalCloseButton></ModalCloseButton>
            <ModalBody>
              <EditModal ref={editRef} row={currentProduct} />
            </ModalBody>
            <ModalFooter>
              <HStack justifyContent={'flex-end'} alignItems="center">
                <Button onClick={onCloseEdit}>取消</Button>
                <Button onClick={handleEditLink}>确定</Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      <Info
        isOpen={infoIsOpen}
        onClose={infoOnClose}
        onOpen={infoOnOpen}
        deviceInfo={info as deviceInfoType}
      />
    </Loading>
  );
};

export default ProductManage;
