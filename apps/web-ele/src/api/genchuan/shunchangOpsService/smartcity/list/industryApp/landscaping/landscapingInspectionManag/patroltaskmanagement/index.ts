import { requestClient } from '#/api/request';

// 巡査任务管理 VO
export type PatrolTaskManagementVO = {
  abnormalSituationRecord: string; // 异常情况记录
  belongingPlan: string; // 所属计划
  completionStatusDescription: string; // 完成情况说明
  executive: string; // 执行人员
  expectedDuration: string; // 预计时长
  handlingMeasures: string; // 处理措施
  id: number; // 主键
  keyInspectionPoints: string; // 巡查重点
  listOfCarryingEquipment: string; // 携带设备清单
  patrolArea: string; // 巡查区域
  patrolTime: string; // 巡查时间
  task: string; // 任务名称
  taskDescription: string; // 任务描述
};

// 巡査任务管理 API
export const PatrolTaskManagementApi = {
  // 查询巡査任务管理分页
  getPatrolTaskManagementPage: async (params: any) => {
    return await requestClient.get(`/smartcity/patrol-task-management/page`, {
      params,
    });
  },

  // 查询巡査任务管理详情
  getPatrolTaskManagement: async (id: number) => {
    return await requestClient.get(`/smartcity/patrol-task-management/get`, {
      params: { id },
    });
  },

  // 新增巡査任务管理
  createPatrolTaskManagement: async (data: any) => {
    return await requestClient.post(
      `/smartcity/patrol-task-management/create`,
      data,
    );
  },

  // 修改巡査任务管理
  updatePatrolTaskManagement: async (data: any) => {
    return await requestClient.put(
      `/smartcity/patrol-task-management/update`,
      data,
    );
  },

  // 删除巡査任务管理
  deletePatrolTaskManagement: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/patrol-task-management/delete`,
      { params: { id } },
    );
  },

  // 导出巡査任务管理 Excel
  exportPatrolTaskManagement: async (params) => {
    return await requestClient.download(
      `/smartcity/patrol-task-management/export-excel`,
      params,
    );
  },
};
