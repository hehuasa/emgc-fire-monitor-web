import React from 'react';
import Image from 'next/image';
import login_bg from '@/assets/login/login_bg.jpg';

import login_item from '@/assets/login/login_item.png';
import login_item_back from '@/assets/login/login_item_back.png';

import './index.css';
import { useTranslations } from 'next-intl';

const LoginTempl = ({ children }: { children: React.ReactNode }) => {
	const t = useTranslations('login');

	return (
		<div className="flex items-center justify-center w-full h-full relative min-h-[750px]">
			<div className="fixed top-0 left-0 z-0 w-full h-full">
				<Image src={login_bg} fill alt="login_bg" quality={100} />
			</div>
			<div className=" absolute flex top-[4%] left-20 z-0 text-[32px] font-bold text-[#3377FF] items-center">
				<div className="ml-2.5">{t('sysName')}</div>
			</div>
			<div className="flex">
				<div className="relative flex-1 h-[602px] w-[600px]">
					<div className="absolute left-0 top-0 w-full h-full">
						<Image src={login_item_back} fill alt="login_item" quality={100} />
					</div>
					<div className="absolute left-1/2 top-1/2 w-[605px] h-[520px] -translate-x-1/2 -translate-y-1/2">
						<Image src={login_item} fill alt="login_item" quality={100} />
					</div>
				</div>
				<div className="bg-white w-[600px] h-full z-10 flex items-center justify-center rounded-r-3xl">
					<div className="w-[486px] h-[602px]  px-14 flex flex-col justify-center">{children}</div>
				</div>
			</div>

			<div className="w-full absolute left-0 bottom-2 text-center">安全管控平台</div>
		</div>
	);
};

export default LoginTempl;
