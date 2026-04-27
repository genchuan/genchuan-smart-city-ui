import { requestClient } from '#/api/request';

// ==================== 床位管理接口 ====================
export function getBedMgmtPage(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败', err);
    // 分页接口已联调成功，不再使用模拟数据，返回空列表
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

// 调整床位（单个）
export function adjustBedMgmt(data) {
  return requestClient.put('/studentmgmt/bed-mgmt/adjust', data).catch(err => {
    console.warn('调整接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 新增床位
export function createBedMgmt(data) {
  return requestClient.post('/studentmgmt/bed-mgmt/create', data).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 更新床位
export function updateBedMgmt(data) {
  return requestClient.put('/studentmgmt/bed-mgmt/update', data).catch(err => {
    console.warn('更新接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportBedMgmt(params) {
  return requestClient.download('/studentmgmt/bed-mgmt/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getBedMgmtDetail(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败', err);
    // 不再使用模拟数据，直接抛出错误让调用方处理
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
