import { requestClient } from '#/api/request';

// 经验信息分类 VO
export type ClassificationOfExperienceInformationVO = {
  applicableObjects: string;
  applicationScenarios: string;
  empiricalNature: string;
  id: number;
  sector: string;
  sourceChannel: string;
};

// 经验信息分类 API
export const ClassificationOfExperienceInformationApi = {
  getClassificationOfExperienceInformationPage: async (params: any) => {
    return await requestClient.get(
      `/smartcity/classification-of-experience-information/page`,
      { params },
    );
  },

  getClassificationOfExperienceInformation: async (id: number) => {
    return await requestClient.get(
      `/smartcity/classification-of-experience-information/get`,
      { params: { id } },
    );
  },

  createClassificationOfExperienceInformation: async (data: any) => {
    return await requestClient.post(
      `/smartcity/classification-of-experience-information/create`,
      data,
    );
  },

  updateClassificationOfExperienceInformation: async (data: any) => {
    return await requestClient.put(
      `/smartcity/classification-of-experience-information/update`,
      data,
    );
  },

  deleteClassificationOfExperienceInformation: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/classification-of-experience-information/delete`,
      { params: { id } },
    );
  },

  exportClassificationOfExperienceInformation: async (params) => {
    return await requestClient.download(
      `/smartcity/classification-of-experience-information/export-excel`,
      params,
    );
  },
};
