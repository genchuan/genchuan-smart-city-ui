import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace PassRecordApi {
  /** 放行记录信息 */
  export interface PassRecord {
    id?: number | string;
    plateNo?: string;
    passReason?: string;
    passTime?: string;
    imageUrl?: string;
    status?: string;
    stationId?: number;
    stationName?: string;
    operatorId?: number;
    operatorName?: string;
    operatorTime?: string;
    checkResult?: string;
    remark?: string;
    reserve1?: string;
    reserve2?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 放行记录分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    passReason?: string;
    passTime?: string[];
    status?: string;
    stationId?: number;
    stationName?: string;
    operatorId?: number;
    imageUrl?: string;
    checkResult?: string;
    remark?: string;
    reserve1?: string;
    reserve2?: string;
    creator?: string;
    updater?: string;
  }

  /** 放行记录核查参数 */
  export interface CheckReqVO {
    id: number | string;
    checkResult: string;
    checkRemark?: string;
  }

  /** 放行记录图表查询参数 */
  export interface ChartReqVO {
    startTime?: string;
    endTime?: string;
    stationId?: number;
  }

  /** 放行记录图表数据 */
  export interface ChartVO {
    trend: Array<{ count: number; date: string }>;
    cardData: {
      todayPassCount: number;
      abnormalPassRate: string;
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
  return requestClient.download('/vehiclepass/pass-record/export', {
    params: { ...params },
  });
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
