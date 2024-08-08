import nodataPng from '@/assets/layout/null.png';
import emgcNodataPng from '@/assets/emgcCommond/noData.png';
import Image from 'next/image';
import { Box, BoxProps, Center } from '@chakra-ui/react';

interface Props {
  showTitle?: boolean;
  titleStyle?: BoxProps;
  theme?: 'deep' | 'shallow';
  imgW?: number;
  imgH?: number;
}

const TableNoData = ({ showTitle, titleStyle, theme = 'shallow', imgW, imgH }: Props) => {
  return (
    <Box textAlign="center" width={'48'} m="auto">
      <Center>
        <Image
          src={theme === 'deep' ? emgcNodataPng : nodataPng}
          quality="100"
          objectFit="cover"
          alt="空状态"
          width={imgW}
          height={imgH}
        />
      </Center>
      {showTitle ? (
        <Box fontSize="16px" {...titleStyle}>
          暂无数据
        </Box>
      ) : null}
    </Box>
  );
};

export default TableNoData;
