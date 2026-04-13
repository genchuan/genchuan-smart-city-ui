// order-report/api/index.js
import { requestClient } from '#/api/request.js';
import { mockReportList, mockReportDetail, mockChartData } from '#/views/genchuan/industry/energyCharging/carCharging/chargingOrder/orderReport/table/data.js';

// 开发环境下使用 Mock 数据（上线前改为 false）
const USE_MOCK = true;  // 👈 改为 true，启用前端 Mock 筛选

/**
 * 前端过滤函数（完整支持所有筛选字段）
 */
function filterMockData(data, params) {
  let filtered = [...data];

  // 分页参数不影响过滤，只用于后续分页
  if (params.reportCode) {
    filtered = filtered.filter(item => item.reportCode.includes(params.reportCode));
  }
  if (params.reportName) {
    filtered = filtered.filter(item => item.reportName.includes(params.reportName));
  }
  if (params.reportType) {
    filtered = filtered.filter(item => item.reportType === params.reportType);
  }
  if (params.reportStatus) {
    filtered = filtered.filter(item => item.reportStatus === params.reportStatus);
  }
  if (params.timeScale) {
    filtered = filtered.filter(item => item.timeScale === params.timeScale);
  }
  if (params.startTime && params.endTime) {
    const start = Number(params.startTime);
    const end = Number(params.endTime);
    filtered = filtered.filter(item => Number(item.startTime) >= start && Number(item.endTime) <= end);
  }
  if (params.createTimeBegin && params.createTimeEnd) {
    const begin = Number(params.createTimeBegin);
    const end = Number(params.createTimeEnd);
    filtered = filtered.filter(item => Number(item.createTime) >= begin && Number(item.createTime) <= end);
  }
  if (params.createUser) {
    filtered = filtered.filter(item => item.createUser?.includes(params.createUser));
  }
  return filtered;
}

/**
 * 分页查询报表列表
 */
export async function getReportPage(params) {
  if (USE_MOCK) {
    // 1. 先过滤
    let filteredList = filterMockData(mockReportList, params);
    // 2. 再分页
    const total = filteredList.length;
    const pageNo = params.pageNo || 1;
    const pageSize = params.pageSize || 10;
    const start = (pageNo - 1) * pageSize;
    const pagedList = filteredList.slice(start, start + pageSize);
    return { list: pagedList, total };
  }
  return requestClient.get('/vehiclecharging/order-report/page', { params });
}

/**
 * 导出报表列表
 */
export async function exportReportList(params) {
  if (USE_MOCK) {
    // 模拟导出：基于过滤后的数据生成 Blob（实际可复用 filterMockData）
    const filteredList = filterMockData(mockReportList, params);
    // 简单模拟一个 Excel 文件
    const blob = new Blob([JSON.stringify(filteredList, null, 2)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
  }
  return requestClient.get('/vehiclecharging/order-report/export', {
    params,
    responseType: 'blob',
  });
}

/**
 * 自定义报表生成
 */
export async function customCreateReport(data) {
  if (USE_MOCK) {
    console.log('模拟生成自定义报表', data);
    return { success: true };
  }
  return requestClient.post('/vehiclecharging/order-report/customCreate', data);
}

/**
 * 重新生成自定义报表
 */
export async function recreateReport(data) {
  if (USE_MOCK) {
    console.log('模拟重新生成报表', data);
    return { success: true };
  }
  return requestClient.post('/vehiclecharging/order-report/recreate', data);
}

/**
 * 获取报表详情
 */
export async function getReportDetail(id) {
  if (USE_MOCK) {
    // 根据 id 返回不同的详情（简单处理，实际可根据 id 返回不同 mock）
    return { ...mockReportDetail, id };
  }
  return requestClient.get(`/vehiclecharging/order-report/get?id=${id}`);
}

/**
 * 导出单个报表
 */
export async function exportSingleReport(params) {
  if (USE_MOCK) {
    const blob = new Blob(['模拟单个报表数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
  }
  return requestClient.get('/vehiclecharging/order-report/exportSingle', {
    params,
    responseType: 'blob',
  });
}

/**
 * 打印报表
 */
export async function printReport(params) {
  if (USE_MOCK) {
    // 返回一个模拟的打印预览 URL
    return { data: 'about:blank' };
  }
  return requestClient.get('/vehiclecharging/order-report/print', { params });
}

/**
 * 获取图表数据
 */
export async function getChartData(params) {
  if (USE_MOCK) {
    return mockChartData;
  }
  return requestClient.get('/vehiclecharging/order-report/chart', { params });
}
