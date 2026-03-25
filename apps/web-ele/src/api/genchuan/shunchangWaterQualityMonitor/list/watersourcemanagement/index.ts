import { requestClient } from '#/api/request';

// 水源类型及属性管理 VO
export type WaterSourceManagementVO = {
  administrativeRegion: string; // 所属行政区
  id: number; // 序号
  latitude: number; // 纬度
  longitude: number; // 经度
  sourceCode: string; // 水源编码
  sourceDescription: string; // 水源描述
  sourceName: string; // 水源名称
  sourceType: string; // 水源类型
};

// 水源类型及属性管理 API
export const WaterSourceManagementApi = {
  // 查询水源类型及属性管理分页
  getWaterSourceManagementPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/water-source-management/page`,
      { params },
    );
  },

  // 查询水源类型及属性管理详情
  getWaterSourceManagement: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/water-source-management/get`,
      { params: { id } },
    );
  },

  // 新增水源类型及属性管理
  createWaterSourceManagement: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/water-source-management/create`,
      data,
    );
  },

  // 修改水源类型及属性管理
  updateWaterSourceManagement: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/water-source-management/update`,
      data,
    );
  },

  // 删除水源类型及属性管理
  deleteWaterSourceManagement: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/water-source-management/delete`,
      { params: { id } },
    );
  },

  // 导出水源类型及属性管理 Excel
  exportWaterSourceManagement: async (params) => {
    return await requestClient.download(
      `/waterdetection/water-source-management/export-excel`,
      params,
    );
  },
};
