import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询活动配置列表
 * @param {object} params - 请求参数
 * @param {string} params.name - 活动名称，支持模糊查询
 * @param {string} params.type - 配置类型（新用户/节假日/店庆/日常）
 * @param {string} params.userGroup - 适用人群（新用户/老用户/全部）
 * @param {string} params.status - 配置状态（未生效/已生效）
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getActivityConfigPage(params) {
  return requestClient.get('/marketop/activity-config/page', { params });
}

/** 新增活动配置
 * @param {object} data - 请求参数
 * @param {string} data.name - 活动名称，唯一
 * @param {string} data.type - 配置类型（新用户/节假日/店庆/日常）
 * @param {string} data.joinCondition - 参与条件
 * @param {string} data.ruleContent - 规则内容
 * @param {string} data.userGroup - 适用人群（新用户/老用户/全部）
 * @param {string} data.description - 活动描述
 * @returns {Promise}
 */
export function createActivityConfig(data) {
  return requestClient.post('/marketop/activity-config/create', data);
}

/** 编辑活动配置
 * @param {object} data - 请求参数
 * @param {number} data.id - 配置ID
 * @param {string} data.name - 活动名称，唯一
 * @param {string} data.type - 配置类型（新用户/节假日/店庆/日常）
 * @param {string} data.joinCondition - 参与条件
 * @param {string} data.ruleContent - 规则内容
 * @param {string} data.userGroup - 适用人群（新用户/老用户/全部）
 * @param {string} data.description - 活动描述
 * @returns {Promise}
 */
export function updateActivityConfig(data) {
  return requestClient.put('/marketop/activity-config/update', data);
}

/** 保存活动配置（新增或编辑）
 * @param {object} data - 请求参数
 * @param {number} data.id - 配置ID，新增时为空，编辑时必填
 * @param {string} data.name - 活动名称，唯一
 * @param {string} data.type - 配置类型（新用户/节假日/店庆/日常）
 * @param {string} data.joinCondition - 参与条件
 * @param {string} data.ruleContent - 规则内容
 * @param {string} data.userGroup - 适用人群（新用户/老用户/全部）
 * @param {string} data.description - 活动描述
 * @returns {Promise}
 */
export function saveActivityConfig(data) {
  return requestClient.put('/marketop/activity-config/save', data);
}

// ==================== 列表行交互操作接口 ====================

/** 获取活动配置详情
 * @param {number} id - 配置ID
 * @returns {Promise}
 */
export function getActivityConfigDetail(id) {
  return requestClient.get('/marketop/activity-config/get', { params: { id } });
}

/** 生效活动配置
 * @param {object} data - 请求参数
 * @param {number} data.id - 配置ID
 * @returns {Promise}
 */
export function activateActivityConfig(data) {
  return requestClient.put('/marketop/activity-config/activate', data);
}

/** 禁用活动配置
 * @param {object} data - 请求参数
 * @param {number} data.id - 配置ID
 * @returns {Promise}
 */
export function disableActivityConfig(data) {
  return requestClient.put('/marketop/activity-config/disable', data);
}

// ==================== 数据可视化图表接口 ====================

/** 活动配置统计（饼图 + 卡片）
 * @returns {Promise}
 */
export function getActivityConfigChart() {
  return requestClient.get('/marketop/activity-config/chart');
}
