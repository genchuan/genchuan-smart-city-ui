import { requestClient } from '#/api/request';

// 事件处理 VO
export type EventProcessingVO = {
  id: number; // 主键
  eventHandlingNumber: string; // 事件处理编号
  relatedEventReportingId: string; // 关联事件上报编号
  processingDepartment: string; // 处理部门
  processingPersonnel: string; // 处理人员
  receptionTime: string; // 接收时间
  handlingMeasures: string; // 处理措施
};

// 事件处理 API
export const EventProcessingApi = {
  // 查询事件处理分页
  getEventProcessingPage: async (params: any) => {
    return await requestClient.get(`/smartcity/event-processing/page`, { params });
  },

  // 查询事件处理详情
  getEventProcessing: async (id: number) => {
    return await requestClient.get(`/smartcity/event-processing/get`, { params: { id } });
  },

  // 新增事件处理
  createEventProcessing: async (data: any) => {
    return await requestClient.post(`/smartcity/event-processing/create`, data);
  },

  // 修改事件处理
  updateEventProcessing: async (data: any) => {
    return await requestClient.put(`/smartcity/event-processing/update`, data);
  },

  // 删除事件处理
  deleteEventProcessing: async (id: number) => {
    return await requestClient.delete(`/smartcity/event-processing/delete`, { params: { id } });
  },

  // 导出事件处理 Excel
  exportEventProcessing: async (params) => {
    return await requestClient.download(`/smartcity/event-processing/export-excel`, params);
  },
};
