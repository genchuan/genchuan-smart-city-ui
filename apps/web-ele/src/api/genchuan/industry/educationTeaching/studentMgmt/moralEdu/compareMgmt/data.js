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

// 状态映射
const statusMap = {
  '打分中': 'scoring',
  '已汇总': 'summarized'
};
const statusReverse = {
  'scoring': '打分中',
  'summarized': '已汇总'
};

// 通用转换函数：后端 → 前端（将英文转为中文）
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

// 通用转换函数：前端 → 后端（将中文转为英文）
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
      return { list: [], total: 0 };
    });
}

export function createCompareMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/compare-mgmt/create', convertedData)
}

export function updateCompareMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/compare-mgmt/update', convertedData)
}

export function scoreCompareMgmt(data) {
  return requestClient.put('/studentmgmt/compare-mgmt/score', data)
}

export function awardCompareMgmt(data) {
  return requestClient.put('/studentmgmt/compare-mgmt/award', data)
}

export function exportCompareMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/compare-mgmt/export-excel', convertedParams)
}

export function getCompareMgmtDetail(params) {
  return requestClient.get('/studentmgmt/compare-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getCompareMgmtChart(params) {
  return requestClient.get('/studentmgmt/compare-mgmt/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      rankList: [
        { class_name: '高一(1)班', total_score: 92.5, rank_no: 1 },
        { class_name: '高一(3)班', total_score: 90.0, rank_no: 2 },
        { class_name: '高一(2)班', total_score: 88.0, rank_no: 3 },
        { class_name: '高二(1)班', total_score: 85.5, rank_no: 4 },
      ],
      statusCount: { scoringCount: 5, finishedCount: 15 },
      cycleCount: { weekCount: 8, monthCount: 10, termCount: 2 },
    });
  });
}
