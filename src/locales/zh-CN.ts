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
  login: '登录',
  logout: '退出登录',

  show: '展示端',
  control: '控制端',

  logoutmsg: '是否确认退出登录',
  account: '账号',
  accountPlaceHoder: '请输入用户名',
  pass: '密码',
  passPlaceHoder: '请输入密码',
  rememberMe: '记住我',
  more: '更多',
  commit: '提交',
  ok: '确定',
  cancel: '取消',
  Yes: '是',
  No: '否',

  selectAll: '全选',
  personalInfo: '个人信息',
  passModify: '修改密码',
  dp: '部门/区域',

  interlockingEquipment: '联动设备',
  layers: '图层',
  toolbox: '工具箱',
  searchPlaceHoder: '请输入关键词搜索',
  searchHistory: '历史搜索记录',
  clearSearch: '清空历史',

  today: '今日',
  lastThreeDays: '近三天',
  lastWeek: '近一周',

  no: '序号',
  back: '返回',
  query: '查询',
  export: '导出',
  import: '导入',
  record: '条',
  records: '条数据',
  jumpTo: '跳至',
  page: '页',

  broadcasting: '扩音广播',
  accessControl: '门禁控制',
  accessConfirm: '是否打开',
  oneKeyForOpening: '一键开门',

  toPlayVoiceFiles: '待播放语音文件',
  confirmBroadcasting: '确定广播',

  broadcastMode: '广播方式',

  spacequery: '查周边',
  rectangular: '矩形',

  monday: '周一',
  tuesday: '周二',
  wednesday: '周三',
  thursday: '周四',
  friday: '周五',
  saturday: '周六',
  sunday: '周日',

  alarms: '条报警',

  area: '区域',

  sysName: process.env.NEXT_PUBLIC_ANALYTICS_SYSTEM_NAME,
  sysNameDome: '基于工业互联网平台的安全管控系统',
  // sysSubName: '中石化川西天然气勘探开发有限公司',
};

export default zh_cn;
