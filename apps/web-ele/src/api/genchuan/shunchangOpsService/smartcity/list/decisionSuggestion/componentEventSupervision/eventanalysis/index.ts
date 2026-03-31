import { requestClient } from '#/api/request';

// 事件关联分析 VO
export type EventAnalysisVO = {
  analysisNumber: string; // 关联分析编号
  analysisTime: string; // 分析时间
  analysts: string; // 分析人员
  associationStrength: string; // 关联强度
  associationType: string; // 关联类型
  conclusion: string; // 分析结论
  id: number; // 主键
  mainEventName: string; // 主事件名称
  mainEventNumber: string; // 主事件编号
  recommendedMeasure: string; // 建议措施
  relatedEventName: string; // 关联事件名称
  relatedEventNumber: string; // 关联事件编号
  relatedEvidence: string; // 关联证据
};

// 事件关联分析 API
export const EventAnalysisApi = {
  // 查询事件关联分析分页
  getEventAnalysisPage: async (params: any) => {
    return await requestClient.get(`/smartcity/event-analysis/page`, {
      params,
    });
  },

  // 查询事件关联分析详情
  getEventAnalysis: async (id: number) => {
    return await requestClient.get(`/smartcity/event-analysis/get`, {
      params: { id },
    });
  },

  // 新增事件关联分析
  createEventAnalysis: async (data: any) => {
    return await requestClient.post(`/smartcity/event-analysis/create`, data);
  },

  // 修改事件关联分析
  updateEventAnalysis: async (data: any) => {
    return await requestClient.put(`/smartcity/event-analysis/update`, data);
  },

  // 删除事件关联分析
  deleteEventAnalysis: async (id: number) => {
    return await requestClient.delete(`/smartcity/event-analysis/delete`, {
      params: { id },
    });
  },

  // 导出事件关联分析 Excel
  exportEventAnalysis: async (params) => {
    return await requestClient.download(
      `/smartcity/event-analysis/export-excel`,
      params,
    );
  },
};
