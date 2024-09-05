import { localesModal } from '@/models/global';
import { Box, IconProps } from '@chakra-ui/react';
import React from 'react';
import { useRecoilState } from 'recoil';
import { Enlocales, Zhlocales } from '../Icons';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const SwitchLanguage = (props: IconProps) => {
  const [locales, setLocales] = useRecoilState(localesModal);
  const currentLocale = useLocale();
  const router = useRouter();
  const path = usePathname();

  return (
    // <Tooltip hasArrow label="中文 / English" fontSize="md">
    <Box
      cursor="pointer"
      onClick={() => {
        setLocales(locales === 'zh' ? 'en' : 'zh');
        router.push(path.replace(currentLocale, currentLocale === 'zh' ? 'en' : 'zh'));
      }}
    >
      {locales === 'zh' ? (
        <Zhlocales w={24} h={24} fill="pri.white.100" {...props} />
      ) : (
        <Enlocales w={24} h={24} fill="pri.white.100" {...props} />
      )}
    </Box>
    // </Tooltip>
  );
};

export default SwitchLanguage;
