import { requestClient } from '#/api/request.js';

export function getShiftApplyPage(params) {
  return requestClient.get('/inspectop/shift-apply/page', { params });
}

export function exportShiftApply(params) {
  return requestClient.download('/inspectop/shift-apply/export-excel', {
    params,
  });
}

export function batchAuditShiftApply(data) {
  return requestClient.put('/inspectop/shift-apply/batch-audit', data);
}

export function getShiftApplyDetail(id) {
  return requestClient.get('/inspectop/shift-apply/get', { params: { id } });
}

export function approveShiftApply(data) {
  return requestClient.put('/inspectop/shift-apply/approve', data);
}

export function rejectShiftApply(data) {
  return requestClient.put('/inspectop/shift-apply/reject', data);
}

export function confirmShiftApply(data) {
  return requestClient.put('/inspectop/shift-apply/confirm', data);
}

export function reapplyShiftApply(data) {
  return requestClient.post('/inspectop/shift-apply/reapply', data);
}

export function getShiftApplyChart(params) {
  return requestClient.get('/inspectop/shift-apply/chart', { params });
}
