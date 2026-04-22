import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询兑换类目列表
 * @param {Object} params - 请求参数
 * @param {string} params.name - 类目名称，支持模糊查询
 * @param {string} params.scope - 适用范围（全平台 / 指定场站）
 * @param {string} params.status - 类目状态（未生效 / 已生效 / 已禁用）
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getExchangeCategoryPage(params) {
  return requestClient.get('/marketop/exchange-category/page', { params });
}

/** 新增兑换类目
 * @param {Object} data - 请求参数
 * @param {string} data.name - 类目名称，唯一
 * @param {string} data.scope - 适用范围（全平台 / 指定场站）
 * @param {number} data.sort - 排序权重，默认0
 * @param {string} data.description - 类目描述
 * @returns {Promise}
 */
export function createExchangeCategory(data) {
  return requestClient.post('/marketop/exchange-category/create', data);
}

/** 导入兑换类目
 * @param {File} file - 导入文件，支持Excel格式
 * @returns {Promise}
 */
export function importExchangeCategory(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/marketop/exchange-category/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 导出兑换类目数据
 * @returns {Promise}
 */
export function exportExchangeCategory() {
  return requestClient.download('/marketop/exchange-category/export');
}

// ==================== 列表行交互操作接口 ====================

/** 获取兑换类目详情
 * @param {Object} params - 请求参数
 * @param {number} params.id - 类目ID
 * @returns {Promise}
 */
export function getExchangeCategoryDetail(params) {
  return requestClient.get('/marketop/exchange-category/get', { params });
}

/** 生效兑换类目
 * @param {Object} data - 请求参数
 * @param {number} data.id - 类目ID
 * @returns {Promise}
 */
export function activateExchangeCategory(data) {
  return requestClient.put('/marketop/exchange-category/activate', data);
}

/** 禁用兑换类目
 * @param {Object} data - 请求参数
 * @param {number} data.id - 类目ID
 * @returns {Promise}
 */
export function disableExchangeCategory(data) {
  return requestClient.put('/marketop/exchange-category/disable', data);
}

/** 启用兑换类目
 * @param {Object} data - 请求参数
 * @param {number} data.id - 类目ID
 * @returns {Promise}
 */
export function enableExchangeCategory(data) {
  return requestClient.put('/marketop/exchange-category/enable', data);
}

/** 编辑兑换类目
 * @param {Object} data - 请求参数
 * @param {number} data.id - 类目ID
 * @param {string} data.name - 类目名称
 * @param {string} data.scope - 适用范围
 * @param {number} data.sort - 排序权重
 * @param {string} data.description - 类目描述
 * @returns {Promise}
 */
export function updateExchangeCategory(data) {
  return requestClient.put('/marketop/exchange-category/update', data);
}

// ==================== 数据可视化图表接口 ====================

/** 兑换类目统计（柱状图 + 卡片）
 * @param {Object} params - 请求参数
 * @param {string} params.startTime - 统计开始时间
 * @param {string} params.endTime - 统计结束时间
 * @returns {Promise}
 */
export function getExchangeCategoryChart(params) {
  return requestClient.get('/marketop/exchange-category/chart', { params });
}
