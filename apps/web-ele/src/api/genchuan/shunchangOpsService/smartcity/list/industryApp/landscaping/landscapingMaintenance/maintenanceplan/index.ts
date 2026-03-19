import { requestClient } from '#/api/request';

// 养护计划 VO
export type MaintenancePlanVO = {
  approvalDate: Date; // 审批日期
  approvalOpinion: string; // 审批意见
  approver: string; // 审批人
  id: number; // 主键
  maintainParcel: string; // 养护地块
  maintenanceContent: string; // 养护内容
  maintenanceDemand: string; // 养护资源需求
  maintenanceFrequency: string; // 养护频率
  maintenancePersonnel: string; // 负责养护人员
  planFormulationDate: Date; // 计划制定日期
  planName: string; // 计划名称
  plannedBudget: string; // 计划预算
  plannedEndDate: Date; // 计划结束日期
  planNumber: string; // 计划编号
  planStatus: string; // 计划状态
  startDate: Date; // 计划开始日期
};

// 养护计划 API
export const MaintenancePlanApi = {
  // 查询养护计划分页
  getMaintenancePlanPage: async (params: any) => {
    return await requestClient.get(`/smartcity/maintenance-plan/page`, {
      params,
    });
  },

  // 查询养护计划详情
  getMaintenancePlan: async (id: number) => {
    return await requestClient.get(`/smartcity/maintenance-plan/get`, {
      params: { id },
    });
  },

  // 新增养护计划
  createMaintenancePlan: async (data: any) => {
    return await requestClient.post(`/smartcity/maintenance-plan/create`, data);
  },

  // 修改养护计划
  updateMaintenancePlan: async (data: any) => {
    return await requestClient.put(`/smartcity/maintenance-plan/update`, data);
  },

  // 删除养护计划
  deleteMaintenancePlan: async (id: number) => {
    return await requestClient.delete(`/smartcity/maintenance-plan/delete`, {
      params: { id },
    });
  },

  // 导出养护计划 Excel
  exportMaintenancePlan: async (params) => {
    return await requestClient.download(
      `/smartcity/maintenance-plan/export-excel`,
      params,
    );
  },
};
