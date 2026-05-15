import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace GateOpenApi {
  /** 开闸管理信息 */
  export interface GateOpen {
    id?: number | string;
    stationId?: number;
    stationName?: string;
    openReason?: string;
    applyUserId?: number;
    applyUserName?: string;
    applyTime?: string;
    status?: string;
    auditUserId?: number;
    auditUserName?: string;
    auditTime?: string;
    executeTime?: string;
    rejectReason?: string;
    remark?: string;
    reserve1?: string;
    reserve2?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 开闸管理分页查询参数 */
  export interface PageReqVO extends PageParam {
    stationId?: number;
    openReason?: string;
    applyUserId?: number;
    applyTime?: string[];
    status?: string;
    auditUserId?: number;
    remark?: string;
  }

  /** 开闸管理创建参数 */
  export interface CreateReqVO {
    stationId: number;
    openReason: string;
    remark?: string;
  }

  /** 开闸管理审批参数 */
  export interface ApproveReqVO {
    id: number | string;
  }

  /** 开闸管理驳回参数 */
  export interface RejectReqVO {
    id: number | string;
    rejectReason: string;
  }

  /** 开闸管理执行参数 */
  export interface ExecuteReqVO {
    id: number | string;
  }

  /** 开闸管理重新申请参数 */
  export interface ReapplyReqVO {
    id: number | string;
    openReason: string;
    remark?: string;
  }

  /** 开闸管理图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 开闸管理图表数据 */
  export interface ChartVO {
    openApplyTrend: Array<{ count: number; date: string }>;
    stationOpenCount: Array<{ count: number; stationName: string }>;
    cardData: {
      applyCount: number;
      auditPassRate: number;
    };
  }
}

/** 查询开闸管理分页 */
export function getGateOpenPage(params: GateOpenApi.PageReqVO) {
  return requestClient.get<PageResult<GateOpenApi.GateOpen>>(
    '/vehiclepass/gate-open/page',
    { params },
  );
}

/** 查询开闸管理详情 */
export function getGateOpen(id: number | string) {
  return requestClient.get<GateOpenApi.GateOpen>(
    `/vehiclepass/gate-open/get?id=${id}`,
  );
}

/** 新增开闸申请 */
export function createGateOpen(data: GateOpenApi.CreateReqVO) {
  return requestClient.post<boolean>('/vehiclepass/gate-open/create', data);
}

/** 导出开闸管理 */
export function exportGateOpen(params?: GateOpenApi.PageReqVO) {
  return requestClient.download('/vehiclepass/gate-open/export', { params: { ...params } });
}

/** 审批通过开闸申请 */
export function approveGateOpen(data: GateOpenApi.ApproveReqVO) {
  return requestClient.put<boolean>('/vehiclepass/gate-open/approve', data);
}

/** 驳回开闸申请 */
export function rejectGateOpen(data: GateOpenApi.RejectReqVO) {
  return requestClient.put<boolean>('/vehiclepass/gate-open/reject', data);
}

/** 执行开闸 */
export function executeGateOpen(data: GateOpenApi.ExecuteReqVO) {
  return requestClient.put<boolean>('/vehiclepass/gate-open/execute', data);
}

/** 重新申请开闸 */
export function reapplyGateOpen(data: GateOpenApi.ReapplyReqVO) {
  return requestClient.put<boolean>('/vehiclepass/gate-open/reapply', data);
}

/** 查询开闸管理图表 */
export function getGateOpenChart(params: GateOpenApi.ChartReqVO) {
  return requestClient.get<GateOpenApi.ChartVO>(
    '/vehiclepass/gate-open/chart',
    {
      params,
    },
  );
}
