/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @description正则验证
 */

import { FormInstance } from 'antd/es/form';
import { StoreValue } from 'antd/es/form/interface';

//密码规则
const passwordRule = {
  pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/,
  message:
    '密码设定规则：密码的长度不能小于12位，密码要由数字、大小写字母和特殊符号混合组成。(建议使用@$!%*?&#等符合)',
};

//手机正则
export const mobileRule = /^1\d{10}$/;

//身份证正则
export const idCardRule =
  /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9Xx])$/;

//验证密码是否一致
const checkIfPasswordsMatch = (
  value: StoreValue,
  form: FormInstance<any>,
  message: string,
  passwordName: string
) => {
  if (value && value !== form.getFieldValue(passwordName)) {
    return Promise.reject(message);
  }
  return Promise.resolve();
};

export { passwordRule, checkIfPasswordsMatch };
