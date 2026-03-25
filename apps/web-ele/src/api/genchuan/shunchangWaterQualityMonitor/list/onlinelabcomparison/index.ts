import { requestClient } from '#/api/request';

// 在线数据与实验室比对 VO
export type OnlineLabComparisonVO = {
  comparisonDate: Date; // 比对日期
  deviationValue: number; // 偏差值
  id: number; // 序号
  instrumentType: string; // 仪器类型
  isExceeded: boolean; // 是否超标(0否1是)
  labValue: number; // 实验室检测值
  monitorPointId: string; // 监测点ID
  onlineValue: number; // 在线监测值
  warningStatus: string; // 预警状态
};

// 在线数据与实验室比对 API
export const OnlineLabComparisonApi = {
  // 查询在线数据与实验室比对分页
  getOnlineLabComparisonPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/online-lab-comparison/page`,
      { params },
    );
  },

  // 查询在线数据与实验室比对详情
  getOnlineLabComparison: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/online-lab-comparison/get`,
      { params: { id } },
    );
  },

  // 新增在线数据与实验室比对
  createOnlineLabComparison: async (data: OnlineLabComparisonVO) => {
    return await requestClient.post(
      `/waterdetection/online-lab-comparison/create`,
      data,
    );
  },

  // 修改在线数据与实验室比对
  updateOnlineLabComparison: async (data: OnlineLabComparisonVO) => {
    return await requestClient.put(
      `/waterdetection/online-lab-comparison/update`,
      data,
    );
  },

  // 删除在线数据与实验室比对
  deleteOnlineLabComparison: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/online-lab-comparison/delete`,
      { params: { id } },
    );
  },

  // 导出在线数据与实验室比对 Excel
  exportOnlineLabComparison: async (params) => {
    return await requestClient.download(
      `/waterdetection/online-lab-comparison/export-excel`,
      params,
    );
  },
};
