import { requestClient } from '#/api/request';

// 用水性质分类管理 VO
export type WaterUseCategoryVO = {
  categoryDate: Date; // 分类日期
  id: number; // 序号
  userCode: string; // 用户编号
  waterQuota: number; // 用水定额(立方米)
  waterUseType: string; // 用水性质
};

// 用水性质分类管理 API
export const WaterUseCategoryApi = {
  // 查询用水性质分类管理分页
  getWaterUseCategoryPage: async (params: any) => {
    return await requestClient.get(`/waterdetection/water-use-category/page`, {
      params,
    });
  },

  // 查询用水性质分类管理详情
  getWaterUseCategory: async (id: number) => {
    return await requestClient.get(`/waterdetection/water-use-category/get`, {
      params: { id },
    });
  },

  // 新增用水性质分类管理
  createWaterUseCategory: async (data: WaterUseCategoryVO) => {
    return await requestClient.post(
      `/waterdetection/water-use-category/create`,
      data,
    );
  },

  // 修改用水性质分类管理
  updateWaterUseCategory: async (data: WaterUseCategoryVO) => {
    return await requestClient.put(
      `/waterdetection/water-use-category/update`,
      data,
    );
  },

  // 删除用水性质分类管理
  deleteWaterUseCategory: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/water-use-category/delete`,
      { params: { id } },
    );
  },

  // 导出用水性质分类管理 Excel
  exportWaterUseCategory: async (params) => {
    return await requestClient.download(
      `/waterdetection/water-use-category/export-excel`,
      params,
    );
  },
};
