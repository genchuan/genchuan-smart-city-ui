import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询库存管控列表
 * @param {Object} params - 请求参数
 * @param {number} params.cardId - 卡种ID，支持按卡种筛选
 * @param {string} params.status - 库存状态（正常库存/低库存/预警库存）
 * @param {string} params.warnStatus - 告警状态（未告警/已告警）
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getStockControlPage(params) {
  return requestClient.get('/marketop/stock-control/page', { params });
}

/** 导出库存管控数据
 * @returns {Promise}
 */
export function exportStockControl() {
  return requestClient.download('/marketop/stock-control/export');
}

/** 调配库存
 * @param {Object} data - 请求参数
 * @param {number} data.cardId - 卡种ID
 * @param {number} data.sourceStationId - 源场站ID
 * @param {number} data.targetStationId - 目标场站ID
 * @param {number} data.num - 调配数量
 * @returns {Promise}
 */
export function allocateStockControl(data) {
  return requestClient.put('/marketop/stock-control/allocate', data);
}

// ==================== 列表行交互操作接口 ====================

/** 获取库存管控详情
 * @param {Object} params - 请求参数
 * @param {number} params.id - 库存ID
 * @returns {Promise}
 */
export function getStockControlDetail(params) {
  return requestClient.get('/marketop/stock-control/get', { params });
}

/** 补货
 * @param {Object} data - 请求参数
 * @param {number} data.id - 库存ID
 * @param {number} data.num - 补货数量
 * @returns {Promise}
 */
export function replenishStockControl(data) {
  return requestClient.put('/marketop/stock-control/replenish', data);
}

/** 告警
 * @param {Object} data - 请求参数
 * @param {number} data.id - 库存ID
 * @param {string} data.warnContent - 告警内容
 * @returns {Promise}
 */
export function warnStockControl(data) {
  return requestClient.put('/marketop/stock-control/warn', data);
}

// ==================== 数据可视化图表接口 ====================

/** 库存统计（折线图 + 柱状图 + 卡片）
 * @param {Object} params - 请求参数
 * @param {string} params.startTime - 统计开始时间
 * @param {string} params.endTime - 统计结束时间
 * @param {number} params.stationId - 场站ID，支持按场站筛选
 * @returns {Promise}
 */
export function getStockControlChart(params) {
  return requestClient.get('/marketop/stock-control/chart', { params });
}
