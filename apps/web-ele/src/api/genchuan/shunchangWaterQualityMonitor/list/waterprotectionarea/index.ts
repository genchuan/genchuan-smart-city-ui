import { requestClient } from '#/api/request';

// 水源保护区管理 VO
export type WaterProtectionAreaVO = {
  boundaryRange: string; // 边界经纬度范围
  id: number; // 序号
  installTime: Date; // 安装时间
  maintenanceRecord: string; // 维护记录
  pollutionStatus: string; // 污染源治理状态
  protectionLevel: string; // 保护区级别
  signboardLocation: string; // 标识牌位置
  signboardNo: string; // 标识牌编号
};

// 水源保护区管理 API
export const WaterProtectionAreaApi = {
  // 查询水源保护区管理分页
  getWaterProtectionAreaPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/water-protection-area/page`,
      { params },
    );
  },

  // 查询水源保护区管理详情
  getWaterProtectionArea: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/water-protection-area/get`,
      { params: { id } },
    );
  },

  // 新增水源保护区管理
  createWaterProtectionArea: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/water-protection-area/create`,
      data,
    );
  },

  // 修改水源保护区管理
  updateWaterProtectionArea: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/water-protection-area/update`,
      data,
    );
  },

  // 删除水源保护区管理
  deleteWaterProtectionArea: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/water-protection-area/delete`,
      { params: { id } },
    );
  },

  // 导出水源保护区管理 Excel
  exportWaterProtectionArea: async (params) => {
    return await requestClient.download(
      `/waterdetection/water-protection-area/export-excel`,
      params,
    );
  },
};
