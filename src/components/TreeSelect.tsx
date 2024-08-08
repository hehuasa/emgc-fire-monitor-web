'use client';

import { Input, Box, Flex, StyleProps, useTheme, Text } from '@chakra-ui/react';
import React, { useRef, useCallback, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { useMount, useSafeState, useUnmount } from 'ahooks';
import { useMemoizedFn } from 'ahooks';
import { useFormContext, ChangeHandler } from 'react-hook-form';
import TreeView from '@/components/TreeView';

import { FormatTreeDataType } from '@/utils/util';

interface Props extends StyleProps {
  onBlur?: ChangeHandler;
  onChange?: ChangeHandler;
  name?: string;
  placeholder?: string;
  treeData: FormatTreeDataType[];
}
//TODO: 由于useForm包裹后在初始化时引用了ref，因此在使用的时候如果不需要使用refs需要对该组件的refs置为空
const TreeSelect = (props: Props, refs: any) => {
  const theme = useTheme();
  const {
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { onChange, placeholder, treeData, ...rest } = props;
  const [container, setContainer] = useSafeState<Element>();
  const containerRef = useRef<Element>();
  const InputRef = useRef<HTMLInputElement | null>(null);
  const postion = useRef<DOMRect>();
  const [show, setShow] = useSafeState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useMount(() => {
    if (containerRef.current) {
      return;
    }
    createContainer();
    window.addEventListener('mousedown', mousedown);
    getDefaultValue();
  });

  const mousedown = useMemoizedFn((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target === InputRef.current) {
      return;
    }
    const is = isFather(target);
    if (!is && show) {
      setShow(false);
    }
  });

  const getDefaultValue = useCallback(() => {
    let value;
    if (props.name) {
      value = getValues?.(props.name);
    }
    return value;
  }, []);

  const isFather = useCallback((e: HTMLElement) => {
    let flag = false;
    let node = e;
    while (node.parentElement) {
      if (node === boxRef.current) {
        flag = true;
        return flag;
      }
      node = node.parentElement;
    }
    return flag;
  }, []);

  const getPosition = useCallback(() => {
    const pos = JSON.parse(JSON.stringify(InputRef.current?.getBoundingClientRect())) as {
      height: number;
      width: number;
      x: number;
      y: number;
      left: number;
      top: number;
      bottom: number;
      right: number;
      toJSON: any;
    };
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (pos) {
      pos.left = pos.left + scrollLeft;
      pos.top = pos.top + scrollTop;
    }

    postion.current = pos;
  }, []);

  const createContainer = useCallback(() => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    containerRef.current = div;
    setContainer(div);
  }, []);

  useUnmount(() => {
    if (containerRef.current && document.body.contains(containerRef.current)) {
      document.body.removeChild(containerRef.current);
      containerRef.current = undefined;
    }
    window.removeEventListener('click', mousedown);
  });

  const onClick = useMemoizedFn(() => {
    getPosition();
    if (!show) {
      setShow(true);
    }
  });

  const inputOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    //console.log('eeeee', e.target.value);
  }, []);

  const inputonBlur = useCallback((e: React.FocusEvent<HTMLInputElement, Element>) => {
    //
  }, []);

  const getText = useCallback(() => {
    const id = getDefaultValue();
    if (id !== undefined) {
      const text = props.treeData.find((item) => item.id === id)?.text;
      return text;
    }
  }, [treeData]);

  return (
    <Box>
      <Box position="relative" onClick={onClick}>
        <Input
          ref={(ref) => {
            refs?.(ref);
          }}
          {...rest}
          onChange={(e) => {
            inputOnChange(e);
            onChange?.(e);
          }}
          readOnly
          onBlur={inputonBlur}
          color="transparent"
        />
        <Flex
          position="absolute"
          left="0"
          height="100%"
          top="0"
          alignItems="center"
          borderRadius="6px"
          pl="16px"
          pr="16px"
          h="100%"
          w="100%"
          ref={InputRef}
          //border={errors[]}
          border={errors[props.name!] ? `1px solid ${theme.colors.pri['red.100']}` : 'none'}
          boxShadow={errors[props.name!] ? `0 0 0 1px ${theme.colors.pri['red.100']}` : 'none'}
        >
          <Box overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
            {getText() ? (
              <Text>{getText()}</Text>
            ) : (
              <Text color={'gray.500'} fontSize={'inherit'}>
                {placeholder}
              </Text>
            )}
          </Box>
        </Flex>
      </Box>

      {container && show ? (
        <Box>
          {ReactDOM.createPortal(
            <Box
              position="absolute"
              left={postion.current?.left + 'px'}
              top={postion.current!.top! + postion.current!.height! + 'px'}
              minW={InputRef.current?.clientWidth + 'px'}
              overflow="hidden"
              bg="#fff"
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              ref={boxRef}
              maxH={300}
              overflowY="auto"
              overflowX="auto"
              zIndex={9999}
              boxShadow="0px 3px 6px 1px rgba(0,0,0,0.16)"
            >
              <TreeView
                tree={props.treeData}
                rootId={'0'}
                handleSelect={(e) => {
                  console.log('选中', e);

                  setValue?.(props.name!, e, { shouldValidate: true });
                  setShow(false);
                }}
                render={() => <></>}
                onDrop={() => {
                  return null;
                }}
                isCancelSelect={true}
                selectedId={getDefaultValue()}
              />
            </Box>,
            container!
          )}
        </Box>
      ) : null}
    </Box>
  );
};

const FTreeSelect = forwardRef(TreeSelect);

export default FTreeSelect;
