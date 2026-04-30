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

/** 下载导入积分活动模板
 * @returns {Promise} 返回文件流
 */
export function getExchangeCategoryImportTemplate() {
  return requestClient.download(
    '/marketop/exchange-category/get-import-template',
  );
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
 * @param {Object} params - 请求参数
 * @param {number} params.id - 类目ID
 * @returns {Promise}
 */
export function activateExchangeCategory(params) {
  return requestClient.put('/marketop/exchange-category/enable', null, { params });
}

/** 禁用兑换类目
 * @param {Object} params - 请求参数
 * @param {number} params.id - 类目ID
 * @returns {Promise}
 */
export function disableExchangeCategory(params) {
  return requestClient.put('/marketop/exchange-category/disable', null, { params });
}

/** 启用兑换类目
 * @param {Object} params - 请求参数
 * @param {number} params.id - 类目ID
 * @returns {Promise}
 */
export function enableExchangeCategory(params) {
  return requestClient.put('/marketop/exchange-category/enable', null, { params });
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
 * @returns {Promise}
 */
export function getExchangeCategoryChart() {
  return requestClient.get('/marketop/exchange-category/chart');
}
