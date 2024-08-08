import { Box, Wrap, WrapItem, Text } from '@chakra-ui/react';
// import nextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type routerType = {
  name: string;
  key: string;
};

const LeftBar = () => {
  const router = useRouter();
  const [routes, setRoutes] = useState<routerType[]>([
    {
      name: '未处理',
      key: '1',
    },
    {
      name: '处理中',
      key: '2',
    },
    {
      name: '已关闭',
      key: '3',
    },
  ]);
  const handleClick = (route: routerType) => {
    router.push(`/emgc/alarmRecord?key=${route.key}`);
  };

  return (
    <>
      <Wrap w={44} h="calc(100vh - 4rem)" bg={'pri.gray.100'} direction="column">
        {routes.map((route) => (
          <WrapItem
            h={'12'}
            textAlign="center"
            bg={'pri.dark.300'}
            borderBottom="1px"
            cursor={'pointer'}
            _hover={{
              bg: 'pri.blue.100',
              color: '#FFF',
            }}
            key={route.key}
          >
            <Box
              w={'full'}
              lineHeight={'48px'}
              _hover={{
                bg: 'pri.blue.100',
                color: '#FFF',
              }}
              onClick={() => handleClick(route)}
            >
              <Text>{route.name}</Text>
            </Box>
          </WrapItem>
        ))}
      </Wrap>
    </>
  );
};
export default LeftBar;
