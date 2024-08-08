import { Input, Box, Flex, Stack, InputProps, useOutsideClick } from '@chakra-ui/react';
import React, { useRef, useMemo, useEffect, forwardRef } from 'react';
import { useSafeState, useMemoizedFn } from 'ahooks';
import { useFormContext } from 'react-hook-form';

export interface IDefatltData {
  id: string;
  name: string;
}

interface Props extends InputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder: string;
  defaultData?: IDefatltData;
  saveInput?: boolean;
  data: IDefatltData[];
  onItemClick?: (data: IDefatltData) => void;
}

const SearchInput = (props: Props, refs: React.Ref<any>) => {
  const { setValue } = useFormContext();
  const { placeholder, defaultData, saveInput, data, onItemClick, ...rest } = props;
  const InputRef = useRef<HTMLInputElement | null>(null);
  const [show, setShow] = useSafeState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [selectedItem, setSelectedItem] = useSafeState<IDefatltData>({ id: '', name: '' });
  const [inputValue, setInputValue] = useSafeState<string>('');
  const [isFocus, setIsFocus] = useSafeState(false);
  const defaultValueIsInit = useRef(false);

  useOutsideClick({ handler: () => setShow(false), ref: boxRef });

  useEffect(() => {
    if (defaultData && defaultData.id && defaultData.name && !defaultValueIsInit.current) {
      defaultValueIsInit.current = true;
      setSelectedItem(defaultData);
    }
  }, [defaultData]);

  const onClick = useMemoizedFn(() => {
    setShow(true);
  });

  const inputOnChange = useMemoizedFn((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    props.onChange?.(e);

    if (saveInput) {
      setValue?.(props.name!, e.target.value, { shouldValidate: true });
    }
  });

  const inputOnBlur = useMemoizedFn((e: React.FocusEvent<HTMLInputElement, Element>) => {
    setIsFocus(false);
  });

  const boxColor = useMemo(() => {
    if (isFocus) {
      return '#bfbfbf';
    }
  }, [inputValue, isFocus]);

  return (
    <Box w="full">
      <Flex position="relative" alignItems="center">
        <Input
          ref={(ref) => {
            InputRef.current = ref;
            if (typeof refs === 'function') {
              refs?.(ref);
            }
          }}
          {...rest}
          onClick={onClick}
          onChange={inputOnChange}
          onBlur={inputOnBlur}
          position="relative"
          zIndex={10}
          placeholder={selectedItem.name ? undefined : placeholder}
          autoComplete="off"
          onFocus={() => setIsFocus(true)}
        />
        {inputValue && show ? (
          <Box
            position="absolute"
            left={0}
            top={InputRef.current?.clientHeight + 'px'}
            w="full"
            maxH={200}
            overflowY="auto"
            overflowX="auto"
            zIndex={1400}
            boxShadow="0px 3px 20px 1px rgba(0,0,0,0.15)"
            layerStyle="scrollbarStyle"
            ref={boxRef}
            border="1px solid"
            borderColor="border.gray.100"
            borderBottomRadius="6px"
          >
            <Stack spacing={0}>
              {data?.map((item, index) => {
                return (
                  <Box
                    p={2}
                    key={item.id + '' + index}
                    bg="#fff"
                    cursor="pointer"
                    _hover={{ color: 'pri.blue.100' }}
                    onClick={(e) => {
                      e.preventDefault();
                      setValue?.(props.name!, item.name, { shouldValidate: true });
                      setSelectedItem({ name: item.name, id: item.id });
                      setShow(false);
                      setInputValue('');
                      onItemClick?.(item);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {item.name}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        ) : null}
      </Flex>
    </Box>
  );
};

const FSearchInput = forwardRef(SearchInput);

export default FSearchInput;
