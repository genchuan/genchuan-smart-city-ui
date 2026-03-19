import { requestClient } from '#/api/request';

// 执法文书 VO
export type LawDocumentVO = {
  id: number;
  caseId: string;
  documentType: string;
  documentCode: string;
  documentTitle: string;
  documentContent: string;
  documentCreator: string;
  approver: string;
  approvalTime: Date;
  approvalStatus: string;
  signatory: string;
  signTime: Date;
  sealStatus: string;
  sealTime: Date;
  printStatus: string;
  printTimes: number;
};

// 执法文书 API
export const LawDocumentApi = {
  getLawDocumentPage: async (params: any) => {
    return await requestClient.get(`/smartcity/law-document/page`, { params });
  },

  getLawDocument: async (id: number) => {
    return await requestClient.get(`/smartcity/law-document/get`, { params: { id } });
  },

  createLawDocument: async (data: any) => {
    return await requestClient.post(`/smartcity/law-document/create`, data);
  },

  updateLawDocument: async (data: any) => {
    return await requestClient.put(`/smartcity/law-document/update`, data);
  },

  deleteLawDocument: async (id: number) => {
    return await requestClient.delete(`/smartcity/law-document/delete`, { params: { id } });
  },

  exportLawDocument: async (params) => {
    return await requestClient.download(`/smartcity/law-document/export-excel`, params);
  },
};