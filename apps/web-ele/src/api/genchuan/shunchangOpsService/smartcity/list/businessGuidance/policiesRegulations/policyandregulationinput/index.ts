import { requestClient } from '#/api/request';

// 政策法规录入 VO
export type PolicyAndRegulationInputVO = {
  id: number;
  developingAgencies: string;
  nameOfPolicyAndRegulation: string;
  documentNumber: string;
  releaseDate: Date;
  effectiveDate: Date;
  expiringDate: string;
  regulatoryCategory: string;
  isArea: string;
  scopeOfApplication: string;
  mainContent: string;
};

// 政策法规录入 API
export const PolicyAndRegulationInputApi = {
  getPolicyAndRegulationInputPage: async (params: any) => {
    return await requestClient.get(`/smartcity/policy-and-regulation-input/page`, { params });
  },

  getPolicyAndRegulationInput: async (id: number) => {
    return await requestClient.get(`/smartcity/policy-and-regulation-input/get`, { params: { id } });
  },

  createPolicyAndRegulationInput: async (data: any) => {
    return await requestClient.post(`/smartcity/policy-and-regulation-input/create`, data);
  },

  updatePolicyAndRegulationInput: async (data: any) => {
    return await requestClient.put(`/smartcity/policy-and-regulation-input/update`, data);
  },

  deletePolicyAndRegulationInput: async (id: number) => {
    return await requestClient.delete(`/smartcity/policy-and-regulation-input/delete`, { params: { id } });
  },

  exportPolicyAndRegulationInput: async (params) => {
    return await requestClient.download(`/smartcity/policy-and-regulation-input/export-excel`, params);
  },
};