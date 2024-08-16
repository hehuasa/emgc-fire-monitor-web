// import EmptyPlayer from '@/components/VideoPlayer/EmptyPlayer';
// import VideoPlayer from '@/components/Video/VideoPlayer';
import { CircleClose, PtzIcon1, VideotapeIcon, VideoZoomOut } from '@/components/Icons';
// import WebRtcPlayer from '@/components/Video/WebRtcPlayer';
// import WebRtcPlayer from '@/components/Video/WebRtcPlayer';
import { CloseIcon } from '@/components/Icons';
import NodeMediaPlayer, { Refs as VideoRefs } from '@/components/Video/NodeMediaPlayer';
import Ptz from '@/components/Video/Ptz';
import WebRtcSrs from '@/components/Video/WebRtcSrs';
import { IPlayVideoItem, playVideosModel } from '@/models/video';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';
import moment from 'moment';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Moveable, { OnDrag, OnResize } from 'react-moveable';
import { useRecoilState } from 'recoil';

type IHistoryForm = {
  startDate: '';
  endDate: '';
};

const wHeight = 900;
const wWidth = 1600;

const videoWidth = 495 + 8;
const videoHeight = 270 + 8;
const Videos = () => {
  const formatMessage = useTranslations("base");
  const methods = useForm<IHistoryForm>({
    defaultValues: {},
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset,
  } = methods;
  const [videos, setVideos] = useRecoilState(playVideosModel);

  const [fullHeight, setFullHeight] = useState('4xl');
  const [showPtz, setShowPtz] = useSafeState(false);
  const videoRef = useRef<HTMLDivElement | null>(null);

  const [showHistoryVideo, setShowHistoryVideo] = useSafeState(false);
  //是否有一个视频全屏展示
  const [isfullCcreen, setIsfullCcreen] = useSafeState(false);

  const [currentVideo, setCurrentVideo] = useState<null | IPlayVideoItem>(null);
  const handleClose = useCallback(
    (index_: number) => {
      const newA = videos.filter((item) => item.index !== index_);
      setVideos([...newA]);
    },
    [videos, setVideos]
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: videotapeIsOpen,
    onOpen: videotapeOnOpen,
    onClose: videotapeOnClose,
  } = useDisclosure();
  const closePtz = useMemoizedFn(() => {
    setShowPtz(false);
  });

  const openHistoryVideo = useMemoizedFn(() => {
    //打开历史视频的时候可能多次打开
    setShowHistoryVideo(false);
    setTimeout(() => {
      setShowHistoryVideo(true);
    }, 50);
  });

  const closeHistoryVideo = useMemoizedFn(() => {
    setShowHistoryVideo(false);
    videotapeOnClose();
  });

  useMount(() => {
    setFullHeight(window.innerHeight + 'px');
  });

  return (
    <>
      {videos.map(({ index, name, cameraId }) => {
        return (
          <CusTomMoveable
            key={cameraId}
            cameraId={cameraId}
            name={name}
            index={index}
            onOpen={onOpen}
            isfullCcreen={isfullCcreen}
            handleClose={handleClose}
            setCurrentVideo={setCurrentVideo}
            isOpen={isOpen}
          />
        );
      })}

      {/* 全屏modal */}
      <Modal size={'full'} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent overflow="hidden">
          <ModalBody backgroundColor="pri.black.100" p="0">
            <Box h={fullHeight} ref={videoRef}>
              <Box
                h="full"
                flexDir="column"
                position="relative"
                _hover={{ ' > .div': { display: 'flex' } }}
              >
                <Flex
                  position="absolute"
                  top="0"
                  w="full"
                  left="0"
                  h="50px"
                  justify="space-between"
                  align="center"
                  px="10px"
                  color="pri.white.100"
                  bg="pri.dark.700"
                  borderTopRadius="10px"
                  zIndex={3}
                  display="none"
                  className="div"
                >
                  <Box>{currentVideo?.name}</Box>
                  <Flex align="center" h="full">
                    <Icon
                      _hover={{ fill: 'pri.blue.100' }}
                      color="pri.white.100"
                      w="20px"
                      h="20px"
                      cursor="pointer"
                      as={CircleClose}
                      onClick={() => {
                        setCurrentVideo(null);
                        onClose();
                      }}
                    />
                  </Flex>
                </Flex>
                {currentVideo ? (
                  process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx' ? (
                    <>
                      <NodeMediaPlayer cameraId={currentVideo.cameraId} streamType={0} />
                    </>
                  ) : (
                    <WebRtcSrs cameraId={currentVideo.cameraId} />
                  )
                ) : null}

                <Flex
                  position="absolute"
                  bottom={0}
                  left={0}
                  w="full"
                  height="56px"
                  zIndex={5}
                  justifyContent="space-between"
                  p="0 20px"
                >
                  <Flex alignItems="center">
                    <PtzIcon1
                      w="28px"
                      h="28px"
                      mr={5}
                      onClick={() => setShowPtz(true)}
                      cursor="pointer"
                    />
                    <VideotapeIcon w="34px" h="24px" cursor="pointer" onClick={videotapeOnOpen} />
                  </Flex>
                </Flex>
                {showPtz && <Ptz cameraId={currentVideo!.cameraId} closePtz={closePtz} />}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* 录像modal */}
      <Modal
        size={'6xl'}
        isOpen={videotapeIsOpen}
        onClose={closeHistoryVideo}
        onCloseComplete={reset}
      >
        <ModalOverlay />
        <ModalContent borderRadius={'8px'} boxShadow="none" bg="unset">
          <ModalBody p="0" borderRadius="10px" overflow="hidden">
            <Box h="640">
              <Flex h="100%" flexDirection="column">
                <Flex
                  h="50px"
                  alignItems="center"
                  p="0 15px"
                  bg="pri.gray.100"
                  justifyContent="space-between"
                >
                  <Flex alignItems="center">
                    <Box mr="28px">回放</Box>
                    <Box>{currentVideo?.name}</Box>
                  </Flex>
                  <CloseIcon cursor="pointer" onClick={closeHistoryVideo} />
                </Flex>
                <Flex backgroundColor="#fff" p="10px 15px" justifyContent="flex-start">
                  <FormControl
                    alignItems="center"
                    isRequired
                    isInvalid={!!errors.startDate}
                    w="auto"
                  >
                    <Flex alignItems="center">
                      <FormLabel mb={0} w="124px" mr={0}>
                        开始时间段
                      </FormLabel>

                      <Input
                        w="200px"
                        placeholder="请选择开始时间段"
                        {...register('startDate', {
                          required: '请选择开始时间段',
                        })}
                        autoFocus={false}
                        mr="17px"
                        borderRadius={'50px'}
                        type="datetime-local"
                      // id="meeting-time"
                      // name="meeting-time"
                      //min="2020-02-020T00:00"
                      //max="2023-02-20T00:00"
                      />
                    </Flex>
                    <FormErrorMessage mt={0}>
                      {errors.startDate ? (errors.startDate.message as unknown as string) : null}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl alignItems="center" isRequired isInvalid={!!errors.endDate} w="auto">
                    <Flex alignItems="center">
                      <FormLabel mb={0} w="124px" mr={0}>
                        结束时间段
                      </FormLabel>

                      <Input
                        w="200px"
                        placeholder="请选择结束时间段"
                        {...register('endDate', {
                          required: '请选择结束时间段',
                        })}
                        autoFocus={false}
                        mr="17px"
                        borderRadius={'50px'}
                        type="datetime-local"
                      />
                    </Flex>
                    <FormErrorMessage mt={0}>
                      {errors.endDate ? (errors.endDate.message as unknown as string) : null}
                    </FormErrorMessage>
                  </FormControl>
                  <Button
                    variant="default"
                    borderRadius={'20px'}
                    onClick={handleSubmit(openHistoryVideo)}
                  >
                    {formatMessage({ id: 'ok' })}
                  </Button>
                </Flex>
                <Box flex={1} bg="pri.dark.100">
                  {currentVideo &&
                    showHistoryVideo &&
                    (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx' ? (
                      <NodeMediaPlayer
                        cameraId={currentVideo.cameraId}
                        history
                        start={moment(getValues('startDate')).format('YYYY-MM-DD HH:mm:ss')}
                        end={moment(getValues('endDate')).format('YYYY-MM-DD HH:mm:ss')}
                        contentStyle={{ borderRadius: 0 }}
                      />
                    ) : (
                      <WebRtcSrs cameraId={currentVideo.cameraId} />
                    ))}
                </Box>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

interface ICusTomMoveable {
  cameraId: string;
  index: number;
  setCurrentVideo: (data: null | IPlayVideoItem) => void;
  isfullCcreen: boolean;
  onOpen: () => void;
  name: string;
  handleClose: (index_: number) => void;
  isOpen: boolean; //是否打开全屏
}

const CusTomMoveable = ({
  cameraId,
  index,
  setCurrentVideo,
  isfullCcreen,
  onOpen,
  name,
  handleClose,
  isOpen,
}: ICusTomMoveable) => {
  const [isLoad, setIsload] = useSafeState(false);
  const videoRef = useRef<VideoRefs>(null);
  const warpRef = useRef<HTMLDivElement | null>(null);
  const genPoisition = useMemoizedFn((index: number) => {
    const xums = Math.floor(wWidth / videoWidth); // 4行
    const ynums = Math.floor(wHeight / videoHeight); // 2列

    const clums = index > ynums ? Math.ceil(index / ynums) : 1;
    const row = index > ynums ? index - (clums - 1) * ynums : index;
    const top = (row === 0 ? 0 : row - 1) * videoHeight + 10;
    const right = (clums - 1) * videoWidth;

    return {
      top,
      right,
    };
  });
  const { top, right } = genPoisition(index);

  const Container = useMemo(() => {
    if (isLoad) {
      return (
        <Moveable
          target={warpRef.current}
          draggable={isOpen ? false : true}
          resizable={isOpen ? false : true}
          onDrag={({ target, transform }: OnDrag) => {
            target!.style.transform = transform;
          }}
          onResize={({ target, width, height, delta, transform, direction }: OnResize) => {
            const diffW = wWidth - target.clientWidth;
            const diffH = height - target.clientHeight;

            if (delta[0]) {
              target!.style.width = `${width}px`;
            }

            if (delta[1]) {
              target!.style.height = `${height}px`;
            }
          }}
          onResizeEnd={() => videoRef.current?.onResize()}
          origin={false}
        />
      );
    }
    return null;
  }, [isLoad, isOpen]);

  useMount(() => {
    if (warpRef.current) {
      setIsload(true);
    }
  });

  return (
    <React.Fragment key={cameraId}>
      <Box
        ref={warpRef}
        transform="translate(0px, 0px)"
        position={'absolute'}
        h={'270px'}
        w={'495px'}
        top={` ${top}px`}
        right={`${right}px`}
        zIndex={3}
        className="custom-draggable"
      >
        <Box
          h="full"
          flexDir="column"
          position="relative"
          _hover={{ ' > .div': { display: 'flex' } }}
        >
          <Flex
            position="absolute"
            top="0"
            w="full"
            left="0"
            h="10"
            justify="space-between"
            align="center"
            px="3"
            color="pri.white.100"
            bg="pri.dark.700"
            borderTopRadius="10px"
            zIndex={3}
            display="none"
            className="div"
          >
            <Box>{name}</Box>
            <Flex align="center" h="full">
              <Icon
                _hover={{ fill: 'pri.blue.100' }}
                onClick={() => {
                  setCurrentVideo({ index, name, cameraId });
                  onOpen();
                }}
                fill="pri.white.100"
                cursor="pointer"
                mr="3"
                w={3.5}
                h={3.5}
                as={VideoZoomOut}
              />

              <Icon
                _hover={{ color: 'pri.blue.100' }}
                w={4}
                h={4}
                fill="pri.white.100"
                cursor="pointer"
                as={CircleClose}
                onClick={() => {
                  handleClose(index);
                }}
              />
            </Flex>
          </Flex>
          {process.env.NEXT_PUBLIC_ANALYTICS_Ms_type === 'cx' ? (
            <>
              <NodeMediaPlayer
                cameraId={cameraId}
                contentStyle={{ borderRadius: isfullCcreen ? '0px' : '10px' }}
                ref={videoRef}
              />
              {/* <PlayComponent cameraId={cameraId} index={index} /> */}
            </>
          ) : (
            <WebRtcSrs cameraId={cameraId} />
          )}
        </Box>
      </Box>

      {Container}
    </React.Fragment>
  );
};

export default Videos;
