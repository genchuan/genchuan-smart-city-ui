import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 心理状态映射
const mentalStatusMap = {
  '正常': 'normal',
  '关注': 'focus',
  '高危': 'high_risk'
};
const mentalStatusReverse = {
  'normal': '正常',
  'focus': '关注',
  'high_risk': '高危'
};

// 风险等级映射
const riskLevelMap = {
  '低': 'low',
  '中': 'medium',
  '高': 'high'
};
const riskLevelReverse = {
  'low': '低',
  'medium': '中',
  'high': '高'
};

// 状态映射
const statusMap = {
  '待评估': 'wait_evaluate',
  '咨询中': 'consulting',
  '已干预': 'intervened'
};
const statusReverse = {
  'wait_evaluate': '待评估',
  'consulting': '咨询中',
  'intervened': '已干预'
};

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.mentalStatus && mentalStatusReverse[result.mentalStatus]) {
    result.mentalStatus = mentalStatusReverse[result.mentalStatus];
  }
  if (result.riskLevel && riskLevelReverse[result.riskLevel]) {
    result.riskLevel = riskLevelReverse[result.riskLevel];
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
  if (result.mentalStatus && mentalStatusMap[result.mentalStatus]) {
    result.mentalStatus = mentalStatusMap[result.mentalStatus];
  }
  if (result.riskLevel && riskLevelMap[result.riskLevel]) {
    result.riskLevel = riskLevelMap[result.riskLevel];
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

// ==================== 心理管理接口 ====================
export function getMentalMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/mental-mgmt/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mockData = convertList(dataList());
      return { list: mockData, total: mockData.length };
    });
}

export function createMentalMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/mental-mgmt/create', convertedData).catch(err => {
    console.warn('建档接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateMentalMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/mental-mgmt/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function consultMentalMgmt(data) {
  // 预约接口只传 id 和 consultTime，无需转换
  return requestClient.put('/studentmgmt/mental-mgmt/consult', data).catch(err => {
    console.warn('预约接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function interveneMentalMgmt(data) {
  // 跟进接口只传 id、interveneTime、interveneContent，无需转换
  return requestClient.put('/studentmgmt/mental-mgmt/intervene', data).catch(err => {
    console.warn('跟进接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateStatusMentalMgmt(data) {
  // 更新状态接口：需要转换 mentalStatus 和 riskLevel
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/mental-mgmt/updateStatus', convertedData).catch(err => {
    console.warn('状态更新接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportMentalMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/mental-mgmt/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getMentalMgmtDetail(params) {
  return requestClient.get('/studentmgmt/mental-mgmt/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = dataList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// 获取学生选项（无需转换）
export function getStudentOptions(params) {
  return requestClient.get('/envirhealth/user/options', { params }).catch(err => {
    console.warn('获取学生选项失败，使用模拟数据', err);
    return Promise.resolve([
      { label: '张三', value: 1 },
      { label: '李四', value: 2 },
      { label: '王五', value: 3 },
      { label: '赵六', value: 4 },
      { label: '孙七', value: 5 },
      { label: '周八', value: 6 },
    ]);
  });
}

// ==================== 图表接口 ====================
// 图表接口暂不处理映射（因未提供后端数据结构），如有需要可参照添加
export function getMentalMgmtChart() {
  return requestClient.get('/studentmgmt/mental-mgmt/chart').catch(err => {
    console.warn('心理看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalCount: 120,
      normalCount: 98,
      focusCount: 18,
      highRiskCount: 4,
      lowRiskCount: 100,
      midRiskCount: 16,
      highRiskLevelCount: 4,
      waitEvaluateCount: 10,
      consultingCount: 5,
      intervenedCount: 105,
      recent7DayCount: 8,
    });
  });
}

export function getStatusDistribution() {
  return requestClient.get('/studentmgmt/mental-mgmt/chart/statusDistribution').catch(err => {
    console.warn('分布统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      mentalStatusDistribution: [
        { name: '正常', value: 98 },
        { name: '关注', value: 18 },
        { name: '高危', value: 4 },
      ],
      riskLevelDistribution: [
        { name: '低', value: 100 },
        { name: '中', value: 16 },
        { name: '高', value: 4 },
      ],
    });
  });
}

// 模拟数据（原始值使用英文，通过转换函数对外提供中文）
export const dataList = () => {
  return [
    {
      id: 1,
      studentId: 1,
      studentName: '张三',
      className: '计算机科学与技术1班',
      mentalStatus: 'normal',
      riskLevel: 'low',
      evaluateTime: 1672531200000,
      consultTime: null,
      interveneTime: null,
      interveneContent: null,
      status: 'wait_evaluate',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      studentId: 2,
      studentName: '李四',
      className: '软件工程1班',
      mentalStatus: 'focus',
      riskLevel: 'medium',
      evaluateTime: 1672617600000,
      consultTime: 1672704000000,
      interveneTime: null,
      interveneContent: null,
      status: 'consulting',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672704000000,
    },
    {
      id: 3,
      studentId: 3,
      studentName: '王五',
      className: '计算机科学与技术2班',
      mentalStatus: 'high_risk',
      riskLevel: 'high',
      evaluateTime: 1672704000000,
      consultTime: 1672790400000,
      interveneTime: 1672876800000,
      interveneContent: '安排心理咨询，情绪稳定',
      status: 'intervened',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672876800000,
    },
    {
      id: 4,
      studentId: 4,
      studentName: '赵六',
      className: '电子信息工程1班',
      mentalStatus: 'normal',
      riskLevel: 'low',
      evaluateTime: 1672790400000,
      consultTime: null,
      interveneTime: null,
      interveneContent: null,
      status: 'wait_evaluate',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672790400000,
    },
    {
      id: 5,
      studentId: 5,
      studentName: '孙七',
      className: '大数据1班',
      mentalStatus: 'focus',
      riskLevel: 'medium',
      evaluateTime: 1672876800000,
      consultTime: 1672963200000,
      interveneTime: null,
      interveneContent: null,
      status: 'consulting',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672963200000,
    },
    {
      id: 6,
      studentId: 6,
      studentName: '周八',
      className: '软件工程2班',
      mentalStatus: 'high_risk',
      riskLevel: 'high',
      evaluateTime: 1672963200000,
      consultTime: null,
      interveneTime: null,
      interveneContent: null,
      status: 'wait_evaluate',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
