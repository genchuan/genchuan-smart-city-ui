import { requestClient } from '#/api/request';

// 巡检路线规划与优化 VO
export type InspectionRouteVO = {
  actualArrivalTime: Date; // 实际到达时间
  estimatedArrivalTime: Date; // 预计到达时间
  id: number; // 序号
  inspectionPointId: string; // 巡检点ID
  latitude: number; // 纬度
  longitude: number; // 经度
  pointType: string; // 巡检点类型(水源地/水厂/管网节点)
  routeAdjustReason: string; // 路线调整原因
  routeId: string; // 路线ID
};

// 巡检路线规划与优化 API
export const InspectionRouteApi = {
  // 查询巡检路线规划与优化分页
  getInspectionRoutePage: async (params: any) => {
    return await requestClient.get(`/waterdetection/inspection-route/page`, {
      params,
    });
  },

  // 查询巡检路线规划与优化详情
  getInspectionRoute: async (id: number) => {
    return await requestClient.get(`/waterdetection/inspection-route/get`, {
      params: { id },
    });
  },

  // 新增巡检路线规划与优化
  createInspectionRoute: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/inspection-route/create`,
      data,
    );
  },

  // 修改巡检路线规划与优化
  updateInspectionRoute: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/inspection-route/update`,
      data,
    );
  },

  // 删除巡检路线规划与优化
  deleteInspectionRoute: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/inspection-route/delete`,
      { params: { id } },
    );
  },

  // 导出巡检路线规划与优化 Excel
  exportInspectionRoute: async (params) => {
    return await requestClient.download(
      `/waterdetection/inspection-route/export-excel`,
      params,
    );
  },
};
