import { requestClient } from '#/api/request';

/** 获取管理部件分类分页列表 */
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

/** 新增管理部件实例 */
export function createInstance(data) {
  return requestClient.post('/data/instance/create', data);
}

/** 更新管理部件实例 */
export function updateInstance(data) {
  return requestClient.put('/data/instance/update', data);
}

/** 删除管理部件实例 */
export function deleteInstance(id) {
  return requestClient.delete(`/data/instance/delete?id=${id}`);
}

/** 导出管理部件实例*/
export function exportInstance() {
  return requestClient.download('/data/instance/export-excel');
}

/** 导入管理部件实例
 * @param {File} file - 要导入的Excel文件
 */
export function importInstance(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/data/instance/import-excel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 批量更新部件实例运行状态
 * @param {number[]} ids - 部件实例ID数组
 * @param {number} runStatus - 目标运行状态
 */
export function batchUpdateInstanceStatus(ids, runStatus) {
  return requestClient.post('/data/instance/update-status-batch', {
    ids,
    runStatus,
  });
}
