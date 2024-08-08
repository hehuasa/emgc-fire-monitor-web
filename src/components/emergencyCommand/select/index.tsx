import {
  Input,
  Flex,
  InputProps,
  Stack,
  Box,
  useOutsideClick,
  Text,
  BoxProps,
  Center,
} from '@chakra-ui/react';
import { useMemoizedFn, useSafeState, useSize } from 'ahooks';
import React, { forwardRef, Ref, useRef } from 'react';
import { CloseIcon, ArrowIcon } from '@/components/Icons';
import TableNoData from '@/components/TableNoData';

import {
  //RefCallBack,
  useFormContext,
  Controller,
} from 'react-hook-form';
interface Props extends InputProps {
  data?: IData[];
  multiple?: boolean;
  dropMenuStyle?: BoxProps;
  onSelected?: (data: IData) => void;
}

interface IData {
  id: string;
  name: string;
}

const Select = (props: Props, refs: Ref<any>) => {
  const { multiple, dropMenuStyle, data, name, onChange, onBlur, ...rest } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useSafeState(false);

  const virtuallyInput = useRef<HTMLDivElement | null>(null);
  const multipleBoxSize = useSize(containerRef);

  const clearVirtuallyInput = useMemoizedFn(() => {
    if (virtuallyInput.current) {
      virtuallyInput.current.innerHTML = '';
    }
  });

  const {
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitted },
  } = useFormContext();

  useOutsideClick({
    ref: containerRef,
    handler: () => {
      visible && setVisible(false);
    },
  });

  const show = useMemoizedFn(() => {
    if (props.isReadOnly) {
      return;
    }

    setVisible(true);
    if (virtuallyInput.current) {
      virtuallyInput.current.focus();
    }
  });

  const select = useMemoizedFn((item: IData) => {
    setVisible(false);
    setValue(name!, item.id, { shouldValidate: isSubmitted ? true : false });

    props.onSelected?.(item);
  });

  const multipleSelect = useMemoizedFn((item: IData) => {
    let oldValue = getValues(name!) as string[];
    if (oldValue.includes(item.id)) {
      oldValue = oldValue.filter((e) => e !== item.id);
    } else {
      oldValue.push(item.id);
    }
    setValue(name!, oldValue, { shouldValidate: isSubmitted ? true : false });

    clearVirtuallyInput();
  });

  const multipleClear = useMemoizedFn((id: string) => {
    let oldValue = getValues(name!) as string[];
    oldValue = oldValue.filter((e) => e !== id);
    setValue(name!, oldValue, { shouldValidate: isSubmitted ? true : false });
  });

  return (
    <Controller
      control={control}
      name={name!}
      render={({ field: { onChange, onBlur, value } }) => {
        //多选和单选
        if (multiple) {
          let content: string | undefined = '"请输入"';
          if (value && value.length) {
            content = undefined;
          }

          return (
            <Flex
              border={errors[name!] ? '1px solid #E53E3E' : ''}
              position="relative"
              ref={containerRef}
              onClick={show}
            >
              <Flex {...rest} flexWrap="wrap" p="0 16px">
                {value?.map((e: string) => {
                  const name = data?.find((s) => s.id === e)?.name;
                  return (
                    <Box key={e} py="4px" mr="4px" className="nihao">
                      <Flex h={props.h} border="1px solid #095EE5" mr="3px" borderRadius={'5px'}>
                        <Text flex={1} noOfLines={1}>
                          {name}
                        </Text>
                        <CloseIcon
                          fontSize="10px"
                          cursor={'pointer'}
                          onClick={(event) => {
                            event.stopPropagation();
                            multipleClear(e);
                          }}
                        />
                      </Flex>
                    </Box>
                  );
                })}
                <Flex
                  alignSelf="center"
                  ref={virtuallyInput}
                  onInput={(e) => {
                    const box = e.target as HTMLDivElement;
                    const v = box.innerText;
                  }}
                  onBlur={() => {
                    clearVirtuallyInput();
                  }}
                  outline="none"
                  _focusVisible={{ border: 'none', boxShadow: 'none' }}
                  contentEditable
                  suppressContentEditableWarning
                  borderRadius={0}
                  alignItems="center"
                  bg="transparent"
                  _placeholder={props._placeholder}
                  flexWrap="wrap"
                  wordBreak="break-all"
                  minW="4px"
                  _empty={{ _before: { content, color: '#fff' } }}
                />
              </Flex>

              {visible ? (
                <Stack
                  maxH={'200px'}
                  overflowY="auto"
                  layerStyle="scrollbarStyle"
                  spacing={0}
                  position="absolute"
                  left={0}
                  top={`${multipleBoxSize?.height ?? 0}px`}
                  w="full"
                  zIndex={100}
                  boxShadow="0px 3px 6px 1px rgba(0,0,0,0.6)"
                  {...dropMenuStyle}
                >
                  {data && data.length ? (
                    <>
                      {data.map((item) => (
                        <Box
                          key={item.id}
                          bg={value.includes(item.id) ? '#048EB1' : '#084362'}
                          lineHeight="36px"
                          p="0 16px"
                        >
                          <Text
                            _hover={{ color: 'pri.white.500' }}
                            noOfLines={1}
                            cursor="pointer"
                            onClick={() => multipleSelect(item)}
                          >
                            {item.name}
                          </Text>
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Center w="full" h="150px" bg="#084362">
                      <TableNoData showTitle theme="deep" imgW={100} />
                    </Center>
                  )}
                </Stack>
              ) : null}
              <Flex
                position="absolute"
                h="full"
                alignItems="center"
                justifyContent="center"
                right="16px"
                top="0"
              >
                <ArrowIcon />
              </Flex>
            </Flex>
          );
        } else {
          const label = data?.find((item) => item.id === value)?.name;
          return (
            <Flex position="relative" w="max-content" alignItems="center" ref={containerRef}>
              <Input
                placeholder={props.placeholder}
                onBlur={(e) => {
                  onBlur();
                }}
                ref={refs}
                onChange={(e) => {
                  onChange(e);
                }}
                value={label || ''}
                onClick={show}
                autoComplete="off"
                {...rest}
                _invalid={{ border: '1px solid #E53E3E', boxShadow: '0 0 0 1px #e53e3e' }}
              />

              {visible ? (
                <Stack
                  maxH={'200px'}
                  overflowY="auto"
                  layerStyle="scrollbarStyle"
                  spacing={0}
                  position="absolute"
                  left={0}
                  top={props.h}
                  w="full"
                  zIndex={100}
                  boxShadow="0px 3px 6px 1px rgba(0,0,0,0.6)"
                  {...dropMenuStyle}
                >
                  {data && data.length ? (
                    <>
                      {data?.map((item) => (
                        <Box
                          h="36px"
                          key={item.id}
                          bg={value === item.id ? '#048EB1' : '#084362'}
                          lineHeight="36px"
                          p="0 16px"
                        >
                          <Text
                            _hover={{ color: 'pri.white.500' }}
                            noOfLines={1}
                            cursor="pointer"
                            onClick={() => select(item)}
                          >
                            {item.name}
                          </Text>
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Center w="full" h="150px" bg="#084362">
                      <TableNoData showTitle theme="deep" imgW={100} />
                    </Center>
                  )}
                </Stack>
              ) : null}
              <Flex
                position="absolute"
                h="full"
                alignItems="center"
                justifyContent="center"
                right="10px"
                top="0"
              >
                <ArrowIcon
                //transform={visible ? 'rotate(180deg)' : 'rotate(0deg)'}
                />
              </Flex>
            </Flex>
          );
        }
      }}
    />
  );
};

const FSearchInput = forwardRef(Select);

export default FSearchInput;
