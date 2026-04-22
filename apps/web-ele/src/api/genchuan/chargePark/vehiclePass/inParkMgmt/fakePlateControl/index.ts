import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace FakePlateControlApi {
  /** 套牌管控信息 */
  export interface FakePlateControl {
    id?: number | string;
    plateNo?: string;
    plateColor?: string;
    enterTime?: string;
    stationId?: number;
    stationName?: string;
    suspectReason?: string;
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

  /** 套牌管控分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    plateColor?: string;
    stationId?: number;
    suspectReason?: string;
    handleStatus?: string;
  }

  /** 套牌管控批量处理参数 */
  export interface BatchHandleReqVO {
    ids: Array<number | string>;
    handleResult: string;
    remark?: string;
  }

  /** 套牌管控核查参数 */
  export interface CheckReqVO {
    id: number | string;
    checkResult: string;
    checkRemark?: string;
  }

  /** 套牌管控忽略参数 */
  export interface IgnoreReqVO {
    id: number | string;
    ignoreReason?: string;
  }

  /** 套牌管控更新进度参数 */
  export interface UpdateProgressReqVO {
    id: number | string;
    progress: string;
    progressRemark?: string;
  }

  /** 套牌管控图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 套牌管控图表数据 */
  export interface ChartVO {
    suspectTrend: Array<{ count: number; date: string }>;
    reasonCount: Array<{ count: number; reason: string }>;
    cardData: {
      handleRate: number;
      totalSuspect: number;
    };
  }
}

/** 查询套牌管控分页 */
export function getFakePlateControlPage(params: FakePlateControlApi.PageReqVO) {
  return requestClient.get<PageResult<FakePlateControlApi.FakePlateControl>>(
    '/vehiclepass/fake-plate-control/page',
    { params },
  );
}

/** 查询套牌管控详情 */
export function getFakePlateControl(id: number | string) {
  return requestClient.get<FakePlateControlApi.FakePlateControl>(
    `/vehiclepass/fake-plate-control/get?id=${id}`,
  );
}

/** 导出套牌管控 */
export function exportFakePlateControl(params?: FakePlateControlApi.PageReqVO) {
  return requestClient.download('/vehiclepass/fake-plate-control/export', {
    params,
  });
}

/** 批量处理套牌管控 */
export function batchHandleFakePlateControl(
  data: FakePlateControlApi.BatchHandleReqVO,
) {
  return requestClient.put<boolean>(
    '/vehiclepass/fake-plate-control/batch-handle',
    data,
  );
}

/** 核查套牌管控 */
export function checkFakePlateControl(data: FakePlateControlApi.CheckReqVO) {
  return requestClient.put<boolean>(
    '/vehiclepass/fake-plate-control/check',
    data,
  );
}

/** 忽略套牌管控 */
export function ignoreFakePlateControl(data: FakePlateControlApi.IgnoreReqVO) {
  return requestClient.put<boolean>(
    '/vehiclepass/fake-plate-control/ignore',
    data,
  );
}

/** 更新套牌管控进度 */
export function updateFakePlateControlProgress(
  data: FakePlateControlApi.UpdateProgressReqVO,
) {
  return requestClient.put<boolean>(
    '/vehiclepass/fake-plate-control/update-progress',
    data,
  );
}

/** 查询套牌管控图表 */
export function getFakePlateControlChart(
  params: FakePlateControlApi.ChartReqVO,
) {
  return requestClient.get<FakePlateControlApi.ChartVO>(
    '/vehiclepass/fake-plate-control/chart',
    { params },
  );
}
