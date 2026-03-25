import { useAccessStore } from '@vben/stores';
import { baseRequestClient, requestClient } from '#/api/request';

// ---------- 公厕基础信息 ----------
/**
 * 分页查询公厕列表
 */
export function getPublicToiletPage(params) {
  return requestClient.get('/envirhealth/public-toilet/detail-page', {
    params,
  });
}

/**
 * 创建公厕
 */
export function createPublicToilet(data) {
  return requestClient.post('/envirhealth/public-toilet/create', data);
}

/**
 * 更新公厕
 */
export function updatePublicToilet(data) {
  return requestClient.put('/envirhealth/public-toilet/update', data);
}

/**
 * 删除单个公厕
 */
export function deletePublicToilet(id) {
  return requestClient.delete(`/envirhealth/public-toilet/delete?id=${id}`);
}

/**
 * 批量删除公厕
 */
export function deletePublicToiletBatch(ids) {
  return requestClient.delete('/envirhealth/public-toilet/delete-batch', {
    data: ids,
  });
}

/**
 * 导出公厕列表 Excel
 */
export async function exportPublicToiletExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get(
    '/envirhealth/public-toilet/export-excel',
    {
      params,
      responseType: 'blob',
      validateStatus: () => true,
      headers: {
        Authorization: accessStore.accessToken
          ? `Bearer ${accessStore.accessToken}`
          : undefined,
      },
    },
  );
}

// ---------- 投诉记录 ----------
export function getToiletComplaintPage(params) {
  return requestClient.get('/envirhealth/toilet-complaint/detail-page', {
    params,
  });
}

export function createToiletComplaint(data) {
  return requestClient.post('/envirhealth/toilet-complaint/create', data);
}

export function updateToiletComplaint(data) {
  return requestClient.put('/envirhealth/toilet-complaint/update', data);
}

export function deleteToiletComplaint(id) {
  return requestClient.delete(`/envirhealth/toilet-complaint/delete?id=${id}`);
}

export function deleteToiletComplaintBatch(ids) {
  return requestClient.delete('/envirhealth/toilet-complaint/delete-batch', {
    data: ids,
  });
}

export async function exportToiletComplaintExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get(
    '/envirhealth/toilet-complaint/export-excel',
    {
      params,
      responseType: 'blob',
      validateStatus: () => true,
      headers: {
        Authorization: accessStore.accessToken
          ? `Bearer ${accessStore.accessToken}`
          : undefined,
      },
    },
  );
}

// ---------- 设施维修记录 ----------
export function getToiletFacilityRepairPage(params) {
  return requestClient.get('/envirhealth/toilet-facility-repair/detail-page', {
    params,
  });
}

export function createToiletFacilityRepair(data) {
  return requestClient.post('/envirhealth/toilet-facility-repair/create', data);
}

export function updateToiletFacilityRepair(data) {
  return requestClient.put('/envirhealth/toilet-facility-repair/update', data);
}

export function deleteToiletFacilityRepair(id) {
  return requestClient.delete(
    `/envirhealth/toilet-facility-repair/delete?id=${id}`,
  );
}

export function deleteToiletFacilityRepairBatch(ids) {
  return requestClient.delete(
    '/envirhealth/toilet-facility-repair/delete-batch',
    { data: ids },
  );
}

export async function exportToiletFacilityRepairExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get(
    '/envirhealth/toilet-facility-repair/export-excel',
    {
      params,
      responseType: 'blob',
      validateStatus: () => true,
      headers: {
        Authorization: accessStore.accessToken
          ? `Bearer ${accessStore.accessToken}`
          : undefined,
      },
    },
  );
}

// ---------- 保洁任务 ----------
/**
 * 分页查询保洁任务列表
 */
export function getToiletCleaningTaskPage(params) {
  return requestClient.get('/envirhealth/toilet-cleaning-task/detail-page', {
    params,
  });
}

/**
 * 创建保洁任务
 */
export function createToiletCleaningTask(data) {
  return requestClient.post('/envirhealth/toilet-cleaning-task/create', data);
}

/**
 * 更新保洁任务
 */
export function updateToiletCleaningTask(data) {
  return requestClient.put('/envirhealth/toilet-cleaning-task/update', data);
}

/**
 * 删除单个保洁任务
 */
export function deleteToiletCleaningTask(id) {
  return requestClient.delete(
    `/envirhealth/toilet-cleaning-task/delete?id=${id}`,
  );
}

/**
 * 批量删除保洁任务
 */
export function deleteToiletCleaningTaskBatch(ids) {
  return requestClient.delete(
    '/envirhealth/toilet-cleaning-task/delete-batch',
    { data: ids },
  );
}

/**
 * 导出保洁任务 Excel
 */
export async function exportToiletCleaningTaskExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get(
    '/envirhealth/toilet-cleaning-task/export-excel',
    {
      params,
      responseType: 'blob',
      validateStatus: () => true,
      headers: {
        Authorization: accessStore.accessToken
          ? `Bearer ${accessStore.accessToken}`
          : undefined,
      },
    },
  );
}

// ---------- 物资待补充（消耗品）接口 ----------
/**
 * 分页查询物资待补充列表
 */
export function getToiletConsumablePage(params) {
  return requestClient.get('/envirhealth/toilet-consumable/detail-page', {
    params,
  });
}

/**
 * 创建物资待补充记录
 */
export function createToiletConsumable(data) {
  return requestClient.post('/envirhealth/toilet-consumable/create', data);
}

/**
 * 更新物资待补充记录
 */
export function updateToiletConsumable(data) {
  return requestClient.put('/envirhealth/toilet-consumable/update', data);
}

/**
 * 删除单个物资待补充记录
 */
export function deleteToiletConsumable(id) {
  return requestClient.delete(`/envirhealth/toilet-consumable/delete?id=${id}`);
}

/**
 * 批量删除物资待补充记录
 */
export function deleteToiletConsumableBatch(ids) {
  return requestClient.delete('/envirhealth/toilet-consumable/delete-batch', {
    data: ids,
  });
}

/**
 * 导出物资待补充 Excel
 */
export async function exportToiletConsumableExcel(params) {
  const accessStore = useAccessStore();
  return await baseRequestClient.get(
    '/envirhealth/toilet-consumable/export-excel',
    {
      params,
      responseType: 'blob',
      validateStatus: () => true,
      headers: {
        Authorization: accessStore.accessToken
          ? `Bearer ${accessStore.accessToken}`
          : undefined,
      },
    },
  );
}

// ---------- 统计接口（用于选项卡数字）----------
/**
 * 获取公厕运营任务统计（各状态数量）
 */
export function getPublicToiletStatistics() {
  return requestClient.get('/envirhealth/public-toilet/chart/statistics');
}



// 批量调整保洁计划
export function batchAdjustToiletCleaningTask(data) {
  return requestClient.put('/envirhealth/toilet-cleaning-task/batch-adjust', data);
}

// 批量补充登记
export function batchSupplyToiletConsumable(data) {
  return requestClient.post('/envirhealth/toilet-consumable/batch-supply', data);
}

// 单条补充登记
export function supplyToiletConsumable(data) {
  return requestClient.post('/envirhealth/toilet-consumable/supply', data);
}

// 批量处理投诉
export function batchHandleToiletComplaint(data) {
  return requestClient.post('/envirhealth/toilet-complaint/batch-handle', data);
}

// 全状态统计
export function getPublicToiletChartAll() {
  return requestClient.get('/envirhealth/public-toilet/chart/all');
}

// 保洁待执行统计
export function getCleaningPendingChart() {
  return requestClient.get('/envirhealth/toilet-cleaning-task/chart/pending');
}

// 物资待补充统计
export function getConsumablePendingChart() {
  return requestClient.get('/envirhealth/toilet-consumable/chart/pending');
}

// 投诉待处置统计
export function getComplaintPendingChart() {
  return requestClient.get('/envirhealth/toilet-complaint/chart/pending');
}

// 设施待维修统计
export function getFacilityRepairPendingChart() {
  return requestClient.get('/envirhealth/toilet-facility-repair/chart/pending');
}

// 已完成统计
export function getCleaningSummaryChart() {
  return requestClient.get('/envirhealth/toilet-cleaning-task/chart/summary');
}

/**
 * 通用批量上传图片
 */
export function uploadImageBatch(formData) {
  return requestClient.post('/envirhealth/file/upload-multiple-images', formData, {
    headers: { 'Content-Type': undefined }
  });
}

/**
 * 通用删除图片
 */
export function deleteFile(fileUrl) {
  return requestClient.delete('/envirhealth/file/delete-file', {
    params: { fileUrl },
  });
}
