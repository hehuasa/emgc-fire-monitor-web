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

  // sysSubName: '中石化川西天然气勘探开发有限公司',
};
export default enUs;
