export interface ILoginCodeImg {
	captchaImg: string;
	captchaKey: string;
}

//登录方式
export type IogingType = 'normal' | 'platformSacn';
