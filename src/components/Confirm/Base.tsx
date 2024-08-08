import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import { useMemoizedFn, useSafeState } from 'ahooks';
import { CacheProvider } from '@chakra-ui/next-js';
import { IntlProvider, useIntl } from 'react-intl';
import { useEffect } from 'react';
import { IProps } from './CreateContainer';
import zhCN from '@/locales/zh-CN';
import enUS from '@/locales/en-US';
import dynamic from 'next/dynamic';
const ModalWarp = dynamic(() => import('@/components/emergencyCommand/modalWarp'), { ssr: false });
import { Button as EmgcFormBtn } from '@/components/emergencyCommand/button';

// import { localesModal } from '@/models/global';
// import { useRecoilValue } from 'recoil';

interface Props extends IProps {
  destory: () => void;
  locales?: string;
}

const Warp = (props: Props) => {
  const locales = props.locales || 'zh';

  return (
    <IntlProvider locale={locales} messages={locales === 'zh' ? zhCN : enUS}>
      <CacheProvider>
        <Content {...props} />
      </CacheProvider>
    </IntlProvider>
  );
};

const Content = (props: Props) => {
  const [show, setShow] = useSafeState(false);
  const { title, destory, theme, ok, isDark } = props;
  const [loading, setLoading] = useSafeState(false);
  const toast = useToast();

  const pri = theme.colors.pri;

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 50);
  }, []);

  const { formatMessage } = useIntl();

  const close = useMemoizedFn(() => {
    setShow(false);
  });

  const onTransitionEnd = useMemoizedFn((e) => {
    const warp = e.target as unknown as HTMLDivElement;
    if (warp.style.opacity === '0') {
      destory();
    }
  });

  const openTheDoor = useMemoizedFn(async () => {
    setLoading(true);
    await ok?.();
    setLoading(false);
  });

  if (isDark) {
    return (
      <Box
        position="absolute"
        zIndex={9999}
        left="50%"
        top="50%"
        transition="all 0.2s"
        transform={`translate(-50%, -50%) scale(${show ? 1 : 0.5})`}
        style={{ opacity: show ? 1 : 0 }}
        onTransitionEnd={onTransitionEnd}
        w={300}
      >
        <ModalWarp onClose={close} title={title}>
          <Flex p="15px" justifyContent="center">
            <Box>
              <EmgcFormBtn onClick={close}>{formatMessage({ id: 'cancel' })}</EmgcFormBtn>
              <EmgcFormBtn isLoading={loading} onClick={openTheDoor} buttonType="active">
                {formatMessage({ id: 'ok' })}
              </EmgcFormBtn>
            </Box>
          </Flex>
        </ModalWarp>
      </Box>
    );
  }

  return (
    <>
      <Box
        position="absolute"
        zIndex={9998}
        w="100%"
        h="100%"
        top={0}
        left={0}
        bg="rgba(0,0,0,0.2)"
      />
      <Box
        position="absolute"
        zIndex={9999}
        left="50%"
        top="50%"
        transform={`translate(-50%, -50%) scale(${show ? 1 : 0.5})`}
        style={{ opacity: show ? 1 : 0 }}
        w={300}
        borderRadius={10}
        boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
        transition="all 0.2s"
        onTransitionEnd={onTransitionEnd}
        overflow="hidden"
        bg={pri['white.100']}
      >
        <Box minW={300}>
          <Box p="15px" borderBottom="1px solid #707070" color="#252631">
            {title}
          </Box>
          <Flex p="15px" justifyContent="center">
            <Box>
              <Button
                onClick={close}
                bg="#E4E4E4"
                borderColor="#999999"
                border="1px solid"
                w="80px"
                h="40px"
                borderRadius="20px"
                color="#252631"
                mr="20px"
              >
                {formatMessage({ id: 'cancel' })}
              </Button>
              <Button
                isLoading={loading}
                onClick={openTheDoor}
                w="80px"
                h="40px"
                borderRadius="20px"
                bg="#0078EC"
                color={pri['white.100']}
              >
                {formatMessage({ id: 'ok' })}
              </Button>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default Warp;
