import request from '@/config/axios'

// 供水协议管理 VO
export interface WaterSupplyAgreementVO {
  id: number // 序号
  agreementNo: string // 协议编号
  supplierName: string // 供水单位
  consumerName: string // 用水方
  supplyScope: string // 供水范围
  waterPriceStandard: string // 水价标准
  responsibilityTerms: string // 责任条款
  signDate: Date // 签订日期
  validDate: Date // 有效期至
}

// 供水协议管理 API
export const WaterSupplyAgreementApi = {
  // 查询供水协议管理分页
  getWaterSupplyAgreementPage: async (params: any) => {
    return await request.get({ url: `/waterdetection/water-supply-agreement/page`, params })
  },

  // 查询供水协议管理详情
  getWaterSupplyAgreement: async (id: number) => {
    return await request.get({ url: `/waterdetection/water-supply-agreement/get?id=` + id })
  },

  // 新增供水协议管理
  createWaterSupplyAgreement: async (data: WaterSupplyAgreementVO) => {
    return await request.post({ url: `/waterdetection/water-supply-agreement/create`, data })
  },

  // 修改供水协议管理
  updateWaterSupplyAgreement: async (data: WaterSupplyAgreementVO) => {
    return await request.put({ url: `/waterdetection/water-supply-agreement/update`, data })
  },

  // 删除供水协议管理
  deleteWaterSupplyAgreement: async (id: number) => {
    return await request.delete({ url: `/waterdetection/water-supply-agreement/delete?id=` + id })
  },

  // 导出供水协议管理 Excel
  exportWaterSupplyAgreement: async (params) => {
    return await request.download({ url: `/waterdetection/water-supply-agreement/export-excel`, params })
  },
}
