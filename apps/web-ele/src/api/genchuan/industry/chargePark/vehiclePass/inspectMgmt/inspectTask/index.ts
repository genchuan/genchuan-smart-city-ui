import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace InspectTaskApi {
  /** 稽查任务信息 */
  export interface InspectTask {
    id?: number | string;
    taskType?: string;
    dispatchTime?: string;
    deadlineTime?: string;
    status?: string;
    areaId?: number;
    areaName?: string;
    executeUserId?: number;
    executeUserName?: string;
    finishTime?: string;
    taskProgress?: string;
    transferReason?: string;
    remark?: string;
    reserve1?: string;
    reserve2?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 稽查任务分页查询参数 */
  export interface PageReqVO extends PageParam {
    taskType?: string;
    dispatchTime?: string[];
    deadlineTime?: string[];
    status?: string;
    areaId?: number;
    executeUserId?: number;
    finishTime?: string[];
    taskProgress?: string;
    transferReason?: string;
    remark?: string;
    reserve1?: string;
    reserve2?: string;
    dispatchTimeNew?: string[];
    deadlineTimeNew?: string[];
    finishTimeNew?: string[];
    creator?: string;
    updater?: string;
    createTime?: string[];
    updateTime?: string[];
  }

  /** 稽查任务派发参数 */
  export interface DispatchReqVO {
    id: number | string;
    executeUserId: number;
  }

  /** 稽查任务批量派发参数 */
  export interface BatchDispatchReqVO {
    ids: Array<number | string>;
    executeUserId: number;
  }

  /** 稽查任务认领参数 */
  export interface ClaimReqVO {
    id: number | string;
  }

  /** 稽查任务更新进度参数 */
  export interface UpdateProgressReqVO {
    id: number | string;
    taskProgress: string;
    remark?: string;
  }

  /** 稽查任务转派参数 */
  export interface TransferReqVO {
    id: number | string;
    targetUserId: number;
    transferReason: string;
  }

  /** 稽查任务归档参数 */
  export interface ArchiveReqVO {
    id: number | string;
  }

  /** 稽查任务图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    areaId?: number;
  }

  /** 稽查任务图表数据 */
  export interface ChartVO {
    taskTypeCount: Array<{ count: number; typeName: string }>;
    taskHandleTrend: Array<{ date: string; duration: number }>;
    cardData: {
      waitHandleTaskCount: number;
      finishedTaskCount: number;
    };
  }
}

/** 查询稽查任务分页 */
export function getInspectTaskPage(params: InspectTaskApi.PageReqVO) {
  return requestClient.get<PageResult<InspectTaskApi.InspectTask>>(
    '/vehiclepass/inspect-task/page',
    { params },
  );
}

/** 查询稽查任务详情 */
export function getInspectTask(id: number | string) {
  return requestClient.get<InspectTaskApi.InspectTask>(
    `/vehiclepass/inspect-task/get?id=${id}`,
  );
}

/** 导出稽查任务 */
export function exportInspectTask(params?: InspectTaskApi.PageReqVO) {
  return requestClient.download('/vehiclepass/inspect-task/export', {
    params: { ...params },
  });
}

/** 派发稽查任务 */
export function dispatchInspectTask(data: InspectTaskApi.DispatchReqVO) {
  return requestClient.put<boolean>('/vehiclepass/inspect-task/dispatch', data);
}

/** 批量派发稽查任务 */
export function batchDispatchInspectTask(
  data: InspectTaskApi.BatchDispatchReqVO,
) {
  return requestClient.post<boolean>(
    '/vehiclepass/inspect-task/batch-dispatch',
    data,
  );
}

/** 认领稽查任务 */
export function claimInspectTask(data: InspectTaskApi.ClaimReqVO) {
  return requestClient.put<boolean>('/vehiclepass/inspect-task/claim', data);
}

/** 更新稽查任务进度 */
export function updateInspectTaskProgress(
  data: InspectTaskApi.UpdateProgressReqVO,
) {
  return requestClient.put<boolean>(
    '/vehiclepass/inspect-task/update-progress',
    data,
  );
}

/** 转派稽查任务 */
export function transferInspectTask(data: InspectTaskApi.TransferReqVO) {
  return requestClient.put<boolean>('/vehiclepass/inspect-task/transfer', data);
}

/** 归档稽查任务 */
export function archiveInspectTask(data: InspectTaskApi.ArchiveReqVO) {
  return requestClient.put<boolean>('/vehiclepass/inspect-task/archive', data);
}

/** 查询稽查任务图表 */
export function getInspectTaskChart(params: InspectTaskApi.ChartReqVO) {
  return requestClient.get<InspectTaskApi.ChartVO>(
    '/vehiclepass/inspect-task/chart',
    { params },
  );
}

/** 获得执行人精简列表 */
export function getExecuteUserSimpleList() {
  return requestClient.get<Array<{ userId: number; nickname: string }>>(
    '/vehiclepass/inspect-task/simple-list',
  );
}
