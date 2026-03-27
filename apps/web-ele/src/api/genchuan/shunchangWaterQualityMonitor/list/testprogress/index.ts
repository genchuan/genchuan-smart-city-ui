import { requestClient } from '#/api/request';

// 检测进度跟踪 VO
export type TestProgressVO = {
  id: number; // 序号
  taskCode: string; // 任务编号
  progressPercent: number; // 当前进度(%)
  completedIndicators: string; // 已完成指标
  pendingIndicators: string; // 未完成指标
  estimatedCompletion: Date; // 预计完成时间
  delayReason: string; // 延迟原因(如有)
};

// 检测进度跟踪 API
export const TestProgressApi = {
  // 查询检测进度跟踪分页
  getTestProgressPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/test-progress/page`,
      { params },
    );
  },

  // 查询检测进度跟踪详情
  getTestProgress: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/test-progress/get`,
      { params: { id } },
    );
  },

  // 新增检测进度跟踪
  createTestProgress: async (data: TestProgressVO) => {
    return await requestClient.post(
      `/waterdetection/test-progress/create`,
      data,
    );
  },

  // 修改检测进度跟踪
  updateTestProgress: async (data: TestProgressVO) => {
    return await requestClient.put(
      `/waterdetection/test-progress/update`,
      data,
    );
  },

  // 删除检测进度跟踪
  deleteTestProgress: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/test-progress/delete`,
      { params: { id } },
    );
  },

  // 导出检测进度跟踪 Excel
  exportTestProgress: async (params) => {
    return await requestClient.download(
      `/waterdetection/test-progress/export-excel`,
      params,
    );
  },
};
