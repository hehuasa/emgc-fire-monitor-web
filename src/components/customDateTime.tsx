import { SmallCloseIcon } from '@chakra-ui/icons';
import { Box, Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { useMemoizedFn, useMount } from 'ahooks';
import { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useFormContext } from 'react-hook-form';
import DateTimeView from './dateTimeView';

const CustomDateTimePicker = (props: any) => {
  const { ...rest } = props;
  const {
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [clearIcon, setClearIcon] = useState(false);
  const [container, setContainer] = useState<Element>();
  const containerRef = useRef<Element>();
  const InputRef = useRef<HTMLInputElement | null>(null);
  const pickerRef = useRef<HTMLInputElement | null>(null);
  const postion = useRef<DOMRect>();
  useMount(() => {
    createContainer();
    getPosition();
    window.addEventListener('mousedown', mousedown);
  });

  const createContainer = useMemoizedFn(() => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    containerRef.current = div;
    setContainer(div);
  });

  const isFather = useMemoizedFn((node: HTMLElement) => {
    let flag = false;
    while (node.parentElement) {
      if (node === pickerRef.current) {
        flag = true;
        return flag;
      }
      node = node.parentElement;
    }
    return flag;
  });

  const mousedown = useMemoizedFn((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target === InputRef.current) {
      return;
    }
    const is = isFather(target);
    if (!is && showDatePicker) {
      setShowDatePicker(false);
    }
  });
  const getPosition = useMemoizedFn(() => {
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
  });

  const handleChange_ = useMemoizedFn((value: string) => {
    setClearIcon(!!value);
  });

  const handleFoucs = useMemoizedFn(() => {
    setShowDatePicker(true);
  });
  const handleClear = useMemoizedFn(() => {
    reset({});
  });

  return (
    <>
      <InputGroup
        position={'relative'}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Input
          {...rest}
          ref={InputRef}
          autoComplete="none"
          placeholder="请选择时间"
          onFocus={handleFoucs}
          onChange={(e) => handleChange_(e.target.value)}
        />
        {clearIcon && (
          <InputRightElement {...rest} w={10} cursor={'pointer'} p={1} onClick={handleClear}>
            <Icon as={SmallCloseIcon} bg={'gray.100'} color={'black'} borderRadius={'50%'}></Icon>
          </InputRightElement>
        )}
      </InputGroup>
      {showDatePicker &&
        container &&
        ReactDOM.createPortal(
          <Box
            ref={pickerRef}
            border={'1px solid #eaeaea'}
            borderRadius={'6px'}
            w={postion.current?.width + 'px'}
            padding={1}
            position={'absolute'}
            left={postion.current?.left + 'px'}
            top={postion.current!.top! + postion.current!.height! + 4 + 'px'}
            zIndex={9999}
          >
            <DateTimeView></DateTimeView>
          </Box>,
          container
        )}
    </>
  );
};
export default CustomDateTimePicker;
