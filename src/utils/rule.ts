//手机和座机
export const phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^((\d{3,4}-)|\d{3.4}-)?\d{7,8}$)/;
//手机
export const cellphoneReg = /^1[3|4|5|6|7|8|9]\d{9}$/;
//座机
export const fixedphoneReg = /^((\d{3,4}-)|\d{3.4}-)?\d{7,8}$/;
//邮箱
export const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;

export function teleOrPhone(phone: string, message?: string) {
  if (!phone.trim()) return;
  const str = message ? message : '请输入手机或者座机号码';

  const res = phoneReg.test(phone);
  if (!res) {
    return str;
  }
}

//去掉空格符合
export function blankSpace<T>(content: string, _: T, message: string) {
  const mewContrnt = content.trim();
  if (!mewContrnt) {
    return message;
  }
  return;
}

//邮箱验证
export function emailValidate<T>(content: string, _: T, message: string) {
  if (content === null || content === 'null') {
    return;
  }
  if (!content.trim()) {
    return;
  }
  if (!emailReg.test(content)) {
    return message;
  }
}

//手机验证
export function cellphoneValidate<T>(content: string, _: T, message: string) {
  if (content === null || content === 'null') {
    return;
  }
  if (!content.trim()) {
    return;
  }
  if (!cellphoneReg.test(content)) {
    return message;
  }
}

//座机验证
export function fixedphoneValidate<T>(content: string, _: T, message: string) {
  if (content === null || content === 'null') {
    return;
  }
  if (!content.trim()) {
    return;
  }
  if (!fixedphoneReg.test(content)) {
    return message;
  }
}

//正整数
export function positiveIntegerValidate<T>(content: string | number, _: T, message: string) {
  if (content === null || content === 'null') {
    return;
  }
  const newContent = content + '';
  if (!newContent.trim()) {
    return;
  }
  if (!/^[0-9]*[1-9][0-9]*$/.test(newContent)) {
    return message;
  }
}
//只能输入m~n位的数字：。"^\d{m,n}$"
export function appointNumberValidate<T>(
  content: string | number,
  _: T,
  message: string,
  min: number,
  max: number
) {
  const newContent = content + '';
  if (!newContent.trim()) {
    return;
  }

  if (!(content >= min && content <= max)) {
    return message;
  }
}
