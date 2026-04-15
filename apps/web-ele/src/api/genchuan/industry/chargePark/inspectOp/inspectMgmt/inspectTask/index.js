import { requestClient } from '#/api/request.js';

/** 分页查询巡检任务列表 */
export function getInspectTaskPage(params) {
  return requestClient.get('/inspectop/inspect-task/page', { params });
}

/** 导出巡检任务数据 */
export function exportInspectTask(params) {
  return requestClient.download('/inspectop/inspect-task/export', { params });
}

/** 批量派发巡检任务 */
export function batchDispatchInspectTask(data) {
  return requestClient.put('/inspectop/inspect-task/batch-dispatch', data);
}

/** 获取巡检任务详情 */
export function getInspectTaskDetail(id) {
  return requestClient.get('/inspectop/inspect-task/get', { params: { id } });
}

/** 派发巡检任务 */
export function dispatchInspectTask(data) {
  return requestClient.put('/inspectop/inspect-task/dispatch', data);
}

/** 认领巡检任务 */
export function claimInspectTask(data) {
  return requestClient.put('/inspectop/inspect-task/claim', data);
}

/** 更新巡检任务进度 */
export function updateInspectTaskProgress(data) {
  return requestClient.put('/inspectop/inspect-task/update-progress', data);
}

/** 转派巡检任务 */
export function transferInspectTask(data) {
  return requestClient.put('/inspectop/inspect-task/transfer', data);
}

/** 归档巡检任务 */
export function archiveInspectTask(data) {
  return requestClient.put('/inspectop/inspect-task/archive', data);
}

/** 获取巡检任务统计看板 */
export function getInspectTaskChart(params) {
  return requestClient.get('/inspectop/inspect-task/chart', { params });
}
