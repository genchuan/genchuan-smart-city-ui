import { requestClient } from '#/api/request';

// 采样频率设置 VO
export type SamplingFrequencyVO = {
  executionCycle: string; // 执行周期
  frequency: string; // 采样频率(次/月/季)
  id: number; // 序号
  indicatorName: string; // 指标名称
  pointCode: string; // 采样点编号
  specialPeriodRule: string; // 特殊时段(如汛期)调整规则
};

// 采样频率设置 API
export const SamplingFrequencyApi = {
  // 查询采样频率设置分页
  getSamplingFrequencyPage: async (params: any) => {
    return await requestClient.get(`/waterdetection/sampling-frequency/page`, {
      params,
    });
  },

  // 查询采样频率设置详情
  getSamplingFrequency: async (id: number) => {
    return await requestClient.get(`/waterdetection/sampling-frequency/get`, {
      params: { id },
    });
  },

  // 新增采样频率设置
  createSamplingFrequency: async (data: SamplingFrequencyVO) => {
    return await requestClient.post(
      `/waterdetection/sampling-frequency/create`,
      data,
    );
  },

  // 修改采样频率设置
  updateSamplingFrequency: async (data: SamplingFrequencyVO) => {
    return await requestClient.put(
      `/waterdetection/sampling-frequency/update`,
      data,
    );
  },

  // 删除采样频率设置
  deleteSamplingFrequency: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/sampling-frequency/delete`,
      { params: { id } },
    );
  },

  // 导出采样频率设置 Excel
  exportSamplingFrequency: async (params) => {
    return await requestClient.download(
      `/waterdetection/sampling-frequency/export-excel`,
      params,
    );
  },
};
