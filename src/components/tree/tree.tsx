import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
  TreeProps,
  NodeModel,
} from '@minoru/react-dnd-treeview';
import { DndProvider } from 'react-dnd';
import CustomNode from '@/components/customTreeNode';
import ContextMenu from './contextMenu';
import { ComponentWithAs, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

/**
 * 功能说明： tree,rootId,onDrop,render
 * @param
 *  必填
 *  tree: 元数据
 *  rootId： 根节点id
 *  onDrop:()=>return
 *  render: ()=><></>
 *  可选
 *  initialOpen: boolean 初始化展开
 *  enableAnimateExpand: boolean 启用展开动画
 *  isEdit
 *  isCancelSelect
 *  isCheckBo
 *  menus
 * @emits
 *  handleSelect
 *  handleChange
 *  click:
 *  handleAdd
 *  handleEdit
 *  handleDel
 */

export type ITreeItem = {
  id: string | number; // 节点唯一标识符
  parent: string | number; // 父节点标识符
  text: string; // 文字内容
  droppable?: boolean; // 是否有下级数据
  checked?: boolean; // 勾选
  isIndeterminate?: boolean; // 半勾选
  [key: string]: unknown;
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

interface IProps extends TreeProps<ITreeItem> {
  tree: ITreeItem[];
  menus?: Array<contextMenuType>; //右键菜单项
  isEdit?: boolean; // 是否开启树自身crud
  isCancelSelect?: boolean; // 是否可以取消选择
  isCheckBox?: boolean; // 是否开启checkbox
  lastNodeCheckBox?: boolean; // 只有最低级的节点和其父节点可以进行勾选
  defaultSelect?: ITreeItem; // 默认选中
  isSearch?: boolean; //是否开启搜索
  handleChange?: (node: ITreeItem) => void; // 开启checkbox后的change事件
  handleSelect?: (node: ITreeItem) => void; // 选中项时触发
  click?: (menu: contextMenuType) => void; //右键点击单项事件
  handleAdd?: (node: ITreeItem) => void; //树自己的新增
  handleEdit?: (node: ITreeItem) => void; //树自己的编辑
  handleDel?: (node: ITreeItem) => void; //树自己的删除
}

export type contextMenuType = {
  text: string;
  icon?: ComponentWithAs<any>;
  code: string;
};

const TreeRender = (props: IProps) => {
  const {
    tree,
    isCheckBox = false,
    lastNodeCheckBox = false,
    isCancelSelect = false,
    isSearch = false,
    handleSelect,
    menus,
    defaultSelect,
    ...rest
  } = props;
  const ref = useRef(null);
  const [treeData, setTreeData] = useState<ITreeItem[]>(tree);
  const parentList: ITreeItem[] = [];
  const childList: ITreeItem[] = [];
  const currentNode = useRef<ITreeItem | null | undefined>(null);
  const [defaultSelectId, setDefaultSelectId] = useState<string | number>('');
  const [keyWord, setkeyWord] = useState('');
  useEffect(() => {
    const tree_ = JSON.parse(JSON.stringify(tree));
    console.log('tree_', tree_);

    setTreeData(tree_);
    currentNode.current = defaultSelect;
    if (defaultSelect) {
      setDefaultSelectId(defaultSelect.id);
    }
  }, [defaultSelect, tree]);

  const _handleChange = (node: ITreeItem) => {
    const nodeItem = treeData.find((item) => item.id === node.id);
    if (nodeItem) {
      node.checked = !node.checked;
      node.isIndeterminate = false;
      editNode(nodeItem);
      // 需要监听节点状态就调用props.handleChange
      console.log('选中', nodeItem);

      props.handleChange ? props.handleChange(nodeItem) : null;
    }
    setTreeData([...treeData]);
  };

  const _handleSelect = useCallback((node: ITreeItem) => {
    currentNode.current = node;
    handleSelect && handleSelect(node);
  }, []);

  /**
   * 修改节点状态,使用循环替代递归，分为两个步骤：
   * 1、修改子节点状态，以及子节点的子节点
   * 2、修改父节点状态，以及父节点的父节点
   */
  const editNode = (node: ITreeItem) => {
    getParentNode(node);
    getChildrenNode(node);

    if (parentList.length) {
      if (node.checked) {
        parentList.forEach((parent) => {
          const childList = getChildrenList(parent);
          const isAllChecked = childList.every((child) => child.checked);

          if (isAllChecked) {
            parent.checked = isAllChecked;
            parent.isIndeterminate = false;
          } else {
            parent.checked = false;
            parent.isIndeterminate = true;
          }
        });
      } else {
        parentList.forEach((parent) => {
          const childList = getChildrenList(parent);
          const hadChecked = childList.some((child) => child.checked || child.isIndeterminate);

          if (hadChecked) {
            parent.checked = false;
            parent.isIndeterminate = true;
          } else {
            parent.checked = false;
            parent.isIndeterminate = false;
          }
        });
      }
    }
    if (childList.length) {
      childList.forEach((child) => {
        child.checked = node.checked;
      });
    }
  };

  //: 找子级
  const getChildrenList = (node: ITreeItem) => {
    const list = treeData.filter((v) => v.parent === node.id);
    return list;
  };

  // : 保存父级-父级关系的节点
  const getParentNode = (node: ITreeItem) => {
    treeData.forEach((v) => {
      if (node.parent === v.id) {
        parentList.push(v);
        getParentNode(v);
      }
    });
  };
  //: 保存子级-子级关系的节点
  const getChildrenNode = (node: ITreeItem) => {
    treeData.forEach((v) => {
      if (node.id === v.parent) {
        childList.push(v);
        getChildrenNode(v);
      }
    });
  };

  const handleEnter = (e: any) => {
    const tree_ = JSON.parse(JSON.stringify(tree));

    if (e.key == 'Enter' && keyWord) {
      const filterTree = tree_.filter((node: ITreeItem) => node.text.includes(keyWord));

      // 1、查询出来的节点可能是人员或部门或更上级部门
      // 2、根据不同类型的节点，查询出上下级
      // 3、重新拼接树
      const newTree: Array<ITreeItem> = [];
      filterTree.forEach((node: ITreeItem) => {
        node.parent = '0';
        // 1、人员节点不额外处理
        // 2、只处理人员节点的父级节点，跟树结构保持一致，只能勾选人员节点和最近的父级节点
        newTree.push(node);
        if (node.children && (node.children as ITreeItem[]).length > 0) {
          newTree.push(...(node.children as ITreeItem[]));
        }
      });
      console.log('newTree', newTree);
      setTreeData([...newTree]);
    }
  };

  const handleSearch = (e: any) => {
    const tree_ = JSON.parse(JSON.stringify(tree));

    const filterTree = tree_.filter((node: ITreeItem) => node.text.includes(keyWord));

    // 1、查询出来的节点可能是人员或部门或更上级部门
    // 2、根据不同类型的节点，查询出上下级
    // 3、重新拼接树
    const newTree: Array<ITreeItem> = [];
    filterTree.forEach((node: ITreeItem) => {
      node.parent = '0';
      // 1、人员节点不额外处理
      // 2、只处理人员节点的父级节点，跟树结构保持一致，只能勾选人员节点和最近的父级节点
      newTree.push(node);
      if (node.children && (node.children as ITreeItem[]).length > 0) {
        newTree.push(...(node.children as ITreeItem[]));
      }
    });
    console.log('newTree', newTree);
    setTreeData([...newTree]);
  };

  return (
    <>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        {isSearch && (
          <InputGroup>
            <Input
              value={keyWord}
              onChange={(e) => setkeyWord(e.target.value)}
              onKeyDown={handleEnter}
              placeholder="请输入关键字查询"
            />
            <InputRightElement>
              <SearchIcon
                position="absolute"
                top="50%"
                transform="translateY(-50%)"
                right="3"
                cursor="pointer"
                _hover={{ color: 'pri.blue.100' }}
                onClick={handleSearch}
              />
            </InputRightElement>
          </InputGroup>
        )}
        <Tree
          {...rest}
          {...props}
          tree={treeData}
          onDrop={() => {
            return;
          }}
          ref={ref}
          render={(node: NodeModel<ITreeItem>, options) => {
            if (lastNodeCheckBox) {
              if ((node as any).userInfoVos || (node as any).userName) {
                return (
                  <CustomNode
                    {...options}
                    {...props}
                    isCancelSelect={isCancelSelect}
                    node={node}
                    isCheckBox={true}
                    currentNode={currentNode.current}
                    defaultSelectId={defaultSelectId}
                    handleChange={_handleChange}
                    handleSelect={_handleSelect}
                  ></CustomNode>
                );
              } else {
                return (
                  <CustomNode
                    {...options}
                    {...props}
                    isCancelSelect={isCancelSelect}
                    isCheckBox={false}
                    node={node}
                    currentNode={currentNode.current}
                    defaultSelectId={defaultSelectId}
                    handleChange={_handleChange}
                    handleSelect={_handleSelect}
                  ></CustomNode>
                );
              }
            } else {
              return (
                <CustomNode
                  isCancelSelect={isCancelSelect}
                  node={node}
                  currentNode={currentNode.current}
                  defaultSelectId={defaultSelectId}
                  {...options}
                  {...props}
                  isCheckBox={isCheckBox}
                  handleChange={_handleChange}
                  handleSelect={_handleSelect}
                ></CustomNode>
              );
            }
          }}
        />
      </DndProvider>
      {menus?.length && <ContextMenu click={props.click} contextMenu={menus}></ContextMenu>}
    </>
  );
};
export default TreeRender;
