import { requestClient } from '#/api/request';

// 案件结案 VO
export type CaseClosureVO = {
  approvalOpinion: string; // 审批意见
  approvalPerson: string; // 审批人
  approvalTime: string; // 审批时间
  archiveLocation: string; // 归档位置
  archiveNumber: string; // 归档编号
  caseId: string; // 案件 ID
  closureDepartment: string; // 结案部门
  closurePerson: string; // 结案人
  closureReason: string; // 结案原因
  closureTime: string; // 结案时间
  id: number; // ID
};

// 案件结案 API
export const CaseClosureApi = {
  // 查询案件结案分页
  getCaseClosurePage: async (params: any) => {
    return await requestClient.get(`/smartcity/case-closure/page`, { params });
  },

  // 查询案件结案详情
  getCaseClosure: async (id: number) => {
    return await requestClient.get(`/smartcity/case-closure/get`, {
      params: { id },
    });
  },

  // 新增案件结案
  createCaseClosure: async (data: any) => {
    return await requestClient.post(`/smartcity/case-closure/create`, data);
  },

  // 修改案件结案
  updateCaseClosure: async (data: any) => {
    return await requestClient.put(`/smartcity/case-closure/update`, data);
  },

  // 删除案件结案
  deleteCaseClosure: async (id: number) => {
    return await requestClient.delete(`/smartcity/case-closure/delete`, {
      params: { id },
    });
  },

  // 导出案件结案 Excel
  exportCaseClosure: async (params) => {
    return await requestClient.download(
      `/smartcity/case-closure/export-excel`,
      params,
    );
  },
};
