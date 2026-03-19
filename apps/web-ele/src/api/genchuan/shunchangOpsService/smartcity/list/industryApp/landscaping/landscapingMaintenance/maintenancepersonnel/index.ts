import { requestClient } from '#/api/request';

// 养护人员 VO
export type MaintenancePersonnelVO = {
  contactInformation: string; // 联系方式
  gender: string; // 性别
  id: number; // 主键
  idNumber: string; // 身份证号
  maintainTheLandParcel: string; // 养护地块
  personnelId: string; // 人员编号
  personnelName: string; // 人员姓名
};

// 养护人员 API
export const MaintenancePersonnelApi = {
  // 查询养护人员分页
  getMaintenancePersonnelPage: async (params: any) => {
    return await requestClient.get(`/smartcity/maintenance-personnel/page`, {
      params,
    });
  },

  // 查询养护人员详情
  getMaintenancePersonnel: async (id: number) => {
    return await requestClient.get(`/smartcity/maintenance-personnel/get`, {
      params: { id },
    });
  },

  // 新增养护人员
  createMaintenancePersonnel: async (data: any) => {
    return await requestClient.post(
      `/smartcity/maintenance-personnel/create`,
      data,
    );
  },

  // 修改养护人员
  updateMaintenancePersonnel: async (data: any) => {
    return await requestClient.put(
      `/smartcity/maintenance-personnel/update`,
      data,
    );
  },

  // 删除养护人员
  deleteMaintenancePersonnel: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/maintenance-personnel/delete`,
      { params: { id } },
    );
  },

  // 导出养护人员 Excel
  exportMaintenancePersonnel: async (params) => {
    return await requestClient.download(
      `/smartcity/maintenance-personnel/export-excel`,
      params,
    );
  },
};
