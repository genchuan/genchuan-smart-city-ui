import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询信息发布列表 */
export function getInfoPublishPage(params) {
  return requestClient.get('/investmentmgmt/info-publish/page', { params });
}

/** 导出信息发布数据 */
export function exportInfoPublish() {
  return requestClient.download('/investmentmgmt/info-publish/export');
}

/** 编辑/录入招商信息 */
export function createInfoPublish(data) {
  return requestClient.post('/investmentmgmt/info-publish/create', data);
}

/** 更新招商信息 */
export function updateInfoPublish(data) {
  return requestClient.put('/investmentmgmt/info-publish/update', data);
}

/** 配置招商政策 */
export function updateInfoPublishPolicy(data) {
  return requestClient.put('/investmentmgmt/info-publish/update-policy', data);
}

/** 发布招商信息 */
export function publishInfoPublish(data) {
  return requestClient.put('/investmentmgmt/info-publish/publish', data);
}

/** 响应客户咨询 */
export function responseInfoPublish(data) {
  return requestClient.put('/investmentmgmt/info-publish/response', data);
}

// ==================== 列表行交互操作接口 ====================

/** 获取信息详情 */
export function getInfoPublishDetail(id) {
  return requestClient.get('/investmentmgmt/info-publish/get', { params: { id } });
}

/** 下架信息 */
export function offlineInfoPublish(data) {
  return requestClient.put('/investmentmgmt/info-publish/offline', data);
}

/** 删除信息（支持批量） */
export function deleteInfoPublish(ids) {
  return requestClient.delete('/investmentmgmt/info-publish/delete', { data: ids });
}

// ==================== 数据可视化图表接口 ====================

/** 招商信息发布态势（卡片 + 柱状图） */
export function getInfoPublishChart() {
  return requestClient.get('/investmentmgmt/info-publish/chart');
}
