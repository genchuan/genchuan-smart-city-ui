import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace InParkStatusApi {
  /** 在场状态信息 */
  export interface InParkStatus {
    id?: number | string;
    plateNo?: string;
    plateColor?: string;
    enterTime?: string;
    stationId?: number;
    stationName?: string;
    parkSpaceNo?: string;
    parkDuration?: number;
    vehicleType?: string;
    status?: string;
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 在场状态分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    plateColor?: string;
    stationId?: number;
    parkSpaceNo?: string;
    vehicleType?: string;
    status?: string;
  }

  /** 在场状态位置查询参数 */
  export interface LocationReqVO {
    id: number | string;
  }

  /** 在场状态位置信息 */
  export interface LocationVO {
    plateNo?: string;
    stationName?: string;
    parkSpaceNo?: string;
    location?: {
      lat: number;
      lng: number;
    };
  }

  /** 在场状态提醒参数 */
  export interface RemindReqVO {
    id: number | string;
    remindType: string;
    remindContent?: string;
  }

  /** 在场状态告警参数 */
  export interface AlertReqVO {
    id: number | string;
    alertType: string;
    alertReason?: string;
  }

  /** 在场状态图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 在场状态图表数据 */
  export interface ChartVO {
    parkTrend: Array<{ count: number; date: string }>;
    stationParkCount: Array<{ count: number; stationName: string }>;
    cardData: {
      avgDuration: number;
      totalPark: number;
    };
  }
}

/** 查询在场状态分页 */
export function getInParkStatusPage(params: InParkStatusApi.PageReqVO) {
  return requestClient.get<PageResult<InParkStatusApi.InParkStatus>>(
    '/vehiclepass/in-park-status/page',
    { params },
  );
}

/** 查询在场状态详情 */
export function getInParkStatus(id: number | string) {
  return requestClient.get<InParkStatusApi.InParkStatus>(
    `/vehiclepass/in-park-status/get?id=${id}`,
  );
}

/** 导出在场状态 */
export function exportInParkStatus(params?: InParkStatusApi.PageReqVO) {
  return requestClient.download('/vehiclepass/in-park-status/export', {
    params,
  });
}

/** 查询在场状态位置 */
export function getInParkStatusLocation(data: InParkStatusApi.LocationReqVO) {
  return requestClient.get<InParkStatusApi.LocationVO>(
    '/vehiclepass/in-park-status/location',
    { params: data },
  );
}

/** 提醒在场状态 */
export function remindInParkStatus(data: InParkStatusApi.RemindReqVO) {
  return requestClient.post<boolean>(
    '/vehiclepass/in-park-status/remind',
    data,
  );
}

/** 告警在场状态 */
export function alertInParkStatus(data: InParkStatusApi.AlertReqVO) {
  return requestClient.post<boolean>('/vehiclepass/in-park-status/alert', data);
}

/** 查询在场状态图表 */
export function getInParkStatusChart(params: InParkStatusApi.ChartReqVO) {
  return requestClient.get<InParkStatusApi.ChartVO>(
    '/vehiclepass/in-park-status/chart',
    { params },
  );
}
