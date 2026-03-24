import { requestClient } from '#/api/request';

// 巡查分析统计 VO
export type InspectionStatisticsVO = {
  averagePatrolDuration: string;
  completionInspectionTasks: string;
  distributionProblems: string;
  id: number;
  numberProblemDiscoveries: string;
  patrolArea: string;
  patrolPersonnel: string;
  problemSolvingRate: string;
  repetitiveProblemRate: string;
  riskLevelAssessment: string;
  suggestionsMeasures: string;
};

// 巡查分析统计 API
export const InspectionStatisticsApi = {
  getInspectionStatisticsPage: async (params: any) => {
    return await requestClient.get(`/smartcity/inspection-statistics/page`, {
      params,
    });
  },

  getInspectionStatistics: async (id: number) => {
    return await requestClient.get(`/smartcity/inspection-statistics/get`, {
      params: { id },
    });
  },

  createInspectionStatistics: async (data: any) => {
    return await requestClient.post(
      `/smartcity/inspection-statistics/create`,
      data,
    );
  },

  updateInspectionStatistics: async (data: any) => {
    return await requestClient.put(
      `/smartcity/inspection-statistics/update`,
      data,
    );
  },

  deleteInspectionStatistics: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/inspection-statistics/delete`,
      { params: { id } },
    );
  },

  exportInspectionStatistics: async (params) => {
    return await requestClient.download(
      `/smartcity/inspection-statistics/export-excel`,
      params,
    );
  },
};
