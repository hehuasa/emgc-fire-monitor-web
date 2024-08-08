import { Box } from '@chakra-ui/react';
import { useSize } from 'ahooks';
import { useRef } from 'react';

interface Props {
  children: JSX.Element;

  fold: boolean;
}

const Warp = ({ children, fold }: Props) => {
  const tap = 10;

  const warpRef = useRef<HTMLDivElement | null>(null);
  const height = useSize(warpRef)?.height;

  const width = useSize(warpRef)?.width;
  return (
    <Box ref={warpRef} height={fold ? '43px' : 'full'} color="#fff" zIndex={1} p="0px 0px 10px 0px">
      {children}
      {height ? (
        <svg
          width={width + 'px'}
          height={height + 'px'}
          style={{ position: 'absolute', left: 0, top: 0, zIndex: -1 }}
        >
          <filter id="insetShadowContainerWarp" x="-50%" y="-50%" width="200%" height="200%">
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
          {/* 右上角 */}
          <path
            d={`M${(width / 3) * 2 + tap + 2},2 L${width - 2},2 L${width - 2},6 L${
              (width / 3) * 2 + tap + 6
            },6 z`}
            stroke="#095EE5"
            fill="#095EE5"
          />

          {!fold ? (
            <>
              <path
                d={`M2,2  L${(width / 3) * 2},2 L${(width / 3) * 2 + tap},${tap} L${
                  width - 2
                },${tap} L${width - 2},${height - 2} L${width / 3},${height - 2} 
          L${width / 3 - tap},${height - tap} L2,${height - tap} z`}
                stroke="rgb(9, 94, 229)"
                fill="rgba(8, 19, 52, 0.95)"
                filter="url(#insetShadowContainerWarp)"
                strokeWidth={2}
              />
              <path
                d={`M2,2  L${(width / 3) * 2},2 L${(width / 3) * 2 + tap},${tap} L${
                  width - 2
                },${tap} L${width - 2},${43} L${2},${43} z`}
                fill="rgba(25, 50, 135, 1)"
                strokeWidth={2}
              />
              {/* header 上 */}
              <path
                d={`M2,2  L${(width / 3) * 2},2 L${(width / 3) * 2 + tap},${tap} L${
                  width - 2
                } ,${tap} L${width - 2}`}
                fill="none"
                stroke="rgb(9, 94, 229)"
                strokeWidth={2}
              />

              {/* header 左 */}
              <path d={`M2,2  L${2},${43}`} fill="none" stroke="rgb(9, 94, 229)" strokeWidth={2} />
              {/* header 右 */}
              <path
                d={`M${width - 2},${tap}  L${width - 2},${43}`}
                fill="none"
                stroke="rgb(9, 94, 229)"
                strokeWidth={2}
              />

              {/* 左下角 */}
              <path
                d={`M2,${height - 2} L${width / 3 - tap - 2},${height - 2} L${
                  width / 3 - tap - 6
                },${height - 6} L2,${height - 6} z`}
                stroke="#095EE5"
                fill="#095EE5"
              />
            </>
          ) : (
            <>
              <path
                d={`M2,2  L${(width / 3) * 2},2 L${(width / 3) * 2 + tap},${tap} L${
                  width - 2
                },${tap} L${width - 2},${42} L${2},${42} z`}
                fill="rgba(25, 50, 135, 1)"
                strokeWidth={2}
                stroke="rgb(9, 94, 229)"
              />
            </>
          )}
        </svg>
      ) : null}
    </Box>
  );

  return (
    <Box w={width + 'px'} h={height + 'px'}>
      <Box h="full" color="#fff" zIndex={1} p="0px 0px 10px 0px">
        {children}
      </Box>
    </Box>
  );
};

export default Warp;
