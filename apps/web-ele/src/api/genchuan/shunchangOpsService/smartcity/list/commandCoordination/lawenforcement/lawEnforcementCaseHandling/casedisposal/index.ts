import { requestClient } from '#/api/request';

// 案件处理 VO
export type CaseDisposalVO = {
  id: number; // ID
  caseId: string; // 案件 ID
  disposalType: string; // 处理类型
  disposalDepartment: string; // 处理部门
  disposalPerson: string; // 处理人
  disposalStartTime: string; // 处理开始时间
  disposalEndTime: string; // 处理结束时间
  disposalBasis: string; // 处理依据
  disposalContent: string; // 处理内容
  disposalResult: string; // 处理结果
  penaltyAmount: number; // 处罚金额
  penaltyType: string; // 处罚类型
};

// 案件处理 API
export const CaseDisposalApi = {
  // 查询案件处理分页
  getCaseDisposalPage: async (params: any) => {
    return await requestClient.get(`/smartcity/case-disposal/page`, { params });
  },

  // 查询案件处理详情
  getCaseDisposal: async (id: number) => {
    return await requestClient.get(`/smartcity/case-disposal/get`, { params: { id } });
  },

  // 新增案件处理
  createCaseDisposal: async (data: any) => {
    return await requestClient.post(`/smartcity/case-disposal/create`, data);
  },

  // 修改案件处理
  updateCaseDisposal: async (data: any) => {
    return await requestClient.put(`/smartcity/case-disposal/update`, data);
  },

  // 删除案件处理
  deleteCaseDisposal: async (id: number) => {
    return await requestClient.delete(`/smartcity/case-disposal/delete`, { params: { id } });
  },

  // 导出案件处理 Excel
  exportCaseDisposal: async (params) => {
    return await requestClient.download(`/smartcity/case-disposal/export-excel`, params);
  },
};
