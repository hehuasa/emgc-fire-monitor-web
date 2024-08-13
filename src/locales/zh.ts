//基本的英文
import base from './zh-CN/base';
import alarm from './zh-CN/alarm';
import emergency from './zh-CN/emergency';
import largeScreen from './zh-CN/largeScreen';
import personnelLocate from './zh-CN/personnelLocate';
import plotting from './zh-CN/plotting';
import resource from './zh-CN/resource';
//登录界面英文
import loginZh from './login/zh';
const json = {
  base,
  alarm,
  emergency,
  largeScreen,
  personnelLocate,
  plotting,
  resource,

  ...loginZh,
};

export default json;
