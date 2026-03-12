import { requestClient } from '#/api/request';

/** 获取监测部件分类分页列表 */
export function getCategoryPage(params) {
  return requestClient.get('/data/monitor-category/page', {
    params,
  });
}
/** 分类树形结构 */
export function getCategoryTree() {
  return requestClient.get('/data/monitor-category/tree-simple');
}
/** 新增分类 */
export function createCategory(data) {
  return requestClient.post('/data/monitor-category/create', data);
}

/** 更新分类 */
export function updateCategory(data) {
  return requestClient.put('/data/monitor-category/update', data);
}

/** 删除分类 */
export function deleteCategory(id) {
  return requestClient.delete(`/data/monitor-category/delete?id=${id}`);
}

/** 批量删除分类 */
export function deleteBatchCategory(integers) {
  return requestClient.delete('/data/monitor-category/batch-delete', {
    data: integers,
  });
}

/** 导出分类 */
export function exportCategory() {
  return requestClient.download('/data/monitor-category/export-excel');
}

/** 获取监测部件实例分页列表 */
export function getInstancePage(params) {
  return requestClient.get('/data/monitor-instance/page', {
    params,
  });
}

/** 新增监测部件实例 */
export function createInstance(data) {
  return requestClient.post('/data/monitor-instance/create', data);
}

/** 更新监测部件实例 */
export function updateInstance(data) {
  return requestClient.put('/data/monitor-instance/update', data);
}

/** 删除监测部件实例 */
export function deleteInstance(id) {
  return requestClient.delete(`/data/monitor-instance/delete?id=${id}`);
}

/** 导出监测部件实例*/
export function exportInstance() {
  return requestClient.download('/data/monitor-instance/export-excel');
}

/** 导入监测部件实例
 * @param {File} file - 要导入的Excel文件
 */
export function importInstance(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/data/monitor-instance/import-excel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 批量更新监测部件实例状态
 * @param {number[]} ids - 部件实例ID数组
 * @param runStatus 目标状态
 */
export function batchUpdateInstanceStatus(ids, runStatus) {
  return requestClient.post('/data/monitor-instance/update-status-batch', {
    ids,
    runStatus,
  });
}
