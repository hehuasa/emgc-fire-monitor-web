//基本的英文
import base from './en-US/base';
import alarm from './en-US/alarm';
import map from './en-US/map';

import emergency from './en-US/emergency';
import largeScreen from './en-US/largeScreen';
import personnelLocate from './en-US/personnelLocate';
import plotting from './en-US/plotting';
import resource from './en-US/resource';
//登录界面英文
import loginEn from './login/en';
const json = {
  ...base,
  map,
  alarm,
  emergency,
  largeScreen,
  personnelLocate,
  plotting,
  resource,

  ...loginEn,
};

export default json;
