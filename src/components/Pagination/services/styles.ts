/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';

import { BoxProps, useColorModeValue } from '@chakra-ui/react';
import PagContext from '../providers/pagination-provider';

export const usePaginationStyles = (props: any) => {
  const { colorScheme, rounded, size, baseStyles, activeStyles, hoverStyles } = React.useContext(PagContext);

  const activeStyle: BoxProps = activeStyles || {
    bg: useColorModeValue('blue.400', `${colorScheme}.500`),
    color: useColorModeValue('white', 'gray.200'),
    cursor: 'pointer',
  };

  const hoverStyle: BoxProps = {
    _hover: hoverStyles || activeStyle,
  };
  const baseStyle: BoxProps = baseStyles || {
    paddingLeft: '0',
    paddingRight: '0',
    rounded: rounded,
    bg: useColorModeValue('white', 'backs.200'),
    color: useColorModeValue('font.100', 'font.200'),
    userSelect: 'none',
    borderRadius: '4px',
    minH: '8',
    width: '',
    height: '8',
    border: '1px',
    borderColor: 'pri.gray.200',
  };
  const getSizeStyle = (size: string) => {
    let styles: BoxProps = {};
    switch (size) {
      case 'xs':
        styles = { px: 2, fontSize: 'xs' };
        break;

      case 'sm':
        styles = { px: 3, py: 1, fontSize: 'sm' };
        break;

      case 'md':
        styles = { px: 4, py: 1, fontSize: 'md' };
        break;

      case 'lg':
        styles = { px: 5, py: 2, fontSize: 'lg' };
        break;

      default:
        break;
    }
    return styles;
  };
  const sizeStyle = getSizeStyle(size);
  const disabledStyle: BoxProps = {
    opacity: 0.6,
    cursor: 'not-allowed',
  };
  return {
    ...sizeStyle,
    ...baseStyle,
    ...(!props.disabled && hoverStyle),
    ...(props.active && activeStyle),
    ...(props.disabled && disabledStyle),
  };
};
