import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/**
 * 分页查询券包配置列表
 * @param {Object} params - 请求参数
 * @param {string} params.name - 券包名称，支持模糊查询
 * @param {string} params.type - 券包类型（新手包/节日包/日常包）
 * @param {string} params.scope - 适用范围（全平台/指定场站/指定用户）
 * @param {string} params.status - 配置状态（未生效/已生效）
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getPackageConfigPage(params) {
  return requestClient.get('/marketop/package-config/page', { params });
}

/**
 * 新增券包配置
 * @param {Object} data - 请求参数
 * @param {string} data.name - 券包名称，唯一
 * @param {string} data.type - 券包类型（新手包/节日包/日常包）
 * @param {string} data.couponIds - 包含优惠券ID列表，逗号分隔
 * @param {number} data.price - 价格
 * @param {string} data.scope - 适用范围（全平台/指定场站/指定用户）
 * @param {string} data.description - 券包描述
 * @returns {Promise}
 */
export function createPackageConfig(data) {
  return requestClient.post('/marketop/package-config/create', data);
}

/**
 * 编辑券包配置
 * @param {Object} data - 请求参数
 * @param {number} data.id - 配置ID
 * @param {string} data.name - 券包名称，唯一
 * @param {string} data.type - 券包类型（新手包/节日包/日常包）
 * @param {string} data.couponIds - 包含优惠券ID列表，逗号分隔
 * @param {number} data.price - 价格
 * @param {string} data.scope - 适用范围（全平台/指定场站/指定用户）
 * @param {string} data.description - 券包描述
 * @returns {Promise}
 */
export function updatePackageConfig(data) {
  return requestClient.put('/marketop/package-config/update', data);
}

/**
 * 保存券包配置（新增或编辑）
 * @param {Object} data - 请求参数
 * @param {number} data.id - 配置ID，新增时为空，编辑时必填
 * @param {string} data.name - 券包名称，唯一
 * @param {string} data.type - 券包类型（新手包/节日包/日常包）
 * @param {string} data.couponIds - 包含优惠券ID列表，逗号分隔
 * @param {number} data.price - 价格
 * @param {string} data.scope - 适用范围（全平台/指定场站/指定用户）
 * @param {string} data.description - 券包描述
 * @returns {Promise}
 */
export function savePackageConfig(data) {
  return requestClient.put('/marketop/package-config/save', data);
}

// ==================== 列表行交互操作接口 ====================

/**
 * 获取券包配置详情
 * @param {Object} params - 请求参数
 * @param {number} params.id - 配置ID
 * @returns {Promise}
 */
export function getPackageConfigDetail(params) {
  return requestClient.get('/marketop/package-config/get', { params });
}

/**
 * 生效券包配置
 * @param {Object} data - 请求参数
 * @param {number} data.id - 配置ID
 * @returns {Promise}
 */
export function activatePackageConfig(data) {
  return requestClient.put('/marketop/package-config/activate', data);
}

/**
 * 禁用券包配置
 * @param {Object} data - 请求参数
 * @param {number} data.id - 配置ID
 * @returns {Promise}
 */
export function disablePackageConfig(data) {
  return requestClient.put('/marketop/package-config/disable', data);
}

// ==================== 数据可视化图表接口 ====================

/**
 * 券包配置统计（柱状图 + 卡片）
 * @param {Object} params - 请求参数
 * @param {string} params.startTime - 统计开始时间
 * @param {string} params.endTime - 统计结束时间
 * @returns {Promise}
 */
export function getPackageConfigChart(params) {
  return requestClient.get('/marketop/package-config/chart', { params });
}
