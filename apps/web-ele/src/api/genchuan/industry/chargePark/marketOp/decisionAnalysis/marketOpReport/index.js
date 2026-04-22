import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询营销运营报表列表
 * @param {Object} params - 请求参数
 * @param {string} params.reportType - 报表类型（日报 / 周报 / 月报 / 季报 / 半年报 / 年报 / 自定义报表）
 * @param {string} params.startTime - 统计开始时间，自定义报表时必填
 * @param {string} params.endTime - 统计结束时间，自定义报表时必填
 * @param {number} params.pageNo - 页码，默认 1
 * @param {number} params.pageSize - 每页条数，默认 10
 * @returns {Promise}
 */
export function getMarketOpReportPage(params) {
  return requestClient.get('/marketop/market-op-report/page', { params });
}

/** 导出营销运营报表数据
 * @returns {Promise}
 */
export function exportMarketOpReport() {
  return requestClient.download('/marketop/market-op-report/export');
}

// ==================== 列表行交互操作接口 ====================

/** 获取营销运营报表详情
 * @param {Object} params - 请求参数
 * @param {number} params.id - 报表ID
 * @returns {Promise}
 */
export function getMarketOpReportDetail(params) {
  return requestClient.get('/marketop/market-op-report/get', { params });
}

// ==================== 数据可视化图表接口 ====================

/** 营销运营分析（折线图 + 柱状图 + 卡片）
 * @param {Object} params - 请求参数
 * @param {number} params.reportId - 报表ID
 * @returns {Promise}
 */
export function getMarketOpReportChart(params) {
  return requestClient.get('/marketop/market-op-report/chart', { params });
}
