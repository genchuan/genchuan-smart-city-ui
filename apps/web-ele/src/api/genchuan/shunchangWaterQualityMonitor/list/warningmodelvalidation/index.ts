import request from '@/config/axios'

// 预警模型校验 VO
export interface WarningModelValidationVO {
  id: number // 序号
  modelName: string // 模型名称
  validationPeriod: string // 校验时间段
  warningCount: number // 预警次数
  accurateWarningCount: number // 准确预警次数
  falseAlarmCount: number // 误报次数
  accuracyRate: number // 准确率(%)
  adjustmentSuggestion: string // 调整建议
}

// 预警模型校验 API
export const WarningModelValidationApi = {
  // 查询预警模型校验分页
  getWarningModelValidationPage: async (params: any) => {
    return await request.get({ url: `/waterdetection/warning-model-validation/page`, params })
  },

  // 查询预警模型校验详情
  getWarningModelValidation: async (id: number) => {
    return await request.get({ url: `/waterdetection/warning-model-validation/get?id=` + id })
  },

  // 新增预警模型校验
  createWarningModelValidation: async (data: WarningModelValidationVO) => {
    return await request.post({ url: `/waterdetection/warning-model-validation/create`, data })
  },

  // 修改预警模型校验
  updateWarningModelValidation: async (data: WarningModelValidationVO) => {
    return await request.put({ url: `/waterdetection/warning-model-validation/update`, data })
  },

  // 删除预警模型校验
  deleteWarningModelValidation: async (id: number) => {
    return await request.delete({ url: `/waterdetection/warning-model-validation/delete?id=` + id })
  },

  // 导出预警模型校验 Excel
  exportWarningModelValidation: async (params) => {
    return await request.download({ url: `/waterdetection/warning-model-validation/export-excel`, params })
  },
}
