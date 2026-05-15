import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace EnterRecordApi {
  /** 入场记录信息 */
  export interface EnterRecord {
    id?: number | string;
    plateNo?: string; // 车牌
    plateColor?: string; // 车牌颜色（蓝牌/黄牌/绿牌/其他）
    spaceNo?: string; // 车位编号
    enterTime?: string; // 入场时间
    recordType?: string; // 记录类型（自动识别/人工补录）
    status?: string; // 记录状态（正常记录/异常记录）
    stationId?: number; // 场站ID
    remark?: string; // 备注
    proofImage?: string; // 佐证图片地址
    isCorrected?: boolean; // 修正日志标记
    reserve1?: string;
    reserve2?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 入场记录分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    plateColor?: string;
    spaceNo?: string;
    enterTime?: string[];
    recordType?: string;
    status?: string;
    stationId?: number;
    remark?: string;
    isCorrected?: boolean;
  }

  /** 入场记录创建参数 */
  export interface CreateReqVO {
    plateNo: string;
    plateColor: string;
    spaceNo?: string;
    enterTime: string;
    recordType: string;
    status: string;
    stationId: number;
    remark?: string;
    proofImage?: string;
  }

  /** 入场记录更新参数 */
  export interface UpdateReqVO {
    id: number | string;
    plateNo: string;
    plateColor: string;
    spaceNo?: string;
    enterTime: string;
    recordType: string;
    status: string;
    stationId: number;
    remark?: string;
    proofImage?: string;
  }

  /** 入场记录修正参数 */
  export interface CorrectReqVO {
    id: number | string;
    plateNo: string;
    plateColor: string;
    spaceNo?: string;
    enterTime: string;
    status: string;
    stationId: number;
    remark?: string;
    proofImage?: string;
    isCorrected: boolean;
  }

  /** 入场记录图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 入场记录图表数据 */
  export interface ChartVO {
    enterCountTrend: Array<{ count: number; date: string }>;
    hourEnterCount: Array<{ count: number; hour: string }>;
    cardData: {
      enterPeak: number;
      todayEnterCount: number;
    };
  }
}

/** 查询入场记录分页 */
export function getEnterRecordPage(params: EnterRecordApi.PageReqVO) {
  return requestClient.get<PageResult<EnterRecordApi.EnterRecord>>(
    '/vehiclepass/enter-record/page',
    { params },
  );
}

/** 查询入场记录详情 */
export function getEnterRecord(id: number | string) {
  return requestClient.get<EnterRecordApi.EnterRecord>(
    `/vehiclepass/enter-record/get?id=${id}`,
  );
}

/** 新增入场记录 */
export function createEnterRecord(data: EnterRecordApi.CreateReqVO) {
  return requestClient.post<boolean>('/vehiclepass/enter-record/create', data);
}

/** 更新入场记录 */
export function updateEnterRecord(data: EnterRecordApi.UpdateReqVO) {
  return requestClient.put<boolean>('/vehiclepass/enter-record/update', data);
}

/** 导出入场记录 */
export function exportEnterRecord(params?: EnterRecordApi.PageReqVO) {
  return requestClient.download('/vehiclepass/enter-record/export', {
    params: { ...params },
  });
}

/** 修正入场记录 */
export function correctEnterRecord(data: EnterRecordApi.CorrectReqVO) {
  return requestClient.put<boolean>('/vehiclepass/enter-record/correct', data);
}

/** 查询入场记录图表 */
export function getEnterRecordChart(params: EnterRecordApi.ChartReqVO) {
  return requestClient.get<EnterRecordApi.ChartVO>(
    '/vehiclepass/enter-record/chart',
    { params },
  );
}
