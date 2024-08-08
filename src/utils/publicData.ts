//  公用数据定义

// 分页数据泛型接口
export interface IPageData<T> {
  current: number;
  pages: number;
  records: T[];
  searchCount: boolean;
  size: number;
  total: number;
}

export const initPageData = {
  current: 1,
  pages: 1,
  records: [],
  searchCount: false,
  size: 10,
  total: 0,
};

export const pageInitial = {
  // 当前页
  pageNum: 1,
  // 每页显示条数
  pageSize: 20,
  pageSizeModal: 10,
  pageSizeOptions: [10, 20, 30, 40, 50],
};
