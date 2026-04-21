import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 评价人类型映射
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

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.evaluatorType && evaluatorTypeReverse[result.evaluatorType]) {
    result.evaluatorType = evaluatorTypeReverse[result.evaluatorType];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为英文）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.evaluatorType && evaluatorTypeMap[result.evaluatorType]) {
    result.evaluatorType = evaluatorTypeMap[result.evaluatorType];
  }
  return result;
}

// 转换列表数据
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
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = getMockList();
      // 模拟数据已经是中文，无需额外转换，但为了保持一致，也调用转换（幂等）
      return { list: convertList(mock), total: mock.length };
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
  // 配置接口可能包含 evaluatorType，需要转换
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/target-mgmt/config', convertedData).catch(err => {
    console.warn('配置接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function enableTargetMgmt(ids) {
  // 启用接口只传 ids，无需转换
  return requestClient.put('/studentmgmt/target-mgmt/enable', { ids }).catch(err => {
    console.warn('启用接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function disableTargetMgmt(ids) {
  // 停用接口只传 ids，无需转换
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
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// ==================== 图表接口 ====================
// 图表接口暂不处理映射（因未提供后端数据结构），如有需要可参照添加
export function getTargetMgmtChart(params) {
  return requestClient.get('/studentmgmt/target-mgmt/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      statusCount: { unEnableCount: 2, enabledCount: 8 },
      evaluatorTypeCount: { teacherCount: 5, parentCount: 2, leaderCount: 3 },
      scoreTypeCount: { accumulateCount: 6, apiCount: 4 },
      scoreDistribution: [
        { range: '0-20', count: 1 },
        { range: '20-40', count: 2 },
        { range: '40-60', count: 3 },
        { range: '60-80', count: 2 },
        { range: '80-100', count: 2 }
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

// 模拟数据（原始值使用中文，保持与前端一致）
export const getMockList = () => {
  return [
    {
      id: 1,
      targetName: '德育表现',
      totalScore: 100.00,
      warnThreshold: 60.00,
      evaluatorType: '教职工',
      scoreType: '累计赋分',
      enableTime: 1767225600000,
      disableTime: null,
      status: '已启用',
      remark: '日常行为规范',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      targetName: '志愿服务',
      totalScore: 80.00,
      warnThreshold: 40.00,
      evaluatorType: '家长',
      scoreType: '接口赋分',
      enableTime: 1769904000000,
      disableTime: 1772496000000,
      status: '未启用',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1769904000000,
      updateTime: 1772496000000,
    },
    {
      id: 3,
      targetName: '学术竞赛',
      totalScore: 120.00,
      warnThreshold: 70.00,
      evaluatorType: '领导',
      scoreType: '累计赋分',
      enableTime: 1775088000000,
      disableTime: null,
      status: '已启用',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775088000000,
      updateTime: 1775088000000,
    },
    {
      id: 4,
      targetName: '社团活动',
      totalScore: 60.00,
      warnThreshold: 30.00,
      evaluatorType: '教职工',
      scoreType: '接口赋分',
      enableTime: 1777680000000,
      disableTime: null,
      status: '已启用',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1777680000000,
      updateTime: 1777680000000,
    },
    {
      id: 5,
      targetName: '体育特长',
      totalScore: 90.00,
      warnThreshold: 50.00,
      evaluatorType: '家长',
      scoreType: '累计赋分',
      enableTime: 1780358400000,
      disableTime: null,
      status: '未启用',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1780358400000,
      updateTime: 1780358400000,
    },
    {
      id: 6,
      targetName: '科技创新',
      totalScore: 110.00,
      warnThreshold: 65.00,
      evaluatorType: '领导',
      scoreType: '接口赋分',
      enableTime: 1782950400000,
      disableTime: 1785542400000,
      status: '未启用',
      remark: '专利、论文等',
      creator: 'admin',
      updater: 'admin',
      createTime: 1782950400000,
      updateTime: 1785542400000,
    },
    {
      id: 7,
      targetName: '艺术素养',
      totalScore: 70.00,
      warnThreshold: 35.00,
      evaluatorType: '教职工',
      scoreType: '累计赋分',
      enableTime: 1785628800000,
      disableTime: null,
      status: '已启用',
      remark: '',
      creator: 'teacher_wang',
      updater: 'teacher_wang',
      createTime: 1785628800000,
      updateTime: 1785628800000,
    },
    {
      id: 8,
      targetName: '社会实践',
      totalScore: 85.00,
      warnThreshold: 45.00,
      evaluatorType: '家长',
      scoreType: '接口赋分',
      enableTime: 1788307200000,
      disableTime: null,
      status: '未启用',
      remark: '暑期实践',
      creator: 'admin',
      updater: 'admin',
      createTime: 1788307200000,
      updateTime: 1788307200000,
    }
  ];
};
