import { requestClient } from '#/api/request';

// ==================== 出入申请接口 ====================
export function getAccessApplyPage(params) {
  return requestClient.get('/studentmgmt/access-apply/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const mock = getMockList();
    return { list: mock, total: mock.length };
  });
}

// 新增申请
export function createAccessApply(data) {
  return requestClient.post('/studentmgmt/access-apply/create', data).catch(err => {
    console.warn('申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 审核（批量）
export function auditAccessApply(data) {
  return requestClient.put('/studentmgmt/access-apply/audit', data).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑申请
export function updateAccessApply(data) {
  return requestClient.put('/studentmgmt/access-apply/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportAccessApply(params) {
  return requestClient.download('/studentmgmt/access-apply/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getAccessApplyDetail(params) {
  return requestClient.get('/studentmgmt/access-apply/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = getMockList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// 获取学生列表
export function getStudentOptions(params) {
  return requestClient.get('/studentmgmt/student/options', { params }).catch(err => {
    console.warn('获取学生列表失败，使用模拟数据', err);
    return Promise.resolve([
      { value: 1, label: '张三' },
      { value: 2, label: '李四' },
      { value: 3, label: '王五' },
      { value: 4, label: '赵六' },
      { value: 5, label: '孙七' },
    ]);
  });
}

// ==================== 图表接口 ====================
// 出入申请统计看板（卡片 + 折线图 + 类型分布）
export function getAccessApplyChart(params) {
  return requestClient.get('/studentmgmt/access-apply/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalApplyCount: 128,
      pendingAuditCount: 12,
      passedCount: 116,
      dailyTrend: [
        { date: '2025-03-25', count: 15 },
        { date: '2025-03-26', count: 18 },
        { date: '2025-03-27', count: 20 },
        { date: '2025-03-28', count: 16 },
        { date: '2025-03-29', count: 22 },
        { date: '2025-03-30', count: 21 },
        { date: '2025-03-31', count: 8 },
      ],
      typeDistribution: [
        { type: '应急出入', count: 98 },
        { type: '其他', count: 30 },
      ],
    });
  });
}

// 各班级申请次数 / 类型分布统计（柱状图）
export function getAccessApplyCount(params) {
  return requestClient.get('/studentmgmt/access-apply/chart/applyCount', { params }).catch(err => {
    console.warn('班级统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      classStatistics: [
        { className: '高一1班', emergencyCount: 12, otherCount: 3, totalCount: 15 },
        { className: '高一2班', emergencyCount: 8, otherCount: 2, totalCount: 10 },
        { className: '高一3班', emergencyCount: 5, otherCount: 1, totalCount: 6 },
      ],
    });
  });
}

// 模拟数据（包含班级字段 className，使用 reserve1）
export const getMockList = () => {
  return [
    {
      id: 1,
      studentId: 202301,
      studentName: '张三',
      className: '高一1班',
      applyType: '应急出入',
      applyReason: '家中有急事',
      applyTime: 1767225600000,
      auditUser: '张老师',
      auditTime: 1767312000000,
      status: '已通过',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      studentId: 202302,
      studentName: '李四',
      className: '高一1班',
      applyType: '其他',
      applyReason: '外出就医',
      applyTime: 1767225600000,
      auditUser: null,
      auditTime: null,
      status: '待审核',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 3,
      studentId: 202403,
      studentName: '王五',
      className: '高一2班',
      applyType: '应急出入',
      applyReason: '家里突发情况',
      applyTime: 1769904000000,
      auditUser: '王老师',
      auditTime: 1769990400000,
      status: '已通过',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 4,
      studentId: 202404,
      studentName: '赵六',
      className: '高一2班',
      applyType: '应急出入',
      applyReason: '急需外出',
      applyTime: 1769904000000,
      auditUser: null,
      auditTime: null,
      status: '待审核',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
    {
      id: 5,
      studentId: 202505,
      studentName: '孙七',
      className: '高一3班',
      applyType: '其他',
      applyReason: '参加比赛',
      applyTime: 1775088000000,
      auditUser: '李老师',
      auditTime: 1775174400000,
      status: '已通过',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775088000000,
      updateTime: 1775088000000,
    },
  ];
};
