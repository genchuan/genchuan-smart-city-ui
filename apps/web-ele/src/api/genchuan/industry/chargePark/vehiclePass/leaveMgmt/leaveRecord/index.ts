import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace LeaveRecordApi {
  /** 离场记录信息 */
  export interface LeaveRecord {
    id?: number | string;
    plateNo?: string; // 车牌
    enterTime?: string; // 入场时间
    leaveTime?: string; // 离场时间
    parkDuration?: number; // 停车时长（分钟）
    status?: string; // 记录状态（正常记录/异常记录）
    stationId?: number; // 场站ID
    stationName?: string; // 场站名称
    remark?: string; // 备注
    proofImage?: string; // 佐证图片
    isCorrected?: boolean; // 修正日志标记
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 离场记录分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    enterTime?: number[];
    leaveTime?: number[];
    leaveTimeHour?: string;
    parkDuration?: number;
    status?: string;
    stationId?: number;
    stationName?: string;
    remark?: string;
    isCorrected?: number;
  }

  /** 离场记录创建参数 */
  export interface CreateReqVO {
    plateNo: string;
    enterTime: string;
    leaveTime: string;
    status: string;
    stationId: number;
    remark?: string;
    proofImage?: string;
  }

  /** 离场记录更新参数 */
  export interface UpdateReqVO {
    id: number | string;
    plateNo: string;
    enterTime: string;
    leaveTime: string;
    status: string;
    stationId: number;
    remark?: string;
    proofImage?: string;
  }

  /** 离场记录修正参数 */
  export interface CorrectReqVO {
    id: number | string;
    plateNo: string;
    enterTime: string;
    leaveTime: string;
    status: string;
    stationId: number;
    remark?: string;
    proofImage?: string;
    isCorrected: boolean;
  }

  /** 离场记录图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 离场记录图表数据 */
  export interface ChartVO {
    leaveCountTrend?: Array<{ count: number; date: string }>;
    hourLeaveCount?: Array<{ count: number; hour: string }>;
    cardData?: {
      leavePeak: number;
      todayLeaveCount: number;
    };
  }
}

/** 查询离场记录分页 */
export function getLeaveRecordPage(params: LeaveRecordApi.PageReqVO) {
  return requestClient.get<PageResult<LeaveRecordApi.LeaveRecord>>(
    '/vehiclepass/leave-record/page',
    { params },
  );
}

/** 查询离场记录详情 */
export function getLeaveRecord(id: number | string) {
  return requestClient.get<LeaveRecordApi.LeaveRecord>(
    `/vehiclepass/leave-record/get?id=${id}`,
  );
}

/** 新增离场记录 */
export function createLeaveRecord(data: LeaveRecordApi.CreateReqVO) {
  return requestClient.post<boolean>('/vehiclepass/leave-record/create', data);
}

/** 更新离场记录 */
export function updateLeaveRecord(data: LeaveRecordApi.UpdateReqVO) {
  return requestClient.put<boolean>('/vehiclepass/leave-record/update', data);
}

/** 修正离场记录 */
export function correctLeaveRecord(data: LeaveRecordApi.CorrectReqVO) {
  return requestClient.put<boolean>('/vehiclepass/leave-record/correct', data);
}

/** 导出离场记录 */
export function exportLeaveRecord(params?: LeaveRecordApi.PageReqVO) {
  return requestClient.download('/vehiclepass/leave-record/export', {
    params: { ...params },
  });
}

/** 查询离场记录图表 */
export function getLeaveRecordChart(params: LeaveRecordApi.ChartReqVO) {
  return requestClient.get<LeaveRecordApi.ChartVO>(
    '/vehiclepass/leave-record/chart',
    { params },
  );
}
