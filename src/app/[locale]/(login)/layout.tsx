import React from 'react';
import { ConfigProvider } from 'antd';

const RootLayout = async ({ children }: React.PropsWithChildren) => {

	return (

		<ConfigProvider
			theme={{
				token: {
					controlHeight: 48,
					controlInteractiveSize: 16,
				},
				components: {
					Form: {
						itemMarginBottom: 16,
					},
					Input: {
						inputFontSize: 16,
						controlHeight: 48,
						fontSizeIcon: 16,
					},
					Button: {
						contentFontSize: 18,
					},
				},
			}}
		>
			{children}
		</ConfigProvider>

	);
};

export default RootLayout;
