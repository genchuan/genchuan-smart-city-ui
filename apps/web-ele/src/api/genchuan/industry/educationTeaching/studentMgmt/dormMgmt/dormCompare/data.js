import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const cycleMap = {
  '周': 'week',
  '月': 'month',
  '学期': 'semester'
};
const cycleReverse = {
  'week': '周',
  'month': '月',
  'semester': '学期'
};

const statusMap = {
  '打分中': 'scoring',
  '已汇总': 'summarized'
};
const statusReverse = {
  'scoring': '打分中',
  'summarized': '已汇总'
};

function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.cycle && cycleReverse[result.cycle]) {
    result.cycle = cycleReverse[result.cycle];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  return result;
}

function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.cycle && cycleMap[result.cycle]) {
    result.cycle = cycleMap[result.cycle];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  return result;
}

function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 宿舍评比接口 ====================
export function getDormComparePage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/dorm-compare/page', { params: convertedParams })
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

// 新增宿舍评比记录（状态默认为“打分中”）
export function createDormCompare(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/dorm-compare/create', convertedData);
}

export function scoreDormCompare(data) {
  return requestClient.put('/studentmgmt/dorm-compare/score', data);
}

export function summaryDormCompare(data) {
  return requestClient.put('/studentmgmt/dorm-compare/summary', data);
}

export function pushDormCompare(data) {
  return requestClient.put('/studentmgmt/dorm-compare/push', data);
}

export function updateDormCompare(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/dorm-compare/update', convertedData)
}

export function exportDormCompare(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/dorm-compare/export-excel', convertedParams)
}

export function getDormCompareDetail(params) {
  return requestClient.get('/studentmgmt/dorm-compare/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getDormCompareChart(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/dorm-compare/chart', { params: convertedParams }).catch(err => {
    console.warn('得分看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalCompare: 86,
      avgScore: 85.2,
      highScore: 98.5,
      lowScore: 62.0,
      dormStats: [
        { dormNum: '302', score: 95.5, rank: 1 },
        { dormNum: '301', score: 92.0, rank: 2 },
        { dormNum: '201', score: 90.5, rank: 3 },
        { dormNum: '202', score: 88.0, rank: 4 },
        { dormNum: '101', score: 85.5, rank: 5 },
      ],
    });
  });
}

export function getDormCompareScoreRank(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/dorm-compare/chart/scoreRank', { params: convertedParams }).catch(err => {
    console.warn('得分排名接口失败，使用模拟数据', err);
    return Promise.resolve({
      labels: ['302', '301', '201', '202', '101'],
      data: [95.5, 92.0, 90.5, 88.0, 85.5],
    });
  });
}
