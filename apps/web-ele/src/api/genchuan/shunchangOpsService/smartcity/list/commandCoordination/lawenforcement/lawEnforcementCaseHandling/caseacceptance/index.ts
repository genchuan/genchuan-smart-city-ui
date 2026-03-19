import { requestClient } from '#/api/request';

// 案件受理 VO
export type CaseAcceptanceVO = {
  id: number; // ID
  caseCode: string; // 案件编号
  caseName: string; // 案件名称
  caseType: string; // 案件类型
  caseSource: string; // 案件来源
  caseTime: string; // 案件时间
  caseLocation: string; // 案件地点
  reportUnit: string; // 报案单位
  reportPerson: string; // 报案人
  reportPhone: string; // 联系电话
  caseDesc: string; // 案件描述
  caseStatus: string; // 案件状态
};

// 案件受理 API
export const CaseAcceptanceApi = {
  // 查询案件受理分页
  getCaseAcceptancePage: async (params: any) => {
    return await requestClient.get(`/smartcity/case-acceptance/page`, { params });
  },

  // 查询案件受理详情
  getCaseAcceptance: async (id: number) => {
    return await requestClient.get(`/smartcity/case-acceptance/get`, { params: { id } });
  },

  // 新增案件受理
  createCaseAcceptance: async (data: any) => {
    return await requestClient.post(`/smartcity/case-acceptance/create`, data);
  },

  // 修改案件受理
  updateCaseAcceptance: async (data: any) => {
    return await requestClient.put(`/smartcity/case-acceptance/update`, data);
  },

  // 删除案件受理
  deleteCaseAcceptance: async (id: number) => {
    return await requestClient.delete(`/smartcity/case-acceptance/delete`, { params: { id } });
  },

  // 导出案件受理 Excel
  exportCaseAcceptance: async (params) => {
    return await requestClient.download(`/smartcity/case-acceptance/export-excel`, params);
  },
};
