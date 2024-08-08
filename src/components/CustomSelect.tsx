/*

   本组件主要解决回填的时候组件不更新问题

*/
import { forwardRef, useEffect, useRef, ChangeEvent } from 'react';

import { useFormContext } from 'react-hook-form';
import { Select, SelectProps } from '@chakra-ui/react';

interface IProps extends SelectProps {
  placeholder?: string;
  name?: string;
  children?: React.ReactElement | React.ReactElement[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

function CustomSelect(props: IProps, refs: any) {
  const { setValue, getValues } = useFormContext();
  const { children, disabled, placeholder, ...rest } = props;

  const defaultBack = useRef(false);

  useEffect(() => {
    const name = props.name;

    if (defaultBack.current) {
      return;
    }

    if (name) {
      if (Array.isArray(children)) {
        if (children.length) {
          defaultBack.current = true;
          setValue(name, getValues(name));
        }
      } else {
        const optionList = children?.props?.children?.[1];

        if (optionList && optionList.length) {
          defaultBack.current = true;
          setValue(name, getValues(name));
        }
      }
    }
  }, [children]);

  return (
    <Select
      tabIndex={-1}
      autoFocus={false}
      {...rest}
      ref={refs}
      disabled={disabled}
      placeholder={placeholder}
    >
      {children}
    </Select>
  );
}

const FCustomSelect = forwardRef(CustomSelect);

export default FCustomSelect;
