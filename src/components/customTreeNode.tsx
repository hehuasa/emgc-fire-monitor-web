import { CheckIcon, ChevronDownIcon, ChevronRightIcon, DeleteIcon, EditIcon, SmallAddIcon } from '@chakra-ui/icons';
import { Box, Checkbox, HStack } from '@chakra-ui/react';
import { NodeModel, useDragOver } from '@minoru/react-dnd-treeview';
import { useEffect, useState } from 'react';
export type ITreeItem = {
  id: string | number; // 节点唯一标识符
  parent: string | number; // 父节点标识符
  text: string; // 文字内容
  droppable?: boolean; // 是否有下级数据
  code?: string;
  [key: string]: unknown;
};

// props外层类型限定
const CustomNode = (props: any) => {
  const [hover, setHover] = useState(false);
  const { id, droppable, checked, isIndeterminate } = props.node;
  const [isSelected, setIsSelected] = useState<string | number>('');
  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

  useEffect(() => {
    if (props.defaultSelectId) {
      setIsSelected(props.defaultSelectId);
    }
  }, [props.defaultSelectId]);

  const handleToggle = (e: any) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const handleSelect_ = (node: NodeModel<ITreeItem>) => {
    if (props.handleSelect) {
      if (props.isCancelSelect && node.id === isSelected) {
        setIsSelected('');
        props.handleSelect(null);
        console.log('取消选择', props.isCancelSelect);
      } else {
        setIsSelected(node.id);
        props.handleSelect(node);
      }
    }
  };
  return (
    <>
      <HStack
        {...dragOverProps}
        onClick={(e) => {
          // if (!droppable) {
          handleSelect_(props.node);
          handleToggle(e);
          // }
        }}
        cursor="pointer"
        py={1}
        px={1}
        ps={2}
        mb={0.5}
        _hover={{ background: 'blue.200', color: 'white' }}
        marginLeft={7 * props.depth}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        bg={isSelected == props.node?.id && isSelected == props.currentNode?.id && !props.node.droppable ? 'blue.100' : ''}
        color={isSelected == props.node?.id && isSelected == props.currentNode?.id && !props.node.droppable ? 'white' : ''}
      >
        {droppable && (
          <Box mb={1}>
            {props.isOpen ? (
              <ChevronDownIcon w={3} h={6} color="blackAlpha.600" />
            ) : (
              <ChevronRightIcon w={3} h={6} color="blackAlpha.600" />
            )}
          </Box>
        )}
        {props.isCheckBox && (
          <Checkbox
            value={id}
            isChecked={checked}
            display={'flex'}
            alignItems="center"
            isIndeterminate={isIndeterminate}
            onChange={() => (props.handleChange ? props.handleChange(props.node) : null)}
          ></Checkbox>
        )}
        <Box whiteSpace={'nowrap'}>{props.node.text}</Box>
        {props.isSelected === props.node.id ? (
          <Box flex={1} pr={4} textAlign="right">
            <CheckIcon color={props.isSelected === props.node.id ? 'blue.300' : 'blackAlpha.600'} />
          </Box>
        ) : null}
        {props.isEdit && hover && (
          <Box display={'flex'} justifyContent={'space-around'} alignItems="center" w={'80px'}>
            <Box title="新增" p={'2px'} onClick={() => props.handleAdd(props.node)}>
              <SmallAddIcon
                _hover={{
                  color: '#000',
                }}
              ></SmallAddIcon>
            </Box>
            <Box title="修改" p={'2px'} onClick={() => props.handleEdit(props.node)}>
              <EditIcon
                _hover={{
                  color: '#000',
                }}
              ></EditIcon>
            </Box>

            <Box title="删除" p={'2px'} onClick={() => props.handleDel(props.node)}>
              <DeleteIcon
                _hover={{
                  color: '#000',
                }}
              ></DeleteIcon>
            </Box>
          </Box>
        )}
      </HStack>
    </>
  );
};

export default CustomNode;
