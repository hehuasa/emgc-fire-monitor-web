/**
 * @description正则验证
 */

import { FormInstance as WebFormInstance } from 'antd/es/form';
import { StoreValue } from 'antd/es/form/interface';
import { FormInstance as AppFormInstance } from 'antd-mobile/es/components/form';

//密码规则
const passwordRule = {
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
  message: '密码设定规则：密码的长度不能小于12位，密码要由数字、大小写字母和特殊符号混合组成。',
};

//手机正则
export const mobileRule = /^1\d{10}$/;

//验证密码是否一致
const checkIfPasswordsMatch = (
  value: StoreValue,
  form: AppFormInstance | WebFormInstance<any>,
  message: string,
  passwordName: string
) => {
  if (value && value !== form.getFieldValue(passwordName)) {
    return Promise.reject(message);
  }
  return Promise.resolve();
};

export { passwordRule, checkIfPasswordsMatch };
