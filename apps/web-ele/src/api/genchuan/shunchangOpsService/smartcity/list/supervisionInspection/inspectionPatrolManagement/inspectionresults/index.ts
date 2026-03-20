import { requestClient } from '#/api/request';

// 巡查结果 VO
export type InspectionResultsAVO = {
  id: number;
  inspectionItems: string;
  inspectionResults: string;
  number: string;
  patrolLocation: string;
  patrolPersonnel: string;
  patrolTime: Date;
  resourceName: string;
  resourceNumber: string;
};

// 巡查结果 API
export const InspectionResultsAApi = {
  getInspectionResultsAPage: async (params: any) => {
    return await requestClient.get(`/smartcity/inspection-results-a/page`, {
      params,
    });
  },

  getInspectionResultsA: async (id: number) => {
    return await requestClient.get(`/smartcity/inspection-results-a/get`, {
      params: { id },
    });
  },

  createInspectionResultsA: async (data: any) => {
    return await requestClient.post(
      `/smartcity/inspection-results-a/create`,
      data,
    );
  },

  updateInspectionResultsA: async (data: any) => {
    return await requestClient.put(
      `/smartcity/inspection-results-a/update`,
      data,
    );
  },

  deleteInspectionResultsA: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/inspection-results-a/delete`,
      { params: { id } },
    );
  },

  exportInspectionResultsA: async (params) => {
    return await requestClient.download(
      `/smartcity/inspection-results-a/export-excel`,
      params,
    );
  },
};
