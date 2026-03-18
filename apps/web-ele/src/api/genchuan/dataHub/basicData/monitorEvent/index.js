import { requestClient } from '#/api/request';

/** 获取监测事件分类分页列表 */
export function getCategoryPage(params) {
  return requestClient.get('/data/event-category/page', {
    params,
  });
}
/** 分类树形结构 */
export function getCategoryTree() {
  return requestClient.get('/data/event-category/tree');
}
/** 新增分类 */
export function createCategory(data) {
  return requestClient.post('/data/event-category/create', data);
}

/** 更新分类 */
export function updateCategory(data) {
  return requestClient.put('/data/event-category/update', data);
}

/** 删除分类 */
export function deleteCategory(id) {
  return requestClient.delete(`/data/event-category/delete?id=${id}`);
}

/** 批量删除分类 */
export function deleteBatchCategory(integers) {
  return requestClient.delete('/data/event-category/batch-delete', {
    data: integers,
  });
}

/** 导出分类 */
export function exportCategory() {
  return requestClient.download('/data/event-category/export-excel');
}

/** 获取监测事件实例分页列表 */
export function getInstancePage(params) {
  return requestClient.get('/data/event-instance/page', {
    params,
  });
}

/** 新增监测事件实例 */
export function createInstance(data) {
  return requestClient.post('/data/event-instance/create', data);
}

/** 更新监测事件实例 */
export function updateInstance(data) {
  return requestClient.put('/data/event-instance/update', data);
}

/** 删除监测事件实例 */
export function deleteInstance(id) {
  return requestClient.delete(`/data/event-instance/delete?id=${id}`);
}

/** 导出监测事件实例*/
export function exportInstance() {
  return requestClient.download('/data/event-instance/export-excel');
}

/** 导入监测事件实例
 * @param {File} file - 要导入的Excel文件
 */
export function importInstance(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/data/event-instance/import-excel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 批量更新监测事件实例状态
 * @param {number[]} ids - 事件实例ID数组
 * @param {number} status - 目标运行状态
 */
export function batchUpdateInstanceStatus(ids, status) {
  return requestClient.put('/data/event-instance/batch-update-status', {
    ids,
    status,
  });
}
