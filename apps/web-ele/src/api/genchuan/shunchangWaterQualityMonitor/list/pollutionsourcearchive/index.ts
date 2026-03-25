import { requestClient } from '#/api/request';

// 周边污染源档案管理 VO
export type PollutionSourceArchiveVO = {
  id: number; // 序号
  inspectionTime: Date; // 排查时间
  latitude: number; // 纬度
  longitude: number; // 经度
  pollutionLevel: string; // 污染程度
  pollutionNo: string; // 污染源编号
  pollutionType: string; // 污染源类型
  treatmentMeasures: string; // 治理措施
  treatmentStatus: string; // 治理状态
};

// 周边污染源档案管理 API
export const PollutionSourceArchiveApi = {
  // 查询周边污染源档案管理分页
  getPollutionSourceArchivePage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/pollution-source-archive/page`,
      { params },
    );
  },

  // 查询周边污染源档案管理详情
  getPollutionSourceArchive: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/pollution-source-archive/get`,
      { params: { id } },
    );
  },

  // 新增周边污染源档案管理
  createPollutionSourceArchive: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/pollution-source-archive/create`,
      data,
    );
  },

  // 修改周边污染源档案管理
  updatePollutionSourceArchive: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/pollution-source-archive/update`,
      data,
    );
  },

  // 删除周边污染源档案管理
  deletePollutionSourceArchive: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/pollution-source-archive/delete`,
      { params: { id } },
    );
  },

  // 导出周边污染源档案管理 Excel
  exportPollutionSourceArchive: async (params) => {
    return await requestClient.download(
      `/waterdetection/pollution-source-archive/export-excel`,
      params,
    );
  },
};
