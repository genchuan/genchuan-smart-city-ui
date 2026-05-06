import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/**
 * 分页查询领用记录列表
 * @param {Object} params - 请求参数
 * @param {string} params.no - 记录编号，支持模糊查询
 * @param {number} params.userId - 用户ID，支持按用户筛选
 * @param {number} params.couponId - 优惠券ID，支持按优惠券筛选
 * @param {string} params.receiveTime - 领用时间，支持时间范围查询
 * @param {string} params.status - 记录状态（正常记录/异常记录/已核查）
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getReceiveRecordPage(params) {
  return requestClient.get('/marketop/receive-record/page', { params });
}

/**
 * 导出领用记录
 * @returns {Promise}
 */
export function exportReceiveRecord() {
  return requestClient.download('/marketop/receive-record/export');
}

// ==================== 列表行交互操作接口 ====================

/**
 * 获取领用记录详情
 * @param {Object} params - 请求参数
 * @param {number} params.id - 记录ID
 * @returns {Promise}
 */
export function getReceiveRecordDetail(params) {
  return requestClient.get('/marketop/receive-record/get', { params });
}

/**
 * 核查领用记录
 * @param {Object} data - 请求参数
 * @param {number} data.id - 记录ID
 * @param {string} data.checkResult - 核查结果
 * @returns {Promise}
 */
export function checkReceiveRecord(data) {
  return requestClient.put('/marketop/receive-record/check', data);
}

// ==================== 数据可视化图表接口 ====================

/**
 * 领用记录统计（折线图 + 卡片）
 * @returns {Promise}
 */
export function getReceiveRecordChart() {
  return requestClient.get('/marketop/receive-record/chart');
}
