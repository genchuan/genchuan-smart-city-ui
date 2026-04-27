import { requestClient } from '#/api/request';

// ==================== 周期报表管理 ====================

/**
 * 分页查询周期报表列表
 * @param params 查询参数
 */
export function getCycleReportPage(params: {
  beginTime?: string; // 统计开始时间
  endTime?: string; // 统计结束时间
  pageNo?: number; // 页码，默认1
  pageSize?: number; // 每页条数，默认10
  reportCycle?: string; // 报表周期（日报/周报/月报/季报/半年报/年报/自定义报表）
  reportStatus?: string; // 报表生成状态
  stationId?: number; // 场站ID
  tenantId?: number; // 租户ID
}) {
  return requestClient.get('/vehiclepass/cycle-report/page', {
    params,
  });
}

/**
 * 生成周期报表
 * @param data 报表生成参数
 */
export function createCycleReport(data: {
  remark?: string; // 备注
  reportCycle: string; // 报表周期（日报/周报/月报/季报/半年报/年报/自定义报表）
  statEndTime: string; // 统计结束时间
  stationId: number; // 场站ID
  statStartTime: string; // 统计开始时间
  tenantId: number; // 租户ID
}) {
  return requestClient.post('/vehiclepass/cycle-report/create', data);
}

/**
 * 获取周期报表详情
 * @param id 报表ID
 */
export function getCycleReport(id: number) {
  return requestClient.get('/vehiclepass/cycle-report/get', {
    params: { id },
  });
}

/**
 * 导出周期报表
 * @param params 导出参数
 */
export function exportCycleReport(params: {
  beginTime?: string; // 统计开始时间
  endTime?: string; // 统计结束时间
  reportCycle?: string; // 报表周期
  reportStatus?: string; // 报表生成状态
  stationId?: number; // 场站ID
  tenantId?: number; // 租户ID
}) {
  return requestClient.get('/vehiclepass/cycle-report/export', {
    params,
    responseType: 'blob',
  });
}

/**
 * 获取周期报表图表数据
 * @param params 图表查询参数
 */
export function getCycleReportChart(params: {
  reportCycle: string; // 报表周期（日报/周报/月报/季报/半年报/年报）
  stationId?: number; // 场站ID
  statTime: string; // 统计时间
  tenantId: number; // 租户ID
}) {
  return requestClient.get('/vehiclepass/cycle-report/chart', {
    params,
  });
}
