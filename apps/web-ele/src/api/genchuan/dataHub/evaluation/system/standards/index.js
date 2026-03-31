// #/api/genchuan/dataHub/evaluation/standard/index.js
import { requestClient } from '#/api/request.js';

/** 标准分类分页查询 */
export function getStandardCategoryPage(params) {
  return requestClient.get('/evaluate/standard-category/page', { params });
}

/** 获取标准分类详情（含标准项） */
export function getStandardCategoryDetail(id) {
  return requestClient.get(`/evaluate/standard-category/get-with-items?id=${id}`);
}

/** 创建标准分类 */
export function createStandardCategory(data) {
  return requestClient.post('/evaluate/standard-category/create', data);
}

/** 更新标准分类 */
export function updateStandardCategory(data) {
  return requestClient.put('/evaluate/standard-category/update', data);
}

/** 删除标准分类 */
export function deleteStandardCategory(id) {
  return requestClient.delete(`/evaluate/standard-category/delete?id=${id}`);
}

/** 获取统计数据 */
export function getStandardCategoryStatistics() {
  return requestClient.get('/evaluate/standard-category/statistics');
}

/** 导出Excel */
export function exportStandardCategory(params) {
  return requestClient.get('/evaluate/standard-category/export-excel', {
    params,
    responseType: 'blob',
  });
}

// ---------- 下拉列表接口（全部数据，用于表单）----------

/** 获取指标体系下拉列表（全部） */
export async function getIndexSystemSimpleList() {
  const res = await requestClient.get('/evaluate/index-system/page', {
    params: { pageNo: 1, pageSize: 200 },
  });
  return (res.list || []).map((item) => ({
    label: item.name,
    value: Number(item.id),
  }));
}


/** 获取状态下拉列表（全部） */
export async function getStatusSimpleList() {
  const res = await requestClient.get('/evaluate/status/page', {
    params: { pageNo: 1, pageSize: 200 },
  });
  return (res.list || []).map((item) => ({
    label: item.name,
    value: Number(item.statusId),
  }));
}
