import maPindexUrl from '@/assets/map/maPindex.png';
import { ComponentStyleConfig, defineStyleConfig, type ThemeConfig } from '@chakra-ui/react';

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  cssVarPrefix: 'hyper-theme',
};
const spacing = {
  space: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    4.5: '1.125rem',
    5: '1.25rem',
    5.5: '1.375rem',
    6: '1.5rem',
    6.5: '1.625rem',
    7: '1.75rem',
    7.5: '1.875rem',
    8: '2rem',
    9: '2.25rem',
    9.5: '2.375rem',
    10: '2.5rem',
    10.5: '2.625rem',
    12: '3rem',
    12.5: '3.125rem',
    13.5: '3.375rem',
    14: '3.5rem',
    14.75: '3.6875rem',
    15: '3.75rem',
    15.5: '3.875rem',
    16: '4rem',
    16.5: '4.125rem',
    17.5: '4.375rem',
    19.5: '4.875rem',
    20: '5rem',
    23.5: '5.875rem',
    24: '6rem',
    27: '6.75rem',
    27.4: '6.85rem',
    28: '7rem',
    28.5: '7.125rem',
    29.5: '7.375rem',
    31: '7.75rem',
    32: '8rem',
    33: '8.25rem',
    36: '9rem',
    38: '9.5rem',
    40: '10rem',
    41: '10.25rem',
    42.5: '10.625rem',
    43: '10.75rem',
    43.5: '10.875',
    44: '11rem',
    47.5: '11.875rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    59: '14.75rem',
    60: '15rem',
    61: '15.25rem',
    '62.5': '15.625rem',
    64: '16rem',
    71.5: '17.875rem',
    72: '18rem',
    72.5: '18.125rem',
    78: '19.5rem',
    79: '19.75rem',
    80: '20rem',
    81: '20.25rem',
    83: '20.75rem',
    89.5: '22.375rem',
    93.5: '23.375rem',
    96: '24rem',

    // 15: "",
    8.5: '2.125rem',

    11: '2.75rem',
    11.5: '2.875rem',

    13: '3.25rem',
    17: '4.25rem',
    18: '4.5rem',
    21: '5.25rem',
    22: '5.5rem',
    23: '5.75rem',
    25: '6.25rem',
    27.5: '6.875rem',

    26: '6.5rem',
    30: '7.5rem',
    34: '8.5rem',

    35: '8.75rem',
    37: '9.25rem',
    42: '10.5rem',
    45: '11.25rem',
    46: '11.5rem',
    49: '12.25rem',

    50: '12.5rem',
    51: '12.75rem',
    53: '13.25rem',
    54: '13.5rem',
    55: '13.75rem',
    57: '15.24rem',

    62: '15.5rem',
    63: '15.75rem',
    65: '16.25rem',
    66: '16.5rem',
    67: '16.75rem',
    68: '17rem',
    69: '17.25rem',
    70: '17.5rem',

    73: '18.25rem',
    74: '18.5rem',
    75: '18.75rem',
    76: '19rem',

    82: '20.5rem',
    84: '21rem',
    85: '21.25rem',
    86: '21.5rem',
    88: '22rem',
    90: '22.5rem',
    92: '22.5rem',
    92.5: '23.125rem',
    93: '23.25rem',
    94: '23.5rem',

    94.3: '24.375rem',

    100: '25rem',
    105: '26.25rem',
    106: '26.5rem',
    110: '27.5rem',
    113: '28.25rem',
    115: '28.75rem',
    116: '29rem',

    116.5: '29.125rem',
    117: '29.25rem',
    118: '29.5rem',
    119: '29.75rem',
    120: '30rem',
    121: '30.25rem',
    122: '30.5rem',
    122.5: '30.625rem',
    125: '31.25rem',
    131: '32.75rem',
    131.5: '32.875rem',
    138: '34.5rem',
    142: '35.5rem',
    143: '35.75rem',
    145: '36.25rem',
    147.5: '36.875rem',
    149: '37.25rem',
    150: '37.5rem',
    151.5: '37.878rem',
    156: '39rem',
    159: '39.75rem',
    161.5: '40.375rem',
    166: '41.5rem',
    172: '43rem',
    172.5: '43.125rem',
    173: '43.25rem',
    175: '43.75rem',
    180: '45rem',
    186: '46.5rem',
    192: '48rem',
    198: '49.5rem',
    215: '53.75rem',
    232: '58rem',
    234: '58.5rem',
    238: '59.5rem',
    252.5: '63.125rem',
    265: '66.25rem',
    272: '68rem',
    288: '72rem',
    // 300: '75rem',
    320: '80rem',
    374: '93.5rem',
    385: '96.25rem', // 1540
    480: '120rem',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  size: {
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    '8xl': '90rem',
  },
};
const colors = {
  blue: {
    100: 'rgba(0, 120, 236, 1)',
    200: 'rgba(53, 181, 255, 1)',
    300: 'rgba(46, 138, 230, 0.2)',
    400: 'rgba(0, 120, 236, 1)',
    500: 'rgba(0, 120, 236, 1)',
    600: 'rgba(0, 120, 236, 1)',
    700: 'rgba(0, 120, 236, 1)',
    900: 'rgba(0, 120, 236, 1)',
  },
  border: {
    'gray.100': 'rgba(153, 153, 153, 1)',
  },
  pri: {
    '100': 'red',
    'blue.100': 'rgba(0, 120, 236, 1)', // 导航栏、侧边栏选中、移入
    // 'blue.200': 'rgba(58, 131, 255, 0.03)',

    'blue.200': 'rgba(53, 181, 255, 1)',
    'blue.300.5': 'rgba(46, 138, 230, 0.1)',
    'blue.300': 'rgba(46, 138, 230, 0.2)',
    'blue.400': 'rgba(228, 240, 255, 1)',
    'blue.500': 'rgba(46, 138, 230, 0.05)',
    'blue.600': 'rgba(53, 181, 255, 0.95)',
    'blue.700': 'rgb(244,249,254)',
    'blue.800': 'rgba(240, 243, 250, 1)',
    'blue.900': 'rgba(229, 241, 253, 1)',

    'red.100': ' rgba(249, 42, 42, 1)',
    'red.200': ' rgba(253, 37, 37, 0.08)',

    'red.400': '  rgba(236, 55, 81, 0.05)',
    'red.500': 'rgba(255, 0, 0, 1)',
    'red.600': 'rgba(253, 37, 37, 1)', // 必填的提示色

    'yellow.100': 'rgba(255, 149, 10, 0.05)',
    'yellow.200': 'rgba(255, 149, 10, 1)',
    'yellow.300': 'rgba(255, 179, 0, 1)',

    'green.100': 'rgba(228, 240, 255, 1)', // #E4F0FF
    'green.200': '#01b09a',
    // 'green.200': 'rgba(1, 176, 154, 1)',

    'gray.100': 'rgba(239, 240, 242, 1)', // #EFF0F2
    'gray.200': 'rgba(228, 228, 228, 1)', //  #E4E4E4
    'gray.300': 'rgba(244, 246, 247, 1)', // #F4F6F7
    'gray.400': 'rgba(238, 243, 248, 1)', // #EEF3F8
    'gray.500': 'rgba(249, 249, 249, 1)', // #F9F9F9
    'gray.600': 'rgba(249, 249, 249, 0.8)', // #F9F9F9

    'gray.700': 'rgba(219, 222, 226, 1)',
    'gray.800': 'rgba(180, 180, 180, 1)',
    'gray.900': 'rgba(103, 103, 103, 1)',

    'dark.100': 'rgba(37, 38, 49, 1)', //'#252631'

    'dark.200': '#242528',
    'dark.300': 'rgba(78, 96, 115, 1)', // '#4E6073',
    'dark.400': '#666',
    'dark.500': 'rgba(119, 140, 162, 1)', // #778CA2
    'dark.600': 'rgba(114, 114, 114, 1)', // #778CA2
    'dark.700': 'rgba(0, 0, 0, 0.6)',

    'black.100': 'rgba(0,0,0,1)',
    'black.200': 'rgba(0,40,77,1)',
    'white.100': '#fff',
    'white.500': 'rgba(255, 255, 255, 0.5)',
    'white.400': 'rgba(255, 255, 255, 0.4)',
    'white.300': 'rgba(255, 255, 255, 0.3)',
    'white.01': 'rgba(0, 0, 0, 0.1)',
    'phone.open': '#3fd895',
    'phone.close': '#d34343',
    'border.100': 'rgba(226, 232, 240,1)',
    placeholder: '#718096',
  },
  sys: {
    'yellow.100': 'rgba(255, 179, 27, 1)',
    'yellow.200': 'rgba(255, 149, 10, 0.05)',
  },
  font: {
    '100': '#18191B',
    '200': '#666',
    '300': '#A8A8A8',
    '400': '#3A83FF',
    '500': '#707070',
  },
  emgc: {
    blue: {
      '000': 'rgba(16, 128, 255, 1)', //#1080FF
      '100': 'rgba(0, 216, 255, 0.1)',
      '200': 'rgba(51, 178, 240, 1)', //#33B2F0
      '300': 'rgba(28, 109, 160, 1)', //#1C6DA0
      '400': 'rgba(0, 216, 255, 1)', //border颜色 没有透明度 #00D8FF
      '500': 'rgba(0, 216, 255, 0.2)', //一般border的颜色
      '600': 'rgba(15,38,74,1)', //#0F264A 背景颜色
      '700': 'rgba(9, 94, 229, 1)', //#095EE5 事件左侧信息和地图工具的border颜色
      '800': 'rgba(19, 62, 120, 1)', //#081334
      '900': 'rgba(50, 173, 234, 1)', //#32ADEA
      '1000': 'rgba(66, 225, 255, 1)', //#42E1FF
      '1100': 'rgba(19, 62, 120, 1)',
    },
    dark: {
      '100': 'rgba(7, 112, 255, 1)', //#0770FF 边框颜色
      '200': 'rgba(51, 178, 240, 0.1)', //#33B2F0 span颜色，带透明度
      '300': 'rgba(51, 178, 240, 0.3)', //#33B2F0 span颜色，带透明度
      '400': 'rgba(17, 53, 93, 1)', //#11355D 搜索栏颜色
      '500': 'rgba(7, 32, 65, 0.95)', //#072041 背景颜色
      '600': 'rgba(9, 68, 99, 1)', //#094463 边框颜色2
      '700': 'rgba(25, 50, 135, 0.5)', //#193287 标题栏颜色
      '800': 'rgba(5, 47, 80, 0.95)', //弹窗背景颜色
      '900': 'rgba(0, 228, 255, 1)', //#00E4FF 弹窗边框颜色
      '1000': 'rgba(0, 227, 255, 0.15)', //弹窗标题颜色
      '1100': 'rgba(0, 30, 68, 1)',
      '1200': 'rgba(4, 77, 146, 1)',
      '1300': 'rgba(7, 112, 255, 0.7)', //#0770FF 选中图形的背景颜色
      yellow: 'rgba(243, 233, 41, 1)', //#F3E929 数字/提醒颜色
      teal: 'rgba(0, 179, 177, 0.2)',
      green: 'rgba(0, 255, 126, 1)',
      gray: 'rgba(205, 219, 229, 1)',
      danger: 'rgba(255, 203, 0, 1)', //#FFCB00
      target: 'rgba(0, 95, 235, 1)',
      resource: 'rgba(0, 199, 43, 1)',
      shader: 'rgba(1, 51, 99, 1)',
      dangerbg: 'rgba(105, 103, 69, 1)',
      targetbg: 'rgba(5, 70, 116, 1)',
      resourcebg: 'rgba(13, 95, 81, 1)',
    },
    black: {
      '100': 'rgba(8, 19, 52, 1)',
      '200': 'rgba(14, 60, 118, 1)', //一般checkBox背景颜色
      '300': 'rgba(26, 19, 17, 1)',
    },
    red: {
      100: 'rgba(227, 16, 20, 1)', //#E31014
    },
    white: {
      100: '#fff',
    },
    level: {
      4: 'rgba(0, 156, 255, 1)', //#009CFF
      3: 'rgba(240, 213, 28, 1)', //#F0D51C
      2: 'rgba(255, 171, 9, 1)', //#FFAB09
      1: 'rgba(227, 16, 20, 1)', //#E31014
    },
    left1: {
      'white.100': '#ffffff',
      'blue.100': '#13385C',
      'yellow.100': '#FFAE38',
      'yellow.200': '#9C7235 ',
    },
  },
  sms: {
    gray: {
      bg: 'rgba(240, 243, 250, 1)', //背景色
      reset: 'rgba(237, 242, 247, 1)', // 重置按钮
    },
    table: {
      header: 'rgba(236, 244, 251, 1)', // 表头
      headerColor: 'rgba(22, 32, 77, 1)', //表头字体
      col: 'rgba(228, 231, 233, 1)', // 偶数行背景颜色
      border: 'rgba(228, 231, 233, 1)', // 分割线颜色
      fontCcolor: 'rgba(119, 140, 162, 1)', // 字体颜色
    },
    button: {
      common: 'rgba(0, 120, 236, 1)', // 通用按钮颜色
      edit: 'rgba(255, 153, 0, 1)', // 编辑色
      success: 'rgba(0, 176, 156, 1)',
      delete: 'rgba(254, 84, 84, 1)',
    },
  },
};

const borderRadius = {
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
    // ========================== 自定义尺寸 ===================
    'btn.md': '2.5rem',
    'btn.radius': '1.25rem',
    'card.md': '1rem',
  },
};

const styles = {
  global: {
    // styles for the `body`
    'html, body': {
      height: '100%',
      color: 'font.200',
      background: 'transparent',
    },

    '#__next': {
      height: '100%',
      background: 'transparent',
    },
    '*:disabled': {
      opacity: 0.9,
    },
    '.icon': {
      width: '1em',
      height: '1em',
      verticalAlign: '-0.15em',
      fill: 'currentColor',
      overflow: 'hidden',
    },
    '.cxd-Modal-close .Dialog-close .icon': {
      width: 'inherit',
      height: 'inherit',
      'vertical-align': 'middle',
    },

    // '@media (min-width: 768px)': {
    //   '.cxd-Page-aside': {
    //     width: '200px !important',
    //   },
    // },
    ul: {
      listStyleType: 'none',
    },
    '.dateActive': {
      background: '#1080FF',
      color: 'white',
    },
    'div[data-nextjs-scroll-focus-boundary]': {
      display: 'contents',
      height: '100%',
    },

    'li::marker': {
      display: 'none',
    },
    '.scrollbar-thumb': {
      width: '0px',
    },
    '.maplibregl-popup-content': {
      padding: '0  !important',
      borderRadius: '10px !important',
    },
    '.map-pick-img': {
      backgroundImage: maPindexUrl.src,
      width: '30px',
      height: '36px',
      backgroundSize: '100%',
    },
    '.cxd-Page-asideInner': {
      top: '10px !important',
    },
    '.cxd-Select-value': {
      display: 'inline-flex !important',
    },
    '.cxd-Pagination > li > a, .cxd-Pagination > li > span': {
      display: 'inline-flex !important',
      alignItems: 'center',
      position: 'unset',
      float: 'unset',
    },
    '.cxd-Pagination > li > span>svg.icon': {
      position: 'unset',
    },
    '.cxd-Page-body': {
      padding: 0,
    },
    '.cxd-Nav-Menu-inline .cxd-Nav-Menu-submenu-arrow': {
      width: 'unset !important',
      top: '16px !important',
    },
    '*-Tree-itemText': {
      maxWidth: '67% !important',
    },
    '.antd-Pagination > li > span': {
      display: 'inline-grid',
      alignItems: 'center',
    },
    '.antd-Page-body': {
      padding: '4px 15px !important',
    },
    '.selectSort': {
      width: '200px',
      marginBottom: '4px',
    },
    //react-moveable 中点点隐藏
    '.moveable-line': {
      height: '0px !important',
    },
    '.moveable-control': {
      background: '#fff !important',
      borderColor: '#fff !important',
      opacity: '0 !important',
    },
    '.moveable-control-box:hover  .moveable-control': {
      opacity: '0.4 !important',
    },
    '.tableTreeNode>.cxd-PlainField': {
      marginLeft: '40px',
    },
    '.customDateTime': {
      width: 'calc(100% - 10px)',
      height: '100%',
      paddingTop: '2px',
      textIndent: '10px',
      paddingBottom: '2px',
    },
    '.customDateTime>input': {
      margin: '0',
      width: 'inherit',
      height: '100%',
      outline: 'none',
      border: 'none',
    },
    '.rdtPicker': {
      marginTop: '5px',
      background: '#FFF !important',
    },
    '.rdtPicker td.rdtActive': {
      backgroundColor: '#428bca !important',
      color: '#FFF !important',
    },
    '.rdt .rdtPicker .rdtActive.rdtToday': {
      backgroundColor: '#428bca',
    },
    '.cxd-Transfer-select, .cxd-Transfer-result': {
      maxHeight: '35rem !important',
    },
    '.cxd-ResultTableList': {
      height: 'calc(100% - 94px) !important',
      overflow: 'auto',
    },
    '.cxd-Transfer .cxd-Table-content .cxd-Table-table > tbody > tr > td:last-child': {
      whiteSpace: 'nowrap',
    },
    '.cxd-Transfer-result .cxd-Table-content .cxd-OperationField': {
      display: 'inline',
    },
    '.cxd-ResultTableList-close-btn': {
      float: 'none !important',
      display: 'inline-block',
      marginLeft: '1rem',
    },
    '.text-danger': {
      color: '#dc3545 !important',
    },
  },
};
const CheckBox: ComponentStyleConfig = {
  // The styles all button have in common
  baseStyle: {
    bg: 'pri.blue.100', // <-- border radius is same for all variants and sizes
  },
};

// const Table: ComponentStyleConfig = {
//   // The styles all button have in common
//   baseStyle: {
//     borderRadius: 'btn.radius', // <-- border radius is same for all variants and sizes
//   },
// };
// 3. extend the theme

const layerStyles = {
  //滚动条样式
  scrollbarStyle: {
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
      opacity: 0,
      backgroundColor: '#fff',
    },
    '::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    '::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
      //bg: 'rgba(119, 140, 162, 1)',
      opacity: 0,
    },
    _hover: {
      '::-webkit-scrollbar-thumb': { bg: 'rgba(119, 140, 162, 1)' },
      '::-webkit-scrollbar': {
        width: '8px',
      },
    },

    'overflow-y': 'auto',
  },
};

//公共按钮样式
const Button = defineStyleConfig({
  variants: {
    //取消按钮
    default: {
      borderRadius: '6px',
      color: '#fff',
      bg: 'pri.blue.100',
      fontWeight: 0,
      _hover: {
        color: '#FFF',
        bg: 'pri.blue.600',
      },
    },
    //确定按钮
  },
});

// const theme = extendTheme(
//   {
//     config,
//     colors,
//     styles,
//     sizes: spacing.space,
//     ...spacing,
//     ...borderRadius,
//     layerStyles,
//     components: {
//       // Button,
//     },
//   },
//   {
//     config,
//     colors,
//     styles,
//     sizes: spacing.space,
//     ...spacing,
//     ...borderRadius,
//     layerStyles,
//     components: {
//       // Button,
//     },
//   }
// );

export default {
  config,
  colors,
  styles,
  sizes: spacing.space,
  ...spacing,
  ...borderRadius,
  layerStyles,
  components: {
    CheckBox,
    Button,
  },
};
