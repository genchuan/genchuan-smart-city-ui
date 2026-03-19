import { requestClient } from '#/api/request';

// 事件上报 VO
export type EventReportingVO = {
  id: number; // 主键
  eventNumber: string; // 事件编号
  eventName: string; // 事件名称
  eventType: string; // 事件类型
  eventDescription: string; // 事件描述
  occurrenceTime: Date; // 发生时间
  place: string; // 发生地点
  latitudeLongitude: string; // 经纬度坐标
  reportperson: string; // 上报人
};

// 事件上报 API
export const EventReportingApi = {
  // 查询事件上报分页
  getEventReportingPage: async (params: any) => {
    return await requestClient.get(`/smartcity/event-reporting/page`, { params });
  },

  // 查询事件上报详情
  getEventReporting: async (id: number) => {
    return await requestClient.get(`/smartcity/event-reporting/get`, { params: { id } });
  },

  // 新增事件上报
  createEventReporting: async (data: any) => {
    return await requestClient.post(`/smartcity/event-reporting/create`, data);
  },

  // 修改事件上报
  updateEventReporting: async (data: any) => {
    return await requestClient.put(`/smartcity/event-reporting/update`, data);
  },

  // 删除事件上报
  deleteEventReporting: async (id: number) => {
    return await requestClient.delete(`/smartcity/event-reporting/delete`, { params: { id } });
  },

  // 导出事件上报 Excel
  exportEventReporting: async (params) => {
    return await requestClient.download(`/smartcity/event-reporting/export-excel`, params);
  },
};
