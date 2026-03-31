import { requestClient } from '#/api/request';

// 岗位职责划分管理 VO
export type PositionResponsibilityVO = {
  id: number; // 序号
  positionName: string; // 岗位名称
  responsibilityDesc: string; // 岗位职责描述
  qualificationReq: string; // 任职要求
  belongUnit: string; // 所属单位
  manager: string; // 负责人
};

// 岗位职责划分管理 API
export const PositionResponsibilityApi = {
  // 查询岗位职责划分管理分页
  getPositionResponsibilityPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/position-responsibility/page`,
      { params },
    );
  },

  // 查询岗位职责划分管理详情
  getPositionResponsibility: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/position-responsibility/get`,
      { params: { id } },
    );
  },

  // 新增岗位职责划分管理
  createPositionResponsibility: async (data: PositionResponsibilityVO) => {
    return await requestClient.post(
      `/waterdetection/position-responsibility/create`,
      data,
    );
  },

  // 修改岗位职责划分管理
  updatePositionResponsibility: async (data: PositionResponsibilityVO) => {
    return await requestClient.put(
      `/waterdetection/position-responsibility/update`,
      data,
    );
  },

  // 删除岗位职责划分管理
  deletePositionResponsibility: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/position-responsibility/delete`,
      { params: { id } },
    );
  },

  // 导出岗位职责划分管理 Excel
  exportPositionResponsibility: async (params) => {
    return await requestClient.download(
      `/waterdetection/position-responsibility/export-excel`,
      params,
    );
  },
};
