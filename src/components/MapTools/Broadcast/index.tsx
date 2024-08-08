import { Modal, ModalContent, ModalOverlay, ModalBody } from '@chakra-ui/react';
import { broadcastVisibleModel } from '@/models/map';
import { useRecoilState } from 'recoil';
import { useMemoizedFn } from 'ahooks';
import Content from './Content';

interface Props {
  theme?: 'deep' | 'shallow';
  onCloseFn?: () => void;
}

const Broadcast = ({ theme = 'shallow', onCloseFn }: Props) => {
  const [visible, setVisible] = useRecoilState(broadcastVisibleModel);
  const onClose = useMemoizedFn(() => {
    setVisible(false);
    onCloseFn?.();
  });
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="1400px" borderRadius="10px" bg="transparent" boxShadow="none">
        <ModalBody borderRadius="10px" p="0" bg={theme === 'shallow' ? 'pri.white.100' : ''}>
          <Content onClose={onClose} theme={theme} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Broadcast;
