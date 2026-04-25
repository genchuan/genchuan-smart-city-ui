import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace EndParkApi {
  /** 结束停车信息 */
  export interface EndPark {
    id?: number | string;
    plateNo?: string;
    plateColor?: string;
    enterTime?: string;
    endTime?: string;
    stationId?: number;
    stationName?: string;
    parkSpaceNo?: string;
    parkDuration?: number;
    parkFee?: number;
    payStatus?: string;
    payTime?: string;
    payMethod?: string;
    status?: string;
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 结束停车分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    plateColor?: string;
    stationId?: number;
    parkSpaceNo?: string;
    payStatus?: string;
    status?: string;
  }

  /** 结束停车缴费参数 */
  export interface PayReqVO {
    id: number | string;
    payMethod: string;
    payAmount: number;
  }

  /** 结束停车确认参数 */
  export interface ConfirmReqVO {
    id: number | string;
  }

  /** 结束停车取消参数 */
  export interface CancelReqVO {
    id: number | string;
    cancelReason?: string;
  }

  /** 结束停车图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 结束停车图表数据 */
  export interface ChartVO {
    endParkTrend: Array<{ count: number; date: string }>;
    payMethodCount: Array<{ count: number; method: string }>;
    cardData: {
      totalEndPark: number;
      totalFee: number;
    };
  }
}

/** 查询结束停车分页 */
export function getEndParkPage(params: EndParkApi.PageReqVO) {
  return requestClient.get<PageResult<EndParkApi.EndPark>>(
    '/vehiclepass/end-park/page',
    { params },
  );
}

/** 查询结束停车详情 */
export function getEndPark(id: number | string) {
  return requestClient.get<EndParkApi.EndPark>(
    `/vehiclepass/end-park/get?id=${id}`,
  );
}

/** 导出结束停车 */
export function exportEndPark(params?: EndParkApi.PageReqVO) {
  return requestClient.download('/vehiclepass/end-park/export', { params });
}

/** 缴费结束停车 */
export function payEndPark(data: EndParkApi.PayReqVO) {
  return requestClient.post<boolean>('/vehiclepass/end-park/pay', data);
}

/** 确认结束停车 */
export function confirmEndPark(data: EndParkApi.ConfirmReqVO) {
  return requestClient.put<boolean>('/vehiclepass/end-park/confirm', data);
}

/** 取消结束停车 */
export function cancelEndPark(data: EndParkApi.CancelReqVO) {
  return requestClient.put<boolean>('/vehiclepass/end-park/cancel', data);
}

/** 查询结束停车图表 */
export function getEndParkChart(params: EndParkApi.ChartReqVO) {
  return requestClient.get<EndParkApi.ChartVO>('/vehiclepass/end-park/chart', {
    params,
  });
}
