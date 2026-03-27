import request from '@/config/axios'

// 预警指标配置 VO
export interface WarningIndicatorVO {
  id: number // 序号
  indicatorName: string // 预警指标名称
  indicatorType: string // 指标类型(水质/设备)
  relatedPointType: string // 关联监测点类型(水源/水厂/管网)
  dataSource: string // 数据来源(在线监测/人工检测)
}

// 预警指标配置 API
export const WarningIndicatorApi = {
  // 查询预警指标配置分页
  getWarningIndicatorPage: async (params: any) => {
    return await request.get({ url: `/waterdetection/warning-indicator/page`, params })
  },

  // 查询预警指标配置详情
  getWarningIndicator: async (id: number) => {
    return await request.get({ url: `/waterdetection/warning-indicator/get?id=` + id })
  },

  // 新增预警指标配置
  createWarningIndicator: async (data: WarningIndicatorVO) => {
    return await request.post({ url: `/waterdetection/warning-indicator/create`, data })
  },

  // 修改预警指标配置
  updateWarningIndicator: async (data: WarningIndicatorVO) => {
    return await request.put({ url: `/waterdetection/warning-indicator/update`, data })
  },

  // 删除预警指标配置
  deleteWarningIndicator: async (id: number) => {
    return await request.delete({ url: `/waterdetection/warning-indicator/delete?id=` + id })
  },

  // 导出预警指标配置 Excel
  exportWarningIndicator: async (params) => {
    return await request.download({ url: `/waterdetection/warning-indicator/export-excel`, params })
  },
}
