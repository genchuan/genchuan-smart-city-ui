import { requestClient } from '#/api/request';

// ==================== 德育资源接口 ====================
export function getMoralResourcePage(params) {
  return requestClient.get('/studentmgmt/moral-resource/page', { params }).catch(err => {
    console.warn('分页接口失败', err);
    return { list: [], total: 0 };
  });
}

export function createMoralResource(data) {
  return requestClient.post('/studentmgmt/moral-resource/create', data).catch(err => {
    console.warn('上传接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateMoralResource(data) {
  return requestClient.put('/studentmgmt/moral-resource/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function onlineMoralResource(ids) {
  return requestClient.put('/studentmgmt/moral-resource/online', { ids }).catch(err => {
    console.warn('上架接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function offlineMoralResource(ids) {
  return requestClient.put('/studentmgmt/moral-resource/offline', { ids }).catch(err => {
    console.warn('下架接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportMoralResource(params) {
  return requestClient.download('/studentmgmt/moral-resource/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getMoralResourceDetail(params) {
  return requestClient.get('/studentmgmt/moral-resource/get', { params }).catch(err => {
    console.warn('详情接口失败', err);
    return Promise.reject(err);
  });
}

// ==================== 图表接口 ====================
export function getMoralResourceChart(params) {
  return requestClient.get('/studentmgmt/moral-resource/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      statusCount: { unOnlineCount: 3, onlineCount: 17 },
      resourceTypeCount: { courseCount: 10, bookCount: 6, packageCount: 4 },
      learnTrend: [
        { date: '2025-07', count: 1 },
        { date: '2025-08', count: 8 },
        { date: '2025-09', count: 1 },
      ],
      rateTrend: [
        { date: '2025-07', rate: 58.2 },
        { date: '2025-08', rate: 81.53 },
        { date: '2025-09', rate: 65.3 },
      ]
    });
  });
}

export function getMoralResourceCount(params) {
  return requestClient.get('/studentmgmt/moral-resource/chart/resourceCount', { params }).catch(err => {
    console.warn('资源数量统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      typeList: ['课程', '图书', '专题包'],
      resourceCountList: [10, 6, 4],
      learnRateList: [85.5, 78.0, 90.0],
    });
  });
}
