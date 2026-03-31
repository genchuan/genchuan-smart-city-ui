import { requestClient } from '#/api/request';

/** 获取应用场景分类分页列表 */
export function getCategoryPage(params) {
  return requestClient.get('/data/scene-category/page', {
    params,
  });
}
/** 分类树形结构 */
export function getCategoryTree() {
  return requestClient.get('/data/scene-category/tree');
}
/** 新增分类 */
export function createCategory(data) {
  return requestClient.post('/data/scene-category/create', data);
}

/** 更新分类 */
export function updateCategory(data) {
  return requestClient.put('/data/scene-category/update', data);
}

/** 删除分类 */
export function deleteCategory(id) {
  return requestClient.delete(`/data/scene-category/delete?id=${id}`);
}

/** 批量删除分类 */
export function deleteBatchCategory(integers) {
  return requestClient.delete('/data/scene-category/batch-delete', {
    data: integers,
  });
}

/** 导出分类 */
export function exportCategory() {
  return requestClient.download('/data/scene-category/export-excel');
}

/** 获取应用场景实例分页列表 */
export function getInstancePage(params) {
  return requestClient.get('/data/scene-instance/page', {
    params,
  });
}

/** 新增应用场景实例 */
export function createInstance(data) {
  return requestClient.post('/data/scene-instance/create', data);
}

/** 更新应用场景实例 */
export function updateInstance(data) {
  return requestClient.put('/data/scene-instance/update', data);
}

/** 删除应用场景实例 */
export function deleteInstance(id) {
  return requestClient.delete(`/data/scene-instance/delete?id=${id}`);
}

/** 导出应用场景实例*/
export function exportInstance() {
  return requestClient.download('/data/scene-instance/export-excel');
}

/** 导入应用场景实例
 * @param {File} file - 要导入的Excel文件
 */
export function importInstance(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/data/scene-instance/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 批量更新应用场景实例状态
 * @param {number[]} ids - 场景实例ID数组
 * @param {number} status - 目标运行状态
 * @param statusTime -更新时间
 */
export function batchUpdateInstanceStatus(ids, status, statusTime) {
  return requestClient.put('/data/scene-instance/update-status-batch', {
    ids,
    status,
    statusTime,
  });
}
