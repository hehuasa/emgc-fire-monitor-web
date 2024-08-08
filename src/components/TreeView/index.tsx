import React from 'react';
import { Tree, getBackendOptions, MultiBackend, TreeProps } from '@minoru/react-dnd-treeview';
import { DndProvider } from 'react-dnd';
import { Box, HStack } from '@chakra-ui/react';
import { CheckIcon, Icon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { AiFillFile, AiFillFolder } from 'react-icons/ai';

/**
 * 功能说明：
 */

export type ITreeItem = {
  id: string; // 节点唯一标识符
  parent: string; // 父节点标识符
  text: string; // 文字内容
  droppable?: boolean; // 是否有下级数据
  [key: string]: unknown;
};

interface IProps extends TreeProps<ITreeItem> {
  // data: ITreeItem[];
  // rootCode: string;
  handleSelect?: (id: ITreeItem['id']) => void;
  isCancelSelect?: true;
  selectedItems?: string[];
  [key: string]: any;
}

const TreeView = (props: IProps) => {
  const { handleSelect, isCancelSelect, selectedItems } = props;
  // const [isSelected, setIsSelected] = useState<string>('');

  const handleSelect_ = (id: ITreeItem['id']) => {
    if (handleSelect) {
      handleSelect(id);
      // if (isCancelSelect && id === isSelected) {
      //   setIsSelected('');
      //   handleSelect('');
      // } else {
      //   setIsSelected(id);
      //   handleSelect(id);
      // }
    }
  };

  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <Tree
        {...props}
        // tree={data}
        // rootId={rootCode}
        sort={false}
        onDrop={() => {
          return null;
        }}
        render={(node, { depth, isOpen, onToggle }) => {
          const isSelected = selectedItems?.includes(node.id as string);
          console.log('node', node);

          return (
            <HStack
              onClick={() => {
                //TODO:因为存在可选父级的情况，暂时处理为根据点击内容不同处理
                // handleSelect_(node.id as string);
                // if (!node.droppable) {
                //   handleSelect_(node.id as string);
                // }
              }}
              color="font.100"
              cursor="pointer"
              _hover={{ background: 'blue.100', color: 'white' }}
              marginLeft={8 * depth}
            >
              <Box mt={1} pl={2}>
                {node.droppable ? (
                  <Icon as={AiFillFolder} w={5} h={5} color="yellow.300" />
                ) : (
                  <Icon as={AiFillFile} w={5} h={5} color={isSelected ? 'blue.300' : 'gray.400'} />
                )}
              </Box>
              <Box
                whiteSpace={'nowrap'}
                onClick={() => {
                  handleSelect_(node.id as string);
                }}
              >
                {node.text}
              </Box>
              {isSelected ? (
                <Box flex={1} pr={4} textAlign="right">
                  <CheckIcon color={isSelected ? 'blue.300' : 'blackAlpha.600'} />
                </Box>
              ) : null}
              {node.droppable && (
                <Box
                  mb={1}
                  pr={4}
                  onClick={() => {
                    onToggle();
                  }}
                >
                  {isOpen ? <TriangleUpIcon w={3} h={6} color="font.300" /> : <TriangleDownIcon w={3} h={6} color="font.300" />}
                </Box>
              )}
            </HStack>
          );
        }}
      />
    </DndProvider>
  );
};

export default TreeView;
