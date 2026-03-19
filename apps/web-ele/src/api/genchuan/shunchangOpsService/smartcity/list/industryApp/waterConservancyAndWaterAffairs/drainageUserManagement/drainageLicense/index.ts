import { requestClient } from '#/api/request';

// 排水电子许可证信息 VO
export type DrainageLicenseVO = {
  approvalUnit: string; // 审批单位
  drainageType: string; // 许可排水类型
  endDate: Date; // 有效期结束日期
  id: number; // ID
  licenseNo: string; // 许可证编号
  licenseStatus: string; // 状态
  startDate: Date; // 有效期开始日期
};

// 排水电子许可证信息 API
export const DrainageLicenseApi = {
  // 查询排水电子许可证信息分页
  getDrainageLicensePage: async (params: any) => {
    return await requestClient.get(`/smartcity/drainage-license/page`, {
      params,
    });
  },

  // 查询排水电子许可证信息详情
  getDrainageLicense: async (id: number) => {
    return await requestClient.get(`/smartcity/drainage-license/get`, {
      params: { id },
    });
  },

  // 新增排水电子许可证信息
  createDrainageLicense: async (data: any) => {
    return await requestClient.post(`/smartcity/drainage-license/create`, data);
  },

  // 修改排水电子许可证信息
  updateDrainageLicense: async (data: any) => {
    return await requestClient.put(`/smartcity/drainage-license/update`, data);
  },

  // 删除排水电子许可证信息
  deleteDrainageLicense: async (id: number) => {
    return await requestClient.delete(`/smartcity/drainage-license/delete`, {
      params: { id },
    });
  },

  // 导出排水电子许可证信息 Excel
  exportDrainageLicense: async (params) => {
    return await requestClient.download(
      `/smartcity/drainage-license/export-excel`,
      params,
    );
  },
};
