import { requestClient } from '#/api/request';

// 经验信息录入 VO
export type ExperienceInformationInputVO = {
  achieveResults: string;
  detailSteps: string;
  experienceProvider: string;
  experienceTheme: string;
  id: number;
  implementationLocation: string;
  implementationTime: Date;
  isArea: string;
  keyPointsForReference: string;
};

// 经验信息录入 API
export const ExperienceInformationInputApi = {
  getExperienceInformationInputPage: async (params: any) => {
    return await requestClient.get(
      `/smartcity/experience-information-input/page`,
      { params },
    );
  },

  getExperienceInformationInput: async (id: number) => {
    return await requestClient.get(
      `/smartcity/experience-information-input/get`,
      { params: { id } },
    );
  },

  createExperienceInformationInput: async (data: any) => {
    return await requestClient.post(
      `/smartcity/experience-information-input/create`,
      data,
    );
  },

  updateExperienceInformationInput: async (data: any) => {
    return await requestClient.put(
      `/smartcity/experience-information-input/update`,
      data,
    );
  },

  deleteExperienceInformationInput: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/experience-information-input/delete`,
      { params: { id } },
    );
  },

  exportExperienceInformationInput: async (params) => {
    return await requestClient.download(
      `/smartcity/experience-information-input/export-excel`,
      params,
    );
  },
};
