import { requestClient } from '#/api/request';

// 排水户信息 VO
export type DrainageUserVO = {
  id: number; // ID
  creditCode: string; // 统一社会信用代码
  userName: string; // 排水户名称
  industryType: string; // 行业类别
  userType: string; // 排水户分类
  waterUsage: string; // 月均用水量（吨）
  drainagePoint: string; // 排水管网接入点坐标
  preTreatment: string; // 预处理设施清单
};

// 排水户信息 API
export const DrainageUserApi = {
  // 查询排水户信息分页
  getDrainageUserPage: async (params: any) => {
    return await requestClient.get(`/smartcity/drainage-user/page`, { params });
  },

  // 查询排水户信息详情
  getDrainageUser: async (id: number) => {
    return await requestClient.get(`/smartcity/drainage-user/get`, { params: { id } });
  },

  // 新增排水户信息
  createDrainageUser: async (data: any) => {
    return await requestClient.post(`/smartcity/drainage-user/create`, data);
  },

  // 修改排水户信息
  updateDrainageUser: async (data: any) => {
    return await requestClient.put(`/smartcity/drainage-user/update`, data);
  },

  // 删除排水户信息
  deleteDrainageUser: async (id: number) => {
    return await requestClient.delete(`/smartcity/drainage-user/delete`, { params: { id } });
  },

  // 导出排水户信息 Excel
  exportDrainageUser: async (params) => {
    return await requestClient.download(`/smartcity/drainage-user/export-excel`, params);
  },
};
