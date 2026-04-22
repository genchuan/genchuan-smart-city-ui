import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace ResultHandleApi {
  /** 结果处理信息 */
  export interface ResultHandle {
    id?: number | string;
    taskId?: number | string;
    taskNo?: string;
    plateNo?: string;
    plateColor?: string;
    stationId?: number;
    stationName?: string;
    inspectResult?: string;
    handleStatus?: string;
    handleType?: string;
    handleTime?: string;
    handler?: string;
    handleDesc?: string;
    approveStatus?: string;
    approveTime?: string;
    approver?: string;
    approveRemark?: string;
    executeStatus?: string;
    executeTime?: string;
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 结果处理分页查询参数 */
  export interface PageReqVO extends PageParam {
    taskNo?: string;
    plateNo?: string;
    stationId?: number;
    handleStatus?: string;
    handleType?: string;
    approveStatus?: string;
    executeStatus?: string;
  }

  /** 结果处理批量处理参数 */
  export interface BatchHandleReqVO {
    ids: Array<number | string>;
    handleType: string;
    handleDesc?: string;
  }

  /** 结果处理审批参数 */
  export interface ApproveReqVO {
    id: number | string;
    approveRemark?: string;
  }

  /** 结果处理驳回参数 */
  export interface RejectReqVO {
    id: number | string;
    rejectReason: string;
  }

  /** 结果处理执行参数 */
  export interface ExecuteReqVO {
    id: number | string;
    executeResult?: string;
  }

  /** 结果处理图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 结果处理图表数据 */
  export interface ChartVO {
    handleTrend: Array<{ count: number; date: string }>;
    handleTypeCount: Array<{ count: number; type: string }>;
    cardData: {
      executeRate: number;
      totalHandle: number;
    };
  }
}

/** 查询结果处理分页 */
export function getResultHandlePage(params: ResultHandleApi.PageReqVO) {
  return requestClient.get<PageResult<ResultHandleApi.ResultHandle>>(
    '/vehiclepass/result-handle/page',
    { params },
  );
}

/** 查询结果处理详情 */
export function getResultHandle(id: number | string) {
  return requestClient.get<ResultHandleApi.ResultHandle>(
    `/vehiclepass/result-handle/get?id=${id}`,
  );
}

/** 导出结果处理 */
export function exportResultHandle(params?: ResultHandleApi.PageReqVO) {
  return requestClient.download('/vehiclepass/result-handle/export', {
    params,
  });
}

/** 批量处理结果 */
export function batchHandleResultHandle(
  data: ResultHandleApi.BatchHandleReqVO,
) {
  return requestClient.put<boolean>(
    '/vehiclepass/result-handle/batch-handle',
    data,
  );
}

/** 审批结果处理 */
export function approveResultHandle(data: ResultHandleApi.ApproveReqVO) {
  return requestClient.put<boolean>('/vehiclepass/result-handle/approve', data);
}

/** 驳回结果处理 */
export function rejectResultHandle(data: ResultHandleApi.RejectReqVO) {
  return requestClient.put<boolean>('/vehiclepass/result-handle/reject', data);
}

/** 执行结果处理 */
export function executeResultHandle(data: ResultHandleApi.ExecuteReqVO) {
  return requestClient.put<boolean>('/vehiclepass/result-handle/execute', data);
}

/** 查询结果处理图表 */
export function getResultHandleChart(params: ResultHandleApi.ChartReqVO) {
  return requestClient.get<ResultHandleApi.ChartVO>(
    '/vehiclepass/result-handle/chart',
    { params },
  );
}
