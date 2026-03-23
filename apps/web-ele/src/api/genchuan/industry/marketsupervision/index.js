import { requestClient } from '#/api/request'; 
export function getWarnList(params) {
  return requestClient.get('/kitchen/ai-alert-message/page', {
    params,
  });
} 
 

/** excel导出 */
export function exporReviewExcel() {
  return requestClient.download('/kitchen/rectify-review/export-excel');
}

/** pdf导出 */
export function exporReviewPDF(id) {
  return requestClient.download(`/kitchen/rectify-review/download-notice-pdf-batch?rectifyNoticeIds=${id}`);
}

/** 批量查看整改复审台账证据分页 */
export function getRectifyEvidence(data) { 
  return requestClient.post('/kitchen/rectify-review/create', data);
}

/**整改通知书复审管理 */
export function getRectifyList(params) {
  return requestClient.get('/kitchen/rectify-review/page', {
    params,
  });
} 
/** 删除台账数据 */
export function deleteRectifyEvidence(id) {
  return requestClient.delete(`/kitchen/rectify-review/delete?id=${id}`);
}
export function addRectify(data) {
  return requestClient.post(`/kitchen/rectify-review/create`, data);
}
export function updateRectify(data) {
  return requestClient.put(`/kitchen/rectify-review/update`, data);
}




/**整改通知书 */
export function getNoticeList(params) {
  return requestClient.get('/kitchen/rectify-notice/page', {
    params,
  });
} 
/** 删除台账数据 */
export function deleteNotice(id) {
  return requestClient.delete(`/kitchen/rectify-notice/delete?id=${id}`);
}
export function addNotice(data) {
  return requestClient.post(`/kitchen/rectify-notice/create`, data);
}
export function updateNotice(data) {
  return requestClient.put(`/kitchen/rectify-notice/update`, data);
}
/** excel导出 */
export function exporNoticeExcel() {
  return requestClient.download('/kitchen/rectify-notice/export-excel');
}




/** 企业整改记录分页 */
export function getEntRectifyRecord(params) {
  return requestClient.get('/kitchen/ent-rectify-record/page', {
    params,
  });
} 
/** 删除台账数据 */
export function deleteEntNotice(id) {
  return requestClient.delete(`/kitchen/ent-rectify-record/delete?id=${id}`);
}
export function addEntNotice(data) {
  return requestClient.post(`/kitchen/ent-rectify-record/create`, data);
}
export function updateEntNotice(data) {
  return requestClient.put(`/kitchen/ent-rectify-record/update`, data);
}
/** excel导出 */
export function exporEntNoticeExcel() {
  return requestClient.download('/kitchen/ent-rectify-record/export-excel');
}

/** 获得企业 */
export function getEnterpriseList(params) {
  return requestClient.get('/kitchen/enterprise-info/page'); 
}
/** 创建复审台账 */
export function createReviewLedger(data) {
  return requestClient.post(`/kitchen/rectify-review/review-add`, data);
}
/** 获取复审台账详情 */
export function getReviewLedgerDetail(id) {
  return requestClient.get(`/kitchen/rectify-review/get?id=${id}`);
}
/** 上传资料 */
export function uploadKitchenFile(data) {
 return requestClient.post('/kitchen/rectify-review/upload-evidence-file', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
} 
/**上传资料 */
export function uploadRectifyFile(data) {
 return requestClient.post('/kitchen/ent-rectify-record/upload-file', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
} 
/** 审核通过 */
export function sendApprove(data) {
  return requestClient.post(`/kitchen/ent-rectify-record/review-approve`, data);
}
/** 审核不通过 */
export function sendNoApprove(data) {
  return requestClient.post(`/kitchen/ent-rectify-record/review-reject`, data);
}
/** 下发整改 */
export function sendRectify(data) {
  return requestClient.post(`/kitchen/rectify-review/review-issue`, data);
}

/** 获取撤销原因 */
export function getReasonList( ) {
  return requestClient.get('/kitchen/cancel-reason-dict/page');
}
/** 撤销 */
export function sendReason(data) {
  return requestClient.post(`/kitchen/rectify-review/review-cancel`, data);
}
/** 批量查看证据 */
export function getbatchEvidence(data) {
  return requestClient.post(`/kitchen/rectify-review/batch-view-evidence`, data);
}

export function sendRectificationNotice(data) {
  return requestClient.post(`/kitchen/ent-rectify-record/add`, data);
} 
/** 获取复审台账详情 */
export function downLoadPdf(id) {
  return requestClient.download(`/kitchen/rectify-notice/download-pdf?rectifyNoticeId=${id}`);
} 
/** 整改台账分页 */
export function getLedgerPage(params) {
  return requestClient.get('kitchen/rectify-review/ledger-page', {
    params,
  });
} 
/** 获得企业详情接口 */
export function getDetailEnObj(id) {
 return requestClient.get(`/kitchen/enterprise-info/get?id=${id}`);
}
/** 获得违规类型详情接口 */
export function getDetailillObj(id) {
 return requestClient.get(`/kitchen/illegal-type-dict/get?id=${id}`);
}