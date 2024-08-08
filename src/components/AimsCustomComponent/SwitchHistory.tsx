import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const AimsRender = dynamic(() => import('@/components/AimsRender'), { ssr: false });

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SwitchHistory = ({ isOpen, onClose }: Props) => {
  const { isOpen: deviceIsOpen, onOpen: deviceOnOpen, onClose: deviceOnClose } = useDisclosure();

  const json = {
    type: 'page',
    id: 'u:8602ac8fe24f',
    asideResizor: false,
    pullRefresh: {
      disabled: true,
    },
    regions: ['body'],
    body: [
      {
        type: 'crud',
        syncLocation: false,
        api: {
          method: 'get',
          url: '/cx-alarm/alm/turnoff/page/log',
          requestAdaptor: '',
          adaptor: '',
          messages: {},
          dataType: 'form',
        },
        columns: [
          {
            type: 'tpl',
            id: 'u:e95915368d2f',
            label: '序号',
            tpl: '${index + 1}',
          },
          {
            type: 'text',
            label: '设备名称',
            name: 'resourceName',
            id: 'u:78cd5b939b56',
          },
          {
            name: 'operational',
            label: '开关状态',
            type: 'mapping',
            id: 'u:321f1a79a6c9',
            map: {
              '1': '开启',
              '2': '关闭',
            },
          },
          {
            type: 'mapping',
            label: '操作模式',
            name: 'operMode',
            id: 'u:cd11518aa6c5',
            map: {
              '1': '手动',
              '2': '定时',
            },
          },
          {
            type: 'text',
            name: 'handTime',
            label: '操作时间',
            id: 'u:2040fc4b556a',
          },
          {
            name: 'handlerName',
            label: '操作人',
            type: 'text',
            id: 'u:e9eeec53888d',
          },
        ],
        bulkActions: [],
        itemActions: [],
        id: 'u:e9b44a3f7838',
        title: '设备点位开关历史数据',
        perPageAvailable: [10],
        messages: {},
        perPageField: 'size',
        keepItemSelectionOnPageChange: false,
        defaultParams: {
          current: '1',
          size: '10',
        },
        pageField: 'current',
      },
    ],
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay></ModalOverlay>
      <ModalContent w="80%" maxW={'unset'} padding="0px 20px 0px 0px">
        <ModalCloseButton></ModalCloseButton>
        <ModalBody>
          <AimsRender jsonView={json} />;
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SwitchHistory;
