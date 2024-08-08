import { ComponentStyleConfig, type ThemeConfig } from '@chakra-ui/react';

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
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
    6: '1.5rem',
    7: '1.75rem',
    7.5: '1.875rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    15: '3.75rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',

    // 15: "",
    8.5: '2.125rem',
    10.5: '2.625rem',

    11: '2.75rem',
    11.5: '2.875rem',

    13: '3.25rem',
    17: '4.25rem',
    18: '4.5rem',
    22: '5.5rem',
    23: '5.75rem',
    25: '6.25rem',

    26: '6.5rem',
    30: '7.5rem',
    34: '8.5rem',

    35: '8.75rem',

    38: '9.5rem',
    42: '10.5rem',
    45: '11.25rem',

    50: '12.5rem',
    54: '13.5rem',
    58: '14.5rem',
    62.5: '15.625rem',
    65: '16.25rem',
    70: '17.5rem',

    74: '18.5rem',
    75: '18.75rem',

    82: '20.5rem',
    84: '21rem',
    85: '21.25rem',
    86: '21.5rem',
    88: '22rem',
    90: '22.5rem',
    92: '22.5rem',
    92.5: '23.125rem',
    94: '23.5rem',

    100: '25rem',
    110: '27.5rem',
    115: '28.75rem',
    118: '29.5rem',
    120: '30rem',
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
};
const colors = {
  pri: {
    //'blue.100': 'rgba(0, 120, 236, 1)', // 导航栏、侧边栏选中、移入
    'blue.100': 'red',
    // 'blue.200': 'rgba(58, 131, 255, 0.03)',

    'blue.200': 'rgba(53, 181, 255, 1)',
    'blue.300': 'rgba(58, 131, 255, 0.1)',
    'blue.400': 'rgba(228, 240, 255, 1)',
    'blue.500': 'rgba(46, 138, 230, 0.05)',

    'red.100': 'rgba(225, 28, 28, 0.05)',
    'red.200': 'rgba(225, 28, 28, 0.1)',
    'red.300': 'rgba(225, 28, 28, 1)',

    'yellow.100': 'rgba(255, 149, 10, 0.05)',
    'yellow.200': 'rgba(255, 149, 10, 1)',
    // 'yellow.200': 'rgba(255, 149, 10, 1)',

    // 'yellow.300': 'rgba(252, 193, 79, 0.05)',
    // 'yellow.400': 'rgba(252, 193, 79, 1)',

    // 'yellow.500': ' rgba(252, 155, 79, 0.05)',
    // 'yellow.600': ' rgba(252, 155, 79, 1)',

    'green.100': 'rgba(228, 240, 255, 1)', // #E4F0FF
    // 'green.200': 'rgba(1, 176, 154, 1)',

    'gray.100': 'rgba(239, 240, 242, 1)', // #EFF0F2
    'gray.200': 'rgba(228, 228, 228, 1)', //  #E4E4E4
    'gray.300': 'rgba(244, 246, 247, 1)', // #F4F6F7
    'gray.400': 'rgba(238, 243, 248, 1)', // #EEF3F8
    'gray.500': 'rgba(249, 249, 249, 1)', // #F9F9F9
    'gray.600': 'rgba(249, 249, 249, 0.8)', // #F9F9F9

    'gray.700': 'rgba(219, 222, 226, 1)',

    'dark.100': 'rgba(37, 38, 49, 1)', //'#252631'

    'dark.200': '#242528',
    'dark.300': 'rgba(78, 96, 115, 1)', // '#4E6073',
    'dark.400': '#666',
    'dark.500': 'rgba(119, 140, 162, 1)', // #778CA2
    'dark.600': 'rgba(114, 114, 114, 1)', // #778CA2
    'dark.700': 'rgba(0, 0, 0, 0.6)',

    'white.100': 'red',
    'phone.open': '#3fd895',
    'phone.close': '#d34343',
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
    },

    '#__next': {
      height: '100%',
    },
    '.icon': {
      width: '1em',
      height: '1em',
      verticalAlign: '-0.15em',
      fill: 'currentColor',
      overflow: 'hidden',
    },
    ul: {
      listStyleType: 'none',
    },
    'div[data-nextjs-scroll-focus-boundary]': {
      display: 'contents',
      height: '100%',
    },
    'li::marker': {
      display: 'none',
    },
    '.maplibregl-popup-content': {
      padding: '0  !important',
      borderRadius: '10px !important',
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
  },
};
const Button: ComponentStyleConfig = {
  // The styles all button have in common
  baseStyle: {
    borderRadius: 'btn.radius', // <-- border radius is same for all variants and sizes
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
      width: '0',
      height: '10px',

      opacity: 0,
      ' backgroundColor': '#f2f2f2',
    },
    '::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      // boxShadow: 'inset 0 0 6px rgba(36, 36, 36, 0.3)',
      backgroundColor: 'rgba(119, 140, 162, 1)',
      cursor: 'pointer',
    },
    '::-webkit-scrollbar-track': {
      display: 'none',
      // boxShadow: 'inset 0 0 6px rgba(36, 36, 36, 0.3)',
      // borderRadius: '10px',
      backgroundColor: 'rgba(0,0,0,0)',
      opacity: 0,
    },
    _hover: { '::-webkit-scrollbar': { width: '8px' } },
  },
};

// const theme = extendTheme({
//   config,
//   colors,
//   styles,
//   sizes: spacing.space,
//   ...spacing,
//   ...borderRadius,
//   layerStyles,
//   components: {
//     // Button,
//   },
// });

export default {
  config,
  colors,
  styles,
  sizes: spacing.space,
  ...spacing,
  ...borderRadius,
  layerStyles,
  components: {
    // Button,
  },
};
