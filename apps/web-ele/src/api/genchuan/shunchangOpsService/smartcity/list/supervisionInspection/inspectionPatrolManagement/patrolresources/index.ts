import { requestClient } from '#/api/request';

// 巡查资源 VO
export type PatrolResourcesVO = {
  id: number;
  resourceName: string;
  resourceNumber: string;
  resourceType: string;
  geographicLocation: string;
  regionalDivision: string;
  specificationAndModel: string;
};

// 巡查资源 API
export const PatrolResourcesApi = {
  getPatrolResourcesPage: async (params: any) => {
    return await requestClient.get(`/smartcity/patrol-resources/page`, { params });
  },

  getPatrolResources: async (id: number) => {
    return await requestClient.get(`/smartcity/patrol-resources/get`, { params: { id } });
  },

  createPatrolResources: async (data: any) => {
    return await requestClient.post(`/smartcity/patrol-resources/create`, data);
  },

  updatePatrolResources: async (data: any) => {
    return await requestClient.put(`/smartcity/patrol-resources/update`, data);
  },

  deletePatrolResources: async (id: number) => {
    return await requestClient.delete(`/smartcity/patrol-resources/delete`, { params: { id } });
  },

  exportPatrolResources: async (params) => {
    return await requestClient.download(`/smartcity/patrol-resources/export-excel`, params);
  },
};