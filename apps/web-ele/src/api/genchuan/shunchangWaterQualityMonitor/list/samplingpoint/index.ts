import { requestClient } from '#/api/request';

// 采样点规划 VO
export type SamplingPointVO = {
  id: number; // 序号
  pointCode: string; // 采样点编号
  longitude: number; // 经度
  latitude: number; // 纬度
  pointType: string; // 类型(水源/水厂/管网/末梢)
  coveredPopulation: number; // 覆盖人口
  surroundingDesc: string; // 周边环境描述
  planningBasis: string; // 规划依据
};

// 采样点规划 API
export const SamplingPointApi = {
  // 查询采样点规划分页
  getSamplingPointPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/sampling-point/page`,
      { params },
    );
  },

  // 查询采样点规划详情
  getSamplingPoint: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/sampling-point/get`,
      { params: { id } },
    );
  },

  // 新增采样点规划
  createSamplingPoint: async (data: SamplingPointVO) => {
    return await requestClient.post(
      `/waterdetection/sampling-point/create`,
      data,
    );
  },

  // 修改采样点规划
  updateSamplingPoint: async (data: SamplingPointVO) => {
    return await requestClient.put(
      `/waterdetection/sampling-point/update`,
      data,
    );
  },

  // 删除采样点规划
  deleteSamplingPoint: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/sampling-point/delete`,
      { params: { id } },
    );
  },

  // 导出采样点规划 Excel
  exportSamplingPoint: async (params) => {
    return await requestClient.download(
      `/waterdetection/sampling-point/export-excel`,
      params,
    );
  },
};
