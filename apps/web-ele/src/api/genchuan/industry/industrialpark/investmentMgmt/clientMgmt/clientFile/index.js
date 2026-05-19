import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询客户档案列表 */
export function getClientFilePage(params) {
  return requestClient.get('/investmentmgmt/client-file/page', { params });
}

/** 导出客户档案数据 */
export function exportClientFile() {
  return requestClient.download('/investmentmgmt/client-file/export');
}

/** 收集潜在客户信息 */
export function createClientFile(data) {
  return requestClient.post('/investmentmgmt/client-file/create', data);
}

/** 建立完善客户档案 */
export function updateClientFile(data) {
  return requestClient.put('/investmentmgmt/client-file/update', data);
}

/** 客户意向分类 */
export function updateClientFileClassify(data) {
  return requestClient.put('/investmentmgmt/client-file/update-classify', data);
}

/** 客户跟踪维护 */
export function updateClientFileTrack(data) {
  return requestClient.put('/investmentmgmt/client-file/update-track', data);
}

/** 客户签约转化 */
export function signClientFile(data) {
  return requestClient.put('/investmentmgmt/client-file/sign', data);
}

// ==================== 列表行交互操作接口 ====================

/** 获取客户档案详情 */
export function getClientFileDetail(id) {
  return requestClient.get('/investmentmgmt/client-file/get', {
    params: { id },
  });
}

/** 跟进潜在客户 */
export function followClientFile(data) {
  return requestClient.put('/investmentmgmt/client-file/follow', data);
}

/** 洽谈意向客户 */
export function talkClientFile(data) {
  return requestClient.put('/investmentmgmt/client-file/talk', data);
}

/** 确认客户转化 */
export function confirmClientFile(data) {
  return requestClient.put('/investmentmgmt/client-file/confirm', data);
}

/** 已签约客户续费 */
export function renewClientFile(data) {
  return requestClient.put('/investmentmgmt/client-file/renew', data);
}

/** 已签约客户服务 */
export function serviceClientFile(data) {
  return requestClient.put('/investmentmgmt/client-file/service', data);
}

// ==================== 数据可视化图表接口 ====================

/** 招商客户分布态势（卡片 + 饼图 + 柱状图） */
export function getClientFileChart() {
  return requestClient.get('/investmentmgmt/client-file/chart');
}
