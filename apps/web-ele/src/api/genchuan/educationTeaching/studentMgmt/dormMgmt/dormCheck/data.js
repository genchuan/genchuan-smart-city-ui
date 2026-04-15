import { requestClient } from '#/api/request';

// ==================== 宿舍考勤接口 ====================
export function getDormCheckPage(params) {
  return requestClient.get('/studentmgmt/dorm-check/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const mock = getMockList();
    return { list: mock, total: mock.length };
  });
}

// 打卡（批量）
export function createDormCheck(data) {
  return requestClient.post('/studentmgmt/dorm-check/create', data).catch(err => {
    console.warn('打卡接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 补卡（批量）
export function recheckDormCheck(data) {
  return requestClient.put('/studentmgmt/dorm-check/recheck', data).catch(err => {
    console.warn('补卡接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 推送（批量）
export function pushDormCheck(data) {
  return requestClient.put('/studentmgmt/dorm-check/push', data).catch(err => {
    console.warn('推送接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportDormCheck(params) {
  return requestClient.download('/studentmgmt/dorm-check/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getDormCheckDetail(params) {
  return requestClient.get('/studentmgmt/dorm-check/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = getMockList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// 获取学生列表（用于其他场景，打卡不再使用）
export function getStudentOptions(params) {
  return requestClient.get('/studentmgmt/student/options', { params }).catch(err => {
    console.warn('获取学生列表失败，使用模拟数据', err);
    return Promise.resolve([
      { value: 10001, label: '张三' },
      { value: 10002, label: '李四' },
      { value: 10003, label: '王五' },
      { value: 10004, label: '赵六' },
      { value: 10005, label: '孙七' },
      { value: 10006, label: '周八' },
    ]);
  });
}

// ==================== 图表接口 ====================
export function getDormCheckChart(params) {
  return requestClient.get('/studentmgmt/dorm-check/chart', { params }).catch(err => {
    console.warn('考勤看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalCheck: 1200,
      normalCount: 1110,
      abnormalCount: 90,
      inRate: 92.5,
      warningCount: 15,
      abnormalStats: [
        { type: '晚归', count: 10 },
        { type: '未归', count: 5 },
        { type: '迟到', count: 75 },
      ],
    });
  });
}

export function getDormCheckCount(params) {
  return requestClient.get('/studentmgmt/dorm-check/chart/checkCount', { params }).catch(err => {
    console.warn('班级统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      labels: ['高一1班', '高一2班', '高一3班', '高二1班'],
      abnormalCount: [3, 5, 2, 4],
      inRate: [95.0, 92.5, 97.0, 93.0],
    });
  });
}

// 模拟数据
export const getMockList = () => {
  return [
    {
      id: 1,
      studentId: 2310001,
      studentName: '张三',
      className: '高一1班',
      checkTime: 1767225600000,
      checkStatus: '正常',
      abnormalType: '无',
      repairTime: null,
      repairUser: null,
      pushTime: 1767312000000,
      inRate: 95.5,
      status: '正常',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 2,
      studentId: 2310002,
      studentName: '李四',
      className: '高一1班',
      checkTime: 1767225600000,
      checkStatus: '迟到',
      abnormalType: '迟到',
      repairTime: null,
      repairUser: null,
      pushTime: null,
      inRate: 95.5,
      status: '异常',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 3,
      studentId: 2410003,
      studentName: '王五',
      className: '高一2班',
      checkTime: 1767225600000,
      checkStatus: '未到',
      abnormalType: '未归',
      repairTime: null,
      repairUser: null,
      pushTime: null,
      inRate: 95.5,
      status: '异常',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 4,
      studentId: 2410004,
      studentName: '赵六',
      className: '高一2班',
      checkTime: 1767225600000,
      checkStatus: '正常',
      abnormalType: '无',
      repairTime: null,
      repairUser: null,
      pushTime: 1767312000000,
      inRate: 95.5,
      status: '正常',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1767225600000,
      updateTime: 1767225600000,
    },
    {
      id: 5,
      studentId: 2510005,
      studentName: '孙七',
      className: '高一3班',
      checkTime: 1769904000000,
      checkStatus: '迟到',
      abnormalType: '迟到',
      repairTime: 1772496000000,
      repairUser: '张老师',
      pushTime: null,
      inRate: 92.0,
      status: '正常',
      remark: '已补卡',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1769904000000,
      updateTime: 1772496000000,
    },
    {
      id: 6,
      studentId: 2510006,
      studentName: '周八',
      className: '高一3班',
      checkTime: 1769904000000,
      checkStatus: '未到',
      abnormalType: '晚归',
      repairTime: null,
      repairUser: null,
      pushTime: null,
      inRate: 92.0,
      status: '异常',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1769904000000,
      updateTime: 1769904000000,
    },
  ];
};
