import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace OilCarHandleApi {
  /** 油车处置信息 */
  export interface OilCarHandle {
    id?: number | string;
    plateNo?: string; // 车牌
    spaceId?: number; // 车位ID
    spaceName?: string; // 车位名称
    identifyTime?: number; // 识别时间
    occupyType?: string; // 占位类型（燃油车占位/其他）
    status?: string; // 处置状态（未处理/处理中/已关闭）
    stationId?: number; // 场站ID
    stationName?: string; // 场站名称
    handleUserId?: number; // 处置人ID
    handleUserName?: string; // 处置人姓名
    handleTime?: number; // 处置时间
    handleMethod?: string; // 处置方式
    handleProgress?: string; // 处置进度
    ignoreReason?: string; // 忽略理由
    remark?: string; // 备注
    reserve1?: string;
    reserve2?: string;
    creator?: string;
    updater?: string;
    createTime?: number;
    updateTime?: number;
  }

  /** 油车处置分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    spaceId?: number;
    identifyTime?: string;
    occupyType?: string;
    status?: string;
    stationId?: number;
    handleUserId?: number;
    remark?: string;
  }

  /** 油车处置批量处理参数 */
  export interface BatchHandleReqVO {
    ids: Array<number | string>;
    handleType: string; // 处置类型（处置/忽略）
  }

  /** 油车处置参数 */
  export interface HandleReqVO {
    id: number | string;
    handleMethod: string;
  }

  /** 油车忽略参数 */
  export interface IgnoreReqVO {
    id: number | string;
    ignoreReason: string;
  }

  /** 油车更新进度参数 */
  export interface UpdateProgressReqVO {
    id: number | string;
    handleProgress: string;
  }

  /** 油车处置图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 油车处置图表数据 */
  export interface ChartVO {
    handleProgressTrend?: Array<{ count: number; date: string }>;
    stationHandleCount?: Array<{ count: number; stationName: string }>;
    cardData?: {
      handleCompleteRate: number;
      waitHandleCount: number;
    };
  }
}

/** 查询油车处置分页 */
export function getOilCarHandlePage(params: OilCarHandleApi.PageReqVO) {
  return requestClient.get<PageResult<OilCarHandleApi.OilCarHandle>>(
    '/vehiclepass/oil-car-handle/page',
    { params },
  );
}

/** 查询油车处置详情 */
export function getOilCarHandle(id: number | string) {
  return requestClient.get<OilCarHandleApi.OilCarHandle>(
    `/vehiclepass/oil-car-handle/get?id=${id}`,
  );
}

/** 导出油车处置 */
export function exportOilCarHandle(params?: OilCarHandleApi.PageReqVO) {
  return requestClient.download('/vehiclepass/oil-car-handle/export', {
    params: { ...params },
  });
}

/** 批量处理油车处置 */
export function batchHandleOilCar(data: OilCarHandleApi.BatchHandleReqVO) {
  return requestClient.post<boolean>(
    '/vehiclepass/oil-car-handle/batch-handle',
    data,
  );
}

/** 处置油车 */
export function handleOilCar(data: OilCarHandleApi.HandleReqVO) {
  return requestClient.put<boolean>('/vehiclepass/oil-car-handle/handle', data);
}

/** 忽略油车处置 */
export function ignoreOilCarHandle(data: OilCarHandleApi.IgnoreReqVO) {
  return requestClient.put<boolean>('/vehiclepass/oil-car-handle/ignore', data);
}

/** 更新油车处置进度 */
export function updateOilCarHandleProgress(
  data: OilCarHandleApi.UpdateProgressReqVO,
) {
  return requestClient.put<boolean>(
    '/vehiclepass/oil-car-handle/update-progress',
    data,
  );
}

/** 查询油车处置图表 */
export function getOilCarHandleChart(params: OilCarHandleApi.ChartReqVO) {
  return requestClient.get<OilCarHandleApi.ChartVO>(
    '/vehiclepass/oil-car-handle/chart',
    { params },
  );
}
