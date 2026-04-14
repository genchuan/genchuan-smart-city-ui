import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询积分活动列表 */
export function getPointActivityPage(params) {
  return requestClient.get('/marketop/point-activity/page', { params });
}

/** 新增积分活动 */
export function createPointActivity(data) {
  return requestClient.post('/marketop/point-activity/create', data);
}

/** 导入积分活动 */
export function importPointActivity(data) {
  return requestClient.upload('/marketop/point-activity/import', data);
}

/** 导出积分活动数据 */
export function exportPointActivity() {
  return requestClient.download('/marketop/point-activity/export');
}

// ==================== 列表行交互操作接口 ====================

/** 获取积分活动详情 */
export function getPointActivityDetail(id) {
  return requestClient.get('/marketop/point-activity/get', { params: { id } });
}

/** 生效积分活动 */
export function enablePointActivity(data) {
  return requestClient.put('/marketop/point-activity/enable', data);
}

/** 暂停积分活动 */
export function pausePointActivity(data) {
  return requestClient.put('/marketop/point-activity/pause', data);
}

/** 编辑积分活动 */
export function updatePointActivity(data) {
  return requestClient.put('/marketop/point-activity/update', data);
}

// ==================== 数据可视化图表接口 ====================

/** 积分活动统计图表 */
export function getPointActivityChart(params) {
  return requestClient.get('/marketop/point-activity/chart', { params });
}
