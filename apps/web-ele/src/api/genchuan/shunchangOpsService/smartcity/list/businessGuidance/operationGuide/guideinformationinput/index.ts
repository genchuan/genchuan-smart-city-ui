import { requestClient } from '#/api/request';

// 指南信息录入 VO
export type GuideInformationInputVO = {
  guideName: string;
  id: number;
  mainContentOverview: string;
  publishingUnit: string;
  releaseDate: string;
  scopeOfApplication: string;
  updateDate: string;
};

// 指南信息录入 API
export const GuideInformationInputApi = {
  getGuideInformationInputPage: async (params: any) => {
    return await requestClient.get(`/smartcity/guide-information-input/page`, {
      params,
    });
  },

  getGuideInformationInput: async (id: number) => {
    return await requestClient.get(`/smartcity/guide-information-input/get`, {
      params: { id },
    });
  },

  createGuideInformationInput: async (data: any) => {
    return await requestClient.post(
      `/smartcity/guide-information-input/create`,
      data,
    );
  },

  updateGuideInformationInput: async (data: any) => {
    return await requestClient.put(
      `/smartcity/guide-information-input/update`,
      data,
    );
  },

  deleteGuideInformationInput: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/guide-information-input/delete`,
      { params: { id } },
    );
  },

  exportGuideInformationInput: async (params) => {
    return await requestClient.download(
      `/smartcity/guide-information-input/export-excel`,
      params,
    );
  },
};
