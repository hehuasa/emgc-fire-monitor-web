import { motion, isValidMotionProp, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { chakra, shouldForwardProp, Box } from '@chakra-ui/react';
import { useSafeState } from 'ahooks';

const ChakraBox = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

interface Props {
  children: React.ReactNode;
  show: boolean;
  duration?: number;
}

const Collapse = (props: Props) => {
  const { children, show, duration = 0.2 } = props;
  const controls = useAnimation();
  const domRef = useRef<HTMLDivElement>(null);
  const [containerH, setContainerH] = useSafeState<number | string>(0);

  useEffect(() => {
    const h = domRef.current?.clientHeight || 0;
    if (show) {
      setContainerH(h);
      controls.set({ overflow: 'hidden' });
      controls
        .start({
          height: h,
          transition: { duration: duration },
        })
        .then(() => {
          controls.set({ height: 'auto', overflow: '' });
        });
    } else {
      controls.set({ overflow: 'hidden' });
      controls
        .start({
          height: 0,
          transition: { duration: duration },
        })
        .then(() => {
          controls.set({ height: 0, overflow: '' });
          setContainerH(0);
        });
    }
  }, [show]);

  return (
    <ChakraBox
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      animate={controls}
      //overflow={'hidden'}
      h={0}
      id="animated"
      w="full"
    >
      {show || containerH ? <Box ref={domRef}>{children}</Box> : null}
    </ChakraBox>
  );
};

export default Collapse;
