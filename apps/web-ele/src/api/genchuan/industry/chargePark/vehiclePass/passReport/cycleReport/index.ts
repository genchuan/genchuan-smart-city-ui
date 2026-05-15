import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// ==================== 周期报表管理 ====================

export namespace CycleReportApi {
  /** 周期报表信息 */
  export interface CycleReport {
    id?: number | string;
    reportCycle?: string; // 报表周期（日报/周报/月报/季报/半年报/年报/自定义报表）
    statStartTime?: string; // 统计开始时间
    statEndTime?: string; // 统计结束时间
    stationId?: number | string; // 场站ID
    stationName?: string; // 场站名称
    enterCount?: number; // 入场量
    leaveCount?: number; // 离场量
    parkingCount?: number; // 在停车辆数
    identifySuccessRate?: number; // 识别成功率
    checkSuccessRate?: number; // 核验成功率
    abnormalHandleRate?: number; // 异常处置率
    etcPassSuccessRate?: number; // ETC通行成功率
    reportStatus?: string; // 报表生成状态
    createTime?: string; // 报表生成时间
    createCost?: number; // 报表生成耗时
    updateTime?: string; // 数据更新时间
    creator?: string; // 操作人
    remark?: string; // 备注
  }

  /** 周期报表分页查询参数 */
  export interface PageReqVO extends PageParam {
    reportCycle?: string; // 报表周期
    stationId?: number | string; // 场站ID
    reportStatus?: string; // 报表生成状态
    beginTime?: string; // 统计开始时间
    endTime?: string; // 统计结束时间
    creator?: string; // 操作人
  }

  /** 周期报表生成参数 */
  export interface CreateReqVO {
    reportCycle: string; // 报表周期（日报/周报/月报/季报/半年报/年报/自定义报表）
    statStartTime: string; // 统计开始时间
    statEndTime: string; // 统计结束时间
    stationId: number | string; // 场站ID
    remark?: string; // 备注
    tenantId?: number; // 租户ID
  }

  /** 周期报表图表查询参数 */
  export interface ChartReqVO {
    reportCycle: string; // 报表周期（日报/周报/月报/季报/半年报/年报）
    stationId?: number | string; // 场站ID
    statTime: string; // 统计时间
    tenantId?: number; // 租户ID
  }

  /** 周期报表图表数据 */
  export interface ChartVO {
    cardData: {
      enterCount: number; // 入场量
      leaveCount: number; // 离场量
      parkingCount: number; // 在停车辆数
      identifySuccessRate: number; // 识别成功率
      checkSuccessRate: number; // 核验成功率
      abnormalHandleRate: number; // 异常处置率
      etcPassSuccessRate: number; // ETC通行成功率
    };
    mapData: Array<{
      stationName: string; // 场站名称
      parkingCount: number; // 在停车辆数
      passCount: number; // 通行量
      spaceUseRate: number; // 泊位使用率
    }>;
    barData: Array<{
      stationName?: string; // 场站名称
      hour?: string; // 时段
      passCount: number; // 通行量
      abnormalCount: number; // 异常数
      etcPassCount: number; // ETC通行量
      enterCount?: number; // 入场量
      leaveCount?: number; // 离场量
    }>;
    lineData: Array<{
      statTime: string; // 统计时间
      passCount: number; // 通行量
      identifySuccessRate: number; // 识别成功率
      abnormalHandleRate: number; // 异常处置率
      checkSuccessRate: number; // 核验成功率
      enterCount?: number; // 入场量
      leaveCount?: number; // 离场量
    }>;
    pieData: Array<{
      type: string; // 类型
      count: number; // 数量
      name?: string; // 名称
      value?: number; // 值
    }>;
  }
}

/**
 * 分页查询周期报表列表
 * @param params 查询参数
 */
export function getCycleReportPage(params: CycleReportApi.PageReqVO) {
  return requestClient.get<PageResult<CycleReportApi.CycleReport>>(
    '/vehiclepass/cycle-report/page',
    { params },
  );
}

/**
 * 生成周期报表
 * @param data 报表生成参数
 */
export function createCycleReport(data: CycleReportApi.CreateReqVO) {
  return requestClient.post<{ id: number | string; reportStatus: string }>(
    '/vehiclepass/cycle-report/create',
    data,
  );
}

/**
 * 获取周期报表详情
 * @param id 报表ID
 */
export function getCycleReport(id: number | string) {
  return requestClient.get<CycleReportApi.CycleReport>(
    '/vehiclepass/cycle-report/get',
    { params: { id } },
  );
}

/**
 * 导出周期报表（批量导出）
 * @param params 导出参数
 */
export function exportCycleReport(params?: CycleReportApi.PageReqVO) {
  return requestClient.download('/vehiclepass/cycle-report/export', {
    params: { ...params },
  });
}

/**
 * 导出单条周期报表
 * @param id 报表ID
 */
export function exportCycleReportById(id: number | string) {
  return requestClient.download('/vehiclepass/cycle-report/export', {
    params: { id },
  });
}

/**
 * 获取周期报表图表数据
 * @param params 图表查询参数
 */
export function getCycleReportChart(params: CycleReportApi.ChartReqVO) {
  return requestClient.get<CycleReportApi.ChartVO>(
    '/vehiclepass/cycle-report/chart',
    { params },
  );
}
