import exception from './zh-CN/exception';
import globalHeader from './zh-CN/globalHeader';
import login from './zh-CN/login';
import menu from './zh-CN/menu';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import pwa from './zh-CN/pwa';
import component from './zh-CN/component';
import components from './zh-CN/greatechcomponents';
import map from './zh-CN/map';
import base from './zh-CN/base';
import alarm from './zh-CN/alarm';
import resource from './zh-CN/resource';
import major from './zh-CN/major';
import generic from './zh-CN/generic';
import knowledge from './zh-CN/knowledge';
import event from './zh-CN/event';
import user from './zh-CN/user';
import patrol from './zh-CN/patrol';
import consMonitorData from './zh-CN/consMonitorData';
import rawMaterial from './zh-CN/rawMaterial';
import fireControl from './zh-CN/fireControl';
import msg from './zh-CN/msg';
import email from './zh-CN/email';
import trajectory from './zh-CN/trajectory';
import socialRescueForce from './zh-CN/socialRescueForce';
import car from './zh-CN/car';
import lateLinkage from './zh-CN/lateLinkage';
import systemsManage from './zh-CN/systemsManage/index.ts';
import emergency from './zh-CN/emergency.ts';

import fireAlarm from './zh-CN/fireAlarm';
import sms from './zh-CN/sms';

import tools from './zh-CN/tools';

const zh_cn = {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.home.introduce': '介绍',
  'app.forms.basic.title': '基础表单',
  'app.forms.basic.description':
    '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
  ...sms,
  ...fireAlarm,
  ...exception,
  ...globalHeader,
  ...login,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...components,
  ...map,
  ...base,
  ...alarm,
  ...resource,
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
  ...tools,
  ...emergency,
  login: '登录',
  yes: '是',
  no: '否',
  ok: '确定',
  cancel: '取消',
  back: '返回',
  query: '查询',
  add: '新增',
  update: '编辑',
  delete: '删除',
  selectDelete: '批量删除',
  reset: '重置',
  import: '导入',
  export: '导出',
  remark: '备注',
  action: '操作',
  submit: '提交',
  'remark.tips': '请输入备注',
  required: '*',
  index: '序号',
  effective: '有效',
  invalid: '无效',
  historyInfo: '历史修改信息',

  updateTime: '创建/修改时间',
  updatePerson: '创建/修改人',
  updateContent: '创建/修改内容',
  sysName: '安全管控指挥系统',
  sysNameDome: '基于工业互联网平台的安全管控系统',
  sysSubName: '中石化川西天然气勘探开发有限公司',
};

export default zh_cn;
