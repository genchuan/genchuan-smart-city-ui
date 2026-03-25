import { requestClient } from '#/api/request';

// 漏损控制方案建议 VO
export type LeakageControlPlanVO = {
  id: number; // 序号
  partitionId: string; // 分区ID
  exceededLeakageRate: number; // 超标漏损率(%)
  pressureData: string; // 压力数据
  pipeAvgAge: number; // 管道平均使用年限(年)
  suggestedPlan: string; // 建议方案
  planImplementTime: Date; // 方案实施时间
  postImplementRate: number; // 实施后漏损率(%)
};

// 漏损控制方案建议 API
export const LeakageControlPlanApi = {
  // 查询漏损控制方案建议分页
  getLeakageControlPlanPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/leakage-control-plan/page`,
      { params },
    );
  },

  // 查询漏损控制方案建议详情
  getLeakageControlPlan: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/leakage-control-plan/get`,
      { params: { id } },
    );
  },

  // 新增漏损控制方案建议
  createLeakageControlPlan: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/leakage-control-plan/create`,
      data,
    );
  },

  // 修改漏损控制方案建议
  updateLeakageControlPlan: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/leakage-control-plan/update`,
      data,
    );
  },

  // 删除漏损控制方案建议
  deleteLeakageControlPlan: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/leakage-control-plan/delete`,
      { params: { id } },
    );
  },

  // 导出漏损控制方案建议 Excel
  exportLeakageControlPlan: async (params) => {
    return await requestClient.download(
      `/waterdetection/leakage-control-plan/export-excel`,
      params,
    );
  },
};
