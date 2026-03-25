import { requestClient } from '#/api/request';

// 设备保养计划管理 VO
export type EquipmentMaintenanceVO = {
  id: number; // 序号
  equipmentId: string; // 设备ID
  equipmentType: string; // 设备类型
  maintenanceCycle: number; // 保养周期(天)
  planMaintenanceDate: Date; // 计划保养日期
  actualMaintenanceDate: Date; // 实际保养日期
  maintenanceContent: string; // 保养内容
  replacedParts: string; // 更换部件名称
  postMaintenanceParams: string; // 保养后运行参数
  maintenanceStaffId: string; // 维护人员ID
};

// 设备保养计划管理 API
export const EquipmentMaintenanceApi = {
  // 查询设备保养计划管理分页
  getEquipmentMaintenancePage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/equipment-maintenance/page`,
      { params },
    );
  },

  // 查询设备保养计划管理详情
  getEquipmentMaintenance: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/equipment-maintenance/get`,
      { params: { id } },
    );
  },

  // 新增设备保养计划管理
  createEquipmentMaintenance: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/equipment-maintenance/create`,
      data,
    );
  },

  // 修改设备保养计划管理
  updateEquipmentMaintenance: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/equipment-maintenance/update`,
      data,
    );
  },

  // 删除设备保养计划管理
  deleteEquipmentMaintenance: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/equipment-maintenance/delete`,
      { params: { id } },
    );
  },

  // 导出设备保养计划管理 Excel
  exportEquipmentMaintenance: async (params) => {
    return await requestClient.download(
      `/waterdetection/equipment-maintenance/export-excel`,
      params,
    );
  },
};
