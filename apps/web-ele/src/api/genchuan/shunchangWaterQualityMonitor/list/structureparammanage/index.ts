import { requestClient } from '#/api/request';

// 构建筑物参数管理 VO
export type StructureParamManageVO = {
  constructionTime: Date; // 建设时间
  depth: number; // 深度(米)
  effectiveVolume: number; // 有效容积(立方米)
  id: number; // 序号
  length: number; // 长度(米)
  structureName: string; // 构建筑物名称
  structureType: string; // 类型(沉淀池/滤池/清水池等)
  width: number; // 宽度(米)
};

// 构建筑物参数管理 API
export const StructureParamManageApi = {
  // 查询构建筑物参数管理分页
  getStructureParamManagePage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/structure-param-manage/page`,
      { params },
    );
  },

  // 查询构建筑物参数管理详情
  getStructureParamManage: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/structure-param-manage/get`,
      { params: { id } },
    );
  },

  // 新增构建筑物参数管理
  createStructureParamManage: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/structure-param-manage/create`,
      data,
    );
  },

  // 修改构建筑物参数管理
  updateStructureParamManage: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/structure-param-manage/update`,
      data,
    );
  },

  // 删除构建筑物参数管理
  deleteStructureParamManage: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/structure-param-manage/delete`,
      { params: { id } },
    );
  },

  // 导出构建筑物参数管理 Excel
  exportStructureParamManage: async (params) => {
    return await requestClient.download(
      `/waterdetection/structure-param-manage/export-excel`,
      params,
    );
  },
};
