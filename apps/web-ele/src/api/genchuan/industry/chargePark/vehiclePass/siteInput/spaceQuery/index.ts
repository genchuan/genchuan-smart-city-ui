import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace SpaceQueryApi {
  /** 车位查询信息 */
  export interface SpaceQuery {
    id?: number | string;
    parkSpaceNo?: string;
    stationId?: number;
    stationName?: string;
    spaceStatus?: string;
    plateNo?: string;
    plateColor?: string;
    enterTime?: string;
    parkDuration?: number;
    location?: {
      lat: number;
      lng: number;
    };
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 车位查询分页查询参数 */
  export interface PageReqVO extends PageParam {
    parkSpaceNo?: string;
    stationId?: number;
    spaceStatus?: string;
    plateNo?: string;
  }

  /** 车位查询位置查询参数 */
  export interface LocationReqVO {
    id: number | string;
  }

  /** 车位查询位置信息 */
  export interface LocationVO {
    parkSpaceNo?: string;
    stationName?: string;
    location?: {
      lat: number;
      lng: number;
    };
    spaceStatus?: string;
  }

  /** 车位查询图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 车位查询图表数据 */
  export interface ChartVO {
    spaceUsageTrend: Array<{ date: string; rate: number }>;
    stationSpaceCount: Array<{
      stationName: string;
      total: number;
      used: number;
    }>;
    cardData: {
      totalSpace: number;
      usageRate: number;
    };
  }
}

/** 查询车位查询分页 */
export function getSpaceQueryPage(params: SpaceQueryApi.PageReqVO) {
  return requestClient.get<PageResult<SpaceQueryApi.SpaceQuery>>(
    '/vehiclepass/space-query/page',
    { params },
  );
}

/** 查询车位查询详情 */
export function getSpaceQuery(id: number | string) {
  return requestClient.get<SpaceQueryApi.SpaceQuery>(
    `/vehiclepass/space-query/get?id=${id}`,
  );
}

/** 查询车位位置 */
export function getSpaceQueryLocation(data: SpaceQueryApi.LocationReqVO) {
  return requestClient.get<SpaceQueryApi.LocationVO>(
    '/vehiclepass/space-query/location',
    { params: data },
  );
}

/** 查询车位查询图表 */
export function getSpaceQueryChart(params: SpaceQueryApi.ChartReqVO) {
  return requestClient.get<SpaceQueryApi.ChartVO>(
    '/vehiclepass/space-query/chart',
    {
      params,
    },
  );
}
