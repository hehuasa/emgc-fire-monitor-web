'use client';
import { localesModal } from '@/models/global';
import { request } from '@/utils/request';
import { Box } from '@chakra-ui/react';
import { useUnmount } from 'ahooks';
import moment from 'moment';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';

const RealTime = () => {

	const formatMessage = useTranslations("base");
	const locale = useLocale();

	const locales = useRecoilValue(localesModal);

	const [time, setTime] = useState(0);
	const timer = useRef<NodeJS.Timer | null>(null);
	const [weekday, setWeekday] = useState('');

	const { data } = useSWR({ url: '/ms-gateway/ms-system/config/system_date' }, request<string>, {
		refreshInterval: 3 * 1000 * 60,
	});

	const getWeek = (day: number) => {
		switch (day) {
			case 1:
				setWeekday(formatMessage({ id: 'monday' }));
				break;
			case 2:
				setWeekday(formatMessage({ id: 'tuesday' }));
				break;
			case 3:
				setWeekday(formatMessage({ id: 'wednesday' }));
				break;
			case 4:
				setWeekday(formatMessage({ id: 'thursday' }));
				break;
			case 5:
				setWeekday(formatMessage({ id: 'friday' }));
				break;
			case 6:
				setWeekday(formatMessage({ id: 'saturday' }));
				break;
			case 0:
				setWeekday(formatMessage({ id: 'sunday' }));
				break;
		}
	};

	useEffect(() => {
		if (data?.code === 200) {
			if (timer.current) {
				clearInterval(timer.current);
				timer.current = null;
			}
			let currentTime = new Date(data.data).getTime();
			setTime(currentTime);

			timer.current = setInterval(() => {
				currentTime += 1000;
				setTime(currentTime);
			}, 1000);
		}
	}, [data]);

	useEffect(() => {
		const day = new Date().getDay();
		getWeek(day);
	}, [locales]);

	useUnmount(() => {
		if (timer.current) {
			clearInterval(timer.current);
			timer.current = null;
		}
	});

	return (
		<Box>
			{time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''} {weekday}
		</Box>
	);
};

export default RealTime;
