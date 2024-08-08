'use client';
import { IMenuItem } from '@/models/user';
import { Box } from '@chakra-ui/react';
import React, { ReactNode, useState } from 'react';

const SystemsManageLayout = ({ children }: { children: ReactNode }) => {
  const [linkItems, setlinkItems] = useState<IMenuItem[]>([
    {
      functionName: '火警类预案',
      icon: '',
      url: '/emgc/safetyproduction',
      sortIndex: 1,
      id: '',
      parentId: '',
      funType: 2,
      isEnable: 1,
      menuType: 0,
      systemSign: '',
    },
    {
      functionName: '求助类预案',
      icon: '',
      url: '/emgc/safetyproduction',
      sortIndex: 2,
      id: '',
      parentId: '',
      funType: 2,
      isEnable: 1,
      menuType: 0,
      systemSign: '',
    },
    {
      functionName: '投诉类预案',
      icon: '',
      url: '/emgc/safetyproduction',
      sortIndex: 3,
      id: '',
      parentId: '',
      funType: 2,
      isEnable: 1,
      menuType: 0,
      systemSign: '',
    },
  ]);

  return (
    <Box
      h="full"
      p={2}
      borderRightRadius="2xl"
      borderBottomLeftRadius="2xl"
      bg="pri.backs.100"
      overflowY={'auto'}
      css={{
        '::-webkit-scrollbar': {
          width: '2',
        },
        '::-webkit-scrollbar-thumb': {
          borderRadius: '10px',
          backgroundColor: 'rgba(119, 140, 162, 1)',
          cursor: 'pointer',
        },
        '::-webkit-scrollbar-track': {
          display: 'none',
          backgroundColor: 'rgba(0,0,0,0)',
          opacity: 0,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default SystemsManageLayout;
