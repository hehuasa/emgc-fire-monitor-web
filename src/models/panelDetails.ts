export interface CapacityHistory {
  date: string;
  name: string;
  yield: number;
  compareLastDay: number;
}

export interface CapacityHisResData {
  current: number;
  size: number;
  records: CapacityHistory[];
  total: number;
}
