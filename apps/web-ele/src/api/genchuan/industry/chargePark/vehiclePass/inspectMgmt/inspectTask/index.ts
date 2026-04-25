import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace InspectTaskApi {
  /** 巡检任务信息 */
  export interface InspectTask {
    id?: number | string;
    taskNo?: string;
    taskType?: string;
    plateNo?: string;
    plateColor?: string;
    stationId?: number;
    stationName?: string;
    taskStatus?: string;
    priority?: string;
    assignTime?: string;
    assignee?: string;
    claimTime?: string;
    completeTime?: string;
    taskDesc?: string;
    taskResult?: string;
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 巡检任务分页查询参数 */
  export interface PageReqVO extends PageParam {
    taskNo?: string;
    taskType?: string;
    plateNo?: string;
    stationId?: number;
    taskStatus?: string;
    priority?: string;
    assignee?: string;
  }

  /** 巡检任务分配参数 */
  export interface AssignReqVO {
    id: number | string;
    assignee: string;
    assignRemark?: string;
  }

  /** 巡检任务批量分配参数 */
  export interface BatchAssignReqVO {
    ids: Array<number | string>;
    assignee: string;
    assignRemark?: string;
  }

  /** 巡检任务认领参数 */
  export interface ClaimReqVO {
    id: number | string;
  }

  /** 巡检任务进度参数 */
  export interface ProgressReqVO {
    id: number | string;
    progress: string;
    progressDesc?: string;
  }

  /** 巡检任务转移参数 */
  export interface TransferReqVO {
    id: number | string;
    transferTo: string;
    transferReason?: string;
  }

  /** 巡检任务归档参数 */
  export interface ArchiveReqVO {
    id: number | string;
    archiveReason?: string;
  }

  /** 巡检任务图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 巡检任务图表数据 */
  export interface ChartVO {
    taskTrend: Array<{ count: number; date: string }>;
    taskStatusCount: Array<{ count: number; status: string }>;
    cardData: {
      completeRate: number;
      totalTask: number;
    };
  }
}

/** 查询巡检任务分页 */
export function getInspectTaskPage(params: InspectTaskApi.PageReqVO) {
  return requestClient.get<PageResult<InspectTaskApi.InspectTask>>(
    '/vehiclepass/inspect-task/page',
    { params },
  );
}

/** 查询巡检任务详情 */
export function getInspectTask(id: number | string) {
  return requestClient.get<InspectTaskApi.InspectTask>(
    `/vehiclepass/inspect-task/get?id=${id}`,
  );
}

/** 导出巡检任务 */
export function exportInspectTask(params?: InspectTaskApi.PageReqVO) {
  return requestClient.download('/vehiclepass/inspect-task/export', { params });
}

/** 分配巡检任务 */
export function assignInspectTask(data: InspectTaskApi.AssignReqVO) {
  return requestClient.put<boolean>('/vehiclepass/inspect-task/assign', data);
}

/** 批量分配巡检任务 */
export function batchAssignInspectTask(data: InspectTaskApi.BatchAssignReqVO) {
  return requestClient.put<boolean>(
    '/vehiclepass/inspect-task/batch-assign',
    data,
  );
}

/** 认领巡检任务 */
export function claimInspectTask(data: InspectTaskApi.ClaimReqVO) {
  return requestClient.put<boolean>('/vehiclepass/inspect-task/claim', data);
}

/** 更新巡检任务进度 */
export function updateInspectTaskProgress(data: InspectTaskApi.ProgressReqVO) {
  return requestClient.put<boolean>('/vehiclepass/inspect-task/progress', data);
}

/** 转移巡检任务 */
export function transferInspectTask(data: InspectTaskApi.TransferReqVO) {
  return requestClient.put<boolean>('/vehiclepass/inspect-task/transfer', data);
}

/** 归档巡检任务 */
export function archiveInspectTask(data: InspectTaskApi.ArchiveReqVO) {
  return requestClient.put<boolean>('/vehiclepass/inspect-task/archive', data);
}

/** 查询巡检任务图表 */
export function getInspectTaskChart(params: InspectTaskApi.ChartReqVO) {
  return requestClient.get<InspectTaskApi.ChartVO>(
    '/vehiclepass/inspect-task/chart',
    { params },
  );
}
