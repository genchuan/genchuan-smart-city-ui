import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const enterpriseTypeMap = {
  '民企': 'private',
  '国企': 'state_owned',
  '外企': 'foreign'
};
const enterpriseTypeReverseMap = {
  'private': '民企',
  'state_owned': '国企',
  'foreign': '外企'
};

const statusMap = {
  '合作中': 'cooperating',
  '已结束': 'ended'
};
const statusReverseMap = {
  'cooperating': '合作中',
  'ended': '已结束'
};

// 响应数据：英文 → 中文
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.enterpriseType && enterpriseTypeReverseMap[result.enterpriseType]) {
    result.enterpriseType = enterpriseTypeReverseMap[result.enterpriseType];
  }
  if (result.status && statusReverseMap[result.status]) {
    result.status = statusReverseMap[result.status];
  }
  return result;
}

// 请求参数：中文 → 英文
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.enterpriseType && enterpriseTypeMap[result.enterpriseType]) {
    result.enterpriseType = enterpriseTypeMap[result.enterpriseType];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  return result;
}

// 转换列表
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 校企合作接口 ====================
export function getCoopEnterprisePage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/coop-enterprise/page', { params: convertedParams })
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

export function createCoopEnterprise(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/coop-enterprise/create', convertedData)
}

export function maintainCoopEnterprise(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/coop-enterprise/maintain', convertedData)
}

export function updateCoopEnterprise(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/coop-enterprise/update', convertedData)
}

export function exportCoopEnterprise(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/coop-enterprise/export-excel', convertedParams)
}

export function getCoopEnterpriseDetail(params) {
  return requestClient.get('/studentmgmt/coop-enterprise/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

export function getDeptOptions(params) {
  return requestClient.get('/studentmgmt/dept/options', { params }).catch(err => {
    console.warn('获取系部列表失败，使用模拟数据', err);
    return Promise.resolve([
      { value: 2001, label: '计算机系' },
      { value: 2002, label: '机电系' },
      { value: 2003, label: '经贸系' },
      { value: 2004, label: '其他' },
    ]);
  });
}

// ==================== 图表接口 ====================
export function getCoopEnterpriseChart(params) {
  return requestClient.get('/studentmgmt/coop-enterprise/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalEnterprise: 36,
      cooperatingEnterprise: 28,
      finishedEnterprise: 8,
      deptCoopCount: [
        { deptName: '计算机系', count: 12 },
        { deptName: '机电系', count: 10 },
        { deptName: '经贸系', count: 8 },
        { deptName: '其他', count: 6 },
      ],
      coopTrend: [
        { date: '2024-01', count: 2 },
        { date: '2024-02', count: 3 },
        { date: '2024-03', count: 5 },
      ],
    });
  });
}

export function getCoopEnterpriseDistribution(params) {
  return requestClient.get('/studentmgmt/coop-enterprise/chart/enterpriseDistribution', { params }).catch(err => {
    console.warn('分布接口失败，使用模拟数据', err);
    return Promise.resolve({
      typeDistribution: [
        { name: '民企', value: 22 },
        { name: '国企', value: 8 },
        { name: '外企', value: 6 },
      ],
      deptDistribution: [
        { name: '计算机系', value: 12 },
        { name: '机电系', value: 10 },
        { name: '经贸系', value: 8 },
        { name: '其他', value: 6 },
      ],
    });
  });
}
