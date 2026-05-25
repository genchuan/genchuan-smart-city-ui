import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 就诊类型映射
const treatTypeMap = {
  '门诊': 'outpatient',
  '急诊': 'emergency',
  '其他': 'other'
};
const treatTypeReverse = {
  'outpatient': '门诊',
  'emergency': '急诊',
  'other': '其他'
};

// 状态映射
const statusMap = {
  '待审核': 'pending',
  '已就诊': 'visited'
};
const statusReverse = {
  'pending': '待审核',
  'visited': '已就诊'
};

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.treatType && treatTypeReverse[result.treatType]) {
    result.treatType = treatTypeReverse[result.treatType];
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
  if (result.treatType && treatTypeMap[result.treatType]) {
    result.treatType = treatTypeMap[result.treatType];
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

// ==================== 就诊管理接口 ====================
export function getTreatMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/treat-mgmt/page', { params: convertedParams })
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

// 预约
export function appointTreatMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/treat-mgmt/appoint', convertedData)
}

// 审核（批量）
export function auditTreatMgmt(data) {
  // 审核接口只传 ids，无需转换
  return requestClient.put('/studentmgmt/treat-mgmt/audit', data)
}

// 登记（批量）
export function registerTreatMgmt(data) {
  // 登记接口只传 ids, treatContent, registerTime，无需转换
  return requestClient.put('/studentmgmt/treat-mgmt/register', data)
}

// 编辑
export function updateTreatMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/treat-mgmt/update', convertedData)
}

// 反馈（单个）
export function feedbackTreatMgmt(data) {
  // 反馈接口只传 id 和 feedbackTime，无需转换
  return requestClient.put('/studentmgmt/treat-mgmt/feedback', data)
}

// 导出
export function exportTreatMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/treat-mgmt/export-excel', convertedParams)
}

// 详情
export function getTreatMgmtDetail(params) {
  return requestClient.get('/studentmgmt/treat-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
    });
}

// ==================== 图表接口 ====================
export function getTreatMgmtChart(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/treat-mgmt/chart', { params: convertedParams }).catch(err => {
    console.warn('就诊看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalTreatCount: 86,
      pendingAuditCount: 12,
      finishedTreatCount: 74,
      outpatientCount: 62,
      emergencyCount: 18,
      otherCount: 6,
      recentWeekTreatTrend: [
        { date: '2025-03-25', count: 8 },
        { date: '2025-03-26', count: 12 },
        { date: '2025-03-27', count: 10 },
        { date: '2025-03-28', count: 9 },
        { date: '2025-03-29', count: 7 },
        { date: '2025-03-30', count: 5 },
        { date: '2025-03-31', count: 6 },
      ],
    });
  });
}

export function getTreatMgmtDistribution(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/treat-mgmt/treatDistribution', { params: convertedParams }).catch(err => {
    console.warn('分布统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      treatTypeDistribution: [
        { name: '门诊', value: 62 },
        { name: '急诊', value: 18 },
        { name: '其他', value: 6 },
      ],
      gradeDistribution: [
        { name: '高一', value: 25 },
        { name: '高二', value: 30 },
        { name: '高三', value: 31 },
      ],
    });
  });
}
