'use client';

import { Box, Flex, Center } from '@chakra-ui/react';
import {
  CircleClose,
  PtzArrowIcon,
  AddFocuseIcon,
  ReduceFocuseIcon,
  PtzSelectedBgIcon,
} from '@/components/Icons';
import { useRef } from 'react';
import { useMemoizedFn, useSafeState } from 'ahooks';
import { useEffect } from 'react';
import { request } from '@/utils/request';

interface Props {
  closePtz: () => void;
  cameraId: string;
}

type PTZebum =
  | 'DOWN'
  | 'LEFT'
  | 'LEFT_DOWN'
  | 'LEFT_UP'
  | 'RIGHT'
  | 'RIGHT_DOWN'
  | 'RIGHT_UP'
  | 'UP'
  | 'ZOOM_IN'
  | 'ZOOM_OUT';

const Ptz = ({ closePtz, cameraId }: Props) => {
  const [animate, setAnimate] = useSafeState(false);
  const postion = useRef<{ name: PTZebum; deg: string }[]>([
    { name: 'UP', deg: '0deg' },
    { name: 'RIGHT_UP', deg: '45deg' },
    { name: 'RIGHT', deg: '90deg' },
    { name: 'RIGHT_DOWN', deg: '135deg' },
    { name: 'DOWN', deg: '180deg' },
    { name: 'LEFT_DOWN', deg: '225deg' },
    { name: 'LEFT', deg: '270deg' },
    { name: 'LEFT_UP', deg: '315deg' },
  ]);

  //判断鼠标是否按下，mousedown触发的是否如果鼠标移动了 不会触发mouseup这里加一个mouseleave来解决
  const mouseDown = useRef(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const [showbg, setShowbg] = useSafeState('');

  const onTransitionEnd = useMemoizedFn((e) => {
    console.log('ee', e.target.style.right);
    const warp = e.target as unknown as HTMLDivElement;
    if (parseFloat(warp.style.right) !== 0 && e.propertyName === 'right') {
      closePtz();
    }
  });

  const startPtz = (ptzEnum: PTZebum) => {
    const url = '/device-manger/camera/controlling';
    request({
      url,
      options: {
        method: 'post',
        body: JSON.stringify({
          cameraId,
          ptzEnum,
          startOrStop: true,
        }),
      },
    });
  };
  const stopPtz = (ptzEnum: PTZebum) => {
    const url = '/device-manger/camera/controlling';
    request({
      url,
      options: {
        method: 'post',
        body: JSON.stringify({
          cameraId,
          ptzEnum,
          startOrStop: false,
        }),
      },
    });
  };

  return (
    <Box
      position="absolute"
      right={0}
      top={0}
      w="240px"
      style={{ right: animate ? '0' : '-240px' }}
      //style={{ right: '0px' }}
      zIndex={4}
      h="full"
      color="black"
      bg="gray.100"
      borderRadius="10px"
      onTransitionEnd={onTransitionEnd}
      transition="right 0.15s"
    >
      <Flex
        alignItems="center"
        p="0 10px"
        h="50px"
        borderBottom="1px solid rgba(255,255,255,0.2)"
        justifyContent="space-between"
      >
        <Box userSelect="none">2102WH-HM03</Box>

        <CircleClose
          color="pri.white.100"
          w="20px"
          h="20px"
          onClick={() => setAnimate(false)}
          cursor="pointer"
        />
      </Flex>
      <Center w="full" mt="94px" position="relative">
        <Center w="176px" h="176px" bg="pri.white.300" borderRadius="100%">
          <Center w="107px" h="107px" bg="pri.white.400" borderRadius="100%">
            <Center w="30px" h="30px" bg="pri.white.500" borderRadius="100%">
              <Center w="14px" h="14px" bg="pri.white.100" borderRadius="100%" />
            </Center>
          </Center>

          {postion.current.map((item) => (
            <Box
              key={item.name}
              position="absolute"
              top="2px"
              left="50%"
              transform={`translateX(-50%) rotate(${item.deg})`}
              transformOrigin="20px 87px"
              h="33px"
              onMouseDown={() => {
                mouseDown.current = true;
                startPtz(item.name);
                setShowbg(item.name);
              }}
              onMouseUp={() => {
                mouseDown.current = false;
                stopPtz(item.name);
                setShowbg('');
              }}
              onMouseLeave={() => {
                if (mouseDown.current) {
                  mouseDown.current = false;
                  stopPtz(item.name);
                  setShowbg('');
                }
              }}
            >
              <PtzArrowIcon h="full" cursor="pointer" position="relative" zIndex={1} />

              {showbg === item.name ? (
                <PtzSelectedBgIcon position="absolute" left={'-10px'} top={'-2px'} />
              ) : null}
            </Box>
          ))}
        </Center>
      </Center>

      <Center mt="34px">
        <AddFocuseIcon
          w="25px"
          h="25px"
          cursor="pointer"
          onMouseDown={() => {
            mouseDown.current = true;
            startPtz('ZOOM_IN');
          }}
          onMouseUp={() => {
            mouseDown.current = false;
            stopPtz('ZOOM_IN');
          }}
          onMouseLeave={() => {
            if (mouseDown.current) {
              mouseDown.current = false;
              stopPtz('ZOOM_IN');
            }
          }}
          onClick={() => console.log('click')}
        />
        <Box m="0 10px" fontSize="16px" userSelect="none">
          焦距
        </Box>
        <ReduceFocuseIcon
          w="26px"
          h="26px"
          cursor="pointer"
          onMouseDown={() => {
            mouseDown.current = true;
            startPtz('ZOOM_OUT');
          }}
          onMouseUp={() => {
            mouseDown.current = false;
            stopPtz('ZOOM_OUT');
          }}
          onMouseLeave={() => {
            if (mouseDown.current) {
              mouseDown.current = false;
              stopPtz('ZOOM_OUT');
            }
          }}
        />
      </Center>
    </Box>
  );
};

export default Ptz;
