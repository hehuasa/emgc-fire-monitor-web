import alarm from './en-US/alarm';
import emergency from './en-US/emergency';
import largeScreen from './en-US/largeScreen';
import personnelLocate from './en-US/personnelLocate';
import plotting from './en-US/plotting';
import resource from './en-US/resource';

const enUs = {
  ...resource,
  ...alarm,
  ...largeScreen,
  ...plotting,
  ...personnelLocate,
  ...emergency,
  login: 'Login',
  logout: 'Logout',
  logoutmsg: 'Are you sure you want to log out',

  show: 'Show',
  control: 'Control',

  account: 'Account',
  accountPlaceHoder: 'Account',
  pass: 'Password',
  passPlaceHoder: 'Please input password',
  rememberMe: 'Remember me',
  more: 'More',
  commit: 'Commit',
  ok: 'OK',
  cancel: 'Cancel',
  Yes: 'Yes',
  No: 'No',

  selectAll: 'SelectAll',
  personalInfo: 'Personal Information',
  passModify: 'Password Modification',
  dp: 'Department-Position',

  interlockingEquipment: 'Interlocking Equipment',
  layers: 'Layer',
  toolbox: 'Toolbox',
  searchPlaceHoder: 'Please input',
  searchHistory: 'Search History',
  clearSearch: 'Clear',

  today: 'Today',
  lastThreeDays: 'Last Three Days',
  lastWeek: 'Last Week',

  no: 'No',
  back: 'Back',
  query: 'Query',
  export: 'Export',
  record: '',
  records: 'Records',
  page: 'page',

  broadcasting: 'Broadcasting',
  accessControl: 'Access Control',
  broadcastMode: 'Mode',
  accessConfirm: 'Confirm Operation',
  oneKeyForOpening: 'One Key For Opening Doors',

  toPlayVoiceFiles: 'To Play Voice Files',
  confirmBroadcasting: 'Confirm Broadcasting',

  spacequery: 'Space Query',
  rectangular: 'rectangular',

  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
  alarms: 'records',

  area: 'Area',
  sysName: 'SAFETY EMERGENCY SYSTEM',
  sysNameDome: 'SAFETY EMERGENCY SYSTEM  BASED ON INDUSTRIAL INTERNET PLAFORM',
  // sysSubName: '中石化川西天然气勘探开发有限公司',
};
export default enUs;
