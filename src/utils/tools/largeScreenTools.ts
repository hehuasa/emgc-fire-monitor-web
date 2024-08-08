let staionPageDom: any = null;

export const setStaionPageDomNull = () => {
  staionPageDom = null;
};

export const transformSize = (pixelsize: number) => {
  if (staionPageDom === null) {
    staionPageDom = document.getElementById('StaionPage');
  }
  const height = staionPageDom?.clientWidth;
  // const height = window.screen.height;
  // const ratio = width / 3840;
  let ratio = 0.5;
  if (height && height < 3840) {
    ratio = height / 3840;
  }

  return Math.ceil(pixelsize * ratio);
};

export const transformSizePX = (pixelsize: number) => {
  if (staionPageDom === null) {
    staionPageDom = document.getElementById('StaionPage');
  }
  const height = staionPageDom?.clientWidth;
  // const height = window.screen.height;
  // const ratio = width / 3840;
  let ratio = 0.5;
  if (height && height < 3840) {
    ratio = height / 3840;
  }

  return Math.ceil(pixelsize * ratio) + 'px';
};

/**
 * 判断两个对象是否相等
 */
export function isEqual(obj1: any, obj2: any) {
  // 判断两个变量是否为对象类型
  const isObj =
    toString.call(obj1) === '[object Object]' && toString.call(obj2) === '[object Object]';
  if (!isObj) {
    return false;
  }

  // 判断两个对象的长度是否相等，不相等则直接返回 fase
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  // 判断两个对象的每个属性值是否相等
  for (const key in obj1) {
    // 判断两个对象的键是否相等
    if (obj2.hasOwnProperty.call(obj2, key)) {
      const obj1Type = toString.call(obj1[key]);
      const obj2Type = toString.call(obj2[key]);
      // 如果值是对象，则递归
      if (obj1Type === '[object Object]' || obj2Type === '[object Object]') {
        if (!isEqual(obj1[key], obj2[key])) {
          return false;
        }
      } else if (obj1[key] !== obj2[key]) {
        return false; // 如果不是对象，则判断值是否相等
      }
    } else {
      return false;
    }
  }
  return true; // 上面条件都通过，则返回 true
}

export interface baseProps {
  width?: string;
  height?: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  zIndex?: number;
}

export const getNumToChinese = (numMonth: string | number) => {
  switch (numMonth) {
    case '01' || 1:
      return '一';
    case '02' || 2:
      return '二';
    case '03' || 3:
      return '三';
    case '04' || 4:
      return '四';
    case '05' || 5:
      return '五';
    case '06' || 6:
      return '六';
    case '07' || 7:
      return '七';
    case '08' || 8:
      return '八';
    case '09' || 9:
      return '九';
    case '10' || 10:
      return '十';
    case '11' || 11:
      return '十一';
    case '12' || 12:
      return '十二';
    default:
      return '一';
  }
};

export const getChineseToNum = (chinese: string) => {
  switch (chinese) {
    case '一':
      return 1;
    case '二':
      return 2;
    case '三':
      return 3;
    case '四':
      return 4;
    case '五':
      return 5;
    case '六':
      return 6;
    case '七':
      return 7;
    case '八':
      return 8;
    case '九':
      return 9;
    case '十':
      return 10;
    case '十一':
      return 11;
    case '十二':
      return 12;
    default:
      return 1;
  }
};
