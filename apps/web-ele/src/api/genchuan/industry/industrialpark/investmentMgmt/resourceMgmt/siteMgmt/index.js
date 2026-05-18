import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询场地管理列表 */
export function getSiteMgmtPage(params) {
  return requestClient.get('/investmentmgmt/site-mgmt/page', { params });
}

/** 导出场地管理数据 */
export function exportSiteMgmt() {
  return requestClient.download('/investmentmgmt/site-mgmt/export');
}

/** 录入场地信息 */
export function createSiteMgmt(data) {
  return requestClient.post('/investmentmgmt/site-mgmt/create', data);
}

/** 完善场地信息 */
export function updateSiteMgmt(data) {
  return requestClient.put('/investmentmgmt/site-mgmt/update', data);
}

/** 标记场地状态 */
export function updateSiteMgmtStatus(data) {
  return requestClient.put('/investmentmgmt/site-mgmt/update-status', data);
}

/** 展示场地（发布到招商展示） */
export function updateSiteMgmtShow(data) {
  return requestClient.put('/investmentmgmt/site-mgmt/update-show', data);
}

/** 签约入驻 */
export function signSiteMgmt(data) {
  return requestClient.put('/investmentmgmt/site-mgmt/sign', data);
}

// ==================== 列表行交互操作接口 ====================

/** 获取场地详情 */
export function getSiteMgmtDetail(id) {
  return requestClient.get('/investmentmgmt/site-mgmt/get', { params: { id } });
}

/** 预约场地 */
export function reserveSiteMgmt(data) {
  return requestClient.put('/investmentmgmt/site-mgmt/reserve', data);
}

/** 跟进洽谈 */
export function followSiteMgmt(data) {
  return requestClient.put('/investmentmgmt/site-mgmt/follow', data);
}

/** 确认签约 */
export function confirmSiteMgmt(data) {
  return requestClient.put('/investmentmgmt/site-mgmt/confirm', data);
}

/** 驳回洽谈 */
export function rejectSiteMgmt(data) {
  return requestClient.put('/investmentmgmt/site-mgmt/reject', data);
}

/** 续费 */
export function renewSiteMgmt(data) {
  return requestClient.put('/investmentmgmt/site-mgmt/renew', data);
}

/** 退租 */
export function quitSiteMgmt(data) {
  return requestClient.put('/investmentmgmt/site-mgmt/quit', data);
}

// ==================== 数据可视化图表接口 ====================

/** 招商资源分布态势（地图 + 卡片） */
export function getSiteMgmtChart() {
  return requestClient.get('/investmentmgmt/site-mgmt/chart');
}
