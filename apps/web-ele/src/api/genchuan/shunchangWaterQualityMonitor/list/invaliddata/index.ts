import { requestClient } from '#/api/request';

// 不合格数据处理 VO
export type InvalidDataVO = {
  id: number; // 序号
  dataId: string; // 数据ID
  instrumentId: string; // 仪器ID
  monitorValue: number; // 监测值
  collectionTime: Date; // 采集时间
  dataStatus: string; // 数据状态(有效/无效)
  invalidReason: string; // 无效原因
  isExcluded: boolean; // 剔除标记(0未剔除1已剔除)
  processorId: string; // 处理人员ID
};

// 不合格数据处理 API
export const InvalidDataApi = {
  // 查询不合格数据处理分页
  getInvalidDataPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/invalid-data/page`,
      { params },
    );
  },

  // 查询不合格数据处理详情
  getInvalidData: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/invalid-data/get`,
      { params: { id } },
    );
  },

  // 新增不合格数据处理
  createInvalidData: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/invalid-data/create`,
      data,
    );
  },

  // 修改不合格数据处理
  updateInvalidData: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/invalid-data/update`,
      data,
    );
  },

  // 删除不合格数据处理
  deleteInvalidData: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/invalid-data/delete`,
      { params: { id } },
    );
  },

  // 导出不合格数据处理 Excel
  exportInvalidData: async (params) => {
    return await requestClient.download(
      `/waterdetection/invalid-data/export-excel`,
      params,
    );
  },
};
