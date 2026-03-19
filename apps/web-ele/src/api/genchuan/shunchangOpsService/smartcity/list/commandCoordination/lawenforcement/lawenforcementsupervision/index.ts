import { requestClient } from '#/api/request';

// 执法监督 VO
export type LawEnforcementSupervisionVO = {
  id: number;
  supervisionId: string;
  eventNumber: string;
  officials: string;
  personnel: string;
  time: string;
  method: string;
  integrityCollection: string;
  satisfactionInvolved: string;
  resultEvaluation: string;
  violationDescription: string;
};

// 执法监督 API
export const LawEnforcementSupervisionApi = {
  getLawEnforcementSupervisionPage: async (params: any) => {
    return await requestClient.get(`/smartcity/law-enforcement-supervision/page`, { params });
  },

  getLawEnforcementSupervision: async (id: number) => {
    return await requestClient.get(`/smartcity/law-enforcement-supervision/get`, { params: { id } });
  },

  createLawEnforcementSupervision: async (data: any) => {
    return await requestClient.post(`/smartcity/law-enforcement-supervision/create`, data);
  },

  updateLawEnforcementSupervision: async (data: any) => {
    return await requestClient.put(`/smartcity/law-enforcement-supervision/update`, data);
  },

  deleteLawEnforcementSupervision: async (id: number) => {
    return await requestClient.delete(`/smartcity/law-enforcement-supervision/delete`, { params: { id } });
  },

  exportLawEnforcementSupervision: async (params) => {
    return await requestClient.download(`/smartcity/law-enforcement-supervision/export-excel`, params);
  },
};