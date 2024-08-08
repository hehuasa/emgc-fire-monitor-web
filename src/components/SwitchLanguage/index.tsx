import { localesModal } from '@/models/global';
import { Box, IconProps, Tooltip } from '@chakra-ui/react';
import React from 'react'
import { useRecoilState } from 'recoil';
import { Enlocales, Zhlocales } from '../Icons';

const SwitchLanguage = (props: IconProps) => {
    const [locales, setLocales] = useRecoilState(localesModal);

    return (
        <Tooltip hasArrow label="中文 / English" fontSize="md">
            <Box
                cursor="pointer"
                onClick={() => {
                    setLocales(locales === 'zh' ? 'en' : 'zh');
                }}
            >
                {locales === 'zh' ? (
                    <Zhlocales w="6" h="6" fill="pri.white.100" {...props} />
                ) : (
                    <Enlocales w="6" h="6" fill="pri.white.100" {...props} />
                )}
            </Box>
        </Tooltip>
    )
}

export default SwitchLanguage