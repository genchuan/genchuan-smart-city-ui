import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace SpaceQueryApi {
  /** 泊位查询信息 */
  export interface SpaceQuery {
    id?: number | string;
    spaceNo?: string;
    queryTime?: string;
    queryUserId?: number;
    queryUserName?: string;
    areaId?: number;
    areaName?: string;
    spaceStatus?: string;
    remark?: string;
    reserve1?: string;
    reserve2?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 泊位查询分页查询参数 */
  export interface PageReqVO extends PageParam {
    spaceNo?: string;
    queryTime?: string;
    queryUserId?: number;
    areaId?: number;
    spaceStatus?: string;
    querySuccess?: boolean;
    remark?: string;
  }

  /** 泊位查询位置查询参数 */
  export interface LocationReqVO {
    id: number | string;
  }

  /** 泊位查询位置信息 */
  export interface LocationVO {
    lon: number;
    lat: number;
    spaceName: string;
    areaName: string;
  }

  /** 泊位查询图表查询参数 */
  export interface ChartReqVO {
    areaId?: number;
  }

  /** 泊位查询图表数据 */
  export interface ChartVO {
    spaceLocationList: Array<{
      lat: number;
      lon: number;
      spaceNo: string;
      spaceStatus: string;
    }>;
    cardData: {
      queryCount: number;
      querySuccessRate: number;
    };
  }
}

/** 查询泊位查询分页 */
export function getSpaceQueryPage(params: SpaceQueryApi.PageReqVO) {
  return requestClient.get<PageResult<SpaceQueryApi.SpaceQuery>>(
    '/vehiclepass/space-query/page',
    { params },
  );
}

/** 查询泊位查询详情 */
export function getSpaceQuery(id: number | string) {
  return requestClient.get<SpaceQueryApi.SpaceQuery>(
    `/vehiclepass/space-query/get?id=${id}`,
  );
}

/** 查询泊位位置 */
export function getSpaceQueryLocation(params: SpaceQueryApi.LocationReqVO) {
  return requestClient.get<SpaceQueryApi.LocationVO>(
    '/vehiclepass/space-query/location',
    { params },
  );
}

/** 查询泊位查询图表 */
export function getSpaceQueryChart(params: SpaceQueryApi.ChartReqVO) {
  return requestClient.get<SpaceQueryApi.ChartVO>(
    '/vehiclepass/space-query/chart',
    {
      params,
    },
  );
}

/** 导出泊位查询 */
export function exportSpaceQuery(params?: SpaceQueryApi.PageReqVO) {
  return requestClient.download('/vehiclepass/space-query/export', {
    params: { ...params },
  });
}
