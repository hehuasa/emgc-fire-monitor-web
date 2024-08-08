'use client';

import {
  Input,
  Box,
  InputProps,
  useOutsideClick,
  Flex,
  Text,
  BoxProps,
  Center,
} from '@chakra-ui/react';
import React, { useRef, forwardRef } from 'react';
import { useSafeState } from 'ahooks';
import { useMemoizedFn } from 'ahooks';
import { useFormContext, ChangeHandler } from 'react-hook-form';
import Tree, { IOritreeData, Props as ITreeProps, Refs, ITreeData } from './Tree';
import { useEffect } from 'react';
import { CloseIcon } from 'amis-ui';
import { ArrowIcon } from '../Icons';
import TableNoData from '@/components/TableNoData';

interface Props extends Omit<InputProps, 'onSelect'> {
  onBlur?: ChangeHandler;
  onChange?: ChangeHandler;
  name?: string;
  placeholder?: string;
  selectItemStyle?: BoxProps;
  showActive?: boolean;
  inputStyle?: BoxProps;
  dropStyle?: BoxProps;
}

type TreeSelectpProps = Props & Omit<ITreeProps<string>, 'checkValue'>;

const TreeSelect = (props: TreeSelectpProps, refs: any) => {
  const {
    getValues,
    setValue,
    formState: { errors, isSubmitted },
    watch,
  } = useFormContext();
  const {
    onChange,
    placeholder,
    data,
    multiple,
    defaultExpandAll,
    isCancel,
    onSelect: onOriSelect,
    selectItemStyle,
    allNodeCanSelect,
    isDisabled,
    showActive = true,
    theme = 'shallow',
    inputStyle,
    dropStyle,
    ...rest
  } = props;
  const InputRef = useRef<HTMLInputElement | null>(null);
  const multipleboxRef = useRef<HTMLInputElement | null>(null);
  const [show, setShow] = useSafeState(false);
  //单选的label
  const [label, setLabel] = useSafeState('');
  //多选的label
  const [multipleLabel, setMultipleLabel] = useSafeState<Pick<IOritreeData, 'id' | 'name'>[]>([]);
  //扁平之后的数据,方便直接取到父级
  const flatObj = useRef<{ [key: string]: ITreeData }>({});

  //适用于打开tree的回填展示
  const [checkValue, setCheckValue] = useSafeState<string[]>([]);

  //多选有时候定位的top大小不一定,所以动态计算
  const [multipleTop, setMultipleTop] = useSafeState(0);
  const treeRef = useRef<Refs>(null);

  const value = watch(props.name!);

  const [showClearIcon, setShowClearIcon] = useSafeState(false);

  useOutsideClick({
    ref: InputRef,
    handler: () => {
      setShow(false);
    },
  });

  const getLabel = useMemoizedFn((id: string) => {
    const label = Object.values(flatObj.current).find((item) => item.id === id)?.name || '';
    return label;
  });

  const onOpen = useMemoizedFn(() => {
    if (!show) {
      setShow(true);
    }
  });

  useEffect(() => {
    flatData(data);
  }, [data]);

  //扁平tree数据
  const flatData = useMemoizedFn((data_: ITreeData[]) => {
    const data = JSON.parse(JSON.stringify(data_));

    const initData: { [key: string]: ITreeData } = {};
    const formatFlag = (data: ITreeData[], pid?: string) => {
      for (const item of data) {
        if (pid) {
          item.pid = pid;
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
  });

  useEffect(() => {
    const h = multipleboxRef.current?.clientHeight;
    setMultipleTop(h || 0);
  }, [multipleLabel]);

  //tree内容回填 打开弹窗之前一定要先回填
  useEffect(() => {
    if (show && data.length) {
      if (!multiple) {
        const id = getValues(props.name!);
        if (id) {
          setCheckValue([id]);
        } else {
          setCheckValue([]);
        }
      } else {
        const id = getValues(props.name!);

        setCheckValue(id);
      }
    }
  }, [show, data]);

  //名称回填
  useEffect(() => {
    if (data.length) {
      if (multiple) {
        const arr: Pick<IOritreeData, 'id' | 'name'>[] = [];
        for (const id of value || []) {
          arr.push({ id, name: getLabel(id) || '' });
        }
        setMultipleLabel(arr);
      } else {
        if (value) {
          const name = getLabel(value) || '';
          setLabel(name);
        } else {
          setLabel('');
        }
      }
    }
  }, [data, value]);

  const onSelect = useMemoizedFn((ids: string[]) => {
    if (multiple) {
      setValue(props.name!, ids, { shouldValidate: isSubmitted ? true : false });
    } else {
      if (ids.length) {
        setValue(props.name!, ids[0], { shouldValidate: isSubmitted ? true : false });
      } else {
        setValue(props.name!, '', { shouldValidate: isSubmitted ? true : false });
      }
    }
  });

  const multipleDelItem = useMemoizedFn((id: string) => {
    const ids = getValues(props.name!) as string[];
    const newIds = ids.filter((_id) => _id !== id);

    treeRef.current?.multipleItemChange(id, false);

    setValue(props.name!, newIds, { shouldValidate: isSubmitted ? true : false });
  });

  const clear = useMemoizedFn(() => {
    setShow(false);
  });

  const _renderTitle = useMemoizedFn(() => {
    let borderColor = '';
    let boxShadow = '';
    if (errors[props.name!]) {
      borderColor = 'pri.red.100';
      boxShadow = 'rgb(229 62 62) 0px 0px 0px 1px';
    } else if (show) {
      borderColor = 'rgba(0, 120, 236, 1)';
      boxShadow = '0 0 0 1px rgb(0 120 236)';
    } else {
      borderColor = 'pri.gray.700';
    }
    if (multiple) {
      let content: string | undefined = `${placeholder}`;
      content = '"' + content + '"';
      if (multipleLabel && multipleLabel.length) {
        content = undefined;
      }

      return (
        <Flex position="relative" ref={multipleboxRef}>
          <Flex
            minH="40px"
            flexWrap="wrap"
            border="1px solid"
            borderColor={showActive ? borderColor : 'none'}
            boxShadow={showActive ? boxShadow : 'none'}
            borderRadius="6px"
            {...rest}
            h="unset"
          >
            {!multipleLabel.length ? (
              <Flex
                alignSelf="center"
                outline="none"
                //contentEditable
                suppressContentEditableWarning
                alignItems="center"
                _placeholder={props._placeholder}
                flexWrap="wrap"
                wordBreak="break-all"
                minW="4px"
                _empty={{ _before: { content } }}
              />
            ) : null}

            {multipleLabel?.map((item) => {
              const { name, id } = item;
              return (
                <Box key={item.id} p="5px" mr="4px" {...selectItemStyle}>
                  <Flex
                    px="1"
                    py="0.5"
                    border="1px solid"
                    borderColor="pri.gray.700"
                    mr="3px"
                    borderRadius={'5px'}
                  >
                    <Text flex={1} noOfLines={1}>
                      {name}
                    </Text>
                    <Flex
                      w="20px"
                      h="20px"
                      cursor={'pointer'}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        multipleDelItem(id);
                      }}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CloseIcon fontSize="10px" />
                    </Flex>
                  </Flex>
                </Box>
              );
            })}
          </Flex>

          {!showClearIcon ? (
            <Flex
              position="absolute"
              h="full"
              alignItems="center"
              justifyContent="center"
              right="10px"
              top="0"
            >
              <ArrowIcon />
            </Flex>
          ) : null}
        </Flex>
      );
    } else {
      return (
        <Flex
          h="40px"
          flexWrap="wrap"
          p="0 16px"
          border="1px solid"
          borderRadius="6px"
          borderColor={showActive ? borderColor : 'none'}
          boxShadow={showActive ? boxShadow : 'none'}
          opacity={props.isDisabled ? 0.4 : ''}
          cursor={props.isDisabled ? 'not-allowed' : 'not-allowed'}
          {...rest}
        >
          <Input
            disabled={isDisabled}
            placeholder={placeholder}
            autoFocus={false}
            readOnly
            px="0"
            _readOnly={{ boxShadow: '' }}
            tabIndex={-1}
            value={label}
            border="none"
            _invalid={{ border: 'none' }}
            _focusVisible={{ border: 'none' }}
            h="full"
            _disabled={{
              opacity: 'unset',
              color: 'unset !important',
              '-webkit-text-fill-color': 'unset',
            }}
            _placeholder={{ color: 'pri.placeholder' }}
            {...inputStyle}
          />
          {!(showClearIcon && value && value.length && !props.isReadOnly) ? (
            <Flex
              position="absolute"
              h="full"
              alignItems="center"
              justifyContent="center"
              right="10px"
              top="0"
            >
              <ArrowIcon />
            </Flex>
          ) : null}
        </Flex>
      );
    }
  });

  return (
    <Box
      position="relative"
      onClick={() => {
        if (!isDisabled && !props.isReadOnly) {
          onOpen();
        }
      }}
      ref={InputRef}
      onMouseEnter={() => {
        if (!isDisabled) {
          setShowClearIcon(true);
        }
      }}
      onMouseLeave={() => {
        if (!isDisabled) {
          setShowClearIcon(false);
        }
      }}
    >
      {_renderTitle()}

      {show ? (
        <Box
          position="absolute"
          left="0"
          top={`${(multiple ? multipleTop || 0 : InputRef?.current?.clientHeight || 0) + 2}px`}
          alignItems="center"
          borderRadius="6px"
          pl="1"
          pr="1"
          h="100%"
          w="100%"
          bg={theme === 'deep' ? '#084362' : '#fff'}
          boxShadow={
            theme === 'deep'
              ? '0px 3px 6px 1px rgba(0,0,0,0.6)'
              : '0px 3px 6px 1px rgba(0,0,0,0.16)'
          }
          zIndex={100}
          height={'300px'}
          whiteSpace="nowrap"
          {...dropStyle}
        >
          {data.length ? (
            <Tree
              data={data}
              onSelect={(...arg) => {
                onSelect(arg[0]);
                onOriSelect && onOriSelect(...arg);
              }}
              multiple={multiple}
              isCancel={isCancel}
              checkValue={checkValue}
              defaultExpandAll={defaultExpandAll}
              ref={treeRef}
              allNodeCanSelect={allNodeCanSelect}
              theme={theme}
            />
          ) : (
            <TableNoData showTitle theme={theme} />
          )}
        </Box>
      ) : null}
      {showClearIcon && value && value.length && !props.isReadOnly ? (
        <Flex
          onClick={(e) => {
            e.stopPropagation();
            clear();
            onSelect([]);
            onOriSelect && onOriSelect([], []);
          }}
          right="14px"
          justifyContent="center"
          cursor="pointer"
          position="absolute"
          top="0"
          alignItems="center"
          zIndex={10}
          borderRadius="10px"
          h="full"
        >
          <Center w="3" h="4">
            <CloseIcon fontSize="12px" />
          </Center>
        </Flex>
      ) : null}
    </Box>
  );
};

const FTreeSelect = forwardRef(TreeSelect);

export default FTreeSelect;
