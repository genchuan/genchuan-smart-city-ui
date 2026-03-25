import { requestClient } from '#/api/request';

// 设备资产台账管理 VO
export type EquipmentAssetVO = {
  id: number; // 序号
  equipmentCode: string; // 设备编号
  equipmentName: string; // 设备名称
  model: string; // 型号
  specification: string; // 规格
  installLocation: string; // 安装位置
  installDate: Date; // 安装日期
  manufacturer: string; // 生产厂家
  maintenanceRecord: string; // 维护记录
};

// 设备资产台账管理 API
export const EquipmentAssetApi = {
  // 查询设备资产台账管理分页
  getEquipmentAssetPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/equipment-asset/page`,
      { params },
    );
  },

  // 查询设备资产台账管理详情
  getEquipmentAsset: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/equipment-asset/get`,
      { params: { id } },
    );
  },

  // 新增设备资产台账管理
  createEquipmentAsset: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/equipment-asset/create`,
      data,
    );
  },

  // 修改设备资产台账管理
  updateEquipmentAsset: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/equipment-asset/update`,
      data,
    );
  },

  // 删除设备资产台账管理
  deleteEquipmentAsset: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/equipment-asset/delete`,
      { params: { id } },
    );
  },

  // 导出设备资产台账管理 Excel
  exportEquipmentAsset: async (params) => {
    return await requestClient.download(
      `/waterdetection/equipment-asset/export-excel`,
      params,
    );
  },
};
