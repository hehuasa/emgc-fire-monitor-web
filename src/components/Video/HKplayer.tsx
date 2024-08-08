
import { request } from '@/utils/request';
import { videoSwitchTime } from '@/utils/util';
import { Box, BoxProps } from '@chakra-ui/react';
import { useMount, useThrottleFn, useUnmount } from 'ahooks';
import { v4 as uuidv4 } from 'uuid';

import React, { useRef, useState } from 'react';

interface Iprops {
    cameraIds: string[];
    history?: boolean;
    start?: string;
    end?: string;
    contentStyle?: BoxProps;
}
const NodeMediaPlayerD = ({ cameraIds, history, start, end, contentStyle }: Iprops) => {
    const id = useRef<string>('video' + uuidv4());
    const ids = useRef<string[]>(['video' + uuidv4(), 'video' + uuidv4()]);
    const currentVideoDomIndexRef = useRef<0 | 1>(0) // 两个播放器，确定谁在顶部的index
    const [currentVideoDomIndex, setCurrentVideoDomIndex] = useState<0 | 1>(0) // 两个播放器，确定谁在顶部的index

    const [loading, setloading] = useState(true);

    const playerRef = useRef<null | NodePlayer>(null)
    const playersRef = useRef<NodePlayer[]>([])

    const timer = useRef<null | NodeJS.Timer>(null)
    const switchTimer = useRef<null | NodeJS.Timer>(null)



    const currentIndex = useRef<number>(0) // 轮询的摄像头Id
    const currentVideo = useRef<{ id: string; playUrl: string }>({
        "id": "",
        "playUrl": ""
    })

    const changeCurrentVideoDomIndex = (index: 0 | 1) => {
        currentVideoDomIndexRef.current = index;
        setCurrentVideoDomIndex(index)
    }
    const { run } = useThrottleFn(
        () => {
            console.info('============流没有数据，重新拉流===id:===========', cameraIds[0]);
            playVideo(cameraIds[0]);
        },
        { wait: 1000 * 10 },
    );
    useMount(() => {

        // playerRef.current = new JSPlugin({
        //     szId: 'play_window', //需要英文字母开头 必填
        //     szBasePath: './', // 必填,引用H5player.min.js的js相对路径

        //     // 当容器div#play_window有固定宽高时，可不传iWidth和iHeight，窗口大小将自适应容器宽高
        //     // iWidth: 600,
        //     // iHeight: 400,

        //     // 分屏播放，默认最大分屏4*4
        //     // iMaxSplit: 4,
        //     // iCurrentSplit: 1,

        //     // 样式
        //     // oStyle: {
        //     //   border: "#343434",
        //     //   borderSelect: "#FFCC00",
        //     //   background: "#000"
        //     // }
        // })
        // if (ids.current[currentVideoDomIndex.current]) {
        // NodePlayer.debug(dev ? false : false)
        // playerRef.current = new NodePlayer();
        // playerRef.current.useWorker();

        // // playerRef.current.skipErrorFrame()
        // playerRef.current.setView(ids.current[currentVideoDomIndex.current]);
        // playerRef.current.setScaleMode(0)
        // playerRef.current.on('start', () => {
        //   setloading(false);
        // });

        // playerRef.current.on("stats", (e) => {

        //   const { vbps, buf, ts } = e;
        //   // 如果没有流，尝试重新拉
        //   if (vbps === 0 && buf === 0 && ts === 0) {
        //     run()
        //   }

        // });
        playVideo(cameraIds[0]);

        if (cameraIds.length > 1) {
            switchVideo()
        } else {
            switchTimer.current = setInterval(() => {
                playVideo(cameraIds[0]);
            }, videoSwitchTime)
        }

        // }
    });

    const switchVideo = async () => {

        if (switchTimer.current) {
            clearInterval(switchTimer.current);
            switchTimer.current = null
        }

        switchTimer.current = setInterval(() => {
            currentIndex.current += 1;
            if (currentIndex.current >= cameraIds.length) {
                currentIndex.current = 0;
            }
            playVideo(cameraIds[currentIndex.current])
        }, videoSwitchTime)

    };

    const playVideo = async (cameraId: string) => {

        // if (playersRef.current[currentVideoDomIndexRef.current]) {

        //     // const res = cameraIds.length === 1 ? await getPlayUrlWs(cameraId) : await getPlayUrl(cameraId);
        //     const res = await getPlayUrlWs(cameraId);

        //     const newIndex = currentVideoDomIndexRef.current === 0 ? 1 : 0

        //     if (res !== 0 && res.playUrl) {
        //         // setTimeout(() => {
        //         //     stopVideo(playersRef.current[currentVideoDomIndexRef.current]);
        //         //     // 切换视频窗
        //         //     changeCurrentVideoDomIndex(newIndex)
        //         // }, 2 * 1000);



        //         const { id, playUrl, url } = res;
        //         currentVideo.current = { id, playUrl }


        //         playerRef.current.JS_Play(url, { playURL: url, mode: 1 }, 0).then(
        //             () => {
        //                 console.log('playbackStart success')

        //             },
        //             e => { console.error(e) }
        //         );




        //     }

        // }
    }
    const stopVideo = (player: NodePlayer) => {
        if (player) {
            player.stop()
            player.clearView()
            // playerRef.current.clearView()
        };
        // request({
        //   url: "/video-server/api/forced_shutdown", options: {
        //     method: "post",
        //     body: JSON.stringify(obj)
        //   }
        // })
    }
    useUnmount(() => {

        for (const player of playersRef.current) {
            stopVideo(player);
            player.release(true)
        }
        // if (currentVideo.current.id) {
        //   stopVideo(currentVideo.current);

        // }
        // if (playerRef.current) {
        //   playerRef.current.release(true)
        // }
        if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
        }
        if (switchTimer.current) {
            clearInterval(switchTimer.current);
            switchTimer.current = null;
        }

    })

    const getPlayUrlWs = async (cameraId: string) => {

        const url = `/device-manger/camera/live_url?protocol=ws&cameraId=${cameraId}&streamType=0`;
        const dev = process.env.NODE_ENV !== 'production';

        const obj: any & { playProtocol: string, cameraIds: string[] } = {
            protocol: 'ws',
            cameraId,
            streamType: 0,
        };

        const urlRes = await request<string>({
            url,
        });
        // 需要视频轮播的话，不做心跳
        // if (cameraIds.length === 1) {
        //     if (timer.current) {
        //         clearInterval(timer.current);
        //         timer.current = null;

        //         timer.current = setInterval(() => {
        //             pingUrl({ id: urlRes.data.id, playUrl: urlRes.data.playUrl })
        //         }, 5 * 1000 * 60)
        //     }
        // }

        if (urlRes.code === 200 && urlRes.data && urlRes.data) {
            const url_ = dev
                ? urlRes.data
                : urlRes.data;

            return { id: urlRes.data, playUrl: urlRes.data, url: url_ }
        } else {
            console.info('============拉流失败 日志开始===========');

            console.info('url', url);
            console.info('参数', obj);
            console.info('返回值', urlRes.msg);
            console.info('============拉流失败： 日志结束===========');

            return 0
        }

        // return dev
        //   ? "ws://" + "10.21.64.3" + ':9192' + urlRes.data.playUrl
        //   : "ws://" + window.location.hostname + ':9192' + urlRes.data.playUrl;
        // const res = await request<any>({
        //   url: '/video-server/api/rtsp_play',
        //   options: {
        //     method: 'post',
        //     body: JSON.stringify({
        //       playProtocol: 'HTTP_FLV',
        //       rtspUrl: 'rtsp://admin:admin2019@192.168.0.109:554/cam/realmonitor?channel=1&subtype=1',
        //     }),
        //   },
        // });

        // console.info('res', res);

        // return dev
        //   ? window.location.origin + '/httpflv' + '/live/stream/bb029b2f816745c8ba569a46bc050421.flv'
        //   : window.location.origin + '/httpflv' + res.data.playUrl;
    };
    const getPlayUrl = async (cameraId: string) => {
        const url = history ? '/device-manger/camera/rtsp_history_play' : '/device-manger/camera/rtsp_live_play';
        const dev = process.env.NODE_ENV !== 'production';

        const obj: any & { playProtocol: string, cameraIds: string[] } = {
            playProtocol: 'HTTP_FLV',
            // playProtocol: 'WS_FLV',
            cameraId,
            streamType: 1,
        };
        if (history) {
            obj.start = start;
            obj.end = end;
        }
        const urlRes = await request<{ id: string; playUrl: string }>({
            url,
            options: {
                method: 'post',
                body: JSON.stringify({
                    //   playProtocol: 'HTTP_FLV',
                    // cameraId,
                    // start: '2023-02-06 12:00:00',
                    // end: '2023-02-06 13:00:00',
                    // rtspUrl: 'rtsp://admin:admin2019@192.168.0.109:554/cam/realmonitor?channel=1&subtype=1',
                    ...obj,
                }),
            },
        });
        // 需要视频轮播的话，不做心跳
        if (cameraIds.length === 1) {
            if (timer.current) {
                clearInterval(timer.current);
                timer.current = null;

                timer.current = setInterval(() => {
                    pingUrl({ id: urlRes.data.id, playUrl: urlRes.data.playUrl })
                }, 5 * 1000 * 60)
            }
        }

        if (urlRes.code === 200 && urlRes.data && urlRes.data.playUrl) {
            const url_ = dev
                ? "ws://" + "10.21.64.3" + ':9192' + urlRes.data.playUrl
                : "ws://" + window.location.hostname + ':9192' + urlRes.data.playUrl;

            return { id: urlRes.data.id, playUrl: urlRes.data.playUrl, url: url_ }
        } else {
            console.info('============拉流失败 日志开始===========');

            console.info('url', url);
            console.info('参数', obj);
            console.info('返回值', urlRes.msg);
            console.info('============拉流失败： 日志结束===========');

            return 0
        }

        // return dev
        //   ? "ws://" + "10.21.64.3" + ':9192' + urlRes.data.playUrl
        //   : "ws://" + window.location.hostname + ':9192' + urlRes.data.playUrl;
        // const res = await request<any>({
        //   url: '/video-server/api/rtsp_play',
        //   options: {
        //     method: 'post',
        //     body: JSON.stringify({
        //       playProtocol: 'HTTP_FLV',
        //       rtspUrl: 'rtsp://admin:admin2019@192.168.0.109:554/cam/realmonitor?channel=1&subtype=1',
        //     }),
        //   },
        // });

        // console.info('res', res);

        // return dev
        //   ? window.location.origin + '/httpflv' + '/live/stream/bb029b2f816745c8ba569a46bc050421.flv'
        //   : window.location.origin + '/httpflv' + res.data.playUrl;
    };

    const pingUrl = async ({ id, playUrl }: { id: string; playUrl: string }) => {
        const urlRes = await request<{ id: string; playUrl: string }>({
            url: '/video-server/api/alive',
            options: {
                method: 'post',
                body: JSON.stringify({ id, playUrl }),
            },
        });

    }
    return (
        <Box w="full" h="full" bg="pri.dark.100" position="relative" borderRadius="10px" overflow="hidden" {...contentStyle}>
            {/* <canvas id={ids.current[0]} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: currentVideoDomIndex === 0 ? 1 : -1 }} />
            <canvas id={ids.current[1]} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: currentVideoDomIndex === 1 ? 1 : -1 }} />
       */}
            <canvas id={id.current} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />

            {/* {loading && (
        <Spinner size="xl" color="pri.white.100" zIndex={2} position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" />
      )} */}

        </Box>
    );
};

export default NodeMediaPlayerD;
