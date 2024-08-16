import CustomSelect from '@/components/CustomSelect';
import { BackIcon, ExportIcon } from '@/components/Icons';
import { checkedAlarmIdsModel, dealAlarmModalVisibleModal, IAlarmTypeItem } from '@/models/alarm';
import { depTreeModal } from '@/models/global';
import { IArea } from '@/models/map';
import { request } from '@/utils/request';
import { Button, Flex, FormLabel, Input } from '@chakra-ui/react';
import { useMount, useSafeState } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import SmoothScrollbar from 'smooth-scrollbar';
import { IAlarmPageState } from './page';

interface IProps {
  handleSearch: (e: IAlarmPageState) => void;
  exportFile: (isHistory: boolean) => void;
  exportLoading: boolean;
  methods: UseFormReturn<IAlarmPageState, any>;
}
const AlarmQuere = ({ handleSearch, exportFile, exportLoading, methods }: IProps) => {
  const depTree = useRecoilValue(depTreeModal);
  const router = useRouter();
  const { formatMessage } = useIntl();
  const checkedAlarmIds = useRecoilValue(checkedAlarmIdsModel);
  const alarmStatus = [
    { id: '01', name: formatMessage({ id: 'alarm.undeal' }) },
    { id: '02', name: formatMessage({ id: 'alarm.dealing' }) },
    { id: '03', name: formatMessage({ id: 'alarm.dealed' }) },
  ];
  const setDealAlarmVisible = useSetRecoilState(dealAlarmModalVisibleModal);
  const domWarp = useRef<HTMLDivElement | null>(null);
  const scrollbar = useRef<SmoothScrollbar | null>(null);
  const [alarmType, setAlarmType] = useSafeState<IAlarmTypeItem[]>([]);
  const [areas, setAreas] = useState<IArea[]>([]);

  // const methods = useForm<IAlarmPageState>({
  //   defaultValues: {
  //     status: '01',
  //   },
  // });
  const { register, handleSubmit, getValues } = methods;
  const getAlarmTypes = () => {
    request<IAlarmTypeItem[]>({ url: '/ms-gateway/cx-alarm/alm/alarm/getAlarmType' }).then((res) => {
      if (res.code === 200) {
        setAlarmType(res.data);
      }
    });
  };

  useMount(() => {
    getAreas();
    getAlarmTypes();
  });

  const getAreas = async () => {
    const res = await request<IArea[]>({ url: '/ms-gateway/cx-alarm/dc/area/getChildren?areaId=0' });
    if (domWarp.current) {
      scrollbar.current = SmoothScrollbar.init(domWarp.current);
    }

    if (res.code === 200) {
      setAreas(res.data);
    }
  };

  return (
    <FormProvider {...methods}>
      <Flex px="6" py="4" flexWrap="wrap">
        <Flex alignItems="center" mr={4} mt={2}>
          <FormLabel mb={0} mr={0} display="flex" w="90px">
            工艺位号:
          </FormLabel>

          <Input
            width="240px"
            pr="7"
            placeholder={
              formatMessage({ id: 'alarm.place' }) +
              '、' +
              formatMessage({ id: 'resource.processNum' })
            }
            borderColor="pri.gray.200"
            {...register('searchText')}
          />
        </Flex>

        {/* <Flex alignItems="center" mr={4} mt={2}>
          <FormLabel mb={0} mr={0} display="flex" w="90px">
            部门:
          </FormLabel>

          <TreeSelect
            placeholder="请选择部门"
            data={depTree}
            {...register('orgId')}
            w="240px"
            ref={undefined}
            allNodeCanSelect
          />
        </Flex> */}

        <Flex alignItems="center" mr={4} mt={2}>
          <FormLabel mb={0} mr={0} display="flex" w="90px">
            报警类型:
          </FormLabel>

          <CustomSelect
            placeholder="请选择事件类型"
            flex={1}
            _hover={{}}
            {...register('alarmTypes')}
            mr={1}
            w="240px"
          >
            {alarmType.map((item) => (
              <option value={item.alarmType} key={item.alarmType}>
                {item.alarmTypeName}
              </option>
            ))}
          </CustomSelect>
        </Flex>

        <Flex alignItems="center" mr={4} mt={2}>
          <FormLabel mb={0} mr={0} display="flex" w="90px">
            区域:
          </FormLabel>

          <CustomSelect
            placeholder="请选择区域"
            flex={1}
            _hover={{}}
            {...register('alarmAreaIds')}
            mr={1}
            w="240px"
          >
            {areas.map((item) => (
              <option value={item.areaId} key={item.areaId}>
                {item.areaName}
              </option>
            ))}
          </CustomSelect>
        </Flex>



        <Flex alignItems="center" mr={4} mt={2}>
          <FormLabel mb={0} mr={0} display="flex" w="90px">
            首报时间:
          </FormLabel>

          <Input
            w="240px"
            pr="7"
            placeholder={'请选择首报时间'}
            {...register('alarmTimeStart')}
            type="datetime-local"
            step="01"
          />
        </Flex>
        <Flex alignItems="center" mr={4} mt={2}>
          <FormLabel mb={0} mr={0} display="flex">
            -
          </FormLabel>

          <Input
            w="240px"
            pr="7"
            ml="4"
            placeholder={'请选择首报时间'}
            {...register('alarmTimeEnd')}
            type="datetime-local"
            step="01"
          />
        </Flex>

        <Flex alignItems="center" mr={4} mt={2}>
          <FormLabel mb={0} mr={0} display="flex" w="90px">
            处理状态:
          </FormLabel>

          <CustomSelect
            flex={1}
            placeholder="请选择处理状态"
            _hover={{}}
            {...register('status')}
            mr={1}
            w="240px"
          >
            {alarmStatus.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </CustomSelect>
        </Flex>

        <Button
          mt={2}
          w="20"
          h="10"
          borderRadius="20px"
          bg="pri.blue.400"
          color="pri.blue.100"
          fill="pri.blue.100"
          fontWeight="normal"
          _hover={{ color: 'pri.white.100', bg: 'pri.blue.100', fill: 'pri.white.100' }}
          leftIcon={<ExportIcon />}
          onClick={() => {
            const status = getValues('status');
            if (status === '03') {
              exportFile(true);
            } else {
              exportFile(false);
            }
          }}
          isLoading={exportLoading}
          mr={2}
        >
          {formatMessage({ id: 'export' })}
        </Button>

        <Button
          w="25"
          mt={2}
          h="10"
          borderRadius="20px"
          bg="pri.white.400"
          color="pri.dark.500"
          borderWidth="1px"
          borderColor="pri.gray.100"
          fill="pri.dark.500"
          fontWeight="normal"
          _hover={{ color: 'pri.blue.100', fill: 'pri.blue.100' }}
          leftIcon={<BackIcon />}
          onClick={router.back}
          mr={2}
        >
          {formatMessage({ id: 'back' })}
        </Button>

        <Button mr={2} mt={2} colorScheme={'blue'} onClick={handleSubmit(handleSearch)}>
          查询
        </Button>
        {getValues('status') === '01' && (
          <Button
            onClick={() => setDealAlarmVisible({ visible: true })}
            isDisabled={!checkedAlarmIds.length}
            mt={2}
            colorScheme={'blue'}
          >
            批量处理
          </Button>
        )}
      </Flex>
    </FormProvider>
  );
};

export default AlarmQuere;
