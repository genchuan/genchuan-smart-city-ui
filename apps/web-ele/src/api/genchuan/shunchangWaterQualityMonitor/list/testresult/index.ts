import request from '@/config/axios'

// 检测结果录入 VO
export interface TestResultVO {
  id: number // 序号
  sampleCode: string // 样本编号
  testIndicator: string // 检测指标
  testValue: number // 检测值
  unit: string // 单位
  testMethod: string // 检测方法
  testOperator: string // 检测人员
  testTime: Date // 检测时间
  equipmentCode: string // 设备编号
}

// 检测结果录入 API
export const TestResultApi = {
  // 查询检测结果录入分页
  getTestResultPage: async (params: any) => {
    return await request.get({ url: `/waterdetection/test-result/page`, params })
  },

  // 查询检测结果录入详情
  getTestResult: async (id: number) => {
    return await request.get({ url: `/waterdetection/test-result/get?id=` + id })
  },

  // 新增检测结果录入
  createTestResult: async (data: TestResultVO) => {
    return await request.post({ url: `/waterdetection/test-result/create`, data })
  },

  // 修改检测结果录入
  updateTestResult: async (data: TestResultVO) => {
    return await request.put({ url: `/waterdetection/test-result/update`, data })
  },

  // 删除检测结果录入
  deleteTestResult: async (id: number) => {
    return await request.delete({ url: `/waterdetection/test-result/delete?id=` + id })
  },

  // 导出检测结果录入 Excel
  exportTestResult: async (params) => {
    return await request.download({ url: `/waterdetection/test-result/export-excel`, params })
  },
}
