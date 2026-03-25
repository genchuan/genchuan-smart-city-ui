import { requestClient } from '#/api/request';

// 巡检任务派发与执行 VO
export type InspectionTaskVO = {
  id: number; // 序号
  taskId: string; // 任务ID
  inspectorId: string; // 巡检人员ID
  taskContent: string; // 任务内容
  dispatchTime: Date; // 派发时间
  receiveTime: Date; // 接收时间
  checkinTime: Date; // 签到时间
  inspectionResult: string; // 检查项结果(正常/异常)
  photoUrl: string; // 现场照片URL
  locationInfo: string; // 定位信息
};

// 巡检任务派发与执行 API
export const InspectionTaskApi = {
  // 查询巡检任务派发与执行分页
  getInspectionTaskPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/inspection-task/page`,
      { params },
    );
  },

  // 查询巡检任务派发与执行详情
  getInspectionTask: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/inspection-task/get`,
      { params: { id } },
    );
  },

  // 新增巡检任务派发与执行
  createInspectionTask: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/inspection-task/create`,
      data,
    );
  },

  // 修改巡检任务派发与执行
  updateInspectionTask: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/inspection-task/update`,
      data,
    );
  },

  // 删除巡检任务派发与执行
  deleteInspectionTask: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/inspection-task/delete`,
      { params: { id } },
    );
  },

  // 导出巡检任务派发与执行 Excel
  exportInspectionTask: async (params) => {
    return await requestClient.download(
      `/waterdetection/inspection-task/export-excel`,
      params,
    );
  },
};
