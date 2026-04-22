import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace OilCarHandleApi {
  /** 油车处理信息 */
  export interface OilCarHandle {
    id?: number | string;
    plateNo?: string;
    plateColor?: string;
    enterTime?: string;
    stationId?: number;
    stationName?: string;
    detectTime?: string;
    handleStatus?: string;
    handleResult?: string;
    handleTime?: string;
    handler?: string;
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 油车处理分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    plateColor?: string;
    stationId?: number;
    handleStatus?: string;
  }

  /** 油车处理批量处理参数 */
  export interface BatchHandleReqVO {
    ids: Array<number | string>;
    handleResult: string;
    remark?: string;
  }

  /** 油车处理处理参数 */
  export interface HandleReqVO {
    id: number | string;
    handleResult: string;
    remark?: string;
  }

  /** 油车处理忽略参数 */
  export interface IgnoreReqVO {
    id: number | string;
    ignoreReason?: string;
  }

  /** 油车处理更新进度参数 */
  export interface UpdateProgressReqVO {
    id: number | string;
    progress: string;
    progressRemark?: string;
  }

  /** 油车处理图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 油车处理图表数据 */
  export interface ChartVO {
    oilCarTrend: Array<{ count: number; date: string }>;
    stationOilCarCount: Array<{ count: number; stationName: string }>;
    cardData: {
      handleRate: number;
      totalOilCar: number;
    };
  }
}

/** 查询油车处理分页 */
export function getOilCarHandlePage(params: OilCarHandleApi.PageReqVO) {
  return requestClient.get<PageResult<OilCarHandleApi.OilCarHandle>>(
    '/vehiclepass/oil-car-handle/page',
    { params },
  );
}

/** 查询油车处理详情 */
export function getOilCarHandle(id: number | string) {
  return requestClient.get<OilCarHandleApi.OilCarHandle>(
    `/vehiclepass/oil-car-handle/get?id=${id}`,
  );
}

/** 导出油车处理 */
export function exportOilCarHandle(params?: OilCarHandleApi.PageReqVO) {
  return requestClient.download('/vehiclepass/oil-car-handle/export', {
    params,
  });
}

/** 批量处理油车 */
export function batchHandleOilCarHandle(
  data: OilCarHandleApi.BatchHandleReqVO,
) {
  return requestClient.put<boolean>(
    '/vehiclepass/oil-car-handle/batch-handle',
    data,
  );
}

/** 处理油车 */
export function handleOilCarHandle(data: OilCarHandleApi.HandleReqVO) {
  return requestClient.put<boolean>('/vehiclepass/oil-car-handle/handle', data);
}

/** 忽略油车处理 */
export function ignoreOilCarHandle(data: OilCarHandleApi.IgnoreReqVO) {
  return requestClient.put<boolean>('/vehiclepass/oil-car-handle/ignore', data);
}

/** 更新油车处理进度 */
export function updateOilCarHandleProgress(
  data: OilCarHandleApi.UpdateProgressReqVO,
) {
  return requestClient.put<boolean>(
    '/vehiclepass/oil-car-handle/update-progress',
    data,
  );
}

/** 查询油车处理图表 */
export function getOilCarHandleChart(params: OilCarHandleApi.ChartReqVO) {
  return requestClient.get<OilCarHandleApi.ChartVO>(
    '/vehiclepass/oil-car-handle/chart',
    { params },
  );
}
