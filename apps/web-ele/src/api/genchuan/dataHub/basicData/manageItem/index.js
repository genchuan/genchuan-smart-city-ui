import { requestClient } from '#/api/request';

/** 获取管理事项分类分页列表 */
export function getCategoryPage(params) {
  return requestClient.get('/data/matter-category/page', {
    params,
  });
}
/** 分类树形结构 */
export function getCategoryTree() {
  return requestClient.get('/data/matter-category/tree');
}
/** 新增分类 */
export function createCategory(data) {
  return requestClient.post('/data/matter-category/create', data);
}

/** 更新分类 */
export function updateCategory(data) {
  return requestClient.put('/data/matter-category/update', data);
}

/** 删除分类 */
export function deleteCategory(id) {
  return requestClient.delete(`/data/matter-category/delete?id=${id}`);
}

/** 批量删除分类 */
export function deleteBatchCategory(integers) {
  return requestClient.delete('/data/matter-category/batch-delete', {
    data: integers,
  });
}

/** 导出分类 */
export function exportCategory() {
  return requestClient.download('/data/matter-category/export-excel');
}

/** 获取管理事项实例分页列表 */
export function getInstancePage(params) {
  return requestClient.get('/data/matter-instance/page', {
    params,
  });
}

/** 新增管理事项实例 */
export function createInstance(data) {
  return requestClient.post('/data/matter-instance/create', data);
}

/** 更新管理事项实例 */
export function updateInstance(data) {
  return requestClient.put('/data/matter-instance/update', data);
}

/** 删除管理事项实例 */
export function deleteInstance(id) {
  return requestClient.delete(`/data/matter-instance/delete?id=${id}`);
}

/** 导出管理事项实例*/
export function exportInstance() {
  return requestClient.download('/data/matter-instance/export-excel');
}

/** 导入管理事项实例
 * @param {File} file - 要导入的Excel文件
 */
export function importInstance(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/data/matter-instance/import-excel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 批量更新管理事项实例状态
 * @param {number[]} ids - 部件实例ID数组
 * @param {number} runStatus - 目标运行状态
 */
export function batchUpdateInstanceStatus(ids, runStatus) {
  return requestClient.post('/data/matter-instance/update-status-name-batch', {
    ids,
    runStatus,
  });
}
