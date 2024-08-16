//基本的英文
import base from './zh-CN/base';
import alarm from './zh-CN/alarm';

//登录界面英文
import loginZh from './login/zh';

const json = {
  alarm,
  // alarm,
  // map,
  // emergency,
  // largeScreen,
  // personnelLocate,
  // plotting,
  // resource,

  ...loginZh,
  ...base,
};

export default json;
