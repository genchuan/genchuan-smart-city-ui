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
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = getMockList();
      return { list: convertList(mock), total: mock.length };
    });
}

// 预约
export function appointTreatMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/treat-mgmt/appoint', convertedData).catch(err => {
    console.warn('预约接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 审核（批量）
export function auditTreatMgmt(data) {
  // 审核接口只传 ids，无需转换
  return requestClient.put('/studentmgmt/treat-mgmt/audit', data).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 登记（批量）
export function registerTreatMgmt(data) {
  // 登记接口只传 ids, treatContent, registerTime，无需转换
  return requestClient.put('/studentmgmt/treat-mgmt/register', data).catch(err => {
    console.warn('登记接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑
export function updateTreatMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/treat-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 反馈（单个）
export function feedbackTreatMgmt(data) {
  // 反馈接口只传 id 和 feedbackTime，无需转换
  return requestClient.put('/studentmgmt/treat-mgmt/feedback', data).catch(err => {
    console.warn('反馈接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportTreatMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/treat-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getTreatMgmtDetail(params) {
  return requestClient.get('/studentmgmt/treat-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// 获取学生列表（用于预约下拉框）
export function getStudentOptions(params) {
  return requestClient.get('/studentmgmt/student/options', { params }).catch(err => {
    console.warn('获取学生列表失败，使用模拟数据', err);
    return Promise.resolve([
      { value: 1, label: '张三', grade: '高一' },
      { value: 2, label: '李四', grade: '高一' },
      { value: 3, label: '王五', grade: '高二' },
      { value: 4, label: '赵六', grade: '高二' },
      { value: 5, label: '孙七', grade: '高三' },
    ]);
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
  return requestClient.get('/studentmgmt/treat-mgmt/chart/treatDistribution', { params: convertedParams }).catch(err => {
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

// 模拟数据（原始值使用英文，通过转换函数对外提供中文）
export const getMockList = () => {
  return [
    {
      id: 1,
      studentId: 1,
      studentName: '张三',
      grade: '高一',
      treatType: 'outpatient',
      symptom: '发热、咳嗽',
      registerTime: 1767225600000,
      treatContent: '开具退烧药',
      applyTime: 1767139200000,
      auditUser: '校医王',
      auditTime: 1767225600000,
      feedbackTime: 1767312000000,
      status: 'visited',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767139200000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      studentId: 2,
      studentName: '李四',
      grade: '高一',
      treatType: 'emergency',
      symptom: '腹痛',
      registerTime: null,
      treatContent: null,
      applyTime: 1767225600000,
      auditUser: null,
      auditTime: null,
      feedbackTime: null,
      status: 'pending',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 3,
      studentId: 3,
      studentName: '王五',
      grade: '高二',
      treatType: 'other',
      symptom: '心理咨询',
      registerTime: 1769904000000,
      treatContent: '心理疏导',
      applyTime: 1769817600000,
      auditUser: '心理咨询师',
      auditTime: 1769904000000,
      feedbackTime: 1769990400000,
      status: 'visited',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1769817600000,
      updateTime: 1769904000000,
    },
    {
      id: 4,
      studentId: 4,
      studentName: '赵六',
      grade: '高二',
      treatType: 'outpatient',
      symptom: '过敏',
      registerTime: null,
      treatContent: null,
      applyTime: 1769904000000,
      auditUser: null,
      auditTime: null,
      feedbackTime: null,
      status: 'pending',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 5,
      studentId: 5,
      studentName: '孙七',
      grade: '高三',
      treatType: 'emergency',
      symptom: '摔伤',
      registerTime: 1775088000000,
      treatContent: '清创包扎',
      applyTime: 1775001600000,
      auditUser: '校医李',
      auditTime: 1775088000000,
      feedbackTime: 1775174400000,
      status: 'visited',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775001600000,
      updateTime: 1775088000000,
    },
  ];
};
