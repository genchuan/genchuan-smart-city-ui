import { requestClient } from '#/api/request';

// 监测设备 VO
export type MonitoringDeviceVO = {
  createTime: Date; // 安装时间
  deviceName: string; // 设备名称
  deviceNumber: string; // 设备编号
  deviceType: string; // 设备类型
  id: number; // 主键
  maintenanceRecord: string; // 维护记录
  manufacturer: string; // 生产厂家
};

// 监测设备 API
export const MonitoringDeviceApi = {
  // 查询监测设备分页
  getMonitoringDevicePage: async (params: any) => {
    return await requestClient.get(`/smartcity/monitoring-device/page`, {
      params,
    });
  },

  // 查询监测设备详情
  getMonitoringDevice: async (id: number) => {
    return await requestClient.get(`/smartcity/monitoring-device/get`, {
      params: { id },
    });
  },

  // 新增监测设备
  createMonitoringDevice: async (data: MonitoringDeviceVO) => {
    return await requestClient.post(
      `/smartcity/monitoring-device/create`,
      data,
    );
  },

  // 修改监测设备
  updateMonitoringDevice: async (data: MonitoringDeviceVO) => {
    return await requestClient.put(`/smartcity/monitoring-device/update`, data);
  },

  // 删除监测设备
  deleteMonitoringDevice: async (id: number) => {
    return await requestClient.delete(`/smartcity/monitoring-device/delete`, {
      params: { id },
    });
  },

  // 导出监测设备 Excel
  exportMonitoringDevice: async (params) => {
    return await requestClient.download(
      `/smartcity/monitoring-device/export-excel`,
      params,
    );
  },
};
