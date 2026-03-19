import { requestClient } from '#/api/request';

// 动态信息录入 VO
export type DynamicInformationInputVO = {
  id: number;
  title: string;
  releaseTime: Date;
  publishingSubject: string;
  contentOverview: string;
};

// 动态信息录入 API
export const DynamicInformationInputApi = {
  getDynamicInformationInputPage: async (params: any) => {
    return await requestClient.get(`/smartcity/dynamic-information-input/page`, { params });
  },

  getDynamicInformationInput: async (id: number) => {
    return await requestClient.get(`/smartcity/dynamic-information-input/get`, { params: { id } });
  },

  createDynamicInformationInput: async (data: any) => {
    return await requestClient.post(`/smartcity/dynamic-information-input/create`, data);
  },

  updateDynamicInformationInput: async (data: any) => {
    return await requestClient.put(`/smartcity/dynamic-information-input/update`, data);
  },

  deleteDynamicInformationInput: async (id: number) => {
    return await requestClient.delete(`/smartcity/dynamic-information-input/delete`, { params: { id } });
  },

  exportDynamicInformationInput: async (params) => {
    return await requestClient.download(`/smartcity/dynamic-information-input/export-excel`, params);
  },
};