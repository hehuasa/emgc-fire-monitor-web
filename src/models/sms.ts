import { ITreeItem } from '@/components/customTreeNode';
import { atom } from 'recoil';

export interface IResItem {
	resourceName: string;
	resourceNo: string;
	iotDeviceId: string;
	iotSubDeviceId: string;
	id: string;
	areaId: string;
	cellId: string;
	deptId: string;
}

export interface deviceType {
	address: string;
	areaId: string;
	areaName: string;
	cellId: string;
	cellName: string;
	createTime: string;
	deptId: string;
	deptName: string;
	equipmentId: string;
	floorLevel: string;
	geoType: string;
	id: string;
	iotDeviceId: string;
	iotSubDeviceId: string;
	lastUpdateTime: string;
	resourceName: string;
	resourceNo: string;
}

export interface postiType {
	address: string;
	onDuty: boolean;
	orgId: string;
	orgName: string;
	positionId: string[];
	positionName: string[];
	sex: string;
	userCode: string;
	userId: string;
	userName: string;
}

export interface switchType {
	deviceId: string;
	deviceNumber: string;
	enable: boolean;
	installationId: string;
	installationName: string;
	orgId: string;
	orgName: string;
	productionUnitId: string;
	productionUnitName: string;
	resourceId: string;
	resourceNo: string;
	status: number;
	subDeviceCode: string;
}

export interface recordTableType {
	address: string;
	alarmAreaId: string;
	alarmAreaName: string;
	alarmFirstTime: string;
	alarmFrequency: string;
	alarmId: string;
	alarmLastTime: string;
	alarmLevel: string;
	firstAlarm: boolean;
	alarmLevelName: string;
	alarmLevelRefer: string;
	alarmNo: string;
	alarmType: string;
	alarmTypeName: string;
	alarmUserId: string;
	alarmUserName: string;
	alarmWay: string;
	alarmWayView: string;
	almAlarmDeals: {
		dealResult: string;
		dealResultView: string;
		dealTime: string;
		dealUserName: string;
		dealWayView: string;
	};
	coordinate: object;
	deptId: string;
	deptName: string;
	devName: string;
	durationTime: string;
	hasMergeAlarm: number;
	iotAlarmId: string;
	iotDeviceId: string;
	iotSubDeviceId: string;
	linkPhone: string;
	msgSendCount: number;
	resourceId: string;
	resourceNo: string;
	responseDateTime: string;
	responseDuration: number;
	responseUserId: string;
	responseUserName: string;
	sendMsg: {
		errorMsg: string;
		msgBody: string;
		planSendDateTime: string;
		sendDateTime: string;
		status: number;
		msgLevel: string;
		msgType: number;
		userInfos: {
			userName: string;
			id: string;
		}[];
	}[];
	status: string;
	statusView: string;
	supplement: string;
}

export interface lockDeviceVoType {
	deviceId: string;
	interlockDeviceId: string;
	resourceNo: string;
	subDeviceCode: string;
	triggerAlarmLevel: Array<string>;
}

export interface lockGroupVoType {
	interlockDeviceVos: Array<lockDeviceVoType>;
	interlockGroupId: string;
	interlockGroupName: string;
	triggerCount: number;
	triggerInterlockGroupVo: Array<lockGroupVoType>;
}

export interface chainTableDataType {
	alarmModuleCode: string;
	alarmMsgBody: string;
	alarmSystemCode: string;
	alarmUserIds: string[];
	deviceId: string;
	interlockEventId: string;
	interlockEventName: string;
	resourceNo: string;
	restoreModuleCode: string;
	restoreMsgBody: string;
	restoreSystemCode: string;
	restoreUserIds: string[];
	subDeviceCode: string;
	interlockGroupVos: Array<lockGroupVoType>;
}

export interface interlockDeviceVosDetails extends lockDeviceVoType {
	alarmLevel: string;
	alarmValue: number;
	endDateTime: string;
	limitValue: string;
	overrunSign: -1 | 1;
	resourceName: string;
	startDateTime: string;
}

export interface interlockEventTableDetails {
	interlockDeviceVos: Array<interlockDeviceVosDetails>;
	interlockGroupId: string;
	interlockGroupName: string;
	triggerCount: number;
	triggerInterlockGroupVo: Array<interlockEventTableDetails>;
}
export interface interlockEventDetails {
	interlockEventName: string;
	interlockGroupBos: Array<interlockEventTableDetails>;
	resourceNo: string;
}

// 关键设备
export interface interLockDeviceType {
	address: string;
	areaId: string;
	areaName: string;
	cellId: string;
	coordinate: object;
	deptId: string;
	deptName: string;
	equipmentId: string;
	id: string;
	iotDeviceId: string;
	iotSubDeviceId: string;
	layerId: string;
	layerName: string;
	productId: string;
	resourceName: string;
	resourceNo: string;
}

// 联锁报警记录
export interface interlockEventRecord {
	areaName: string;
	endDateTime: string;
	eventRecordId: string;
	firstLinkId: string;
	interlockEventId: string;
	interlockEventName: string;
	linkIds: string[];
	orgName: string;
	resourceNo: string;
	status: 0 | 1;
	triggerDateTime: string;
}

export interface historyTableType {
	address: string;
	alarmId: string;
	alarmLevel: string;
	alarmLevelRefer: string;
	alarmValue: number;
	areaCellId: string;
	areaCellName: string;
	areaId: string;
	areaName: string;
	durationTime: number;
	endDateTime: string;
	equipmentId: string;
	iotAlarmId: string;
	lowerLimit: number;
	major: string;
	maxValue: number;
	maxValueDateTime: string;
	orgId: string;
	orgName: string;
	overrunSign: number;
	priority: string;
	responseDateTime: string;
	responseDuration: number;
	startDateTime: string;
	unit: string;
	upLimit: number;
	resourceName: string;
	resourceNo: string;
}

export interface kpiTableType {
	alarmCountOfHold24Hours: number | string;
	alarmCountOfHoursAvg: number | string;
	dealOver10MinutesAlarmsCount: number | string;
	alarmConfirmationTimelinessRate: number | string;
	alarmHandlingTimelinessRate: number | string;
	areaName: string;
	duplicateAlarmsCount: number | string;
	highFrequencyRatio: number | string;
	orgName: string;
	id: string;
}

export interface breakDownTableType {
	address: string;
	alarmId: string;
	alarmLevel: string;
	alarmLevelRefer: string;
	approveBy: string;
	approveByName: string;
	areaId: string;
	areaName: string;
	responseUserName: string;
	cellId: string;
	cellName: string;
	createDate: string;
	equipmentId: string;
	orgId: string;
	orgName: string;
	plannedMaintenanceTime: string;
	priority: string;
	resourceName: string;
	resourceNo: string;
	approveRemark: string;
	status: 0 | 1 | 2 | 3;
	troubleshootingId: string;
	troubleshootingNumber: string;
	troubleshootingPromoter: string;
	troubleshootingPromoterName: string;
}

export interface singleAlarmMonitor {
	thresholdStart: number;
	thresholdEnd: number;
	thresholdLevel: string;
	thresholdProperty: string;
}
export interface singleAlarmItem {
	address: string;
	areaName: string;
	cellName: string;
	equipmentId: string;
	id: string;
	iotDeviceId: string;
	iotSubDeviceId: string;
	orgName: string;
	resourceId: string;
	resourceName: string;
	resourceNo: string;
	type: number;
	monitor: Array<singleAlarmMonitor>;
}

export const allDeviceListModel = atom<deviceType[]>({
	key: 'allDeviceList_',
	default: [],
});

export const deviceListModel = atom<IResItem[]>({
	key: 'deviceList_',
	default: [],
});

export const selectDeviceIdsModel = atom<string[]>({
	key: 'deviceIdList_',
	default: [],
});

export const filterDeviceModal = atom<IResItem[]>({
	key: 'filterDeviceModal_',
	default: [],
});

export const posChangeListModal = atom<string[]>({
	key: 'posChangeList_',
	default: [],
});

export const posTableDataModal = atom<postiType[]>({
	key: 'posTableData_',
	default: [],
});

export const switchChangeModal = atom<string[]>({
	key: 'switchChange_',
	default: [],
});

export const switchTableDataModal = atom<switchType[]>({
	key: 'switchTableData_',
	default: [],
});

export const companyUserModal = atom<ITreeItem[]>({
	key: 'companyUserModal_',
	default: [],
});

export const groupUserModal = atom<Map<string, ITreeItem[]>>({
	key: 'groupUserModal_',
	default: new Map(),
});

export const historyTableModal = atom<historyTableType[]>({
	key: 'historyTableModal_',
	default: [],
});

export const selectHistoryTableDataModal = atom<string[]>({
	key: 'selectHistoryTableDataModal_',
	default: [],
});

export const interLockEditModal = atom<boolean>({
	key: 'interLockEditModal_',
	default: false,
});

export const interLockTableDataModal = atom<chainTableDataType[]>({
	key: 'interLockTableDataModal_',
	default: [],
});

export const interLockRowDataModal = atom<chainTableDataType | null>({
	key: 'interLockRowDataModal_',
	default: null,
});

export const interLockRecordTableDataModal = atom<interlockEventRecord[]>({
	key: 'interLockRecordTableDataModal_',
	default: [],
});
export const breakDownTableModal = atom<breakDownTableType[]>({
	key: 'breakDownTableModal_',
	default: [],
});
export const checkBreakDownTableIdsModal = atom<string[]>({
	key: 'checkBreakDownTableIdsModal_',
	default: [],
});
