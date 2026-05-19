import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace AbnormalLeaveApi {
  /** 异常离场信息 */
  export interface AbnormalLeave {
    id?: number | string;
    plateNo?: string;
    abnormalType?: string;
    identifyTime?: string;
    status?: string;
    stationId?: number;
    stationName?: string;
    handleUserId?: number;
    handleUserName?: string;
    handleTime?: string;
    handleProgress?: string;
    ignoreReason?: string;
    remark?: string;
    reserve1?: string;
    reserve2?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 异常离场分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    abnormalType?: string;
    identifyTime?: string[];
    status?: string;
    stationId?: number;
    handleUserId?: number;
    remark?: string;
  }

  /** 异常离场批量处理参数 */
  export interface BatchHandleReqVO {
    ids: Array<number | string>;
    handleType: string;
  }

  /** 异常离场核查参数 */
  export interface CheckReqVO {
    id: number | string;
  }

  /** 异常离场忽略参数 */
  export interface IgnoreReqVO {
    id: number | string;
    ignoreReason: string;
  }

  /** 异常离场更新进度参数 */
  export interface UpdateProgressReqVO {
    id: number | string;
    handleProgress: string;
  }

  /** 异常离场图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 异常离场图表数据 */
  export interface ChartVO {
    abnormalLeaveTrend: Array<{ count: number; date: string }>;
    stationAbnormalCount: Array<{ count: number; stationName: string }>;
    cardData: {
      handleCompleteRate: number;
      waitHandleCount: number;
    };
  }
}

/** 查询异常离场分页 */
export function getAbnormalLeavePage(params: AbnormalLeaveApi.PageReqVO) {
  return requestClient.get<PageResult<AbnormalLeaveApi.AbnormalLeave>>(
    '/vehiclepass/abnormal-leave/page',
    { params },
  );
}

/** 查询异常离场详情 */
export function getAbnormalLeave(id: number | string) {
  return requestClient.get<AbnormalLeaveApi.AbnormalLeave>(
    `/vehiclepass/abnormal-leave/get?id=${id}`,
  );
}

/** 导出异常离场 */
export function exportAbnormalLeave(params?: AbnormalLeaveApi.PageReqVO) {
  return requestClient.download('/vehiclepass/abnormal-leave/export', {
    params: { ...params },
  });
}

/** 批量处理异常离场 */
export function batchHandleAbnormalLeave(
  data: AbnormalLeaveApi.BatchHandleReqVO,
) {
  return requestClient.put<boolean>(
    '/vehiclepass/abnormal-leave/batch-handle',
    data,
  );
}

/** 核查异常离场 */
export function checkAbnormalLeave(data: AbnormalLeaveApi.CheckReqVO) {
  return requestClient.put<boolean>('/vehiclepass/abnormal-leave/check', data);
}

/** 忽略异常离场 */
export function ignoreAbnormalLeave(data: AbnormalLeaveApi.IgnoreReqVO) {
  return requestClient.put<boolean>('/vehiclepass/abnormal-leave/ignore', data);
}

/** 更新异常离场进度 */
export function updateAbnormalLeaveProgress(
  data: AbnormalLeaveApi.UpdateProgressReqVO,
) {
  return requestClient.put<boolean>(
    '/vehiclepass/abnormal-leave/update-progress',
    data,
  );
}

/** 查询异常离场图表 */
export function getAbnormalLeaveChart(params: AbnormalLeaveApi.ChartReqVO) {
  return requestClient.get<AbnormalLeaveApi.ChartVO>(
    '/vehiclepass/abnormal-leave/chart',
    { params },
  );
}
