import { requestClient } from '#/api/request.js';

/** 分页查询预警列表 */
export function getAlertListPage(params) {
  return requestClient.get('/workbench/alert-list/page', { params });
}

/** 导出预警列表 */
export function exportAlertList(params) {
  return requestClient.get('/workbench/alert-list/export', { params, responseType: 'blob' });
}

/** 批量处置 */
export function batchHandleAlert(ids) {
  return requestClient.put('/workbench/alert-list/batch-handle', { ids });
}

/** 单个处置 */
export function handleAlert(id) {
  return requestClient.put('/workbench/alert-list/handle', { id });
}

/** 忽略预警 */
export function ignoreAlert(id, ignoreReason) {
  return requestClient.put('/workbench/alert-list/ignore', { id, ignoreReason });
}

/** 更新处置进度 */
export function updateProgress(data) {
  return requestClient.put('/workbench/alert-list/update-progress', data);
}

/** 获取预警详情 */
export function getAlertDetail(id) {
  return requestClient.get('/workbench/alert-list/get', { params: { id } });
}

/** 获取图表数据 */
export function getAlertChart(params) {
  return requestClient.get('/workbench/alert-list/chart', { params });
}

/** 上传文件（通用） */
export function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/common/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
