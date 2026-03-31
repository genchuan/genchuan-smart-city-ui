import { requestClient } from '#/api/request';

// 养护地块 VO
export type MaintenancePlotVO = {
  acreage: string; // 地块面积
  greeningType: string; // 绿化类型
  id: number; // 主键
  lastMaintenanceDate: Date; // 上次养护的日期
  latitude: string; // 纬度
  longitude: string; // 经度
  nextMaintenanceDate: Date; // 下次养护的计划日期
  ownership: string; // 归属信息
  plotDescription: string; // 地块描述
  plotName: string; // 地块名称
};

// 养护地块 API
export const MaintenancePlotApi = {
  // 查询养护地块分页
  getMaintenancePlotPage: async (params: any) => {
    return await requestClient.get(`/smartcity/maintenance-plot/page`, {
      params,
    });
  },

  // 查询养护地块详情
  getMaintenancePlot: async (id: number) => {
    return await requestClient.get(`/smartcity/maintenance-plot/get`, {
      params: { id },
    });
  },

  // 新增养护地块
  createMaintenancePlot: async (data: any) => {
    return await requestClient.post(`/smartcity/maintenance-plot/create`, data);
  },

  // 修改养护地块
  updateMaintenancePlot: async (data: any) => {
    return await requestClient.put(`/smartcity/maintenance-plot/update`, data);
  },

  // 删除养护地块
  deleteMaintenancePlot: async (id: number) => {
    return await requestClient.delete(`/smartcity/maintenance-plot/delete`, {
      params: { id },
    });
  },

  // 导出养护地块 Excel
  exportMaintenancePlot: async (params) => {
    return await requestClient.download(
      `/smartcity/maintenance-plot/export-excel`,
      params,
    );
  },
};
