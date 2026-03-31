import { requestClient } from '#/api/request';

// 预警指标配置 VO
export type WarningIndicatorVO = {
  dataSource: string; // 数据来源(在线监测/人工检测)
  id: number; // 序号
  indicatorName: string; // 预警指标名称
  indicatorType: string; // 指标类型(水质/设备)
  relatedPointType: string; // 关联监测点类型(水源/水厂/管网)
};

// 预警指标配置 API
export const WarningIndicatorApi = {
  // 查询预警指标配置分页
  getWarningIndicatorPage: async (params: any) => {
    return await requestClient.get(`/waterdetection/warning-indicator/page`, {
      params,
    });
  },

  // 查询预警指标配置详情
  getWarningIndicator: async (id: number) => {
    return await requestClient.get(`/waterdetection/warning-indicator/get`, {
      params: { id },
    });
  },

  // 新增预警指标配置
  createWarningIndicator: async (data: WarningIndicatorVO) => {
    return await requestClient.post(
      `/waterdetection/warning-indicator/create`,
      data,
    );
  },

  // 修改预警指标配置
  updateWarningIndicator: async (data: WarningIndicatorVO) => {
    return await requestClient.put(
      `/waterdetection/warning-indicator/update`,
      data,
    );
  },

  // 删除预警指标配置
  deleteWarningIndicator: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/warning-indicator/delete`,
      { params: { id } },
    );
  },

  // 导出预警指标配置 Excel
  exportWarningIndicator: async (params) => {
    return await requestClient.download(
      `/waterdetection/warning-indicator/export-excel`,
      params,
    );
  },
};
