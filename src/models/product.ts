import { atom } from 'recoil';

export interface productLinkType {
  enable: boolean;
  gateway: boolean;
  id: string;
  operation: boolean;
  orderCollector: boolean;
  protocol: string;
}

enum decoderType {
  'js脚本',
  'jar包',
  'groovy脚本',
}
enum deviceType {
  '直连设备',
  '设备网关',
  '设备平台',
}
export enum protocolType {
  'MODBUS-TCP',
  'MODBUS-RTU',
  'OPC-UA',
  'OPC-DA',
  'MQTT',
  'TCP-SERVER',
  'TCP-CLIENT',
  'UDP',
  'WEBSOCKET',
  'COM',
  'HTTP-CLIENT',
  'HTTP-SERVER',
}
export interface deviceInfoType {
  productId: string;
  deviceName: string;
  runLogLevel: string;
  serverId: string;
  tag: {
    [tagCode: string]: string;
  };
  connectConfig: any;
  status?: string;
  id?: string;
  arrange?: boolean;
  activate?: boolean;
}

export interface decoderVoType {
  id: string;
  jarUrl: string;
  name: string;
  remark: string;
  scriptText: string;
  type: decoderType;
}
export interface productTableType {
  classificationId: string;
  classificationVo: {
    id: string;
    name: string;
  };

  contacts: string;
  createTime: string;
  decoderVo: decoderVoType;
  deviceCount: number;
  enableHeartbeat: boolean;
  id: string;
  manufacturer: string;
  maxHeartbeatInterval: number;
  name: string;
  operationList: Array<{
    funcId: string;
    functionCode: string;
    id: string;
    productId: string;
    protocolFun: {
      protocol: string;
      [key: string]: any;
    };
    resultCode: string;
    waitForResult: boolean;
  }>;
  productNo: string;
  protocol: string;
  readInfo: {
    protocol: string;
    [key: string]: any;
  };
  remark: string;
  type: deviceType;
  version: string;
  status: number;
}

export interface products {
  classificationId: string;
  id: string;
  name: string;
  productNo: string;
}

export interface productType {
  id: string;
  name: string;
  parentId: string;
  children: Array<productType>;
  products: Array<products>;
}

export interface productTag {
  describe?: string;
  productId: string;
  id: string;
  tagCode: string;
  tagName: string;
}
export interface decoderListType {
  host: string;
  modes: boolean;
  port: number;
  serverId: string;
}

export interface funcCodeType {
  enable: boolean;
  functionCode: string;
  id: string;
  name: string;
  protocolId: string;
}
export interface funCodeTableType {
  funcName: string;
  productId: string;
  sub: boolean;
  systemRead: boolean;
  describe: string;
  id: string;
}

export interface markType {
  describe: string;
  label: string;
  optionalParameters: Array<{ label: string; value: string }>;
  paramPath: string;
  paramType: string;
  subDeviceMark: boolean;
}

export const linkListModal = atom<productLinkType[]>({
  key: 'linkList_',
  default: [],
});

export const productTypeModal = atom<productType[]>({
  key: 'productType',
  default: [],
});

export const opcDataType = atom<string[]>({
  key: 'opcDataType',
  default: [],
});

export const produceInfoModal = atom<Partial<productTableType>>({
  key: 'produceInfoModal',
  default: {},
});

export const pageLoadingModal = atom<boolean>({
  key: 'paoductPageLoading',
  default: false,
});

export const funcCodeRow = atom<funCodeTableType | null>({
  key: 'funcCodeRow_',
  default: null,
});

export const markModal = atom<markType | null>({
  key: 'markModal',
  default: null,
});
