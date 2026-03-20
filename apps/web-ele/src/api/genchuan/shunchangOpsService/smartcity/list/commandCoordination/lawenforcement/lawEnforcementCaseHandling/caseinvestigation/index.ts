import { requestClient } from '#/api/request';

// 案件调查 VO
export type CaseInvestigationVO = {
  caseId: string; // 案件 ID
  evidenceDesc: string; // 证据情况描述
  id: number; // ID
  investigationDesc: string; // 调查情况描述
  investigationEndTime: string; // 调查结束时间
  investigationLeader: string; // 调查负责人
  investigationResult: string; // 调查结果
  investigationStartTime: string; // 调查开始时间
  investigationTeam: string; // 调查组成员
  testimonyDesc: string; // 证人证言描述
  treatmentSuggestion: string; // 处理建议
};

// 案件调查 API
export const CaseInvestigationApi = {
  // 查询案件调查分页
  getCaseInvestigationPage: async (params: any) => {
    return await requestClient.get(`/smartcity/case-investigation/page`, {
      params,
    });
  },

  // 查询案件调查详情
  getCaseInvestigation: async (id: number) => {
    return await requestClient.get(`/smartcity/case-investigation/get`, {
      params: { id },
    });
  },

  // 新增案件调查
  createCaseInvestigation: async (data: any) => {
    return await requestClient.post(
      `/smartcity/case-investigation/create`,
      data,
    );
  },

  // 修改案件调查
  updateCaseInvestigation: async (data: any) => {
    return await requestClient.put(
      `/smartcity/case-investigation/update`,
      data,
    );
  },

  // 删除案件调查
  deleteCaseInvestigation: async (id: number) => {
    return await requestClient.delete(`/smartcity/case-investigation/delete`, {
      params: { id },
    });
  },

  // 导出案件调查 Excel
  exportCaseInvestigation: async (params) => {
    return await requestClient.download(
      `/smartcity/case-investigation/export-excel`,
      params,
    );
  },
};
