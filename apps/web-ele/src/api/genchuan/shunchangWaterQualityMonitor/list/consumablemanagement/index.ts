import { requestClient } from '#/api/request';

// 耗材库存与更换管理 VO
export type ConsumableManagementVO = {
  consumableId: string; // 耗材ID
  consumableType: string; // 耗材类型
  id: number; // 序号
  lastReplacementDate: Date; // 上次更换日期
  nextReplacementDate: Date; // 预计下次更换日期
  relatedEquipmentId: string; // 关联设备ID
  replacementQuantity: number; // 更换数量
  stockQuantity: number; // 库存余量
  warningThreshold: number; // 预警阈值
};

// 耗材库存与更换管理 API
export const ConsumableManagementApi = {
  // 查询耗材库存与更换管理分页
  getConsumableManagementPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/consumable-management/page`,
      { params },
    );
  },

  // 查询耗材库存与更换管理详情
  getConsumableManagement: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/consumable-management/get`,
      { params: { id } },
    );
  },

  // 新增耗材库存与更换管理
  createConsumableManagement: async (data: ConsumableManagementVO) => {
    return await requestClient.post(
      `/waterdetection/consumable-management/create`,
      data,
    );
  },

  // 修改耗材库存与更换管理
  updateConsumableManagement: async (data: ConsumableManagementVO) => {
    return await requestClient.put(
      `/waterdetection/consumable-management/update`,
      data,
    );
  },

  // 删除耗材库存与更换管理
  deleteConsumableManagement: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/consumable-management/delete`,
      { params: { id } },
    );
  },

  // 导出耗材库存与更换管理 Excel
  exportConsumableManagement: async (params) => {
    return await requestClient.download(
      `/waterdetection/consumable-management/export-excel`,
      params,
    );
  },
};
