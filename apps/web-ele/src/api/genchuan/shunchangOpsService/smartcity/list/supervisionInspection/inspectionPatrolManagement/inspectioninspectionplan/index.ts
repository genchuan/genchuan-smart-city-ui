import { requestClient } from '#/api/request';

// 巡查计划 VO
export type InspectionInspectionPlanVO = {
  id: number; // 主键
  inspectionCycle: string; // 巡查周期
  inspectionMethod: string; // 巡查方式
  inspectionProject: string; // 巡查项目
  notes: string; // 备注
  patrolLocation: string; // 巡查地点
  patrolTime: Date; // 巡查时间
};

// 巡查计划 API
export const InspectionInspectionPlanApi = {
  // 查询巡查计划分页
  getInspectionInspectionPlanPage: async (params: any) => {
    return await requestClient.get(
      `/smartcity/inspection-inspection-plan/page`,
      { params },
    );
  },

  // 查询巡查计划详情
  getInspectionInspectionPlan: async (id: number) => {
    return await requestClient.get(
      `/smartcity/inspection-inspection-plan/get`,
      { params: { id } },
    );
  },

  // 新增巡查计划
  createInspectionInspectionPlan: async (data: any) => {
    return await requestClient.post(
      `/smartcity/inspection-inspection-plan/create`,
      data,
    );
  },

  // 修改巡查计划
  updateInspectionInspectionPlan: async (data: any) => {
    return await requestClient.put(
      `/smartcity/inspection-inspection-plan/update`,
      data,
    );
  },

  // 删除巡查计划
  deleteInspectionInspectionPlan: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/inspection-inspection-plan/delete`,
      { params: { id } },
    );
  },

  // 导出巡查计划 Excel
  exportInspectionInspectionPlan: async (params) => {
    return await requestClient.download(
      `/smartcity/inspection-inspection-plan/export-excel`,
      params,
    );
  },
};
