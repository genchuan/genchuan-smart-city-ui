import { requestClient } from '#/api/request';

// 巡查任务 VO
export type InspectionTaskAVO = {
  endTimeB: string;
  id: number;
  inspectionItems: string;
  notes: string;
  startingTimeA: string;
  task: string;
  taskDescription: string;
  taskNumber: string;
};

// 巡查任务 API
export const InspectionTaskAApi = {
  getInspectionTaskAPage: async (params: any) => {
    return await requestClient.get(`/smartcity/inspection-task-a/page`, {
      params,
    });
  },

  getInspectionTaskA: async (id: number) => {
    return await requestClient.get(`/smartcity/inspection-task-a/get`, {
      params: { id },
    });
  },

  createInspectionTaskA: async (data: any) => {
    return await requestClient.post(
      `/smartcity/inspection-task-a/create`,
      data,
    );
  },

  updateInspectionTaskA: async (data: any) => {
    return await requestClient.put(`/smartcity/inspection-task-a/update`, data);
  },

  deleteInspectionTaskA: async (id: number) => {
    return await requestClient.delete(`/smartcity/inspection-task-a/delete`, {
      params: { id },
    });
  },

  exportInspectionTaskA: async (params) => {
    return await requestClient.download(
      `/smartcity/inspection-task-a/export-excel`,
      params,
    );
  },
};
