/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from '@/utils/request';
import { Box, Spinner } from '@chakra-ui/react';
import { useRef, useEffect, useCallback, useState } from 'react';

interface Iprops {
  cameraId: string;
  showPtz?: boolean;
}
const WebRtcPlayer = ({ cameraId = '', showPtz = false }: Iprops) => {
  const videoDom = useRef<HTMLVideoElement | null>(null);
  const warp = useRef<HTMLDivElement | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const pcRefs = useRef<RTCPeerConnection[]>([]);

  const [loading, setloading] = useState(true);

  const waitToCompleteIceGathering = async (pc: RTCPeerConnection, logPerformance: boolean) => {
    const t0 = performance.now();

    const p = new Promise((resolve) => {
      setTimeout(function () {
        resolve(pc.localDescription);
      }, 250);
      pc.onicegatheringstatechange = (ev) =>
        pc.iceGatheringState === 'complete' && resolve(pc.localDescription);
    });

    if (logPerformance) {
      await p;
      console.debug('ice gather blocked for N ms:', Math.ceil(performance.now() - t0));
    }
    return p;
  };

  const initPlayer = useCallback(async (url: string) => {
    if (pcRef.current) {
      pcRef.current.addTransceiver('video', {
        direction: 'recvonly',
      });
      pcRef.current.onsignalingstatechange = (e: any) => {
        //console.log(e);
      };
      // pcRef.current.oniceconnectionstatechange = handleIceStateChange;
      // pcRef.current.onnegotiationneeded = (e) => {
      //   handleNegotiationNeeded(e, url);
      // };
      pcRef.current.onnegotiationneeded = async (ev: any) => {
        const pc = ev.target as RTCPeerConnection;
        if (pc) {
          console.debug('>onnegotiationneeded');
          pcRefs.current.push(pc);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          const ofr = (await waitToCompleteIceGathering(pc, true)) as any;

          if (pc.connectionState === 'closed') {
            return;
          }

          console.debug('sending N line offer:', ofr.sdp.split(/\r\n|\r|\n/).length);

          try {
            // without try/catch, a thrown except from fetch exits our 'thread'
            const resp = await fetch(url, {
              method: 'POST',
              body: ofr.sdp,
              headers: { 'Content-Type': 'application/sdp' },
            });
            if (resp.ok) {
              const anssdp = await resp.text();

              const sdi = new RTCSessionDescription({ type: 'answer', sdp: anssdp });
              await pc.setRemoteDescription(sdi);

              //happy path
              return;
            }
          } catch (error) {
            // not needed console.log(error)

            console.error(error);
          }

          //failed!
          console.log('setting timeout');
          setTimeout(() => {
            console.log('timeout/rollback');
            if (pc) {
              pc.setLocalDescription({ type: 'rollback' });
              pc.restartIce();
            }
          }, 2000);
        }
      };
      pcRef.current.oniceconnectionstatechange = (e: any) => {
        const pc = e.target as RTCPeerConnection;
        pcRefs.current.push(pc);

        if (pc) {
          if (
            pc.iceConnectionState === 'failed' ||
            pc.iceConnectionState === 'disconnected' ||
            pc.iceConnectionState === 'closed'
          ) {
            //'failed' is also an option
            console.debug('*** restarting ice');
            pc.restartIce();
          }
        }
      };
      pcRef.current.onicecandidate = (event: any) => {
        // console.log(event);
      };
      pcRef.current.ontrack = (event: {
        track: { kind: string };
        streams: readonly MediaStream[];
      }) => {
        if (event.track.kind == 'video' && videoDom.current) {
          // stream.current!.value = event.streams[0];

          setloading(false);
          videoDom.current.srcObject = event.streams[0];
          // videoDom.current!.style.display = "none";
        }
      };
      // await pcRef.current.setLocalDescription(await pcRef.current.createOffer());
      // if (pcRef.current.localDescription) {
      //   const res = await fetch(url, {
      //     method: 'POST',
      //     body: pcRef.current.localDescription.toJSON().sdp,
      //     headers: { 'Content-Type': 'application/sdp' },
      //   });

      //   if (res.ok) {
      //     const result = await res.text();

      //     pcRef.current.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: result }));
      //   }
      // }
    }
  }, []);

  const getUrl = async () => {
    // const url = '/ms-gateway/device-manger/camera/rtsp_live_play';
    // const urlRes = await request<any>({
    //   url,
    //   options: {
    //     method: 'post',
    //     body: JSON.stringify({
    //       playProtocol: 'WEBRTC',
    //       cameraId,
    //       start: '2023-02-06 12:00:00',
    //       end: '2023-02-06 13:00:00',
    //       // rtspUrl: 'rtsp://admin:admin2019@192.168.0.109:554/cam/realmonitor?channel=1&subtype=0',
    //     }),
    //   },
    // });

    // const urlRes1 = await request<any>({
    //   url,
    //   options: {
    //     method: 'post',
    //     body: JSON.stringify({
    //       playProtocol: 'WS_FLV',
    //       cameraId,
    //       // rtspUrl: 'rtsp://admin:admin2019@192.168.0.109:554/cam/realmonitor?channel=1&subtype=0',
    //     }),
    //   },
    // });
    // console.info('urlRes', urlRes);
    // console.info('urlRes1', urlRes1);

    const res = await request<any>({
      url: '/ms-gateway/video-server/api/rtsp_play',
      options: {
        method: 'post',
        body: JSON.stringify({
          playProtocol: 'WEBRTC',
          rtspUrl: 'rtsp://admin:admin2019@192.168.0.109:554/cam/realmonitor?channel=1&subtype=0',
        }),
      },
    });
    if (res && res.code === 200) {
      return res.data;
    }
    return '';
  };

  useEffect(() => {
    if (pcRef.current) {
      pcRef.current.close();
    } else {
      // pcRef.current = new RTCPeerConnection();

      // initPlayer('/webrtc/play/live/test');

      getUrl().then((url) => {
        const url_ = url.playUrl as string;
        const index = url_.indexOf('/webrtc/');
        const newUrl = url_.substring(index);

        console.info('newUrl', newUrl);
        console.info('url_', url_);

        setTimeout(() => {
          pcRef.current = new RTCPeerConnection();
          initPlayer('/webrtc/play/live/test');
        }, 1 * 100);
      });
    }

    return () => {
      for (const pcRef of pcRefs.current) {
        if (pcRef && pcRef.close) {
          pcRef.close();
        }
      }
      if (pcRef.current) {
        // pcRef.current.getReceivers()[0].
        // pcRef.current.removeTrack();

        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, []);

  return (
    <Box w="full" h="full" ref={warp} bg="pri.dark.100" position="relative" borderRadius="10px">
      <video
        ref={videoDom}
        autoPlay
        muted
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          borderRadius: '10px',
        }}
      />

      {loading && (
        <Spinner
          size="xl"
          color="pri.white.100"
          zIndex={2}
          position="absolute"
          top="50%"
          left="50%"
        />
      )}
    </Box>
  );
};

export default WebRtcPlayer;
