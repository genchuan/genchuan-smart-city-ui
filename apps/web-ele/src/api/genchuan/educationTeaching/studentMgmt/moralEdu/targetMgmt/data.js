import { requestClient } from '#/api/request';

// ==================== 指标管理接口 ====================
export function getTargetMgmtPage(params) {
  return requestClient.get('/studentmgmt/target-mgmt/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const mock = getMockList();
    return { list: mock, total: mock.length };
  });
}

export function createTargetMgmt(data) {
  return requestClient.post('/studentmgmt/target-mgmt/create', data).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateTargetMgmt(data) {
  return requestClient.put('/studentmgmt/target-mgmt/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function configTargetMgmt(data) {
  return requestClient.put('/studentmgmt/target-mgmt/config', data).catch(err => {
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
  return requestClient.download('/studentmgmt/target-mgmt/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getTargetMgmtDetail(params) {
  return requestClient.get('/studentmgmt/target-mgmt/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = getMockList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// ==================== 图表接口 ====================
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

// 模拟数据（与接口响应结构一致）
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
