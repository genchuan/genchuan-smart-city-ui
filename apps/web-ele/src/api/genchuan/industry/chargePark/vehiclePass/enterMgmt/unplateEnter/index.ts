import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace UnplateEnterApi {
  /** 无牌入场信息 */
  export interface UnplateEnter {
    id?: number | string;
    vehicleDesc?: string;
    enterTime?: string;
    stationId?: number;
    stationName?: string;
    gateId?: number;
    gateName?: string;
    imageUrl?: string;
    status?: string;
    auditStatus?: string;
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 无牌入场分页查询参数 */
  export interface PageReqVO extends PageParam {
    vehicleDesc?: string;
    enterTime?: string;
    stationId?: number;
    gateId?: number;
    status?: string;
    auditStatus?: string;
  }

  /** 无牌入场创建参数 */
  export interface CreateReqVO {
    vehicleDesc: string;
    enterTime: string;
    stationId: number;
    gateId: number;
    imageUrl?: string;
    remark?: string;
  }

  /** 无牌入场审核参数 */
  export interface AuditReqVO {
    id: number | string;
    auditStatus: string;
    auditRemark?: string;
  }

  /** 无牌入场确认参数 */
  export interface ConfirmReqVO {
    id: number | string;
  }

  /** 无牌入场纠正参数 */
  export interface CorrectReqVO {
    id: number | string;
    vehicleDesc?: string;
    enterTime?: string;
    stationId?: number;
    gateId?: number;
    imageUrl?: string;
    remark?: string;
  }

  /** 无牌入场图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 无牌入场图表数据 */
  export interface ChartVO {
    unplateTrend: Array<{ count: number; date: string }>;
    stationUnplateCount: Array<{ count: number; stationName: string }>;
    cardData: {
      auditRate: number;
      totalUnplate: number;
    };
  }
}

/** 查询无牌入场分页 */
export function getUnplateEnterPage(params: UnplateEnterApi.PageReqVO) {
  return requestClient.get<PageResult<UnplateEnterApi.UnplateEnter>>(
    '/vehiclepass/unplate-enter/page',
    { params },
  );
}

/** 查询无牌入场详情 */
export function getUnplateEnter(id: number | string) {
  return requestClient.get<UnplateEnterApi.UnplateEnter>(
    `/vehiclepass/unplate-enter/get?id=${id}`,
  );
}

/** 新增无牌入场 */
export function createUnplateEnter(data: UnplateEnterApi.CreateReqVO) {
  return requestClient.post<boolean>('/vehiclepass/unplate-enter/create', data);
}

/** 导出无牌入场 */
export function exportUnplateEnter(params?: UnplateEnterApi.PageReqVO) {
  return requestClient.download('/vehiclepass/unplate-enter/export', {
    params,
  });
}

/** 审核无牌入场 */
export function auditUnplateEnter(data: UnplateEnterApi.AuditReqVO) {
  return requestClient.put<boolean>('/vehiclepass/unplate-enter/audit', data);
}

/** 确认无牌入场 */
export function confirmUnplateEnter(data: UnplateEnterApi.ConfirmReqVO) {
  return requestClient.put<boolean>('/vehiclepass/unplate-enter/confirm', data);
}

/** 纠正无牌入场 */
export function correctUnplateEnter(data: UnplateEnterApi.CorrectReqVO) {
  return requestClient.put<boolean>('/vehiclepass/unplate-enter/update', data);
}

/** 查询无牌入场图表 */
export function getUnplateEnterChart(params: UnplateEnterApi.ChartReqVO) {
  return requestClient.get<UnplateEnterApi.ChartVO>(
    '/vehiclepass/unplate-enter/chart',
    { params },
  );
}
