import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace InParkStatusApi {
  /** 在停状态信息 */
  export interface InParkStatus {
    id?: number | string;
    carNo?: string;
    spaceName?: string;
    stationName?: string;
    inTime?: number;
    status?: string;
    remark?: string;
    reserve1?: string;
    reserve2?: string;
    creator?: string;
    updater?: string;
    createTime?: number;
    updateTime?: number;
    infile?: number;
    outfile?: number;
  }

  /** 在停状态分页查询参数 */
  export interface PageReqVO extends PageParam {
    carNo?: string;
    spaceName?: string;
    stationName?: string;
    status?: string;
  }

  /** 在停状态位置查询参数 */
  export interface LocationReqVO {
    id: number | string;
  }

  /** 在停状态位置信息 */
  export interface LocationVO {
    lon?: number;
    lat?: number;
    spaceName?: string;
    stationName?: string;
  }

  /** 在停状态提醒参数 */
  export interface RemindReqVO {
    id: number | string;
  }

  /** 在停状态告警参数 */
  export interface AlarmReqVO {
    id: number | string;
    alarmContent: string;
  }

  /** 在停状态图表查询参数 */
  export interface ChartReqVO {
    stationId?: number;
  }

  /** 在停状态图表数据 */
  export interface ChartVO {
    carLocationList?: Array<{
      lat: number;
      lon: number;
      plateNo: string;
      spaceName: string;
    }>;
    inParkCountTrend?: Array<{
      count: number;
      time: string;
    }>;
    cardData?: {
      inParkCarCount: number;
      overTimeCarCount: number;
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

/** 查询在停状态位置 */
export function getInParkStatusLocation(data: InParkStatusApi.LocationReqVO) {
  return requestClient.get<InParkStatusApi.LocationVO>(
    '/vehiclepass/in-park-status/location',
    { params: data },
  );
}

/** 提醒在停状态 */
export function remindInParkStatus(data: InParkStatusApi.RemindReqVO) {
  return requestClient.put<boolean>('/vehiclepass/in-park-status/remind', data);
}

/** 告警在停状态 */
export function alarmInParkStatus(data: InParkStatusApi.AlarmReqVO) {
  return requestClient.put<boolean>('/vehiclepass/in-park-status/alarm', data);
}

/** 查询在停状态图表 */
export function getInParkStatusChart(params: InParkStatusApi.ChartReqVO) {
  return requestClient.get<InParkStatusApi.ChartVO>(
    '/vehiclepass/in-park-status/chart',
    { params },
  );
}
