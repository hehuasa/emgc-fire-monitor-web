import alarm from './zh-CN/alarm';
import largeScreen from './zh-CN/largeScreen';
import resource from './zh-CN/resource';

import consMonitorData from './zh-CN/consMonitorData';
import email from './zh-CN/email';
import emergency from './zh-CN/emergency';
import event from './zh-CN/event';
import fireControl from './zh-CN/fireControl';
import generic from './zh-CN/generic';
import knowledge from './zh-CN/knowledge';
import major from './zh-CN/major';
import msg from './zh-CN/msg';
import patrol from './zh-CN/patrol';
import rawMaterial from './zh-CN/rawMaterial';
import socialRescueForce from './zh-CN/socialRescueForce';
import trajectory from './zh-CN/trajectory';
import user from './zh-CN/user';

import car from './zh-CN/car';
import fireAlarm from './zh-CN/fireAlarm';
import lateLinkage from './zh-CN/lateLinkage';
import personnelLocate from './zh-CN/personnelLocate';
import plotting from './zh-CN/plotting';
import sms from './zh-CN/sms';
import systemsManage from './zh-CN/systemsManage';
import tools from './zh-CN/tools';

const zh_cn = {
  ...alarm,
  ...resource,
  ...largeScreen,
  ...fireAlarm,
  ...emergency,
  ...sms,
  ...tools,

  ...major,
  ...generic,
  ...knowledge,
  ...event,
  ...user,
  ...patrol,
  ...consMonitorData,
  ...rawMaterial,
  ...fireControl,
  ...msg,
  ...email,
  ...trajectory,
  ...socialRescueForce,
  ...car,
  ...systemsManage,
  ...lateLinkage,
  ...plotting,
  ...personnelLocate,
  // ==========================

  // sysSubName: '中石化川西天然气勘探开发有限公司',
};

export default zh_cn;
