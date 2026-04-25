import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace FakePlateControlApi {
  /** 套牌管控信息 */
  export interface FakePlateControl {
    id?: number | string;
    plateNo?: string; // 车牌
    identifyTime?: number; // 识别时间
    matchScene?: string; // 匹配场景（同牌多停/车牌车型不匹配）
    status?: string; // 处置状态（未处理/处理中/已关闭）
    stationId?: number; // 场站ID
    stationName?: string; // 场站名称
    handleUserId?: number; // 处置人ID
    handleUserName?: string; // 处置人姓名
    handleTime?: number; // 处置时间
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

  /** 套牌管控分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    identifyTime?: string;
    matchScene?: string;
    status?: string;
    stationId?: number;
    handleUserId?: number;
    remark?: string;
  }

  /** 套牌管控批量处理参数 */
  export interface BatchHandleReqVO {
    ids: Array<number | string>;
    handleType: string; // 处置类型（核查/忽略）
  }

  /** 套牌管控核查参数 */
  export interface CheckReqVO {
    id: number | string;
  }

  /** 套牌管控忽略参数 */
  export interface IgnoreReqVO {
    id: number | string;
    ignoreReason: string;
  }

  /** 套牌管控更新进度参数 */
  export interface UpdateProgressReqVO {
    id: number | string;
    handleProgress: string;
  }

  /** 套牌管控图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 套牌管控图表数据 */
  export interface ChartVO {
    fakeIdentifyTrend?: Array<{ count: number; date: string }>;
    stationFakeCount?: Array<{ count: number; stationName: string }>;
    cardData?: {
      handleCompleteRate: number;
      waitHandleCount: number;
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
  return requestClient.post<boolean>(
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
