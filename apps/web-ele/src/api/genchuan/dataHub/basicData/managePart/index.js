import { requestClient } from '#/api/request';

/** 分类分页列表 */
export function getCategoryPage(params) {
  return requestClient.get('/data/category/page', {
    params,
  });
}

/** 分类树形结构 */
export function getCategoryTree() {
  return requestClient.get('/data/category/tree');
}

/** 新增分类 */
export function createCategory(data) {
  return requestClient.post('/data/category/create', data);
}

/** 更新分类 */
export function updateCategory(data) {
  return requestClient.put('/data/category/update', data);
}

/** 删除分类 */
export function deleteCategory(id) {
  return requestClient.delete(`/data/category/delete?id=${id}`);
}

/** 批量删除分类 */
export function deleteBatchCategory(integers) {
  return requestClient.delete('/data/category/batch-delete', {
    data: integers,
  });
}

/** 绑定图示 */
export function bindIcon(data) {
  return requestClient.put('/data/category/bindIcon', data);
}

/** 提交审核 */
export function submitAudit(id) {
  return requestClient.put(`/data/category/submitAudit?id=${id}`);
}

/** 导出分类 */
export function exportCategory() {
  return requestClient.download('/data/category/export-excel');
}

/** 管理部件实例分页列表 */
export function getInstancePage(params) {
  return requestClient.get('/data/instance/page', {
    params,
  });
}

