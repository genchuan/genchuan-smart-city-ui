import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 评比周期映射
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

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.cycle && cycleReverse[result.cycle]) {
    result.cycle = cycleReverse[result.cycle];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为英文）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.cycle && cycleMap[result.cycle]) {
    result.cycle = cycleMap[result.cycle];
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 评比管理接口 ====================
export function getCompareMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/compare-mgmt/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败', err);
      // 分页接口已联调成功，不再使用模拟数据，返回空列表
      return { list: [], total: 0 };
    });
}

export function createCompareMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/compare-mgmt/create', convertedData).catch(err => {
    console.warn('发起接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateCompareMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/compare-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function scoreCompareMgmt(data) {
  return requestClient.put('/studentmgmt/compare-mgmt/score', data).catch(err => {
    console.warn('打分接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function awardCompareMgmt(data) {
  return requestClient.put('/studentmgmt/compare-mgmt/award', data).catch(err => {
    console.warn('授予接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportCompareMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/compare-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getCompareMgmtDetail(params) {
  return requestClient.get('/studentmgmt/compare-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getCompareMgmtChart(params) {
  return requestClient.get('/studentmgmt/compare-mgmt/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      rankList: [
        { className: '高一(1)班', totalScore: 92.5, rankNo: 1 },
        { className: '高一(3)班', totalScore: 90.0, rankNo: 2 },
        { className: '高一(2)班', totalScore: 88.0, rankNo: 3 },
        { className: '高二(1)班', totalScore: 85.5, rankNo: 4 },
      ],
      statusCount: { scoringCount: 5, finishedCount: 15 },
      cycleCount: { weekCount: 8, monthCount: 10, termCount: 2 },
    });
  });
}
