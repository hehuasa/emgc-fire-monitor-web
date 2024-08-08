/*
   应急指挥里面modal的特殊样式弹窗
   这个模块使用了useSize
   需要动态导入
*/

import { Box, BoxProps, Center } from '@chakra-ui/react';
import { useSize, useMemoizedFn } from 'ahooks';
import { CloseIcon } from '@/components/Icons';
import { useRef } from 'react';

interface Props {
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
  fill?: string;
  opacity?: number;
  floatingComponent?: React.ReactNode;
  contentStyle?: BoxProps;
}

const Warp = ({ title, children, onClose, fill, floatingComponent, contentStyle }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const size = useSize(containerRef);

  const py = 6;
  const px = 4;
  const bottomTap = 14;
  const fillColor = '#00D8FF';

  //svg外边框比实际的div要大 左右6px和1px的border 上10px下2px
  const width = size ? size?.width + 14 : 0;
  const height = size ? size?.height + 12 : 0;

  const _renderSvg = useMemoizedFn(() => {
    if (width && height) {
      return (
        <Box position="absolute" left={'-7px'} top={'-10px'} zIndex={-1}>
          <svg width={width} height={height}>
            <filter id="insetShadowModal" x="-50%" y="-50%" width="200%" height="200%">
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="4" />
              <feOffset dx="0" dy="1" result="offsetblur" />
              <feFlood floodColor="rgba(9, 94, 229, 1)" result="color" />
              <feComposite in2="offsetblur" operator="in" />
              <feComposite in2="SourceAlpha" operator="in" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode />
              </feMerge>
            </filter>
            <path
              d={`M${px + 2},${py} L${width - px - 2},${py} L${width - px - 2},${
                height - bottomTap
              }  L${width - bottomTap - 6},${height - 2} L${bottomTap + 6},${height - 2} L${
                px + 2
              },${height - bottomTap} z`}
              //d={`M${px + 2},${py} L${width - px - 2},${py} L${width - px - 2},${height - bottomTap}`}
              stroke={fillColor}
              fill={fill ?? 'rgba(5, 47, 80, 1)'}
              //filter="url(#insetShadowModal)"
              //opacity={0.9}
            />
            {/* top的白线 */}
            <path
              d={`M${px + (width - px * 2) / 3},${py} L${px + ((width - px * 2) / 3) * 2},${py}`}
              stroke="#fff"
            />

            {/* 左下角 */}
            <path
              d={`M${px / 2 + 4},${height - bottomTap * 3} L${px / 2 + 4},${height - bottomTap} L${
                bottomTap + 10
              },${height - 1} L${bottomTap * 4},${height - 1}`}
              stroke={fillColor}
              strokeWidth={2}
              fill="none"
            />
            {/* 右下角 */}
            <path
              d={`M${width - px / 2 - 4},${height - bottomTap * 3} L${width - px / 2 - 4},${
                height - bottomTap
              } L${width - bottomTap - 10},${height - 1} L${width - bottomTap * 4},${height - 1}`}
              stroke={fillColor}
              strokeWidth={2}
              fill="none"
            />
            {/* 左上角 */}
            <path
              d={`M2,0 L2,4 L7,10  L50,10 L54,8  L${px + (width - px * 2) / 3},8 L${
                px + (width - px * 2) / 3
              },6 L40,6 L36,4 L18,4 L16,0 z`}
              fill={fillColor}
              stroke={fillColor}
            />
            {/* 右上角 */}
            <path
              d={`M${width - 2},0 L${width - 2},4 L${width - 7},10  L${width - 50},10 L${
                width - 54
              },8  L${px + ((width - px * 2) / 3) * 2},8 L${px + ((width - px * 2) / 3) * 2},6 L${
                width - 40
              },6 L${width - 36},4 L${width - 18},4 L${width - 16},0 z`}
              fill={fillColor}
              stroke={fillColor}
            />
          </svg>
        </Box>
      );
    }
    return null;
  });

  return (
    <Box position="relative" h="full" w="full">
      {_renderSvg()}
      <Box
        clipPath="polygon(0% 0%, 100% 0, 100% calc(100% - 11px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 11px))"
        ref={containerRef}
        bg={!width ? 'rgb(10,29,59)' : undefined}
        {...contentStyle}
        h="full"
        w="full"
      >
        <Box px={'20px'} display="flex" h="50px" alignItems="center" justifyContent="space-between">
          <Box color="#fff">{title}</Box>
          <Center justifyContent="flex-end" w="7" h="8" cursor="pointer" onClick={onClose}>
            <CloseIcon color="#fff" />
          </Center>
        </Box>
        {children ? <Box h="calc(100% - 50px)">{children}</Box> : null}

        {floatingComponent ?? null}
      </Box>
    </Box>
  );
};

export default Warp;
