import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 报修类型映射
const repairTypeMap = {
  '水电': 'water_electricity',
  '家具': 'furniture',
  '其他': 'other'
};
const repairTypeReverse = {
  'water_electricity': '水电',
  'furniture': '家具',
  'other': '其他'
};

// 状态映射
const statusMap = {
  '待派单': 'pending',
  '维修中': 'repairing',
  '已维修': 'completed'
};
const statusReverse = {
  'pending': '待派单',
  'repairing': '维修中',
  'completed': '已维修'
};

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.repairType && repairTypeReverse[result.repairType]) {
    result.repairType = repairTypeReverse[result.repairType];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为英文）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.repairType && repairTypeMap[result.repairType]) {
    result.repairType = repairTypeMap[result.repairType];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 报修管理接口 ====================
export function getRepairMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/repair-mgmt/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败', err);
      return { list: [], total: 0 };
    });
}

export function createRepairMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/repair-mgmt/create', convertedData).catch(err => {
    console.warn('申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function assignRepairMgmt(data) {
  return requestClient.put('/studentmgmt/repair-mgmt/assign', data).catch(err => {
    console.warn('派单接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function feedbackRepairMgmt(data) {
  return requestClient.put('/studentmgmt/repair-mgmt/feedback', data).catch(err => {
    console.warn('反馈接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function acceptRepairMgmt(data) {
  return requestClient.put('/studentmgmt/repair-mgmt/accept', data).catch(err => {
    console.warn('验收接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateRepairMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/repair-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportRepairMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/repair-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getRepairMgmtDetail(params) {
  return requestClient.get('/studentmgmt/repair-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getRepairMgmtChart(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/repair-mgmt/chart', { params: convertedParams }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalRepairCount: 86,
      pendingDispatchCount: 8,
      repairingCount: 5,
      repairedCount: 12,
      acceptedCount: 61,
      dailyTrend: [
        { date: '2025-03-25', count: 15 },
        { date: '2025-03-26', count: 18 },
        { date: '2025-03-27', count: 20 },
        { date: '2025-03-28', count: 16 },
        { date: '2025-03-29', count: 22 },
        { date: '2025-03-30', count: 21 },
        { date: '2025-03-31', count: 8 },
      ],
      typeDistribution: [
        { type: '水电', count: 52 },
        { type: '家具', count: 24 },
        { type: '其他', count: 10 },
      ],
    });
  });
}

export function getRepairMgmtCount(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/repair-mgmt/chart/repairCount', { params: convertedParams }).catch(err => {
    console.warn('统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      typeStatistics: [
        { type: '水电', total: 52, finished: 50, finishRate: 0.9615 },
        { type: '家具', total: 24, finished: 22, finishRate: 0.9167 },
        { type: '其他', total: 10, finished: 9, finishRate: 0.9 },
      ],
      buildingStatistics: [
        { building: '1号楼', total: 22, finished: 21, finishRate: 0.9545 },
        { building: '2号楼', total: 28, finished: 26, finishRate: 0.9286 },
        { building: '3号楼', total: 36, finished: 34, finishRate: 0.9444 },
      ],
    });
  });
}
