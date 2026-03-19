import { requestClient } from '#/api/request';

// 违建基本信息 VO
export type BasicIllegalVO = {
  id: number; // 主键
  buildingNumber: string; // 违建编号
  buildingAddress: string; // 违建地址
  constructionArea: string; // 违建面积
  typesStructures: string; // 违建结构类型
  numberFloors: string; // 违建层数
  unauthorizedBuildings: string; // 违建用途
};

// 违建基本信息 API
export const BasicIllegalApi = {
  // 查询违建基本信息分页
  getBasicIllegalPage: async (params: any) => {
    return await requestClient.get(`/smartcity/basic-illegal/page`, { params });
  },

  // 查询违建基本信息详情
  getBasicIllegal: async (id: number) => {
    return await requestClient.get(`/smartcity/basic-illegal/get`, { params: { id } });
  },

  // 新增违建基本信息
  createBasicIllegal: async (data: any) => {
    return await requestClient.post(`/smartcity/basic-illegal/create`, data);
  },

  // 修改违建基本信息
  updateBasicIllegal: async (data: any) => {
    return await requestClient.put(`/smartcity/basic-illegal/update`, data);
  },

  // 删除违建基本信息
  deleteBasicIllegal: async (id: number) => {
    return await requestClient.delete(`/smartcity/basic-illegal/delete`, { params: { id } });
  },

  // 导出违建基本信息 Excel
  exportBasicIllegal: async (params) => {
    return await requestClient.download(`/smartcity/basic-illegal/export-excel`, params);
  },
};
