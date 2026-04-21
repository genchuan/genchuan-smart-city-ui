import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace LeaveRecordApi {
  /** 离场记录信息 */
  export interface LeaveRecord {
    id?: number | string;
    plateNo?: string;
    plateColor?: string;
    leaveTime?: string;
    stationId?: number;
    stationName?: string;
    gateId?: number;
    gateName?: string;
    imageUrl?: string;
    parkDuration?: number;
    parkFee?: number;
    payStatus?: string;
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 离场记录分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    plateColor?: string;
    leaveTime?: string;
    stationId?: number;
    gateId?: number;
    payStatus?: string;
  }

  /** 离场记录创建参数 */
  export interface CreateReqVO {
    plateNo: string;
    plateColor: string;
    leaveTime: string;
    stationId: number;
    gateId: number;
    imageUrl?: string;
    parkDuration?: number;
    parkFee?: number;
    payStatus?: string;
    remark?: string;
  }

  /** 离场记录纠正参数 */
  export interface CorrectReqVO {
    id: number | string;
    plateNo?: string;
    plateColor?: string;
    leaveTime?: string;
    stationId?: number;
    gateId?: number;
    imageUrl?: string;
    parkDuration?: number;
    parkFee?: number;
    payStatus?: string;
    remark?: string;
  }

  /** 离场记录图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 离场记录图表数据 */
  export interface ChartVO {
    leaveTrend: Array<{ count: number; date: string }>;
    stationLeaveCount: Array<{ count: number; stationName: string }>;
    cardData: {
      avgParkDuration: number;
      totalLeave: number;
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

/** 导出离场记录 */
export function exportLeaveRecord(params?: LeaveRecordApi.PageReqVO) {
  return requestClient.download('/vehiclepass/leave-record/export', { params });
}

/** 纠正离场记录 */
export function correctLeaveRecord(data: LeaveRecordApi.CorrectReqVO) {
  return requestClient.put<boolean>('/vehiclepass/leave-record/update', data);
}

/** 查询离场记录图表 */
export function getLeaveRecordChart(params: LeaveRecordApi.ChartReqVO) {
  return requestClient.get<LeaveRecordApi.ChartVO>(
    '/vehiclepass/leave-record/chart',
    { params },
  );
}
