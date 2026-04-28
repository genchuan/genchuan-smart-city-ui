import { requestClient } from '#/api/request';
/** 逃费识别分页 */
export function getDebtIdentifyPage(params) {
  return requestClient.get('/ordertrade/debt-identify/page', {
    params,
  });
}
/** 逃费识别标记 */
export function markDebtIdentify(data) {
  return requestClient.put('/ordertrade/debt-identify/mark', data);
}
/** 逃费识别 */
export function identifyDebtIdentify(data) {
  return requestClient.put('/ordertrade/debt-identify/identify', data);
}
/** 逃费识别导出 */
export function exportDebtIdentifyExcel() {
  return requestClient.download('/ordertrade/debt-identify/export');
}
/** 逃费识别批量处理 */
export function batchIdentifyDebtIdentify(data) {
  return requestClient.post('/ordertrade/debt-identify/batch-identify', data);
}
/** 逃费识别图表 */
export function getDebtIdentifyChart() {
  return requestClient.get('/ordertrade/debt-identify/chart');
} 
/*逃费记录分页 */
export function getDebtRecordPage(params) {
  return requestClient.get('/ordertrade/debt-record/page', {
    params,
  });
}

/** 逃费记录追缴 */
export function startCollectDebtRecord(data) {
  return requestClient.put('/ordertrade/debt-record/start-collect', data);
}
/** 逃费记录追缴进度 */
export function updateCollectProgress(data) {
  return requestClient.put('/ordertrade/debt-record/update-progress', data);
}
/** 逃费记录导出 */
export function exportDebtRecordExcel() {
  return requestClient.download('/ordertrade/debt-record/export');
}
/** 逃费记录图表 */
export function getDebtRecordChart() {
  return requestClient.get('/ordertrade/debt-record/chart');
}
/** 欠费记录分页 */
export function getDebtRecordCollectPage(params) {
  return requestClient.get('/ordertrade/arrear-record/page', {
    params,
  });
}
/** 催缴 */
export function remindDebtRecordCollect(data) {
  return requestClient.put('/ordertrade/arrear-record/remind', data);
}
/** 催缴导出 */
export function exportDebtRecordCollectExcel() {
  return requestClient.download('/ordertrade/arrear-record/export');
}
/** 催缴图表 */
export function getDebtRecordCollectChart() {
  return requestClient.get('/ordertrade/arrear-record/chart');
}

/** 追缴跟踪分页 */
export function getDebtRecordCollectTrackPage(params) {
  return requestClient.get('/ordertrade/collect-track/page', {
    params,
  });
}

/** 追缴跟踪推送 */
export function pushDebtRecordCollectTrack(data) {
  return requestClient.put('/ordertrade/collect-track/push', data);
}
/** 追缴跟踪转移 */
export function transferDebtRecordCollectTrack(data) {
  return requestClient.put('/ordertrade/collect-track/transfer', data);
}
/** 追缴跟踪更新进度 */
export function updateProgressDebtRecordCollectTrack(data) {
  return requestClient.put('/ordertrade/collect-track/update-progress', data);
}
/** 追缴跟踪导出 */
export function exportDebtRecordCollectTrackExcel() {
  return requestClient.download('/ordertrade/collect-track/export');
}
/** 追缴跟踪批量推送 */
export function batchPushDebtRecordCollectTrack(data) {
  return requestClient.post('/ordertrade/collect-track/batch-push', data);
}
/** 追缴跟踪归档 */
export function archiveDebtRecordCollectTrack(data) {
  return requestClient.put('/ordertrade/collect-track/archive', data);
}
/** 追缴跟踪图表 */
export function getDebtRecordCollectTrackChart() {
  return requestClient.get('/ordertrade/collect-track/chart');
}
/** 追缴配置分页 */
export function getDebtRecordCollectConfigPage(params) {
  return requestClient.get('/ordertrade/collect-config/page', {
    params,
  });
}
/** 追缴配置创建 */
export function createDebtRecordCollectConfig(data) {
  return requestClient.post('/ordertrade/collect-config/create', data);
}
/** 追缴配置保存 */
export function saveDebtRecordCollectConfig(data) {
  return requestClient.post('/ordertrade/collect-config/save', data);
}
/** 追缴配置更新 */
export function updateDebtRecordCollectConfig(data) {
  return requestClient.put('/ordertrade/collect-config/update', data);
}
/** 追缴配置启用 */
export function enableDebtRecordCollectConfig(data) {
  return requestClient.put('/ordertrade/collect-config/enable', data);
}
/** 追缴配置禁用 */
export function disableDebtRecordCollectConfig(data) {
  return requestClient.put('/ordertrade/collect-config/disable', data);
}
/** 追缴配置图表 */
export function getDebtRecordCollectConfigChart() {
  return requestClient.get('/ordertrade/collect-config/chart');
}
