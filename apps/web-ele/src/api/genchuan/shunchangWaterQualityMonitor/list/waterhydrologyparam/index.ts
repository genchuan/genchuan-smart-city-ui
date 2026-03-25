import { requestClient } from '#/api/request';

// 水源水文参数管理 VO
export type WaterHydrologyParamVO = {
  id: number; // 序号
  monitorTime: Date; // 监测时间
  waterLevel: number; // 水位值(米)
  aquiferThickness: number; // 含水层厚度(米)
  permeabilityCoefficient: number; // 渗透系数(m/d)
  dataCollector: string; // 数据采集人
};

// 水源水文参数管理 API
export const WaterHydrologyParamApi = {
  // 查询水源水文参数管理分页
  getWaterHydrologyParamPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/water-hydrology-param/page`,
      { params },
    );
  },

  // 查询水源水文参数管理详情
  getWaterHydrologyParam: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/water-hydrology-param/get`,
      { params: { id } },
    );
  },

  // 新增水源水文参数管理
  createWaterHydrologyParam: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/water-hydrology-param/create`,
      data,
    );
  },

  // 修改水源水文参数管理
  updateWaterHydrologyParam: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/water-hydrology-param/update`,
      data,
    );
  },

  // 删除水源水文参数管理
  deleteWaterHydrologyParam: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/water-hydrology-param/delete`,
      { params: { id } },
    );
  },

  // 导出水源水文参数管理 Excel
  exportWaterHydrologyParam: async (params) => {
    return await requestClient.download(
      `/waterdetection/water-hydrology-param/export-excel`,
      params,
    );
  },
};
