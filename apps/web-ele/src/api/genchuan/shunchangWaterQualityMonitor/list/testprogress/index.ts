import request from '@/config/axios'

// 检测进度跟踪 VO
export interface TestProgressVO {
  id: number // 序号
  taskCode: string // 任务编号
  progressPercent: number // 当前进度(%)
  completedIndicators: string // 已完成指标
  pendingIndicators: string // 未完成指标
  estimatedCompletion: Date // 预计完成时间
  delayReason: string // 延迟原因(如有)
}

// 检测进度跟踪 API
export const TestProgressApi = {
  // 查询检测进度跟踪分页
  getTestProgressPage: async (params: any) => {
    return await request.get({ url: `/waterdetection/test-progress/page`, params })
  },

  // 查询检测进度跟踪详情
  getTestProgress: async (id: number) => {
    return await request.get({ url: `/waterdetection/test-progress/get?id=` + id })
  },

  // 新增检测进度跟踪
  createTestProgress: async (data: TestProgressVO) => {
    return await request.post({ url: `/waterdetection/test-progress/create`, data })
  },

  // 修改检测进度跟踪
  updateTestProgress: async (data: TestProgressVO) => {
    return await request.put({ url: `/waterdetection/test-progress/update`, data })
  },

  // 删除检测进度跟踪
  deleteTestProgress: async (id: number) => {
    return await request.delete({ url: `/waterdetection/test-progress/delete?id=` + id })
  },

  // 导出检测进度跟踪 Excel
  exportTestProgress: async (params) => {
    return await request.download({ url: `/waterdetection/test-progress/export-excel`, params })
  },
}
