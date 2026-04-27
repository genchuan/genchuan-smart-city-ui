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
/** 下载导入积分活动模板
 * @returns {Promise} 返回文件流
 */
export function getPointActivityImportTemplate() {
  return requestClient.download('/marketop/point-activity/get-import-template');
}

/** 导入积分活动 */
export function importPointActivity(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/marketop/point-activity/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 导出积分活动数据
 * @param {object} params - 导出参数
 * @param {number} params.pageNo - 页码，从1开始
 * @param {number} params.pageSize - 每页条数，最大值为200
 * @param {string} [params.name] - 活动名称
 * @param {string} [params.type] - 活动类型
 * @param {string} [params.status] - 活动状态
 * @param {number} [params.startTime] - 开始时间（时间戳）
 * @param {number} [params.endTime] - 结束时间（时间戳）
 * @returns {Promise} 返回文件流
 */
export function exportPointActivity(params) {
  return requestClient.download('/marketop/point-activity/export', { params });
}

// ==================== 列表行交互操作接口 ====================

/** 获取积分活动详情 */
export function getPointActivityDetail(id) {
  return requestClient.get('/marketop/point-activity/get', { params: { id } });
}

/** 生效积分活动
 * @param {object} params - 请求参数
 * @param {number} params.id - 活动ID
 */
export function activatePointActivity(params) {
  return requestClient.put('/marketop/point-activity/activate', null, {
    params,
  });
}

/** 启用积分活动
 * @param {object} params - 请求参数
 * @param {number} params.id - 活动ID
 */
export function enablePointActivity(params) {
  return requestClient.put('/marketop/point-activity/enable', null, { params });
}

/** 暂停积分活动
 * @param {object} params - 请求参数
 * @param {number} params.id - 活动ID
 */
export function pausePointActivity(params) {
  return requestClient.put('/marketop/point-activity/pause', null, { params });
}

/** 编辑积分活动 */
export function updatePointActivity(data) {
  return requestClient.put('/marketop/point-activity/update', data);
}

// ==================== 数据可视化图表接口 ====================

/** 积分活动统计图表 */
export function getPointActivityChart() {
  return requestClient.get('/marketop/point-activity/chart');
}
