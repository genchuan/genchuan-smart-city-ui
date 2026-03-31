import { requestClient } from '#/api/request';

// 采样人员分配 VO
export type SamplingAssignmentVO = {
  assignTime: Date; // 分配时间
  contactInfo: string; // 联系方式
  deadline: Date; // 完成时限
  id: number; // 序号
  planCode: string; // 采样计划编号
  pointList: string; // 采样点清单
  responsiblePerson: string; // 负责人员
  status: string; // 新增流程实例状态字段 便于取消按钮显示判断
};

// 采样人员分配 API
export const SamplingAssignmentApi = {
  // 查询采样人员分配分页
  getSamplingAssignmentPage: async (params: any) => {
    return await requestClient.get(`/waterdetection/sampling-assignment/page`, {
      params,
    });
  },

  // 查询采样人员分配详情
  getSamplingAssignment: async (id: number) => {
    return await requestClient.get(`/waterdetection/sampling-assignment/get`, {
      params: { id },
    });
  },

  // 新增采样人员分配
  createSamplingAssignment: async (data: SamplingAssignmentVO) => {
    return await requestClient.post(
      `/waterdetection/sampling-assignment/create`,
      data,
    );
  },

  // 修改采样人员分配
  updateSamplingAssignment: async (data: SamplingAssignmentVO) => {
    return await requestClient.put(
      `/waterdetection/sampling-assignment/update`,
      data,
    );
  },

  // 删除采样人员分配
  deleteSamplingAssignment: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/sampling-assignment/delete`,
      { params: { id } },
    );
  },

  // 导出采样人员分配 Excel
  exportSamplingAssignment: async (params) => {
    return await requestClient.download(
      `/waterdetection/sampling-assignment/export-excel`,
      params,
    );
  },
};
