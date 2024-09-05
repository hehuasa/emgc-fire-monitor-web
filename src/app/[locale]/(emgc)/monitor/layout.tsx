'use client';
import { lightTheme } from '@/styles';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {

  return (
    <>
      <CacheProvider>
        <ChakraProvider theme={lightTheme}>      {children}
        </ChakraProvider>
      </CacheProvider>

    </>
  );
};

export default Layout;
