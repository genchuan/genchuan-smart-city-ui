import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询卡种配置列表
 * @param {object} params - 请求参数
 * @param {string} params.name - 卡种名称，支持模糊查询
 * @param {string} params.type - 卡种类型（日卡/周卡/月卡/季卡/年卡）
 * @param {string} params.scope - 适用范围（充电/停车/充停通用）
 * @param {string} params.status - 配置状态（未生效/已生效）
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCardConfigPage(params) {
  return requestClient.get('/marketop/card-config/page', { params });
}

/** 新增卡种配置
 * @param {object} data - 请求参数
 * @param {string} data.name - 卡种名称，唯一
 * @param {string} data.type - 卡种类型（日卡/周卡/月卡/季卡/年卡）
 * @param {string} data.scope - 适用范围（充电/停车/充停通用）
 * @param {number} data.price - 价格
 * @param {number} data.validDays - 有效期，卡种有效天数
 * @param {string} data.description - 卡种描述
 * @returns {Promise}
 */
export function createCardConfig(data) {
  return requestClient.post('/marketop/card-config/create', data);
}

/** 编辑卡种配置
 * @param {object} data - 请求参数
 * @param {number} data.id - 配置ID
 * @param {string} data.name - 卡种名称，唯一
 * @param {string} data.type - 卡种类型（日卡/周卡/月卡/季卡/年卡）
 * @param {string} data.scope - 适用范围（充电/停车/充停通用）
 * @param {number} data.price - 价格
 * @param {number} data.validDays - 有效期，卡种有效天数
 * @param {string} data.description - 卡种描述
 * @returns {Promise}
 */
export function updateCardConfig(data) {
  return requestClient.put('/marketop/card-config/update', data);
}

/** 保存卡种配置（新增或编辑）
 * @param {object} data - 请求参数
 * @param {number} data.id - 配置ID，新增时为空，编辑时必填
 * @param {string} data.name - 卡种名称，唯一
 * @param {string} data.type - 卡种类型（日卡/周卡/月卡/季卡/年卡）
 * @param {string} data.scope - 适用范围（充电/停车/充停通用）
 * @param {number} data.price - 价格
 * @param {number} data.validDays - 有效期，卡种有效天数
 * @param {string} data.description - 卡种描述
 * @returns {Promise}
 */
export function saveCardConfig(data) {
  return requestClient.put('/marketop/card-config/save', data);
}

// ==================== 列表行交互操作接口 ====================

/** 获取卡种配置详情
 * @param {object} params - 请求参数
 * @param {number} params.id - 配置ID
 * @returns {Promise}
 */
export function getCardConfigDetail(params) {
  return requestClient.get('/marketop/card-config/get', { params });
}

/** 生效卡种配置
 * @param {object} data - 请求参数
 * @param {number} data.id - 配置ID
 * @returns {Promise}
 */
export function activateCardConfig(data) {
  return requestClient.put('/marketop/card-config/enable', data);
}

/** 禁用卡种配置
 * @param {object} data - 请求参数
 * @param {number} data.id - 配置ID
 * @returns {Promise}
 */
export function disableCardConfig(data) {
  return requestClient.put('/marketop/card-config/disable', data);
}

// ==================== 数据可视化图表接口  ====================

/** 卡种配置统计（饼图 + 卡片）
 * @returns {Promise}
 */
export function getCardConfigChart() {
  return requestClient.get('/marketop/card-config/chart');
}

/** 获取卡种 精简列表（用于下拉选择） */
export function getCardConfigList() {
  return requestClient.get('/marketop/card-config/simple-list');
}
