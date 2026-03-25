import { requestClient } from '#/api/request';

// 问题上报与闭环跟踪 VO
export type IssueTrackingVO = {
  id: number; // 序号
  issueId: string; // 问题ID
  issueType: string; // 问题类型(漏点/设备故障/标识牌损坏)
  reportTime: Date; // 上报时间
  dispatchTime: Date; // 派单时间
  repairStaffId: string; // 维修人员ID
  repairTime: Date; // 修复时间
  inspectionResult: string; // 验收结果
  closureStatus: string; // 闭环状态
};

// 问题上报与闭环跟踪 API
export const IssueTrackingApi = {
  // 查询问题上报与闭环跟踪分页
  getIssueTrackingPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/issue-tracking/page`,
      { params },
    );
  },

  // 查询问题上报与闭环跟踪详情
  getIssueTracking: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/issue-tracking/get`,
      { params: { id } },
    );
  },

  // 新增问题上报与闭环跟踪
  createIssueTracking: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/issue-tracking/create`,
      data,
    );
  },

  // 修改问题上报与闭环跟踪
  updateIssueTracking: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/issue-tracking/update`,
      data,
    );
  },

  // 删除问题上报与闭环跟踪
  deleteIssueTracking: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/issue-tracking/delete`,
      { params: { id } },
    );
  },

  // 导出问题上报与闭环跟踪 Excel
  exportIssueTracking: async (params) => {
    return await requestClient.download(
      `/waterdetection/issue-tracking/export-excel`,
      params,
    );
  },
};
