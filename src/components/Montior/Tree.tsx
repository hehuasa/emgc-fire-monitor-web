import { PaperIcon, TriangleIcon } from '@/components/Icons';
import { Box, Checkbox, Flex, HStack } from '@chakra-ui/react';
import { useDebounceFn, useMemoizedFn, useSafeState } from 'ahooks';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Collapse from './Collapse';

declare module 'react' {
  function forwardRef<T, P>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

// export interface IOritreeData<T = any> {
//   name: string;
//   id: string;
//   children?: IOritreeData<T>[];
//   //可能需要部分额外参数
//   param?: T;
//   sortIndex?: number;
// }

export interface IOritreeData<T = any> {
  name: string;
  id: string;
  children?: IOritreeData<T>[];
  //可能需要部分额外参数
  param?: T;
  sortIndex?: number;
}

export interface T1<T = any> {
  name: string;
  id: string;
  param?: T;
}

export interface ITreeData<T = any> extends IOritreeData<T> {
  //用于多选
  checkBoxStatus?: '0' | '1' | '2';
  pid?: string;
  open?: boolean;
  children?: ITreeData<T>[];
  //用于单选
  isCheck?: boolean;
}

export interface Props {
  //原数据
  data: IOritreeData<any>[];
  //选择事件
  onSelect?: (arr: string[], param: any[]) => void;
  //是否默认展开
  defaultExpandAll?: boolean;
  //默认选中项
  checkValue?: string[];
  //是否开启多选模式
  multiple?: boolean;
  //是否可以取消选中 只能用于单选
  isCancel?: boolean;

  //是否所有节点都可以选择
  allNodeCanSelect?: boolean;

  //是否可以选择
  isSelected?: boolean;

  renderOperator?: (data: ITreeData) => React.ReactNode;

  iconPotiosn?: 'left' | 'right';

  //是否回填上次选中的项，通常用于删除tree节点，暂时只支持单选
  remeberLastNode?: boolean;

  theme?: 'shallow' | 'deep';

  renderNodeItem?: (data: ITreeData) => JSX.Element;

  itemOnContextMenu?: (
    data: ITreeData,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    flatObj: { [key: string]: ITreeData }
  ) => void;
}

interface TreeItemTitle {
  currentItemObj: ITreeData;
  item: ITreeData;
  open: boolean;
  level: number;
}

export interface Refs {
  multipleItemChange: (id: string, check: boolean) => void;
}

function Tree(
  {
    data,
    onSelect,
    defaultExpandAll = false,
    checkValue,
    multiple = false,
    isCancel = false,
    allNodeCanSelect = true,
    isSelected = true,
    renderOperator,
    itemOnContextMenu,
    remeberLastNode,
    theme = 'shallow',
    renderNodeItem,
    iconPotiosn = 'right',
  }: Props,
  refs: React.Ref<Refs>
) {
  //check  0没有选中 1子元素有选中 3子元素全部选中
  const checkBoxStatus = useRef({
    '0': { isChecked: false },
    '1': { isIndeterminate: true },
    '2': { isChecked: true },
  }).current;

  //模拟强制更新
  const [_, setSimulate] = useSafeState({});
  //扁平之后的数据,方便直接取到父级
  const flatObj = useRef<{ [key: string]: ITreeData }>({});

  useImperativeHandle(refs, () => ({
    multipleItemChange,
  }));

  //保存上次展开的节点
  const remeberExpandNode = useRef<string[]>([]);

  //保存上次选中的项
  const remberSelected = useRef<string[]>([]);

  const setCheckdebounceFn = useDebounceFn(
    (checkValue: string[]) => {
      if (checkValue?.length && Object.keys(flatObj.current).length) {
        const newData = JSON.parse(JSON.stringify(data)) as IOritreeData[];
        flatData(newData);
        if (multiple) {
          for (const _key of checkValue) {
            const obj = flatObj.current?.[_key];
            //每个多选的id调用选中方法
            onSelectCheckBox({
              isChecked: true,
              data: obj,
              isUpdate: false,
              expandFatherNode: true,
              carryOutOnSelect: false,
            });
          }
        } else {
          const obj = flatObj.current?.[checkValue[0]];
          //每个单选的id调用选中方法
          onSelectSinger({
            data: obj,
            isCheck: true,
            expandFatherNode: true,
            carryOutOnSelect: false,
          });
        }
        forceUpdate();
      } else {
        const newData = JSON.parse(JSON.stringify(data)) as IOritreeData[];
        flatData(newData);
      }
    },
    { wait: 50 }
  );

  const multipleItemChange = useMemoizedFn((id, check: boolean) => {
    const obj = flatObj.current[id];
    onSelectCheckBox({
      isChecked: check,
      data: obj,
      isUpdate: true,
      expandFatherNode: false,
      carryOutOnSelect: false,
    });
  });

  useEffect(() => {
    const newData = JSON.parse(JSON.stringify(data)) as IOritreeData[];
    flatData(newData);
  }, [data]);

  //回填check ids
  useEffect(() => {
    if (checkValue) {
      setCheckdebounceFn.run(checkValue);
    }
  }, [checkValue]);

  //扁平tree数据
  const flatData = useMemoizedFn((data: ITreeData[]) => {
    const initData: { [key: string]: ITreeData } = {};
    const formatFlag = (data: ITreeData[], pid?: string) => {
      for (const item of data) {
        item.checkBoxStatus = '0';
        item.open = false;
        if (pid !== null) {
          item.pid = pid;
        }
        if (remeberLastNode && remberSelected.current.length) {
          if (remberSelected.current[0] === item.id) {
            item.isCheck = true;
          }
        }
        //展开的项保存他的id
        if (defaultExpandAll && !remeberExpandNode.current.length) {
          item.children && item.children.length && remeberExpandNode.current.push(item.id);
          item.open = true;
        } else if (remeberExpandNode.current.length) {
          item.open = remeberExpandNode.current.includes(item.id);
        }

        if (!initData[item.id]) {
          initData[item.id] = item;
        }
        if (item.children && item.children.length) {
          formatFlag(item.children, item.id);
        }
      }
    };

    formatFlag(data);
    flatObj.current = initData;
    forceUpdate();
  });

  //更新全部组件
  const forceUpdate = useMemoizedFn(() => {
    setSimulate({});
  });

  //tree多选事件
  const onSelectCheckBox = useMemoizedFn(
    ({
      isChecked,
      data,
      isUpdate,
      expandFatherNode,
      carryOutOnSelect,
    }: {
      isChecked: boolean;
      data: ITreeData;
      isUpdate: boolean;
      expandFatherNode?: boolean;
      carryOutOnSelect?: boolean;
    }) => {
      if (!data) {
        return;
      }

      //更新自身属性
      if (isChecked) {
        data.checkBoxStatus = '2';
      } else {
        data.checkBoxStatus = '0';
      }

      //更新子元素属性
      updateChildrenNode(data, isChecked);
      //更新父元素属性
      updateFatherNode(data, isChecked, expandFatherNode);
      if (onSelect && isUpdate && carryOutOnSelect) {
        const ids = findChecboxkIds().map((item) => item.id);
        const param = findChecboxkIds().map((item) => item.param);
        onSelect(ids, param);
      }
      //更新整个tree
      isUpdate && forceUpdate();
    }
  );

  //tree单选事件
  const onSelectSinger = useMemoizedFn(
    ({
      data,
      isCheck,
      expandFatherNode,
      carryOutOnSelect,
    }: {
      data: ITreeData;
      isCheck: boolean;
      expandFatherNode?: boolean;
      carryOutOnSelect?: boolean;
    }) => {
      if (!data) {
        return;
      }
      //重新所有为isCheck=false
      Object.values(flatObj.current).forEach((item) => (item.isCheck = false));

      data.isCheck = isCheck;

      if (remeberLastNode) {
        remberSelected.current = data.isCheck ? [data.id] : [];
      }

      if (onSelect && carryOutOnSelect) {
        const ids = findIsCheck().map((item) => item.id);
        const param = findIsCheck().map((item) => item.param);

        onSelect(ids, param);
      }

      //是否展开父节点
      if (expandFatherNode) {
        let pid = data.pid;
        while (pid) {
          const fatherObj = flatObj.current[pid];
          fatherObj.open = true;
          pid = fatherObj.pid;
        }
      }

      forceUpdate();
    }
  );

  //查找多选选中的项
  const findChecboxkIds = useMemoizedFn(() => {
    const checkIs = Object.values(flatObj.current)
      //过滤掉有子元素的项 只包含没有子元素的项
      .filter((item) => item.checkBoxStatus === '2' && !(item.children && item.children.length))
      .map((item) => ({ id: item.id, param: item.param }));
    return checkIs;
  });

  //查找单选选中的项
  const findIsCheck = useMemoizedFn(() => {
    const checkIs = Object.values(flatObj.current)
      .filter((item) => item.isCheck)
      .map((item) => ({ id: item.id, param: item.param }));
    return checkIs;
  });

  const updateChildrenNode = useMemoizedFn((data, isChecked: boolean) => {
    const update = (data: ITreeData) => {
      if (data.children) {
        for (const item of data.children) {
          if (isChecked) {
            item.checkBoxStatus = '2';
          } else {
            item.checkBoxStatus = '0';
          }

          if (item.children) {
            update(item);
          }
        }
      }
    };
    update(data);
  });

  const updateFatherNode = useMemoizedFn((data: ITreeData, isChecked: boolean, expand = false) => {
    if (data.pid) {
      const fatherObj = flatObj.current?.[data.pid];
      if (fatherObj?.children) {
        //是否展开当前父元素
        if (expand) {
          fatherObj.open = true;
        }

        //是否子元素全部选中
        const status2 = fatherObj.children.every((item) => item.checkBoxStatus === '2');
        //是否有个子元素全部全中
        const status2Some = fatherObj.children.some(
          (item) => item.checkBoxStatus === '2' || item.checkBoxStatus === '1'
        );

        if (status2) {
          fatherObj.checkBoxStatus = '2';
        } else {
          if (status2Some) {
            fatherObj.checkBoxStatus = '1';
          } else {
            fatherObj.checkBoxStatus = '0';
          }
        }
      }

      //如果有父级的父级 继续更新父级
      if (fatherObj?.pid) {
        updateFatherNode(fatherObj, isChecked, expand);
      }
    }
  });

  const showToggle = useMemoizedFn((data: ITreeData) => {
    if (data.open) {
      data.open = false;
      remeberExpandNode.current = remeberExpandNode.current.filter((item) => item !== data.id);
    } else {
      data.open = true;
      remeberExpandNode.current.push(data.id);
    }

    forceUpdate();
  });

  const _renderTreeItemTitle = useMemoizedFn(
    ({ currentItemObj, item, open, level }: TreeItemTitle) => {
      //const hasChildren = !!(currentItemObj?.children && currentItemObj.children.length);

      let dom: React.ReactNode;
      let bg = '';
      if (multiple) {
        //多选的时候 checkBox的状态
        let checkedBoxStatu = {};
        let isCheck = false;
        if (currentItemObj) {
          const status = currentItemObj.checkBoxStatus;
          isCheck = currentItemObj.checkBoxStatus === '2';
          checkedBoxStatu = checkBoxStatus[status!];
        }
        dom = (
          <React.Fragment>
            <HStack w="full" whiteSpace="nowrap" py={1} my={1}>
              <Checkbox
                mr={2}
                {...checkedBoxStatu}
                onChange={(e) => {
                  onSelectCheckBox({
                    isChecked: !isCheck,
                    data: currentItemObj!,
                    isUpdate: true,
                    expandFatherNode: false,
                    carryOutOnSelect: true,
                  });
                }}
              />
              <Box pr="4">{item.name}</Box>
            </HStack>
          </React.Fragment>
        );
      } else {
        const isCheck = currentItemObj?.isCheck;

        if (isCheck) {
          if (theme === 'deep') {
            bg = 'rgba(51, 178, 240, 0.8)';
          } else {
            bg = 'pri.blue.400';
          }
        }

        dom = (
          <HStack
            w="full"
            cursor={'pointer'}
            onClick={() => {
              // 是否可以取消选中
              if (!isCancel && currentItemObj.isCheck) {
                return;
              }

              if (!isSelected) {
                return;
              }

              onSelectSinger({
                data: currentItemObj,
                isCheck: !isCheck,
                expandFatherNode: false,
                carryOutOnSelect: true,
              });
            }}
            position="relative"
            flexDir="row"
            whiteSpace="nowrap"
            py={1}
            my={1}
            onContextMenu={(e) => {
              e.preventDefault();
              itemOnContextMenu?.(currentItemObj, e, flatObj.current);
            }}
          >
            {renderNodeItem && currentItemObj ? (
              renderNodeItem(currentItemObj)
            ) : (
              <>
                <PaperIcon fill="pri.white.100" stroke="pri.dark.500" />
                <Box>{item.name}</Box>
                {renderOperator?.(currentItemObj)}
              </>
            )}
          </HStack>
        );
      }

      return (
        <Flex
          pl={2 + level * 2}
          userSelect="none"
          alignItems="center"
          bg={bg}
          w="max-content"
          minW="full"
          pr={2}
        >
          {item.children && item.children.length && iconPotiosn === 'left' ? (
            <Box cursor="pointer" onClick={() => showToggle(currentItemObj!)}>
              <TriangleIcon
                transform={`rotate(${open ? 180 : 0}deg)`}
                transition="all 0.2s"
                w="3"
                h="2"
                fill={theme === 'deep' ? 'pri.white.100' : ''}
                mr={2}
              />
            </Box>
          ) : null}

          {/* flex={1} whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" */}
          <Box>{dom}</Box>

          {item.children && item.children.length && iconPotiosn === 'right' ? (
            <Box cursor="pointer" onClick={() => showToggle(currentItemObj!)}>
              <TriangleIcon
                transform={`rotate(${open ? 180 : 0}deg)`}
                transition="all 0.2s"
                w="3"
                h="2"
                fill={theme === 'deep' ? 'pri.white.100' : ''}
                ml={2}
              />
            </Box>
          ) : null}
        </Flex>
      );
    }
  );

  const TreeItem = useMemoizedFn(
    ({ children, item, level }: { children?: React.ReactNode; item: ITreeData; level: number }) => {
      const currentItemObj = flatObj.current?.[item.id];

      //是否展开
      const open = currentItemObj?.open || false;
      return (
        <>
          {_renderTreeItemTitle({ currentItemObj, item, open, level })}
          <Collapse show={open} duration={0.15}>
            {children}
          </Collapse>
        </>
      );
    }
  );

  const _renderItem = useMemoizedFn((data: ITreeData[], level?: number) => {
    const level_ = level === undefined ? -1 : level;
    return data.map((item) => {
      const newLevel = level_ + 1;
      if (item.children && item.children.length) {
        return (
          <TreeItem item={item} key={item.id} level={newLevel}>
            {_renderItem(item.children, newLevel)}
          </TreeItem>
        );
      }
      return <TreeItem item={item} key={item.id} level={newLevel} />;
    });
  });

  return (
    <Box w="full" h="full" whiteSpace="nowrap" overflow="auto" layerStyle="scrollbarStyle">
      {_renderItem(data)}
    </Box>
  );
}

const FrTree = forwardRef(Tree);

export default FrTree;
