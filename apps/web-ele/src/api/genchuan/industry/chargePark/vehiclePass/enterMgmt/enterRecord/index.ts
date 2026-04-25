import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace EnterRecordApi {
  /** 入场记录信息 */
  export interface EnterRecord {
    id?: number | string;
    plateNo?: string;
    plateColor?: string;
    enterTime?: string;
    stationId?: number;
    stationName?: string;
    gateId?: number;
    gateName?: string;
    imageUrl?: string;
    vehicleType?: string;
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 入场记录分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    plateColor?: string;
    enterTime?: string;
    stationId?: number;
    gateId?: number;
    vehicleType?: string;
  }

  /** 入场记录创建参数 */
  export interface CreateReqVO {
    plateNo: string;
    plateColor: string;
    enterTime: string;
    stationId: number;
    gateId: number;
    imageUrl?: string;
    vehicleType?: string;
    remark?: string;
  }

  /** 入场记录纠正参数 */
  export interface CorrectReqVO {
    id: number | string;
    plateNo?: string;
    plateColor?: string;
    enterTime?: string;
    stationId?: number;
    gateId?: number;
    imageUrl?: string;
    vehicleType?: string;
    remark?: string;
  }

  /** 入场记录图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 入场记录图表数据 */
  export interface ChartVO {
    enterTrend: Array<{ count: number; date: string }>;
    stationEnterCount: Array<{ count: number; stationName: string }>;
    cardData: {
      avgDuration: number;
      totalEnter: number;
    };
  }
}

/** 查询入场记录分页 */
export function getEnterRecordPage(params: EnterRecordApi.PageReqVO) {
  return requestClient.get<PageResult<EnterRecordApi.EnterRecord>>(
    '/vehiclepass/enter-record/page',
    { params },
  );
}

/** 查询入场记录详情 */
export function getEnterRecord(id: number | string) {
  return requestClient.get<EnterRecordApi.EnterRecord>(
    `/vehiclepass/enter-record/get?id=${id}`,
  );
}

/** 新增入场记录 */
export function createEnterRecord(data: EnterRecordApi.CreateReqVO) {
  return requestClient.post<boolean>('/vehiclepass/enter-record/create', data);
}

/** 导出入场记录 */
export function exportEnterRecord(params?: EnterRecordApi.PageReqVO) {
  return requestClient.download('/vehiclepass/enter-record/export', { params });
}

/** 纠正入场记录 */
export function correctEnterRecord(data: EnterRecordApi.CorrectReqVO) {
  return requestClient.put<boolean>('/vehiclepass/enter-record/update', data);
}

/** 查询入场记录图表 */
export function getEnterRecordChart(params: EnterRecordApi.ChartReqVO) {
  return requestClient.get<EnterRecordApi.ChartVO>(
    '/vehiclepass/enter-record/chart',
    { params },
  );
}
