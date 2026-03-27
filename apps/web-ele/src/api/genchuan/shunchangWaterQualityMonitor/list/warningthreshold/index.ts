import request from '@/config/axios'

// 预警阈值管理 VO
export interface WarningThresholdVO {
  id: number // 序号
  indicatorName: string // 指标名称
  thresholdType: string // 阈值类型(上限/下限)
  thresholdValue: number // 阈值数值
  unit: string // 单位
  applicableScene: string // 适用场景(如管网末梢)
  effectiveTime: Date // 生效时间
}

// 预警阈值管理 API
export const WarningThresholdApi = {
  // 查询预警阈值管理分页
  getWarningThresholdPage: async (params: any) => {
    return await request.get({ url: `/waterdetection/warning-threshold/page`, params })
  },

  // 查询预警阈值管理详情
  getWarningThreshold: async (id: number) => {
    return await request.get({ url: `/waterdetection/warning-threshold/get?id=` + id })
  },

  // 新增预警阈值管理
  createWarningThreshold: async (data: WarningThresholdVO) => {
    return await request.post({ url: `/waterdetection/warning-threshold/create`, data })
  },

  // 修改预警阈值管理
  updateWarningThreshold: async (data: WarningThresholdVO) => {
    return await request.put({ url: `/waterdetection/warning-threshold/update`, data })
  },

  // 删除预警阈值管理
  deleteWarningThreshold: async (id: number) => {
    return await request.delete({ url: `/waterdetection/warning-threshold/delete?id=` + id })
  },

  // 导出预警阈值管理 Excel
  exportWarningThreshold: async (params) => {
    return await request.download({ url: `/waterdetection/warning-threshold/export-excel`, params })
  },
}
