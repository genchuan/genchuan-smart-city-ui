import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace PassOpReportApi {
  /** 通行运营报表信息 */
  export interface PassOpReport {
    id?: number | string;
    reportDate?: string;
    stationId?: number;
    stationName?: string;
    enterCount?: number;
    leaveCount?: number;
    inParkCount?: number;
    abnormalCount?: number;
    specialPassCount?: number;
    inspectCount?: number;
    totalFee?: number;
    avgParkDuration?: number;
    spaceUsageRate?: number;
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 通行运营报表分页查询参数 */
  export interface PageReqVO extends PageParam {
    reportDate?: string;
    stationId?: number;
  }

  /** 通行运营报表图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 通行运营报表图表数据 */
  export interface ChartVO {
    enterLeaveTrend: Array<{
      date: string;
      enterCount: number;
      leaveCount: number;
    }>;
    feeTrend: Array<{ amount: number; date: string }>;
    stationCompare: Array<{
      enterCount: number;
      stationName: string;
      totalFee: number;
    }>;
    cardData: {
      avgUsageRate: number;
      totalEnter: number;
      totalFee: number;
      totalLeave: number;
    };
  }
}

/** 查询通行运营报表分页 */
export function getPassOpReportPage(params: PassOpReportApi.PageReqVO) {
  return requestClient.get<PageResult<PassOpReportApi.PassOpReport>>(
    '/vehiclepass/pass-op-report/page',
    { params },
  );
}

/** 查询通行运营报表详情 */
export function getPassOpReport(id: number | string) {
  return requestClient.get<PassOpReportApi.PassOpReport>(
    `/vehiclepass/pass-op-report/get?id=${id}`,
  );
}

/** 导出通行运营报表 */
export function exportPassOpReport(params?: PassOpReportApi.PageReqVO) {
  return requestClient.download('/vehiclepass/pass-op-report/export', {
    params,
  });
}

/** 查询通行运营报表图表 */
export function getPassOpReportChart(params: PassOpReportApi.ChartReqVO) {
  return requestClient.get<PassOpReportApi.ChartVO>(
    '/vehiclepass/pass-op-report/chart',
    { params },
  );
}
