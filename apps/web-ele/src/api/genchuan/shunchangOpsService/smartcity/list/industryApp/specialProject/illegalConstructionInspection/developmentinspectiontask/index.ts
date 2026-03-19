import { requestClient } from '#/api/request';

// 巡查任务管理 VO
export type DevelopmentInspectionTaskVO = {
  id: number; // 主键
  plan: string; // 巡查计划编号
  task: string; // 巡查任务编号
  record: string; // 巡查记录编号
  patrolTime: string; // 巡查时间
  region: string; // 区域
  staff: string; // 人员
  foundProblems: string; // 发现的问题
};

// 巡查任务管理 API
export const DevelopmentInspectionTaskApi = {
  // 查询巡查任务管理分页
  getDevelopmentInspectionTaskPage: async (params: any) => {
    return await requestClient.get(`/smartcity/development-inspection-task/page`, { params });
  },

  // 查询巡查任务管理详情
  getDevelopmentInspectionTask: async (id: number) => {
    return await requestClient.get(`/smartcity/development-inspection-task/get`, { params: { id } });
  },

  // 新增巡查任务管理
  createDevelopmentInspectionTask: async (data: any) => {
    return await requestClient.post(`/smartcity/development-inspection-task/create`, data);
  },

  // 修改巡查任务管理
  updateDevelopmentInspectionTask: async (data: any) => {
    return await requestClient.put(`/smartcity/development-inspection-task/update`, data);
  },

  // 删除巡查任务管理
  deleteDevelopmentInspectionTask: async (id: number) => {
    return await requestClient.delete(`/smartcity/development-inspection-task/delete`, { params: { id } });
  },

  // 导出巡查任务管理 Excel
  exportDevelopmentInspectionTask: async (params) => {
    return await requestClient.download(`/smartcity/development-inspection-task/export-excel`, params);
  },
};
