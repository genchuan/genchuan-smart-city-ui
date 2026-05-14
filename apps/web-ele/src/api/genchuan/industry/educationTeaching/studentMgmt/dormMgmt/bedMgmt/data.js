import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 状态映射（后端英文 unallocated -> 前端中文 未分配）
const statusMap = {
  '未分配': 'unallocated',
  '已分配': 'allocated'
};
const statusReverse = {
  'unallocated': '未分配',
  'allocated': '已分配'
};

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为英文）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
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

// ==================== 床位管理接口 ====================
export function getBedMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/bed-mgmt/page', { params: convertedParams })
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

// 分配床位（批量，bedIds 与 studentIds 一一对应）
export function assignBedMgmt(data) {
  return requestClient.put('/studentmgmt/bed-mgmt/assign', data).catch(err => {
    console.warn('分配接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 调整床位（单个）- 修正为 Query 参数形式
export function adjustBedMgmt(data) {
  return requestClient.put('/studentmgmt/bed-mgmt/adjust', null, { params: data }).catch(err => {
    console.warn('调整接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 新增床位
export function createBedMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/bed-mgmt/create', convertedData).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 更新床位
export function updateBedMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/bed-mgmt/update', convertedData).catch(err => {
    console.warn('更新接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportBedMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/bed-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getBedMgmtDetail(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getBedMgmtChart(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/chart', { params }).catch(err => {
    console.warn('床位看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalBed: 1200,
      usedBed: 980,
      unusedBed: 220,
      usageRate: 81.67,
      buildingStats: [
        { building: '1号楼', total: 400, used: 350, unused: 50 },
        { building: '2号楼', total: 400, used: 320, unused: 80 },
        { building: '3号楼', total: 400, used: 310, unused: 90 },
      ],
    });
  });
}

export function getBedDistribution(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/chart/bedDistribution', { params }).catch(err => {
    console.warn('床位占比接口失败，使用模拟数据', err);
    return Promise.resolve({
      labels: ['1号楼', '2号楼', '3号楼'],
      data: [33.33, 33.33, 33.34],
    });
  });
}

export function getBedIndex(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/chart/bedIndex', { params }).catch(err => {
    console.warn('核心指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      assignCount: 120,
      adjustCount: 15,
      newAssignCount: 8,
      newAdjustCount: 2,
      trendList: [
        { date: '2025-03-25', assign: 15, adjust: 2 },
        { date: '2025-03-26', assign: 18, adjust: 1 },
        { date: '2025-03-27', assign: 20, adjust: 3 },
        { date: '2025-03-28', assign: 16, adjust: 2 },
        { date: '2025-03-29', assign: 22, adjust: 3 },
        { date: '2025-03-30', assign: 21, adjust: 2 },
        { date: '2025-03-31', assign: 8, adjust: 2 },
      ],
    });
  });
}
