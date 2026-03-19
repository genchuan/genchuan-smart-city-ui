import { requestClient } from '#/api/request';

// 巡查人员 VO
export type PatrolPersonnelVO = {
  id: number;
  number: string;
  fullName: string;
  gender: string;
  age: string;
  contactInformation: string;
  certificateTime: Date;
  inspectionRemarks: string;
};

// 巡查人员 API
export const PatrolPersonnelApi = {
  getPatrolPersonnelPage: async (params: any) => {
    return await requestClient.get(`/smartcity/patrol-personnel/page`, { params });
  },

  getPatrolPersonnel: async (id: number) => {
    return await requestClient.get(`/smartcity/patrol-personnel/get`, { params: { id } });
  },

  createPatrolPersonnel: async (data: any) => {
    return await requestClient.post(`/smartcity/patrol-personnel/create`, data);
  },

  updatePatrolPersonnel: async (data: any) => {
    return await requestClient.put(`/smartcity/patrol-personnel/update`, data);
  },

  deletePatrolPersonnel: async (id: number) => {
    return await requestClient.delete(`/smartcity/patrol-personnel/delete`, { params: { id } });
  },

  exportPatrolPersonnel: async (params) => {
    return await requestClient.download(`/smartcity/patrol-personnel/export-excel`, params);
  },
};