import { requestClient } from '#/api/request';

// 指南信息分类 VO
export type ClassificationOfGuideInformationVO = {
  id: number;
  applications: string;
  applicationScenarios: string;
  targetAudience: string;
  natureOfTheGuide: string;
};

// 指南信息分类 API
export const ClassificationOfGuideInformationApi = {
  getClassificationOfGuideInformationPage: async (params: any) => {
    return await requestClient.get(`/smartcity/classification-of-guide-information/page`, { params });
  },

  getClassificationOfGuideInformation: async (id: number) => {
    return await requestClient.get(`/smartcity/classification-of-guide-information/get`, { params: { id } });
  },

  createClassificationOfGuideInformation: async (data: any) => {
    return await requestClient.post(`/smartcity/classification-of-guide-information/create`, data);
  },

  updateClassificationOfGuideInformation: async (data: any) => {
    return await requestClient.put(`/smartcity/classification-of-guide-information/update`, data);
  },

  deleteClassificationOfGuideInformation: async (id: number) => {
    return await requestClient.delete(`/smartcity/classification-of-guide-information/delete`, { params: { id } });
  },

  exportClassificationOfGuideInformation: async (params) => {
    return await requestClient.download(`/smartcity/classification-of-guide-information/export-excel`, params);
  },
};