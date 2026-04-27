import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace PayCheckApi {
  /** 缴费核验信息 */
  export interface PayCheck {
    id?: number | string;
    plateNo?: string;
    parkFee?: number;
    status?: string;
    checkTime?: string;
    stationId?: number;
    stationName?: string;
    checkUserId?: number;
    checkUserName?: string;
    checkResult?: string;
    remark?: string;
    reserve1?: string;
    reserve2?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 缴费核验分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    parkFee?: number;
    status?: string;
    checkTime?: string[];
    stationId?: number;
    checkUserId?: number;
    remark?: string;
  }

  /** 缴费核验放行参数 */
  export interface ReleaseReqVO {
    id: number | string;
  }

  /** 缴费核验催缴参数 */
  export interface RemindReqVO {
    id: number | string;
  }

  /** 缴费核验图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 缴费核验图表数据 */
  export interface ChartVO {
    checkSuccessTrend: Array<{ date: string; rate: number }>;
    cardData: {
      avgCheckDuration: number;
      checkSuccessRate: number;
    };
  }
}

/** 查询缴费核查分页 */
export function getPayCheckPage(params: PayCheckApi.PageReqVO) {
  return requestClient.get<PageResult<PayCheckApi.PayCheck>>(
    '/vehiclepass/pay-check/page',
    { params },
  );
}

/** 查询缴费核查详情 */
export function getPayCheck(id: number | string) {
  return requestClient.get<PayCheckApi.PayCheck>(
    `/vehiclepass/pay-check/get?id=${id}`,
  );
}

/** 导出缴费核查 */
export function exportPayCheck(params?: PayCheckApi.PageReqVO) {
  return requestClient.download('/vehiclepass/pay-check/export', { params });
}

/** 放行缴费核查 */
export function releasePayCheck(data: PayCheckApi.ReleaseReqVO) {
  return requestClient.put<boolean>('/vehiclepass/pay-check/release', data);
}

/** 提醒缴费核查 */
export function remindPayCheck(data: PayCheckApi.RemindReqVO) {
  return requestClient.put<boolean>('/vehiclepass/pay-check/remind', data);
}

/** 查询缴费核查图表 */
export function getPayCheckChart(params: PayCheckApi.ChartReqVO) {
  return requestClient.get<PayCheckApi.ChartVO>(
    '/vehiclepass/pay-check/chart',
    {
      params,
    },
  );
}
