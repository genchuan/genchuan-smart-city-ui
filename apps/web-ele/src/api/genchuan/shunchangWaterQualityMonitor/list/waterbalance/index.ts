import request from '@/config/axios'

// 水量平衡与漏损分析 VO
export interface WaterBalanceVO {
  id: number // 序号
  partitionId: string // 分区ID
  statisticsPeriod: string // 统计周期(日/月/年)
  statisticsDate: Date // 统计日期
  supplyVolume: number // 供水量(立方米)
  salesVolume: number // 售水量(立方米)
  reasonableLoss: number // 合理损耗量(立方米)
  leakageVolume: number // 漏损量(立方米)
  leakageRate: number // 漏损率(%)
  isExceeded: boolean // 是否超标(0否1是)
}

// 水量平衡与漏损分析 API
export const WaterBalanceApi = {
  // 查询水量平衡与漏损分析分页
  getWaterBalancePage: async (params: any) => {
    return await request.get({ url: `/waterdetection/water-balance/page`, params })
  },

  // 查询水量平衡与漏损分析详情
  getWaterBalance: async (id: number) => {
    return await request.get({ url: `/waterdetection/water-balance/get?id=` + id })
  },

  // 新增水量平衡与漏损分析
  createWaterBalance: async (data: WaterBalanceVO) => {
    return await request.post({ url: `/waterdetection/water-balance/create`, data })
  },

  // 修改水量平衡与漏损分析
  updateWaterBalance: async (data: WaterBalanceVO) => {
    return await request.put({ url: `/waterdetection/water-balance/update`, data })
  },

  // 删除水量平衡与漏损分析
  deleteWaterBalance: async (id: number) => {
    return await request.delete({ url: `/waterdetection/water-balance/delete?id=` + id })
  },

  // 导出水量平衡与漏损分析 Excel
  exportWaterBalance: async (params) => {
    return await request.download({ url: `/waterdetection/water-balance/export-excel`, params })
  },
}
