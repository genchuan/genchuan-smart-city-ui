import { requestClient } from '#/api/request';

// 政策法规分类 VO
export type ClassificationOfPoliciesAndRegulationsVO = {
  id: number;
  regulatoryCategory: string;
  isArea: string;
  theme: string;
  applicableObjects: string;
  levelOfEffectiveness: string;
  departmentOfPublication: string;
  implementationTime: string;
  revocatoryDate: string;
};

// 政策法规分类 API
export const ClassificationOfPoliciesAndRegulationsApi = {
  getClassificationOfPoliciesAndRegulationsPage: async (params: any) => {
    return await requestClient.get(`/smartcity/classification-of-policies-and-regulations/page`, { params });
  },

  getClassificationOfPoliciesAndRegulations: async (id: number) => {
    return await requestClient.get(`/smartcity/classification-of-policies-and-regulations/get`, { params: { id } });
  },

  createClassificationOfPoliciesAndRegulations: async (data: any) => {
    return await requestClient.post(`/smartcity/classification-of-policies-and-regulations/create`, data);
  },

  updateClassificationOfPoliciesAndRegulations: async (data: any) => {
    return await requestClient.put(`/smartcity/classification-of-policies-and-regulations/update`, data);
  },

  deleteClassificationOfPoliciesAndRegulations: async (id: number) => {
    return await requestClient.delete(`/smartcity/classification-of-policies-and-regulations/delete`, { params: { id } });
  },

  exportClassificationOfPoliciesAndRegulations: async (params) => {
    return await requestClient.download(`/smartcity/classification-of-policies-and-regulations/export-excel`, params);
  },
};