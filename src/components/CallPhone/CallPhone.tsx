import { Box, Flex, forwardRef } from '@chakra-ui/react';
import { useMemoizedFn, useSafeState } from 'ahooks';

import { CircleClose, CallNumberIcon, HangUpIcon } from '../Icons';
import Process from './Process';
import { useEffect, Ref, useImperativeHandle } from 'react';
import { phoneStatuModel, IPhoneStatu } from '@/models/callNumber';
import { useRecoilState } from 'recoil';

export interface Refs {
  setPhonelineStatu: (e: IPhoneStatu) => void;
  close: () => void;
}
interface Props {
  destory: () => void;
  name: string;
  number: string | number;
  webCall: () => void;
  webHangUp: () => void;
  isbroadcast?: boolean;
}

const CallPhone = (props: Props, refs: Ref<Refs>) => {
  const { name, number, destory, webCall, webHangUp, isbroadcast } = props;
  const [show, setShow] = useSafeState(false);
  //电话是否已经接通 1未拨打2拨打中3已接通
  const [phonelineStatu, setPhonelineStatu] = useRecoilState(phoneStatuModel);

  useImperativeHandle(refs, () => ({
    setPhonelineStatu,
    close,
  }));

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 50);
  }, []);

  const close = useMemoizedFn(() => {
    setShow(false);
  });

  //动画结束后彻底关闭提示窗
  const onTransitionEnd = useMemoizedFn((e) => {
    const warp = e.target as unknown as HTMLDivElement;
    if (warp.style.opacity === '0') {
      destory();
      setPhonelineStatu(1);
    }
  });

  const hangUp = useMemoizedFn(() => {
    //关闭电话弹窗
    close();
    webHangUp();
  });

  const call = useMemoizedFn(() => {
    //送打电话指令
    webCall();
    setPhonelineStatu(2);
    //显示正在打电话样式
  });

  //页面展示广播
  const _renderContent = useMemoizedFn(() => {
    if (isbroadcast) {
      return (
        <Flex flexDirection="column" justifyContent="center" h={'160px'}>
          <Box textAlign="center" mb="20px" color="pri.dark.100">
            正在播放广播
          </Box>
          <Box textAlign="center">
            <HangUpIcon fontSize={36} cursor="pointer" onClick={hangUp} color="pri.phone.close" />
          </Box>
        </Flex>
      );
    }
    switch (phonelineStatu) {
      case 1:
        return (
          <Flex
            flexDirection="column"
            justifyContent="center"
            h={phonelineStatu ? '160px' : '120px'}
          >
            <Box textAlign="center" mb="20px" color="pri.dark.100">
              是否拨打“{name} {number}”
            </Box>
            <Box textAlign="center">
              <CallNumberIcon
                fontSize={36}
                cursor="pointer"
                onClick={call}
                color="pri.phone.open"
              />
            </Box>
          </Flex>
        );

      case 2:
        return (
          <Flex
            flexDirection="column"
            justifyContent="center"
            h={phonelineStatu ? '160px' : '120px'}
            padding="0 15px"
          >
            <Flex mb="20px" color="pri.dark.100">
              {name} 正在等待对方接受电话邀请
              <Process />
            </Flex>
            <Box textAlign="center">
              <HangUpIcon fontSize={36} cursor="pointer" onClick={hangUp} color="pri.phone.close" />
            </Box>
          </Flex>
        );
      case 3:
        return (
          <Flex
            flexDirection="column"
            justifyContent="center"
            h={phonelineStatu ? '160px' : '120px'}
          >
            <Box textAlign="center" mb="20px" color="pri.dark.100">
              {name} 已接通
            </Box>
            <Box textAlign="center">
              <HangUpIcon fontSize={36} cursor="pointer" onClick={hangUp} color="pri.phone.close" />
            </Box>
          </Flex>
        );
    }
  });

  return (
    <Box
      position="absolute"
      zIndex={9999}
      right={440}
      bottom={30}
      transform={`scale(${show ? 1 : 0.5})`}
      style={{ opacity: show ? 1 : 0 }}
      w={300}
      borderRadius={10}
      background="pri.white.100"
      boxShadow="0 1px 2px rgb(0 0 0 / 10%)"
      transition="all 0.2s"
      onTransitionEnd={onTransitionEnd}
      overflow="hidden"
    >
      {phonelineStatu === 1 ? (
        <Flex bg="#EFF0F2" h="40px" alignItems="center" justifyContent="space-between" p="0 15px">
          <Box color="pri.dark.100" fontSize="16px" fontWeight="700">
            提示
          </Box>

          <CircleClose
            _hover={{ fill: 'pri.blue.100' }}
            w="15px"
            h="15px"
            fill="pri.dark.100"
            cursor="pointer"
            opacity="0.8"
            onClick={hangUp}
          />
        </Flex>
      ) : null}
      {_renderContent()}
    </Box>
  );
};

export default forwardRef(CallPhone);
