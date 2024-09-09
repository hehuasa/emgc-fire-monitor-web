/* eslint-disable @typescript-eslint/no-explicit-any */
export const transformSize = (pixelsize: number) => {
  // 获取屏幕宽度
  // const width = window.screen.width;
  const width = window.innerWidth;
  const ratio = width / 1920;
  return Math.ceil(pixelsize * ratio);
};

export const transformSizePX = (pixelsize: number) => {
  // 获取屏幕宽度
  const width = window.innerWidth;
  const ratio = width / 1920;
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

// 对象数组内容深度对比
export function arraysEqual(
  arr1: { [key: string]: any }[],
  arr2: { [key: string]: any }[]
): boolean {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    const item1 = arr1[i];
    const item2 = arr2[i];
    if (item1 === item2) continue; // 如果引用相同，则继续下一个循环
    // 使用深度比较函数来比较对象的内容
    if (!deepEqual(item1, item2)) return false;
  }

  return true;
}

function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true; // 如果引用相同，则它们相等
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return obj1 === obj2; // 不是对象则按普通方式比较
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false; // 键的数量不同则它们不相等
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false; // 键或值不相等则它们不相等
  }
  return true; // 所有键和值都相等，则它们相等
}
