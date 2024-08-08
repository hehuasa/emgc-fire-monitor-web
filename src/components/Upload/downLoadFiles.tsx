import { getFileNameByUrl } from '@/utils/util';
import {
  Flex,
  Box,
  Image,
  useDisclosure,
  StyleProps,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { isImg } from './index';

interface Props {
  urls?: string[];
  itemW?: string;
}

const getDownLoadUrl = (url: string) => {
  const index = url.indexOf('/static');
  const str = url.substring(index, url.length);
  const hostname = window.location.hostname;
  // const insideUrl = process.env.NEXT_PUBLIC_ANALYTICS_Ms_static_inside;
  const outsideUrl = process.env.NEXT_PUBLIC_ANALYTICS_Ms_static_outside;

  // if (insideUrl?.includes(hostname)) {
  //   const subStr = insideUrl.substring(0, insideUrl.length - 7);
  //   console.log('内网', subStr + str);
  //   return subStr + str;
  // }
  if (outsideUrl?.includes(hostname)) {
    const subStr = outsideUrl.substring(0, outsideUrl.length - 7);
    console.log('外网', subStr + str);
    return subStr + str;
  }
  console.log('默认', hostname, outsideUrl);

  return str;
};

export function download(href: string) {
  if (!href) {
    return;
  }
  const fileName = getFileNameByUrl(href);
  fetch(getDownLoadUrl(href))
    .then((res) => res.blob())
    .then((blob) => {
      const downloadElement = document.createElement('a');
      const href = window.URL.createObjectURL(blob); // 创建下载的链接
      downloadElement.href = href;
      downloadElement.download = fileName; // 下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); // 点击下载
      document.body.removeChild(downloadElement); // 下载完成移除元素
      window.URL.revokeObjectURL(href); // 释放掉 URL 对象
    })
    .catch((err) => {
      console.log('errr', err);
    });
}

const DownLoadFiles = ({ urls, itemW }: Props) => {
  if (!urls) {
    return null;
  }
  return (
    <Box>
      {urls
        .filter((item) => !isImg(item))
        .map((item) => {
          return (
            <Flex alignItems="center" key={item} position="relative" flex={1}>
              <Box
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                onClick={() => download(item)}
                cursor="pointer"
                color="pri.blue"
              >
                {getFileNameByUrl(item)}
              </Box>
            </Flex>
          );
        })}
      <Flex flexWrap="wrap">
        {urls
          .filter((item) => isImg(item))
          .map((item) => {
            return (
              <Box
                marginRight="18px"
                marginBottom="10px"
                key={item}
                w={itemW ?? '112px'}
                h={itemW ?? '112px'}
              >
                <ZoomInImage url={getDownLoadUrl(item)} w="100%" height="100%" />
              </Box>
            );
          })}
      </Flex>
    </Box>
  );
};

interface IZoomInImageProps extends StyleProps {
  url: string;
}

export const ZoomInImage = (props: IZoomInImageProps) => {
  const { url, ...rest } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Image src={url} {...rest} onClick={onOpen} cursor="zoom-in" alt="" />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="1000px">
          <ModalCloseButton onClick={onClose} />
          <ModalBody w="1000px">
            <Image src={url} alt="" w="full" h="full" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DownLoadFiles;
