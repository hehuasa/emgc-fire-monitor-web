'use client';

import { useMount, useUnmount } from 'ahooks';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import 'dayjs/locale/zh'
dayjs.locale('zh')

const RealTime = () => {

	const [time, setTime] = useState(0);
	const timer = useRef<NodeJS.Timeout | null>(null);




	useMount(() => {
		if (timer.current) {
			clearInterval(timer.current);
			timer.current = null;
		}


		timer.current = setInterval(() => {
			const currentTime = new Date().getTime();
			setTime(currentTime);
		}, 1000);
	});
	useUnmount(() => {
		if (timer.current) {
			clearInterval(timer.current);
			timer.current = null;
		}
	});

	return (
		<div>
			{time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss dddd') : ''}
		</div>
	);
};

export default RealTime;
