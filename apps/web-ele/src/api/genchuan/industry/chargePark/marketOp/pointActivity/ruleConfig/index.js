import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询积分规则配置列表 */
export function getRuleConfigPage(params) {
  return requestClient.get('/marketop/rule-config/page', { params });
}

/** 新增积分规则配置 */
export function createRuleConfig(data) {
  return requestClient.post('/marketop/rule-config/create', data);
}

/** 编辑积分规则配置 */
export function updateRuleConfig(data) {
  return requestClient.put('/marketop/rule-config/update', data);
}

/** 保存积分规则配置（新增或编辑） */
export function saveRuleConfig(data) {
  return requestClient.put('/marketop/rule-config/save', data);
}

/** 导出积分规则配置数据 */
export function exportRuleConfig() {
  return requestClient.download('/marketop/rule-config/export');
}

// ==================== 列表行交互操作接口 ====================

/** 获取积分规则配置详情 */
export function getRuleConfigDetail(id) {
  return requestClient.get('/marketop/rule-config/get', { params: { id } });
}

/** 生效积分规则配置 */
export function activateRuleConfig(data) {
  return requestClient.put('/marketop/rule-config/activate', data);
}

/** 禁用积分规则配置 */
export function disableRuleConfig(data) {
  return requestClient.put('/marketop/rule-config/disable', data);
}

// ==================== 数据可视化图表接口 ====================

/** 积分规则统计（饼图 + 卡片） */
export function getRuleConfigChart() {
  return requestClient.get('/marketop/rule-config/chart');
}
