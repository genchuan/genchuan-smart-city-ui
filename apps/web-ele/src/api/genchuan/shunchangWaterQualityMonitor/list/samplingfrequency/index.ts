import request from '@/config/axios'

// 采样频率设置 VO
export interface SamplingFrequencyVO {
  id: number // 序号
  pointCode: string // 采样点编号
  indicatorName: string // 指标名称
  frequency: string // 采样频率(次/月/季)
  executionCycle: string // 执行周期
  specialPeriodRule: string // 特殊时段(如汛期)调整规则
}

// 采样频率设置 API
export const SamplingFrequencyApi = {
  // 查询采样频率设置分页
  getSamplingFrequencyPage: async (params: any) => {
    return await request.get({ url: `/waterdetection/sampling-frequency/page`, params })
  },

  // 查询采样频率设置详情
  getSamplingFrequency: async (id: number) => {
    return await request.get({ url: `/waterdetection/sampling-frequency/get?id=` + id })
  },

  // 新增采样频率设置
  createSamplingFrequency: async (data: SamplingFrequencyVO) => {
    return await request.post({ url: `/waterdetection/sampling-frequency/create`, data })
  },

  // 修改采样频率设置
  updateSamplingFrequency: async (data: SamplingFrequencyVO) => {
    return await request.put({ url: `/waterdetection/sampling-frequency/update`, data })
  },

  // 删除采样频率设置
  deleteSamplingFrequency: async (id: number) => {
    return await request.delete({ url: `/waterdetection/sampling-frequency/delete?id=` + id })
  },

  // 导出采样频率设置 Excel
  exportSamplingFrequency: async (params) => {
    return await request.download({ url: `/waterdetection/sampling-frequency/export-excel`, params })
  },
}
