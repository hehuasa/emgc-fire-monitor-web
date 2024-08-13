import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { ConfigProvider } from 'antd';

import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';

const RootLayout = async ({ children }: React.PropsWithChildren) => {
	const messages = await getMessages();
	const locale = await getLocale();
	return (
		<NextIntlClientProvider messages={messages}>
			<AntdRegistry>
				<ConfigProvider
					locale={locale === 'en' ? enUS : zhCN}

				>
					{children}
				</ConfigProvider>
			</AntdRegistry>
		</NextIntlClientProvider>
	);
};

export default RootLayout;
