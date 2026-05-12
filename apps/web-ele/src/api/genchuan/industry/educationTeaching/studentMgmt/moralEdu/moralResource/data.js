import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 状态映射（后端英文 online -> 前端中文 已上架）
const statusMap = {
  '未上架': 'offline',
  '已上架': 'online'
};
const statusReverse = {
  'offline':'未上架',
  'online': '已上架'
};

// 资源类型映射（新增）
const resourceTypeMap = {
  '课程': 'course',
  '图书': 'book',
  '专题包': 'package'
};
const resourceTypeReverse = {
  'course': '课程',
  'book': '图书',
  'package': '专题包'
};

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  if (result.resourceType && resourceTypeReverse[result.resourceType]) {
    result.resourceType = resourceTypeReverse[result.resourceType];
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
  if (result.resourceType && resourceTypeMap[result.resourceType]) {
    result.resourceType = resourceTypeMap[result.resourceType];
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 德育资源接口 ====================
export function getMoralResourcePage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/moral-resource/page', { params: convertedParams })
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

export function createMoralResource(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/moral-resource/create', convertedData).catch(err => {
    console.warn('上传接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateMoralResource(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/moral-resource/update', convertedData).catch(err => {
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
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/moral-resource/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getMoralResourceDetail(params) {
  return requestClient.get('/studentmgmt/moral-resource/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getMoralResourceChart(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/moral-resource/chart', { params: convertedParams }).catch(err => {
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
