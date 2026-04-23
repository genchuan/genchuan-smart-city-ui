// src/api/genchuan/industry/chargePark/carService/serviceReport/cycleReport/index.js

import { requestClient } from '#/api/request';

// ==================== 周期报表核心接口 ====================

export function getCycleReportPage(params) {
  return requestClient.get('/carservice/cycle-report/page', { params });
}

export function createCycleReport(data) {
  return requestClient.post('/carservice/cycle-report/create', data);
}

export function getCycleReportDetail(params) {
  return requestClient.get('/carservice/cycle-report/get', { params });
}

// 导出列表（使用 download 方法，自动处理参数和 Blob）
export function exportCycleReport(params) {
  return requestClient.download('/carservice/cycle-report/export', params);
}

// 导出单条报表：手动拼接 id 到 URL，确保 GET query 参数正确传递
export function rowExportCycleReport(id) {
  return requestClient.download(`/carservice/cycle-report/row-export?id=${id}`);
}

export function compareYoy(params) {
  return requestClient.get('/carservice/cycle-report/compare-yoy', { params });
}

export function compareMom(params) {
  return requestClient.get('/carservice/cycle-report/compare-mom', { params });
}

export function getCycleReportChart(params) {
  return requestClient.get('/carservice/cycle-report/chart', { params });
}

export function getChartDrillData(params) {
  return requestClient.get('/carservice/cycle-report/chart-drill', { params });
}

export function getDimensionDetail(params) {
  return requestClient.get('/carservice/cycle-report/detail', { params });
}

export function getUserInfo(userId) {
  return requestClient.get('/system/user/get', { params: { id: userId } });
}
