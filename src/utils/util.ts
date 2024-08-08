import { IOritreeData } from '@/components/Montior/Tree';
import { IexecOperate } from '@/models/emergency';
import { objectType } from '@/models/global';
import { DCItem } from '@/models/system';
import { IMenuItem } from '@/models/user';
import { DepartmentType } from '@/models/userManage';
import { Moment } from 'moment';
import { request } from './request';

export const videoSwitchTime = 1000 * 12;
export const dev = process.env.NODE_ENV !== 'production';

export const getFileNameByUrl = (url: string) => {
  if (!url) {
    return '';
  }
  //获取文件类型
  const index = url.lastIndexOf('/');
  const name = url.substring(index + 1, url.length);

  return name;
};

export const getLayoutMenuItems = (
  menus: IMenuItem[],
  flatMenus: IMenuItem[],
  pathname: string
) => {
  const getIsNotHiddenParentMenu = (menu_: IMenuItem): IMenuItem | undefined => {
    let parent_: IMenuItem | undefined;
    const parent = flatMenus.find((val) => {
      return val.functionCode === menu_.parentId;
    });

    // isHidden 属性。用于区分有独立页面，但是不在菜单里展示的项
    if (parent && !parent.hidden) {
      parent_ = flatMenus.find((val) => val.functionCode === parent.parentId) || parent;
    } else {
      if (parent) {
        parent_ = getIsNotHiddenParentMenu(parent);
      }
    }

    return parent_;
  };
  const getItems = (menus: IMenuItem[], pathname: string) => {
    const obj: {
      breadcrumbNames: {
        name: string;
        url: string;
      }[];
      linkItems: IMenuItem[];
    } = {
      breadcrumbNames: [],
      linkItems: [],
    };

    for (const menu of menus) {
      if (pathname.endsWith(menu.url)) {
        const visibleParent = getIsNotHiddenParentMenu(menu);

        obj.linkItems = visibleParent?.children || [];

        obj.breadcrumbNames = menu.parentNames || [];

        break;
      }
      if (menu.children) {
        const obj1 = getItems(menu.children, pathname);
        if (obj1.breadcrumbNames.length > 0) {
          obj.breadcrumbNames = obj1.breadcrumbNames;
          obj.linkItems = obj1.linkItems;

          break;
        }
      }
    }
    return obj;
  };

  const obj = getItems(menus, pathname);

  return obj;
};

export type FormatTreeDataType = {
  id: string;
  parent: string | number;
  text: string;
  code: string;
  droppable?: boolean;
  checked?: boolean;
  isIndeterminate?: boolean;
};

export const TreeDataParent = (data: DepartmentType[]) => {
  const newData: DepartmentType[] = [];

  data.forEach((v) => {
    if (v.children && v.children.length > 0) {
      v.droppable = true;
      v.children.forEach((c) => {
        c.parentCode = v.id;
        TreeDataParent(v.children as DepartmentType[]);
      });
    } else {
      v.droppable = false;
    }
    newData.push(v);
    // return v;
  });
  return newData;
};

export const FormatTreeData = (treeData: FormatTreeDataType[], data: DepartmentType[]) => {
  data.forEach((v) => {
    if (v.children) {
      v.droppable = true;
      FormatTreeData(treeData, v.children);
    }
    treeData.push({
      id: v.id,
      parent: v.parentCode || '0',
      text: v.orgName,
      code: v.orgCode,
      droppable: v.droppable,
      checked: false,
      isIndeterminate: false,
    });
  });
  return treeData;
};

export const ArrayToTree = (arr: Array<any>, pid: string) => {
  if(!arr) arr=[]
  const map = new Map(); // 生成map存储元素
  for (const item of arr) {
    if (!map.has(item.id)) {
      // 若map中没有当前元素，添加并初始化children
      map.set(item.id, { ...item, children: [] });
    } else {
      map.set(item.id, { ...map.get(item.id), ...item });
    }
    if (map.has(item.parentId)) {
      // 查找父元素，存在则将该元素插入到children
      map.get(item.parentId).children.push(map.get(item.id));
    } else {
      // 否则初始化父元素，并插入children
      map.set(item.parentId, { children: [map.get(item.id)] });
    }
  }
  return map.get(pid);
};

export const levelList = [
  {
    code: '00',
    name: '待研判',
  },
  {
    code: '01',
    name: '一级',
  },
  {
    code: '02',
    name: '二级',
  },
  {
    code: '03',
    name: '三级',
  },
];

//报警列表排序报警数据按照报警级别优先级（一级、二级、三级、四级）+报警时间倒序排列。即报警级别高的，最新发生的报警排在最前面
// export const alarmListResort = (list_: IAlarm[]) => {
//   const list: IAlarm[] = JSON.parse(JSON.stringify(list_));

//   //有些报警没有等级 默认取最高级
//   list.forEach((item) => {
//     if (!item.alarmLevel) {
//       item.alarmLevel = '09';
//     }
//   });

//   const res = list.sort((a, b) => {
//     if (a.alarmLevel !== b.alarmLevel) {
//       const newA = +a.alarmLevel;
//       const newB = +b.alarmLevel;
//       return newA - newB;
//     } else {
//       const newADate = moment(a.alarmLastTime).valueOf();
//       const newBDate = moment(b.alarmLastTime).valueOf();
//       return newBDate - newADate;
//     }
//   });

//   return res;
// };

//拼接url，去掉没有值的项

export const createGetUrl = (param: { [key: string]: any }) => {
  //去掉没有值的项
  const arr = Object.keys(param).filter((item) => !!param[item]);
  //拼接get请求的url
  const urlArr: string[] = [];
  arr.forEach((item) => {
    urlArr.push(`${item}=${param[item]}`);
  });

  const url = urlArr.join('&');

  if (urlArr.length) {
    return '?' + url;
  }

  return '';
};

export type AlarmLevelRefer = 'HHA' | 'HA' | 'FLT' | 'LLA' | 'LA';

//报警类型
export const getAlarmLevelReferTitle = (type: AlarmLevelRefer) => {
  switch (type) {
    case 'HHA':
      return '高高报';
    case 'HA':
      return '高报';
    case 'FLT':
      return '回路报警';
    case 'LLA':
      return '低低报';
    case 'LA':
      return '低报';
    default:
      return type;
  }
};

//报警状态
export const alarmStatusText = (type: string) => {
  switch (type) {
    case '01':
      return '未处理';
    case '02':
      return '处理中';
    case '03':
      return '已处理';
    default:
      return '';
  }
};

//根据地址直接下载文件
export const downFileByUrl = async (url: string, name?: string) => {
  return new Promise<void>((reslove, reject) => {
    fetch(url)
      .then((res) => res.blob())
      .then((bolb) => {
        reslove();
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(bolb);
        downloadElement.href = href;
        downloadElement.download = name ? name : getFileNameByUrl(url);
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
      })
      .catch(reject);
  });
};

// 部门和人员混合成树
type FormatType = {
  id: string;
  parent: string;
  text: string;
  code: string;
  droppable: boolean;
  checked?: boolean;
  isIndeterminate?: boolean;
  userInfoVos?: Array<FormatType>;
  children?: Array<FormatType>;
};
type DataType = {
  id: string;
  orgCode?: string;
  orgName?: string;
  parentId: string;
  url?: string;
  userName?: string;
  userId?: string;
  children?: Array<DataType>;
  userInfoVos: any;
  text?: string;
  code?: string;
};
export const treeDataFormat = (data: DataType[], initData: FormatType[] = [], pid?: string) => {
  const arr: FormatType[] = initData || [];
  data.forEach((item) => {
    if (item.userInfoVos) {
      item.userInfoVos.forEach((user: any) => {
        user.text = user.userName;
        user.code = user.userCode;
        user.droppable = false;
        user.checked = false;
        user.isIndeterminate = false;
        user.parent = user.orgId;
      });
    }
    arr.push({
      id: item.id,
      parent: pid || '0',
      text: item.orgName || item.text || '',
      code: item.orgCode || item.code || '',
      droppable: item.children?.length && item.children?.length > 0 ? true : false,
      checked: false,
      isIndeterminate: false,
      userInfoVos: item.userInfoVos,
      children: item.children?.length && item.children?.length == 0 ? [] : item.userInfoVos,
    });

    if (item.children?.length) {
      treeDataFormat(item.children, arr, item.id);
    }
  });

  arr.forEach((item) => {
    if (item.children?.length && !item.droppable) {
      item.droppable = true;
      arr.push(...item.children);
    }
  });
  return arr;
};

export const selectDict = (allDict: objectType, type: string) => {
  console.log('type', allDict);
  const arr: Pick<DCItem, 'id' | 'cnName' | 'value'>[] = [];

  const data = allDict?.[type];
  if (data) {
    Object.keys(data).forEach((item) => {
      arr.push({
        id: item,
        cnName: data[item],
        value: item,
      });
    });
  }

  return arr;
};
export const formatTime = (time: Moment) => {
  const hourFormatStr = '小时';
  const minuteFormatStr = '分钟';
  if (!time.minutes()) {
    return time.format(`h [${hourFormatStr}]`);
  }
  return time.format(`h [${hourFormatStr}] mm [${minuteFormatStr}]`);
};

//应急指挥操作的向大屏推送
export const execOperate = async (data: IexecOperate) => {
  const res = await request({
    url: '/cx-scws/dp/operation/execOperate',
    options: {
      method: 'post',
      body: JSON.stringify({
        ...data,
      }),
    },
  });
};

//扁平化菜单结构
export const flagMenuFn = (data: IMenuItem[]) => {
  const obj: { [key: string]: IMenuItem } = {};
  const fn = (data_: IMenuItem[]) => {
    for (const item of data_) {
      obj[item.functionCode!] = item;
      if (item.children && item.children.length) {
        fn(item.children);
      }
    }
  };
  fn(data);
  return obj;
};
//获取扁平化数据最外层的父节点functionCode
export const menuGetOutNode = (flagData: { [key: string]: IMenuItem }, currentData: IMenuItem) => {
  let father = currentData;

  while (flagData[father.parentId]) {
    father = flagData[father.parentId];
  }

  return father;
};

//根据部门id获取部门名称
export const getDepName = (data: IOritreeData<any>[], id: string): string | undefined => {
  for (const item of data) {
    if (item.id === id) {
      return item.name;
    }
    if (item.children && item.children.length) {
      return getDepName(item.children, id);
    }
  }
};

/*
 获取川西项目菜单第一个路由,主要用于展示当前有权限的菜单
 川西路由有两种情况
 (1)二级路由在header上，比如检测预警和应急指挥。直接取一级菜单的url展示
 (2)二级路由在整个页面的左边，比如应急准备。需要取子菜单最里面的url展示。不能直接取第一级菜单的url，会出现404
  目前川西这边暂时只有应急准备(functionCode: "2005")和后台管理(functionCode: "2004")会出现左侧子菜单
  
*/
export const getCxFirstRouter = (menu: IMenuItem[]) => {
  const firstMene = menu[0];
  const hasLeftMenuCode = ['2004', '2005'];
  if (hasLeftMenuCode.includes(firstMene?.functionCode)) {
    let list = firstMene.children;
    if (list) {
      while (list[0].children && list[0].children.length) {
        list = list[0].children;
      }
    }
    return list?.[0].url;
  } else {
    return firstMene.url;
  }
};

export const privateKey = `-----BEGIN RSA PRIVATE KEY-----
      MIICWQIBAAKBgQCDbioYTFK221ZOzUnPNOqYe7b5F3BbVn/7io+mGlKJB9mIVbH+
      gsD0oyKVjdzjNo7OnReZzx1ds6jy9b6ka/1bKgqjybmCEWKAq/O+rjqo6aCuJpZV
      P2+PVZFV7YF8n6PomiGSfMfsYPQBMBLAxxyVUcw//ONricuHtPCTIlNlOwIDAQAB
      An8LS2xSqjxxemfwXbP6GpIOiJMw1NLTBpv5Ae9WVuzA2evXy4WAWbw7ScmvEIHr
      BMVA/D8K+MGNS+M4/eVkO+OJ0Qg/5sugYnck6MTQLRxtMdaMdd5lZ/g2xg6XrP/N
      GwMC4YAa73MdppcEFWvPPiwjOreEetDAjwU4OGEl0ABRAkEA+c0uwtcMDbE8V+ZZ
      dw1Fi9lHwu6tTE5KIhhrOAtNhX2Iq/qULW5o75BBq57urL+NRoC+w2tcqJsZJkvV
      2yBZfwJBAIaxDRH/ObzOBcltt09U63H47o1X3u7f33YjM6Lwoj88SegyyrGevHTQ
      Wpajm9TBVNLOc0zeFimnYB7x6ZbrukUCQB65sx+6Dbx9aVuydJylIEHEVwROETjK
      hGnPMRjyovVhbHci2ikAZJ3a04kFgnvzD7B1U4F76ii+8wf32fUa9IcCQCskiws4
      tUXEuBXNDupaSRA4rDCZ9M6O5wTwQZnvegjHRuUZX9OFBNhl5J5byY5cXs8nUcdN
      W8v70M4YrrmoyAECQHRx3u9OLA1sqq3ViAyZZT9IX5SfaOB9DflNz+a2TLto7O7R
      f88QlHpLO+xtB/AceDu8tVfXsxcsSdap9/a8Cyc=
      -----END RSA PRIVATE KEY-----`;

export const publicKey = `-----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDbioYTFK221ZOzUnPNOqYe7b5
        F3BbVn/7io+mGlKJB9mIVbH+gsD0oyKVjdzjNo7OnReZzx1ds6jy9b6ka/1bKgqj
        ybmCEWKAq/O+rjqo6aCuJpZVP2+PVZFV7YF8n6PomiGSfMfsYPQBMBLAxxyVUcw/
        /ONricuHtPCTIlNlOwIDAQAB
        -----END PUBLIC KEY-----`;
