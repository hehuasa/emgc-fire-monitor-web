'use client';

import { useMount, useUnmount } from 'ahooks';
import { useRef, useState } from 'react';
import 'dayjs/locale/zh';
import 'dayjs/locale/en';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useLocale } from 'next-intl';
import dayjs from 'dayjs';
import { Spinner } from '@chakra-ui/react';

dayjs.extend(localizedFormat);

const RealTime = () => {
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const locale = useLocale();
  dayjs.locale(locale);

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
    <>
      {time ? (
        <>{dayjs(time).format('L HH:mm:ss dddd')}</>
      ) : (
        <div className="w-[24px] h-[24px]">
          <Spinner size="md" w={24} h={24} />
        </div>
      )}
    </>
  );
};

export default RealTime;
