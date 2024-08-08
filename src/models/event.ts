import { Point } from '@turf/turf';

export type IEventLevel = '01' | '02' | '03' | '04' | '09';
export interface IEventItem {
  alarmContent: string;
  alarmId: string;
  areaId: string;
  alarmUserName: string;
  alarmUserPhone: string;
  areaName: string;
  geom: Point;
  id: string;
  incidentAddress: string;
  incidentCause: string;
  incidentContent: string;
  incidentDeath: string;
  incidentDisappear: string;
  incidentInjured: string;
  incidentIsbomb: string;
  incidentIscasualty: number;
  incidentIsdrill: string;
  incidentIspoison: number;
  incidentIstrapped: number;
  incidentLevel: IEventLevel;
  incidentMatter: string;
  incidentMessage: string;
  incidentName: string;
  incidentResourceName: string;
  incidentResponselevel: string;
  incidentStatus: number;
  incidentSummary: string;
  incidentTendency: string;
  incidentTime: string;
  incidentTrap: string;
  incidentType: string;
  incidentTypeName: string;
  incidentUseMeasure: string;
  orgName: string;
}
