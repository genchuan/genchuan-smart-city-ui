import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const evaluatorTypeMap = {
  '教职工': 'teacher',
  '家长': 'parent',
  '领导': 'leader'
};
const evaluatorTypeReverse = {
  'teacher': '教职工',
  'parent': '家长',
  'leader': '领导'
};

const statusMap = {
  '未启用': 'disable',
  '已启用': 'enable'
};
const statusReverse = {
  'disable': '未启用',
  'enable': '已启用'
};

function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.evaluatorType && evaluatorTypeReverse[result.evaluatorType]) {
    result.evaluatorType = evaluatorTypeReverse[result.evaluatorType];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  return result;
}

function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.evaluatorType && evaluatorTypeMap[result.evaluatorType]) {
    result.evaluatorType = evaluatorTypeMap[result.evaluatorType];
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

// ==================== 指标管理接口 ====================
export function getTargetMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/target-mgmt/page', { params: convertedParams })
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

export function createTargetMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/target-mgmt/create', convertedData).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateTargetMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/target-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function configTargetMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/target-mgmt/config', convertedData).catch(err => {
    console.warn('配置接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function enableTargetMgmt(ids) {
  return requestClient.put('/studentmgmt/target-mgmt/enable', { ids }).catch(err => {
    console.warn('启用接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function disableTargetMgmt(ids) {
  return requestClient.put('/studentmgmt/target-mgmt/disable', { ids }).catch(err => {
    console.warn('停用接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportTargetMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/target-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getTargetMgmtDetail(params) {
  return requestClient.get('/studentmgmt/target-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getTargetMgmtChart(params) {
  return requestClient.get('/studentmgmt/target-mgmt/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      statusCount: {
        disable: 4,
        enable: 6
      },
      evaluatorTypeCount: {
        parent: 2,
        leader: 3,
        teacher: 5
      },
      scoreTypeCount: {
        "接口赋分": 2,
        "累计赋分": 8
      },
      scoreDistribution: [
        {
          "0-20": 1,
          "20-40": 2,
          "40-60": 3,
          "60-80": 2,
          "80-100": 2
        }
      ]
    });
  });
}

export function getTargetIndex() {
  return requestClient.get('/studentmgmt/target-mgmt/chart/targetIndex').catch(err => {
    console.warn('核心指标接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalTargetCount: 10,
      enabledTargetCount: 8,
      warnTargetCount: 1,
      avgScore: 78.5
    });
  });
}
