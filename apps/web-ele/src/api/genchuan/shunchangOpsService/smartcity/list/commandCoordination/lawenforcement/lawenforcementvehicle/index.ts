import { requestClient } from '#/api/request';

// 执法车辆管理 VO
export type LawEnforcementVehicleVO = {
  id: number; // 主键
  licensePlateNumber: string; // 车牌号
  vehicleBrand: string; // 车辆品牌
  model: string; // 车辆型号
  vehicleColor: string; // 车辆颜色
  vin: string; // 车架号
  engineNo: string; // 发动机号
  purchaseTime: string; // 购置时间
  registrationDate: string; // 登记注册日期
  belongingDepartment: string; // 所属执法部门
  natureOfUse: string; // 使用性质
  vehicleUsage: string; // 车辆用途
  vehicleStatus: string; // 车辆状态
  annualInspectionDate: string; // 年检到期日期
  insuranceDeadline: string; // 保险截止日期
  typesOfInsurance: string; // 保险类型
  driverName: string; // 驾驶员姓名
  driverContactInformation: string; // 驾驶员联系方式
  mileage: string; // 行驶里程
  maintenanceRecord: string; // 维修记录
  maintenanceRecords: string; // 保养记录
  refuelingRecord: string; // 加油记录
  violationRecords: string; // 违章记录
};

// 执法车辆管理 API
export const LawEnforcementVehicleApi = {
  // 查询执法车辆管理分页
  getLawEnforcementVehiclePage: async (params: any) => {
    return await requestClient.get(`/smartcity/law-enforcement-vehicle/page`, { params });
  },

  // 查询执法车辆管理详情
  getLawEnforcementVehicle: async (id: number) => {
    return await requestClient.get(`/smartcity/law-enforcement-vehicle/get`, { params: { id } });
  },

  // 新增执法车辆管理
  createLawEnforcementVehicle: async (data: any) => {
    return await requestClient.post(`/smartcity/law-enforcement-vehicle/create`, data);
  },

  // 修改执法车辆管理
  updateLawEnforcementVehicle: async (data: any) => {
    return await requestClient.put(`/smartcity/law-enforcement-vehicle/update`, data);
  },

  // 删除执法车辆管理
  deleteLawEnforcementVehicle: async (id: number) => {
    return await requestClient.delete(`/smartcity/law-enforcement-vehicle/delete`, { params: { id } });
  },

  // 导出执法车辆管理 Excel
  exportLawEnforcementVehicle: async (params) => {
    return await requestClient.download(`/smartcity/law-enforcement-vehicle/export-excel`, params);
  },
};
