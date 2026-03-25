import { requestClient } from '#/api/request';

// 户表关联及变更管理 VO
export type MeterUserRelationVO = {
  id: number; // 序号
  meterCode: string; // 户表编号
  oldUserCode: string; // 原用户编号
  newUserCode: string; // 新用户编号
  changeReason: string; // 变更原因
  changeTime: Date; // 变更时间
  operator: string; // 经办人
};

// 户表关联及变更管理 API
export const MeterUserRelationApi = {
  // 查询户表关联及变更管理分页
  getMeterUserRelationPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/meter-user-relation/page`,
      { params },
    );
  },

  // 查询户表关联及变更管理详情
  getMeterUserRelation: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/meter-user-relation/get`,
      { params: { id } },
    );
  },

  // 新增户表关联及变更管理
  createMeterUserRelation: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/meter-user-relation/create`,
      data,
    );
  },

  // 修改户表关联及变更管理
  updateMeterUserRelation: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/meter-user-relation/update`,
      data,
    );
  },

  // 删除户表关联及变更管理
  deleteMeterUserRelation: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/meter-user-relation/delete`,
      { params: { id } },
    );
  },

  // 导出户表关联及变更管理 Excel
  exportMeterUserRelation: async (params) => {
    return await requestClient.download(
      `/waterdetection/meter-user-relation/export-excel`,
      params,
    );
  },
};
