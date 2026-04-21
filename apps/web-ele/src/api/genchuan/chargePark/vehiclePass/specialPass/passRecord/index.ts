import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace PassRecordApi {
  /** 通行记录信息 */
  export interface PassRecord {
    id?: number | string;
    plateNo?: string;
    plateColor?: string;
    passTime?: string;
    stationId?: number;
    stationName?: string;
    gateId?: number;
    gateName?: string;
    passType?: string;
    passReason?: string;
    operator?: string;
    checkStatus?: string;
    checkTime?: string;
    checker?: string;
    checkRemark?: string;
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 通行记录分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    plateColor?: string;
    stationId?: number;
    gateId?: number;
    passType?: string;
    checkStatus?: string;
  }

  /** 通行记录核查参数 */
  export interface CheckReqVO {
    id: number | string;
    checkResult: string;
    checkRemark?: string;
  }

  /** 通行记录图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 通行记录图表数据 */
  export interface ChartVO {
    passTrend: Array<{ count: number; date: string }>;
    passTypeCount: Array<{ count: number; type: string }>;
    cardData: {
      checkRate: number;
      totalPass: number;
    };
  }
}

/** 查询通行记录分页 */
export function getPassRecordPage(params: PassRecordApi.PageReqVO) {
  return requestClient.get<PageResult<PassRecordApi.PassRecord>>(
    '/vehiclepass/pass-record/page',
    { params },
  );
}

/** 查询通行记录详情 */
export function getPassRecord(id: number | string) {
  return requestClient.get<PassRecordApi.PassRecord>(
    `/vehiclepass/pass-record/get?id=${id}`,
  );
}

/** 导出通行记录 */
export function exportPassRecord(params?: PassRecordApi.PageReqVO) {
  return requestClient.download('/vehiclepass/pass-record/export', { params });
}

/** 核查通行记录 */
export function checkPassRecord(data: PassRecordApi.CheckReqVO) {
  return requestClient.put<boolean>('/vehiclepass/pass-record/check', data);
}

/** 查询通行记录图表 */
export function getPassRecordChart(params: PassRecordApi.ChartReqVO) {
  return requestClient.get<PassRecordApi.ChartVO>(
    '/vehiclepass/pass-record/chart',
    {
      params,
    },
  );
}
