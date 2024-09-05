//基本的英文
import base from './zh-CN/base';
import panel from './zh-CN/panel';

//登录界面英文
import loginZh from './login/zh';

const json = {
  // alarm,
  // map,
  // emergency,
  // largeScreen,
  // personnelLocate,
  // plotting,
  // resource,
  ...panel,
  ...loginZh,
  ...base,
};

export default json;
