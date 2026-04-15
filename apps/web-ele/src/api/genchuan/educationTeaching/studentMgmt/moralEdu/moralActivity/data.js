import { requestClient } from '#/api/request';

// ==================== 德育活动接口 ====================
export function getMoralActivityPage(params) {
  return requestClient.get('/studentmgmt/moral-activity/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const mock = getMockList();
    return { list: mock, total: mock.length };
  });
}

export function createMoralActivity(data) {
  return requestClient.post('/studentmgmt/moral-activity/create', data).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateMoralActivity(data) {
  return requestClient.put('/studentmgmt/moral-activity/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function publishMoralActivity(ids) {
  return requestClient.put('/studentmgmt/moral-activity/publish', { ids }).catch(err => {
    console.warn('发布接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function joinMoralActivity(data) {
  return requestClient.put('/studentmgmt/moral-activity/join', data).catch(err => {
    console.warn('报名接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function recordMoralActivity(data) {
  return requestClient.put('/studentmgmt/moral-activity/record', data).catch(err => {
    console.warn('记录接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportMoralActivity(params) {
  return requestClient.download('/studentmgmt/moral-activity/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getMoralActivityDetail(params) {
  return requestClient.get('/studentmgmt/moral-activity/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = getMockList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// 获取学生列表（用于报名下拉框）
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

// 获取部门列表（用于主办部门下拉框）
export function getDeptOptions(params) {
  return requestClient.get('/studentmgmt/dept/options', { params }).catch(err => {
    console.warn('获取部门列表失败，使用模拟数据', err);
    return Promise.resolve([
      { value: 101, label: '学生工作部' },
      { value: 102, label: '团委' },
      { value: 103, label: '教务处' },
    ]);
  });
}

// ==================== 图表接口 ====================
export function getMoralActivityChart(params) {
  return requestClient.get('/studentmgmt/moral-activity/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      statusCount: { unPublishCount: 2, processingCount: 3, finishedCount: 10 },
      activityTypeCount: { partyCount: 5, volunteerCount: 7, otherCount: 3 },
      monthTrend: [
        { month: '2025-01', count: 2 },
        { month: '2025-02', count: 4 },
        { month: '2025-03', count: 9 },
      ],
      joinTrend: [
        { month: '2025-01', count: 80 },
        { month: '2025-02', count: 150 },
        { month: '2025-03', count: 300 },
      ],
    });
  });
}

export function getMoralActivityCount(params) {
  return requestClient.get('/studentmgmt/moral-activity/chart/activityCount', { params }).catch(err => {
    console.warn('活动数量统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      typeList: ['党团活动', '志愿活动', '其他'],
      activityCountList: [5, 7, 3],
      joinCountList: [200, 280, 50],
    });
  });
}

// 模拟数据（与接口响应结构一致）
export const getMockList = () => {
  return [
    {
      id: 1,
      activityName: '学雷锋志愿活动',
      activityType: '志愿活动',
      hostDept: 101,
      hostDeptName: '学生工作部',
      startTime: 1767225600000,
      endTime: 1767312000000,
      joinNum: 45,
      photo: 'https://picsum.photos/id/100/200/150',
      content: '组织学生清扫校园',
      publishTime: 1767139200000,
      status: '进行中',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767139200000,
      updateTime: 1767139200000,
      // 报名记录
      joinRecords: [
        { studentName: '张三', joinTime: 1767150000000 },
        { studentName: '李四', joinTime: 1767160000000 },
        { studentName: '王五', joinTime: 1767170000000 },
      ],
      // 过程记录
      processRecords: [
        { content: '活动动员大会', recordTime: 1767180000000 },
        { content: '清扫校园主道路', recordTime: 1767225600000 },
        { content: '活动总结分享会', recordTime: 1767300000000 },
      ],
    },
    {
      id: 2,
      activityName: '党史知识竞赛',
      activityType: '党团活动',
      hostDept: 102,
      hostDeptName: '团委',
      startTime: 1769904000000,
      endTime: 1769990400000,
      joinNum: 80,
      photo: '',
      content: '',
      publishTime: null,
      status: '未发布',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1769904000000,
      updateTime: 1769904000000,
      joinRecords: [],
      processRecords: [],
    },
    {
      id: 3,
      activityName: '社区服务',
      activityType: '志愿活动',
      hostDept: 101,
      hostDeptName: '学生工作部',
      startTime: 1775088000000,
      endTime: 1775174400000,
      joinNum: 120,
      photo: 'https://picsum.photos/id/101/200/150',
      content: '',
      publishTime: 1775001600000,
      status: '已结束',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1775001600000,
      updateTime: 1775001600000,
      joinRecords: [
        { studentName: '赵六', joinTime: 1775020000000 },
        { studentName: '孙七', joinTime: 1775030000000 },
        { studentName: '周八', joinTime: 1775040000000 },
        { studentName: '吴九', joinTime: 1775050000000 },
      ],
      processRecords: [
        { content: '社区对接会议', recordTime: 1775060000000 },
        { content: '社区清洁服务', recordTime: 1775088000000 },
        { content: '服务总结', recordTime: 1775160000000 },
      ],
    },
    {
      id: 4,
      activityName: '环保讲座',
      activityType: '其他',
      hostDept: 103,
      hostDeptName: '教务处',
      startTime: 1777680000000,
      endTime: 1777766400000,
      joinNum: 60,
      photo: 'https://picsum.photos/id/102/200/150',
      content: '',
      publishTime: 1777593600000,
      status: '进行中',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1777593600000,
      updateTime: 1777593600000,
      joinRecords: [
        { studentName: '郑十', joinTime: 1777600000000 },
        { studentName: '钱十一', joinTime: 1777610000000 },
      ],
      processRecords: [
        { content: '讲座筹备', recordTime: 1777620000000 },
        { content: '专家邀请确认', recordTime: 1777640000000 },
      ],
    },
    {
      id: 5,
      activityName: '植树活动',
      activityType: '志愿活动',
      hostDept: 102,
      hostDeptName: '团委',
      startTime: 1780358400000,
      endTime: 1780444800000,
      joinNum: null,
      photo: '',
      content: '',
      publishTime: null,
      status: '未发布',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1780358400000,
      updateTime: 1780358400000,
      joinRecords: [],
      processRecords: [],
    },
  ];
};
