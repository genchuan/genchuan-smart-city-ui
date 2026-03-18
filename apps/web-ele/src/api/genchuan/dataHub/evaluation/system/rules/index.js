import { requestClient } from '#/api/request.js';

/** 规则分类分页查询（全部/启用/停用） */
export function getRuleCategoryAllPage(params) {
  return requestClient.get('/evaluate/rule-category/allpage', { params });
}

/** 获取状态统计数据（用于 tabs 计数） */
export function getRuleStatusCount() {
  return requestClient.get('/evaluate/rule-category/status-count');
}

/** 创建规则分类（仅基本信息） */
export function createRuleCategory(data) {
  return requestClient.post('/evaluate/rule-category/create', data);
}

/** 更新规则分类（仅基本信息） */
export function updateRuleCategory(data) {
  return requestClient.put('/evaluate/rule-category/update', data);
}

/** 删除规则分类 */
export function deleteRuleCategory(id) {
  return requestClient.delete(`/evaluate/rule-category/delete?id=${id}`);
}

/** 获取规则分类详情（包含规则项列表） */
export function getRuleCategoryDetail(categoryId) {
  return requestClient.get(`/evaluate/rule-category/category-detail?categoryId=${categoryId}`);
}

/** 获取规则概览数据（用于图表） */
export function getRuleOverview() {
  return requestClient.get('/evaluate/rule-category/overview');
}

/** 导出 Excel（后端生成） */
export function exportRuleCategory(params) {
  return requestClient.get('/evaluate/rule-category/export-excel', {
    params,
    responseType: 'blob',
  });
}

// ========== 规则项相关接口 ==========
/** 创建规则项 */
export function createRuleItem(data) {
  return requestClient.post('/evaluate/rule-item/create', data);
}

/** 更新规则项 */
export function updateRuleItem(data) {
  return requestClient.put('/evaluate/rule-item/update', data);
}

/** 删除规则项 */
export function deleteRuleItem(id) {
  return requestClient.delete(`/evaluate/rule-item/delete?id=${id}`);
}

// ========== 字典接口 ==========
/** 获取指标体系下拉列表（用于筛选/表单） */
export function getIndexSystemSimpleList() {
  return requestClient.get('/evaluate/index-system/simple-list');
}

/** 获取指标项下拉列表 */
export function getIndexItemSimpleList() {
  return requestClient.get('/evaluate/index-item/simple-list');
}

/** 获取规则类型字典列表 */
export function getRuleTypeList() {
  return requestClient.get('/evaluate/rule-type/page', { params: { pageNo: 1, pageSize: 100 } });
}

/** 获取对象类型字典列表 */
export function getObjectTypeSimpleList() {
  return requestClient.get('/evaluate/object-type/simple-list');
}

/** 获取状态字典列表 */
export function getStatusSimpleList() {
  return requestClient.get('/evaluate/status/page', { params: { pageNo: 1, pageSize: 100 } }).then(res => {
    const list = res.list || res.data?.list || [];
    return list.map(item => ({
      value: item.statusId, // 字段名可能为 id、statusId 等，请按实际情况调整
      label: item.name,
    }));
  });
}
