export interface operation {
  unitName: string;
  operationContent: string;
  operationArea: string;
  constructionUnit: string;
  operationType: string;
  operationStartTime: string;
  operationEndTime: string;
  riskLevel: string;
  guardianContractor: string;
  guardianOwnerunit: string;
  approvedContractor: string;
  approvedOwnerunit: string;
  onSiteResponsiblePerson: string;
  supervisor: string;
  thirdParty: string;
  onSiteResponsible: string;
  remoteMonitoring: string;
  responsibleLeadership: string;
  remarks: string;
}

export interface alarmDetail {
  alarmNo: string;
  alarmTypeName: string;
  alarmLevel: string;
  resourceNo: string;
  address: string;
  alarmFirstTime: string;
  alarmLastTime: string;
  alarmStatus: string;
  dealResultView: string;
  dealUserName: string;
  dealTime: string;
}
