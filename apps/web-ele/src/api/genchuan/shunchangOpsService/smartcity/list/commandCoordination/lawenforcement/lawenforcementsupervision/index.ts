import { requestClient } from '#/api/request';

// 执法监督 VO
export type LawEnforcementSupervisionVO = {
  eventNumber: string;
  id: number;
  integrityCollection: string;
  method: string;
  officials: string;
  personnel: string;
  resultEvaluation: string;
  satisfactionInvolved: string;
  supervisionId: string;
  time: string;
  violationDescription: string;
};

// 执法监督 API
export const LawEnforcementSupervisionApi = {
  getLawEnforcementSupervisionPage: async (params: any) => {
    return await requestClient.get(
      `/smartcity/law-enforcement-supervision/page`,
      { params },
    );
  },

  getLawEnforcementSupervision: async (id: number) => {
    return await requestClient.get(
      `/smartcity/law-enforcement-supervision/get`,
      { params: { id } },
    );
  },

  createLawEnforcementSupervision: async (data: any) => {
    return await requestClient.post(
      `/smartcity/law-enforcement-supervision/create`,
      data,
    );
  },

  updateLawEnforcementSupervision: async (data: any) => {
    return await requestClient.put(
      `/smartcity/law-enforcement-supervision/update`,
      data,
    );
  },

  deleteLawEnforcementSupervision: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/law-enforcement-supervision/delete`,
      { params: { id } },
    );
  },

  exportLawEnforcementSupervision: async (params) => {
    return await requestClient.download(
      `/smartcity/law-enforcement-supervision/export-excel`,
      params,
    );
  },
};
