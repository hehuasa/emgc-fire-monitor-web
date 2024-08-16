import { useMemoizedFn, useSafeState, useUnmount } from 'ahooks';

import { IntlProvider, useIntl } from 'react-intl';
import { useEffect } from 'react';
import { IProps } from './CreateContainer';
import zhCN from '@/locales/zh-CN';
import dynamic from 'next/dynamic';
const ModalWarp = dynamic(() => import('@/components/emergencyCommand/modalWarp'), { ssr: false });
import { Button } from '@/components/emergencyCommand/button';

import { Box } from '@chakra-ui/react';
import { useMount } from 'ahooks';

// const ChakraBox = chakra(motion.div, {
//   /**
//    * Allow motion props and non-Chakra props to be forwarded.
//    */
//   shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
// });

interface Props extends IProps {
  destory: () => void;
}

export let closeFn: null | (() => void);

const Warp = (props: Props) => {
  return (
    <IntlProvider locale={'zh'} messages={zhCN}>
      <Content {...props} />
    </IntlProvider>
  );
};

const Content = (props: Props) => {
  const [show, setShow] = useSafeState(false);
  const { title, destory, ok } = props;
  const [isLoading, setIsLoading] = useSafeState(false);

  useMount(() => {
    setTimeout(() => {
      setShow(true);
    }, 50);
    closeFn = close;
  });

  useUnmount(() => {
    closeFn = null;
  });

  useEffect(() => {
    if (show) {
      setShow(true);
    }
  }, [show]);

  const formatMessage = useTranslations("base");

  const close = useMemoizedFn(() => {
    setShow(false);
  });

  const onTransitionEnd = useMemoizedFn((e) => {
    const warp = e.target as unknown as HTMLDivElement;
    if (warp.style.opacity === '0') {
      destory();
    }
  });

  const handleOk = useMemoizedFn(async () => {
    setIsLoading(true);
    await ok?.();
    setIsLoading(false);
  });

  return (
    <>
      <Box
        position="absolute"
        zIndex={9998}
        w="100%"
        h="100%"
        left="0px"
        top="0px"
      //bg="rgba(0,0,0,.3)"
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
        transition="all 0.15s"
        onTransitionEnd={onTransitionEnd}
      >
        <ModalWarp title={title} onClose={close}>
          <Box display="flex" justifyContent="center" pb="20px">
            <Button onClick={close} borderRadius="20px" mr="20px">
              {formatMessage('cancel')}
            </Button>
            <Button isLoading={isLoading} buttonType="active" onClick={handleOk}>
              {formatMessage('ok')}
            </Button>
          </Box>
        </ModalWarp>
      </Box>
    </>
  );
};

export default Warp;
