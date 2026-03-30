import { requestClient } from '#/api/request';

// 任务派发 VO
export type TaskDispatchVO = {
  deadline: Date; // 截止日期
  dispatchDept: string; // 派发部门
  id: number; // 序号
  indicators: string; // 指标清单
  status: string; // 新增status便于取消按钮显示判断
  taskCode: string; // 任务编号
  taskType: string; // 任务类型(常规/应急)
  testPoints: string; // 检测点清单
};

// 任务派发 API
export const TaskDispatchApi = {
  // 查询任务派发分页
  getTaskDispatchPage: async (params: any) => {
    return await requestClient.get(`/waterdetection/task-dispatch/page`, {
      params,
    });
  },

  // 查询任务派发详情
  getTaskDispatch: async (id: number) => {
    return await requestClient.get(`/waterdetection/task-dispatch/get`, {
      params: { id },
    });
  },

  // 新增任务派发
  createTaskDispatch: async (data: TaskDispatchVO) => {
    return await requestClient.post(
      `/waterdetection/task-dispatch/create`,
      data,
    );
  },

  // 修改任务派发
  updateTaskDispatch: async (data: TaskDispatchVO) => {
    return await requestClient.put(
      `/waterdetection/task-dispatch/update`,
      data,
    );
  },

  // 删除任务派发
  deleteTaskDispatch: async (id: number) => {
    return await requestClient.delete(`/waterdetection/task-dispatch/delete`, {
      params: { id },
    });
  },

  // 导出任务派发 Excel
  exportTaskDispatch: async (params) => {
    return await requestClient.download(
      `/waterdetection/task-dispatch/export-excel`,
      params,
    );
  },
};
