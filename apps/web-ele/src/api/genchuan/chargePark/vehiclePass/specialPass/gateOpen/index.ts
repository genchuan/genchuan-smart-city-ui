import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace GateOpenApi {
  /** 闸机开闸信息 */
  export interface GateOpen {
    id?: number | string;
    plateNo?: string;
    plateColor?: string;
    applyTime?: string;
    stationId?: number;
    stationName?: string;
    gateId?: number;
    gateName?: string;
    applyReason?: string;
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

  /** 闸机开闸分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    plateColor?: string;
    stationId?: number;
    gateId?: number;
    approveStatus?: string;
    executeStatus?: string;
  }

  /** 闸机开闸创建参数 */
  export interface CreateReqVO {
    plateNo: string;
    plateColor: string;
    stationId: number;
    gateId: number;
    applyReason: string;
    remark?: string;
  }

  /** 闸机开闸审批参数 */
  export interface ApproveReqVO {
    id: number | string;
    approveRemark?: string;
  }

  /** 闸机开闸驳回参数 */
  export interface RejectReqVO {
    id: number | string;
    rejectReason: string;
  }

  /** 闸机开闸执行参数 */
  export interface ExecuteReqVO {
    id: number | string;
  }

  /** 闸机开闸重新申请参数 */
  export interface ReapplyReqVO {
    id: number | string;
    applyReason: string;
    remark?: string;
  }

  /** 闸机开闸图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 闸机开闸图表数据 */
  export interface ChartVO {
    applyTrend: Array<{ count: number; date: string }>;
    approveStatusCount: Array<{ count: number; status: string }>;
    cardData: {
      approveRate: number;
      totalApply: number;
    };
  }
}

/** 查询闸机开闸分页 */
export function getGateOpenPage(params: GateOpenApi.PageReqVO) {
  return requestClient.get<PageResult<GateOpenApi.GateOpen>>(
    '/vehiclepass/gate-open/page',
    { params },
  );
}

/** 查询闸机开闸详情 */
export function getGateOpen(id: number | string) {
  return requestClient.get<GateOpenApi.GateOpen>(
    `/vehiclepass/gate-open/get?id=${id}`,
  );
}

/** 新增闸机开闸 */
export function createGateOpen(data: GateOpenApi.CreateReqVO) {
  return requestClient.post<boolean>('/vehiclepass/gate-open/create', data);
}

/** 导出闸机开闸 */
export function exportGateOpen(params?: GateOpenApi.PageReqVO) {
  return requestClient.download('/vehiclepass/gate-open/export', { params });
}

/** 审批闸机开闸 */
export function approveGateOpen(data: GateOpenApi.ApproveReqVO) {
  return requestClient.put<boolean>('/vehiclepass/gate-open/approve', data);
}

/** 驳回闸机开闸 */
export function rejectGateOpen(data: GateOpenApi.RejectReqVO) {
  return requestClient.put<boolean>('/vehiclepass/gate-open/reject', data);
}

/** 执行闸机开闸 */
export function executeGateOpen(data: GateOpenApi.ExecuteReqVO) {
  return requestClient.put<boolean>('/vehiclepass/gate-open/execute', data);
}

/** 重新申请闸机开闸 */
export function reapplyGateOpen(data: GateOpenApi.ReapplyReqVO) {
  return requestClient.post<boolean>('/vehiclepass/gate-open/reapply', data);
}

/** 查询闸机开闸图表 */
export function getGateOpenChart(params: GateOpenApi.ChartReqVO) {
  return requestClient.get<GateOpenApi.ChartVO>(
    '/vehiclepass/gate-open/chart',
    {
      params,
    },
  );
}
