import { Flex, Skeleton, Stack } from '@chakra-ui/react';
import React from 'react';

interface Props {
  loading?: boolean;
  children: JSX.Element;
}

const Loading = ({ loading, children }: Props) => {
  if (loading) {
    return (
      <Flex overflow="hidden" flexDir="column" flex={1} justifyContent="center" h="full">
        <Stack spacing={5}>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </Stack>
      </Flex>
    );
  }
  return children;
};

export default Loading;
