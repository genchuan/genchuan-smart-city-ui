import request from '@/config/axios'

// 用水性质分类管理 VO
export interface WaterUseCategoryVO {
  id: number // 序号
  userCode: string // 用户编号
  waterUseType: string // 用水性质
  waterQuota: number // 用水定额(立方米)
  categoryDate: Date // 分类日期
}

// 用水性质分类管理 API
export const WaterUseCategoryApi = {
  // 查询用水性质分类管理分页
  getWaterUseCategoryPage: async (params: any) => {
    return await request.get({ url: `/waterdetection/water-use-category/page`, params })
  },

  // 查询用水性质分类管理详情
  getWaterUseCategory: async (id: number) => {
    return await request.get({ url: `/waterdetection/water-use-category/get?id=` + id })
  },

  // 新增用水性质分类管理
  createWaterUseCategory: async (data: WaterUseCategoryVO) => {
    return await request.post({ url: `/waterdetection/water-use-category/create`, data })
  },

  // 修改用水性质分类管理
  updateWaterUseCategory: async (data: WaterUseCategoryVO) => {
    return await request.put({ url: `/waterdetection/water-use-category/update`, data })
  },

  // 删除用水性质分类管理
  deleteWaterUseCategory: async (id: number) => {
    return await request.delete({ url: `/waterdetection/water-use-category/delete?id=` + id })
  },

  // 导出用水性质分类管理 Excel
  exportWaterUseCategory: async (params) => {
    return await request.download({ url: `/waterdetection/water-use-category/export-excel`, params })
  },
}
