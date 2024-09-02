import { BackIcon, ExportIcon } from '@/components/Icons';
import { checkedAlarmIdsModel, dealAlarmModalVisibleModal, IAlarmTypeItem } from '@/models/alarm';
import { depTreeModal } from '@/models/global';
import { IArea } from '@/models/map';
import { request } from '@/utils/request';
import { useMount, useSafeState } from 'ahooks';
import { Button, DatePicker, Form, FormProps, Input, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import './AlarmQuere.css';
import { IAlarmPageState } from './page';

interface IProps {
  handleSearch: (e: IAlarmPageState) => void;
  exportFile: (isHistory: boolean) => void;
  exportLoading: boolean;
  methods: UseFormReturn<IAlarmPageState, any>;
}

interface select {
  label: string;
  value: string;
}

const AlarmQuere = ({ handleSearch, exportFile, exportLoading, methods }: IProps) => {
  const depTree = useRecoilValue(depTreeModal);
  const router = useRouter();
  const formatMessage = useTranslations('alarm');

  const checkedAlarmIds = useRecoilValue(checkedAlarmIdsModel);
  const alarmStatus = [
    { label: formatMessage('alarm-undeal'), value: '01' },
    { label: formatMessage('alarm-dealing'), value: '02' },
    { label: formatMessage('alarm-dealed'), value: '03' },
  ];
  const setDealAlarmVisible = useSetRecoilState(dealAlarmModalVisibleModal);
  const [alarmType, setAlarmType] = useSafeState<select[]>([]);
  const [areas, setAreas] = useState<select[]>([]);
  const [currentStatus, setCurrentStatus] = useState('01');

  const getAlarmTypes = () => {
    request<IAlarmTypeItem[]>({ url: '/ms-gateway/cx-alarm/alm/alarm/getAlarmType' }).then(
      (res) => {
        if (res.code === 200) {
          const newAlarmTypes = [];
          for (let i = 0; i < res.data.length; i++) {
            newAlarmTypes.push({
              label: res.data[i].alarmTypeName,
              value: res.data[i].alarmType,
            });
          }
          setAlarmType(newAlarmTypes);
        }
      }
    );
  };

  useMount(() => {
    getAreas();
    getAlarmTypes();
  });

  const getAreas = async () => {
    const res = await request<IArea[]>({
      url: '/ms-gateway/cx-alarm/dc/area/getChildren?areaId=0',
    });

    if (res.code === 200) {
      const newAreas = [];
      for (let i = 0; i < res.data.length; i++) {
        newAreas.push({
          label: res.data[i].areaName,
          value: res.data[i].areaId,
        });
      }
      setAreas(newAreas);
    }
  };

  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form
        layout={'inline'}
        style={{
          padding: '16px 24px',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="工艺位号："
          name={'searchText'}
          style={{
            marginTop: '8px',
          }}
        >
          <Input
            placeholder={
              formatMessage('alarm-place') + '、' + formatMessage('alarm-resource-processNum')
            }
            style={{
              width: '240px',
            }}
          />
        </Form.Item>

        <Form.Item
          label="报警类型："
          name={'alarmTypes'}
          style={{
            marginTop: '8px',
          }}
        >
          <Select
            style={{
              width: '240px',
            }}
            placeholder={formatMessage('alarm-type')}
            options={alarmType ? alarmType : []}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
          />
        </Form.Item>

        <Form.Item
          label="区域："
          name={'alarmAreaIds'}
          style={{
            marginTop: '8px',
          }}
        >
          <Select
            style={{
              width: '240px',
            }}
            placeholder={formatMessage('alarm-area')}
            options={areas ? areas : []}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
          />
        </Form.Item>

        <Form.Item
          label="首报时间："
          name={'alarmTimeStart'}
          style={{
            marginTop: '8px',
          }}
        >
          <DatePicker.RangePicker
            showTime
            style={{
              width: '500px',
            }}
          />
        </Form.Item>

        <Form.Item
          label="处理状态："
          name={'status'}
          style={{
            marginTop: '8px',
          }}
        >
          <Select
            defaultValue={currentStatus}
            style={{
              width: '240px',
            }}
            placeholder="请选择处理状态"
            options={alarmStatus ? alarmStatus : []}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
            onChange={(e) => {
              // console.log('999', e);
              setCurrentStatus(e);
            }}
          />
        </Form.Item>

        <Button
          className="custom-button"
          style={{
            width: '80px',
            marginTop: '8px',
            marginRight: '8px',
            borderRadius: '20px',
            backgroundColor: '#e4f0ff',
            color: '#0078ec',
            fill: '#0078ec',
            fontSize: '16px',
          }}
          icon={<ExportIcon />}
          onClick={() => {
            if (currentStatus === '03') {
              exportFile(true);
            } else {
              exportFile(false);
            }
          }}
        >
          {formatMessage('alarm-export')}
        </Button>

        <Button
          className="custom-button"
          style={{
            width: '80px',
            marginTop: '8px',
            marginRight: '8px',
            borderRadius: '20px',
            backgroundColor: '#e4f0ff',
            color: '#0078ec',
            fill: '#0078ec',
            fontSize: '16px',
          }}
          icon={<BackIcon />}
          onClick={router.back}
        >
          {formatMessage('alarm-back')}
        </Button>

        <Form.Item
          style={{
            marginTop: '8px',
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{
              fontSize: '16px',
            }}
          >
            {formatMessage('alarm-submit')}
          </Button>
        </Form.Item>

        {currentStatus === '01' && (
          <Button
            style={{
              marginTop: '8px',
              fontSize: '16px',
            }}
            type="primary"
            onClick={() => setDealAlarmVisible({ visible: true })}
            disabled={!checkedAlarmIds.length}
          >
            {formatMessage('alarm-bulk-operation')}
          </Button>
        )}
      </Form>
    </>
  );
};

export default AlarmQuere;
