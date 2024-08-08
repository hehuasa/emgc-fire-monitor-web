import { Box, Spinner, StyleProps, BoxProps } from '@chakra-ui/react';

interface Props extends StyleProps {
  spin?: boolean;
  children?: React.ReactNode;
  boxStyle?: BoxProps;
}

const Spin = ({ children, spin, boxStyle, ...rest }: Props) => {
  return (
    <Box h="100%" position="relative" {...rest}>
      {spin ? (
        <>
          <Spinner
            color="pri.blue"
            top="50%"
            left="50%"
            zIndex={100}
            transform="translate(-50%, -50%)"
            position="absolute"
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="rgba(255,255,255,0.6)"
            zIndex={99}
            {...boxStyle}
          />
        </>
      ) : null}

      {children}
    </Box>
  );
};

export default Spin;
