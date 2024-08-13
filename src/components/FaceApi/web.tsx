/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { useLocalStorageState, useMemoizedFn, useMount, useSafeState, useUnmount } from 'ahooks';

import { useTranslations } from 'next-intl';
import { Button, message, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { IUserRes } from '@/models/user';
import { request } from '@/utils/request';
import { formatUserInfo } from '@/utils/util';


interface FaceApiProps {
	checkType?: 0 | 1; // 0: 人脸检测，1: 人脸录入， 区别在于最后调用的接口不一样
	closeModal: () => void;
	callBack?: () => Promise<any>;
}

const minScore = 0.2; // minimum score
// eslint-disable-next-line unused-imports/no-unused-vars
const maxResults = 1; // maximum number of results to return
const modelPath = process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/face-api/model/';

const errorMap = {
	NotAllowedError: '摄像头已被禁用，请在系统设置或者浏览器设置中开启后重试',
	AbortError: '硬件问题，导致无法访问摄像头',
	NotFoundError: '未检测到可用摄像头',
	NotReadableError: '操作系统上某个硬件、浏览器或者网页层面发生错误，导致无法访问摄像头',
	OverConstrainedError: '未检测到可用摄像头',
	SecurityError: '摄像头已被禁用，请在系统设置或者浏览器设置中开启后重试',
	TypeError: '类型错误，未检测到可用摄像头',
};
// eslint-disable-next-line unused-imports/no-unused-vars
const constraints = {
	audio: false,
	video: { facingMode: 'user', resizeMode: 'crop-and-scale' },
};
const FaceApi = ({ checkType = 0, closeModal, callBack }: FaceApiProps) => {
	const [_, setUserInfo] = useLocalStorageState<null | IUserRes>('userInfo', {
		defaultValue: null,
	});
	const router = useRouter();
	const [canPic, setCanPic] = useSafeState(true); //是否可以拍摄照片
	const hasFace = useRef<boolean>(false);
	const [checkStatus, setCheckStatus] = useSafeState<0 | 1 | 2>(); // 人脸认证状态
	const [loading, setLoading] = useSafeState(false);

	const [isLoaded, setIsLoaded] = useSafeState(false);
	const baseT = useTranslations('base');
	const loginT = useTranslations('login');
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const [videoW, setVideoW] = useSafeState(640);
	const [videoH, setVideoH] = useSafeState(360);
	const tinyFaceDetectorOptions = useRef<TinyFaceDetectorOptions | null>(null);
	const videoStream = useRef<MediaStream | null>(null);

	const requestAnimationFrameId = useRef<number>();

	const [messageApi, contextHolder] = message.useMessage();
	const showToastTime = useRef<number>(0);

	useMount(() => {
		initFaceApi().then(() => {
			if (canvasRef.current) {
				ctxRef.current = canvasRef.current.getContext('2d', {
					willReadFrequently: true,
				});
			}
			initCamera();
		});
	});

	// 初始化face-api，加载模型
	const initFaceApi = async () => {
		// @ts-ignore
		await tf.setBackend('webgl');
		// @ts-ignore
		await tf.ready();

		// tfjs optimizations
		// @ts-ignore
		if (tf?.env().flagRegistry.CANVAS2D_WILL_READ_FREQUENTLY)
			// @ts-ignore
			tf.env().set('CANVAS2D_WILL_READ_FREQUENTLY', true);
		// @ts-ignore
		if (tf?.env().flagRegistry.WEBGL_EXP_CONV)
			// @ts-ignore
			tf.env().set('WEBGL_EXP_CONV', true);
		// @ts-ignore
		if (tf?.env().flagRegistry.WEBGL_EXP_CONV)
			// @ts-ignore
			tf.env().set('WEBGL_EXP_CONV', true);

		await faceapi.nets.tinyFaceDetector.load(modelPath); // 轻量级，大概188Kb，效果略低于ssdMobilenetv1
		// await faceapi.nets.ssdMobilenetv1.load(modelPath); // 效果更好，5.35mb
		// await faceapi.nets.ageGenderNet.load(modelPath); // 419kb  年龄与性别判断
		await faceapi.nets.faceLandmark68Net.load(modelPath); //348kb   人脸标记
		// await faceapi.nets.faceRecognitionNet.load(modelPath); // 6.14mb
		await faceapi.nets.faceExpressionNet.load(modelPath); // 321kb 人脸表情
		tinyFaceDetectorOptions.current = new faceapi.TinyFaceDetectorOptions({
			inputSize: 512,
			scoreThreshold: minScore,
		});
		// ssdMobilenetv1 模型，暂不用
		// optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
		//   minConfidence: minScore,
		//   maxResults,
		// });
	};

	const initCamera = async () => {
		if (!videoRef.current || !canvasRef.current) {
			return;
		}
		if (!navigator.mediaDevices) {
			messageApi.warning('无权限调用摄像机');

			return null;
		}
		try {
			const constraints: any = {
				audio: false,
				video: { facingMode: 'user', resizeMode: 'crop-and-scale' },
			};
			if (window.innerWidth > window.innerHeight) {
				constraints.video.width = { ideal: window.innerWidth };
			} else {
				constraints.video.height = { ideal: window.innerHeight };
			}

			videoStream.current = await navigator.mediaDevices.getUserMedia(constraints);
			if (videoRef.current && videoStream.current) {
				videoRef.current.srcObject = videoStream.current;
				// videoRef.current.play()

				const track = videoStream.current.getVideoTracks()[0];
				const settings = track.getSettings();

				if (settings.deviceId) {
					delete settings.deviceId;
				}
				if (settings.groupId) {
					delete settings.groupId;
				}
				if (settings.aspectRatio) {
					settings.aspectRatio = Math.trunc(100 * settings.aspectRatio) / 100;
				}

				return new Promise((resolve) => {
					if (videoRef.current) {
						videoRef.current.onloadeddata = async () => {
							if (canvasRef.current && videoRef.current) {
								canvasRef.current.width = videoRef.current.videoWidth;
								canvasRef.current.height = videoRef.current.videoHeight;
								// setVideoW(videoRef.current.videoWidth)
								// setVideoH(videoRef.current.videoHeight)
								// todo====> 需要根据视频画面尺寸与video元素尺寸，判读不同的情况，但是暂时不影响移动端展示。

								console.log('1111111', videoRef.current.videoWidth, videoRef.current.clientWidth);

								// canvasRef.current.height = (327 / videoRef.current.videoWidth) * videoRef.current.videoHeight;
								// setVideoW(videoRef.current.videoWidth)
								// setVideoH((327 / videoRef.current.videoWidth) * videoRef.current.videoHeight)
								videoRef.current.play();
								setIsLoaded(true);
								detectVideo();
								resolve(true);
							}
						};
					}
				});
			} else {
				messageApi.warning('摄像机调用失败，请检查摄像头或操作系统配置');
			}
		} catch (error: unknown) {
			// @ts-ignore
			if (errorMap[error.name]) {
				// @ts-ignore
				messageApi.warning(errorMap[error.name]);
			} else {
				messageApi.warning('摄像机调用失败，请检查摄像头或操作系统配置');
			}
		}
	};

	const detectVideo = () => {
		if (videoRef.current && canvasRef.current && tinyFaceDetectorOptions.current) {
			faceapi
				.detectAllFaces(videoRef.current, tinyFaceDetectorOptions.current)
				.withFaceLandmarks()
				.withFaceExpressions()
				// @ts-ignore
				.then((result) => {
					requestAnimationFrameId.current = requestAnimationFrame(detectVideo);
					drawFaces(result);

					//检测到有人脸并且是checkType === 0进行人脸登录
					if (hasFace.current && checkType === 0) {
						videoRef.current?.pause();
						cancelAnimationFrame(requestAnimationFrameId.current);
						setCheckStatus(0);
						faceLogin();
					}
					return true;
				})
				.catch((err: any) => {
					messageApi.warning(`${JSON.stringify(err)}`);
					return false;
				});
			return false;
		}
	};

	const drawFaces = (
		result: faceapi.WithFaceExpressions<
			faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>
		>[]
	) => {
		if (canvasRef.current && ctxRef.current && result) {
			// const ctx = canvas.getContext("2d", { willReadFrequently: true });
			// if (!ctx) return;
			ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			// draw title
			// ctx.font = 'small-caps 20px "Segoe UI"';
			// ctx.fillStyle = "white";
			// ctx.fillText(`FPS: ${fps}`, 10, 25);

			hasFace.current = true;
			if (result.length === 0) {
				hasFace.current = false;
				if (new Date().getTime() - showToastTime.current > 2000) {
					showToastTime.current = new Date().getTime();
					if (checkType === 0) {
						messageApi.warning(loginT('no-face-detected'));
					}
				}
				setCanPic(false);
				return;
			}
			setCanPic(true);
			for (const person of result) {
				// draw box around each face

				ctxRef.current.lineWidth = 3;
				ctxRef.current.strokeStyle = 'green';
				ctxRef.current.fillStyle = 'green';
				ctxRef.current.globalAlpha = 0.8;
				ctxRef.current.beginPath();
				ctxRef.current.rect(
					person.detection.box.x,
					person.detection.box.y,
					person.detection.box.width,
					person.detection.box.height
				);
				ctxRef.current.stroke();
				ctxRef.current.globalAlpha = 1;
				// draw text labels
				//   const expression = Object.entries(person.expressions).sort(
				//     (a, b) => b[1] - a[1]
				//   );
				//   ctx.fillStyle = "black";
				//   ctx.fillText(
				//     `gender: ${Math.round(100 * person.genderProbability)}% ${person.gender}`,
				//     person.detection.box.x,
				//     person.detection.box.y - 59
				//   );
				//   ctx.fillText(
				//     `expression: ${Math.round(100 * expression[0][1])}% ${expression[0][0]}`,
				//     person.detection.box.x,
				//     person.detection.box.y - 41
				//   );
				//   ctx.fillText(
				//     `age: ${Math.round(person.age)} years`,
				//     person.detection.box.x,
				//     person.detection.box.y - 23
				//   );
				//   ctx.fillText(
				//     `roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`,
				//     person.detection.box.x,
				//     person.detection.box.y - 5
				//   );
				//   ctx.fillStyle = "lightblue";
				//   ctx.fillText(
				//     `gender: ${Math.round(100 * person.genderProbability)}% ${person.gender}`,
				//     person.detection.box.x,
				//     person.detection.box.y - 60
				//   );
				//   ctx.fillText(
				//     `expression: ${Math.round(100 * expression[0][1])}% ${expression[0][0]}`,
				//     person.detection.box.x,
				//     person.detection.box.y - 42
				//   );
				//   ctx.fillText(
				//     `age: ${Math.round(person.age)} years`,
				//     person.detection.box.x,
				//     person.detection.box.y - 24
				//   );
				//   ctx.fillText(
				//     `roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`,
				//     person.detection.box.x,
				//     person.detection.box.y - 6
				//   );
				//   // draw face points for each face
				ctxRef.current.globalAlpha = 0.8;
				ctxRef.current.fillStyle = 'lightblue';
				const pointSize = 2;
				for (let i = 0; i < person.landmarks.positions.length; i++) {
					ctxRef.current.beginPath();
					ctxRef.current.arc(
						person.landmarks.positions[i].x,
						person.landmarks.positions[i].y,
						pointSize,
						0,
						2 * Math.PI
					);
					ctxRef.current.fill();
				}
			}
		}
	};

	const noti = () => {
		messageApi.warning(loginT('failed to obtain facial photo'));
	};
	// 拍照
	const takePhoto = async () => {
		return new Promise<FormData>((resolve, reject) => {
			if (videoRef.current) {
				const circlewidth = videoRef.current.clientWidth * 2;
				const halfWidth = circlewidth / 2;
				const regionsToExtract = [
					new faceapi.Rect(
						0,
						videoRef.current.clientHeight / 2 - halfWidth,
						circlewidth * window.devicePixelRatio,
						circlewidth * window.devicePixelRatio
					),
				];
				faceapi.extractFaces(videoRef.current, regionsToExtract).then((res: { toBlob: (arg0: (blob: any) => void) => void; }[]) => {
					if (res && res[0]) {
						const formdata = new FormData();
						res[0].toBlob((blob: Blob) => {
							if (blob) {
								formdata.append('file', blob, 'face.png');
								resolve(formdata);
								// onClose()
							} else {
								reject();
								noti();
							}
						});
					} else {
						reject();
						noti();
					}
				});
			} else {
				reject();
				noti();
			}
		});
	};

	//人脸绑定
	const bind = async () => {
		if (hasFace.current) {
			setLoading(true);

			videoRef.current?.pause();

			const url = '/ms-system/user/bindPersonalFace';
			const formData = await takePhoto();

			const { msg, code, data } = await request({
				url,
				options: { method: 'post', body: formData },
			});

			if (code === 200) {
				message.success(baseT('operation-successful'));
				closeModal();
				callBack?.();
			} else {
				messageApi.error(msg);

				videoRef.current?.play();
				setLoading(false);
			}
		} else {
			messageApi.warning(loginT('no-face-detected'));
		}
	};

	//人脸登录
	const faceLogin = useMemoizedFn(async () => {
		const url = '/ms-system/login/faceLogin';
		const blob = await takePhoto();

		const { msg, code, data } = await request<{
			loginUser: IUserRes;
			success: boolean;
			errMsg: string;
			errCode: string;
		}>({
			url,
			options: { method: 'post', body: blob },
		});

		if (code === 200) {
			message.success(baseT('operation-successful'));
			setCheckStatus(1);

			const newInfo = formatUserInfo(data.loginUser);
			setUserInfo(newInfo);
			//设置租户ID
			localStorage.setItem('tenant_id', data.loginUser.tenantId);
			router.push('/homepage');
		} else {
			messageApi.warning(msg);
			detectVideo();
			videoRef.current?.play();
		}
	});

	useUnmount(() => {
		onClose();
	});

	//关闭弹窗
	const onClose = () => {
		videoStream.current?.getTracks().forEach((track) => track.stop());
		closeModal();
	};

	const genCheckStatus = (checkStatus: 0 | 1 | 2) => {
		switch (checkStatus) {
			case 0:
				return loginT('in-facial-recognition');
			case 1:
				return loginT('facial-recognition-successful');
			case 2:
				return loginT('facial-recognition-failed');
			default:
				return '';
		}
	};

	return (
		<>
			{contextHolder}
			<div className=" relative my-4">
				<div className="flex justify-center">
					<div style={{ width: videoW, height: videoH }} className=" relative ">
						<video
							ref={videoRef}
							style={{
								position: 'absolute',
								top: 0,
								left: '50%',
								transform: 'translateX(-50%)',
								zIndex: 1,
								width: videoW + 'px',
								height: videoH + 'px',
							}}
							width={videoW + 'px'}
							height={videoH + 'px'}
						/>

						<canvas
							ref={canvasRef}
							style={{ width: videoW, height: videoH }}
							className=" absolute top-0 left-1/2 -translate-x-[50%] z-[2]"
						/>

						<div
							style={{
								height: videoH + 'px',

								mixBlendMode: isLoaded ? 'screen' : 'unset',
							}}
							className="flex justify-center items-center absolute top-0 left-0 bg-white z-[3]  w-full"
						>
							<div
								className=" rounded-full bg-[#000] border-[#BDBEBF] border-[18px] flex justify-center items-center"
								style={{ width: videoH + 'px', height: videoH + 'px' }}
							/>
						</div>
					</div>
				</div>
			</div>

			{checkStatus !== undefined ? (
				<div className="my-4 text-center">{genCheckStatus(checkStatus)}</div>
			) : null}

			{checkType === 1 ? (
				<div className="flex justify-end gap-2">
					<Button key="back" onClick={onClose} className="h-10">
						{baseT('cancel')}
					</Button>

					<Button
						key="submit"
						type="primary"
						onClick={bind}
						loading={loading}
						className="h-10"
						disabled={!isLoaded}
					>
						{baseT('confirm')}
					</Button>
				</div>
			) : null}
		</>
	);
};

interface Props extends FaceApiProps {
	open: boolean;
	title: string;
}

const FaceModal = (props: Props) => {
	const { open, closeModal, title, ...res } = props;
	return (
		<Modal
			open={open}
			title={title}
			onOk={() => { }}
			onCancel={closeModal}
			width="50%"
			footer={null}
			destroyOnClose
		>
			<FaceApi closeModal={closeModal} {...res} />
		</Modal>
	);
};

export default FaceModal;
