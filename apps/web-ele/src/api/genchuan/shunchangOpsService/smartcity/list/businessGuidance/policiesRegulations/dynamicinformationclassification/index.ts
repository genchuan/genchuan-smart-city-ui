import { requestClient } from '#/api/request';

// 动态信息分类 VO
export type DynamicInformationClassificationVO = {
  id: number;
  industrySector: string;
  informationSources: string;
  messageSubject: string;
  urgency: string;
};

// 动态信息分类 API
export const DynamicInformationClassificationApi = {
  getDynamicInformationClassificationPage: async (params: any) => {
    return await requestClient.get(
      `/smartcity/dynamic-information-classification/page`,
      { params },
    );
  },

  getDynamicInformationClassification: async (id: number) => {
    return await requestClient.get(
      `/smartcity/dynamic-information-classification/get`,
      { params: { id } },
    );
  },

  createDynamicInformationClassification: async (data: any) => {
    return await requestClient.post(
      `/smartcity/dynamic-information-classification/create`,
      data,
    );
  },

  updateDynamicInformationClassification: async (data: any) => {
    return await requestClient.put(
      `/smartcity/dynamic-information-classification/update`,
      data,
    );
  },

  deleteDynamicInformationClassification: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/dynamic-information-classification/delete`,
      { params: { id } },
    );
  },

  exportDynamicInformationClassification: async (params) => {
    return await requestClient.download(
      `/smartcity/dynamic-information-classification/export-excel`,
      params,
    );
  },
};
