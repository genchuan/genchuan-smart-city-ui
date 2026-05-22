import { requestClient } from '#/api/request.js';

// ==================== 模拟数据生成（保持原有列表逻辑不变） ====================

function getStatTimeByPeriod(reportPeriod, baseDate = null) {
  const now = baseDate ? new Date(baseDate) : new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  switch (reportPeriod) {
    case '日报': {
      const start = new Date(year, month, date, 0, 0, 0);
      const end = new Date(year, month, date, 23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
    case '周报': {
      const dayOfWeek = now.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      monday.setHours(0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59);
      return { statStartTime: monday.getTime(), statEndTime: sunday.getTime() };
    }
    case '月报': {
      const start = new Date(year, month, 1, 0, 0, 0);
      const end = new Date(year, month + 1, 0, 23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
    case '季报': {
      const quarter = Math.floor(month / 3);
      const startMonth = quarter * 3;
      const start = new Date(year, startMonth, 1, 0, 0, 0);
      const end = new Date(year, startMonth + 3, 0, 23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
    case '半年报': {
      const half = month < 6 ? 0 : 6;
      const start = new Date(year, half, 1, 0, 0, 0);
      const end = new Date(year, half + 6, 0, 23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
    case '年报': {
      const start = new Date(year, 0, 1, 0, 0, 0);
      const end = new Date(year, 11, 31, 23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
    default: {
      const start = new Date(now);
      start.setDate(now.getDate() - 29);
      start.setHours(0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
  }
}

// 报表列表生成（完全保持原有逻辑）
export const generateMockReportList = (filters = {}) => {
  const grades = ['2022级', '2023级', '2024级'];
  const majors = ['计算机科学与技术', '软件工程', '大数据技术', '人工智能', '网络工程'];
  const classNames = [
    '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
    '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
  ];
  const reportCycles = ['日报', '周报', '月报', '季报', '半年报', '年报', '自定义报表'];
  const generateStatuses = ['待生成', '已生成', '已归档'];

  const list = [];
  const today = Date.now();
  for (let i = 1; i <= 20; i++) {
    const grade = grades[i % grades.length];
    const major = majors[i % majors.length];
    const className = classNames[i % classNames.length];
    const reportCycle = reportCycles[i % reportCycles.length];
    const generateStatus = generateStatuses[i % generateStatuses.length];

    const { statStartTime, statEndTime } = getStatTimeByPeriod(reportCycle, today - i * 86400000);

    list.push({
      id: i,
      reportCycle,
      statStartTime,
      statEndTime,
      className,
      majorName: major,
      grade,
      studentTotal: Math.floor(Math.random() * 500 + 2000),
      studentRegularNum: Math.floor(Math.random() * 400 + 1800),
      warnStudentNum: Math.floor(Math.random() * 10 + 1),
      newHonorNum: Math.floor(Math.random() * 20 + 5),
      newViolateNum: Math.floor(Math.random() * 5 + 1),
      newAssessNum: Math.floor(Math.random() * 50 + 10),
      dutyRate: (Math.random() * 20 + 80).toFixed(2),
      fundCoverRate: (Math.random() * 30 + 5).toFixed(2),
      generateStatus,
      generateTime: generateStatus !== '待生成' ? today - Math.random() * 86400000 : null,
      operatorId: generateStatus !== '待生成' ? [1, 2, 3][i % 3] : null,
      exportCount: Math.floor(Math.random() * 10),
      studentTotalYoy: (Math.random() * 10 - 5).toFixed(2),
      studentTotalQoq: (Math.random() * 8 - 4).toFixed(2),
      studentRegularNumYoy: (Math.random() * 10 - 5).toFixed(2),
      studentRegularNumQoq: (Math.random() * 8 - 4).toFixed(2),
      warnStudentNumYoy: (Math.random() * 20 - 10).toFixed(2),
      warnStudentNumQoq: (Math.random() * 15 - 7).toFixed(2),
      creator: 'admin',
      createTime: today - Math.random() * 86400000,
      updateTime: today,
    });
  }

  let filtered = list;
  if (filters.reportCycle) filtered = filtered.filter(item => item.reportCycle === filters.reportCycle);
  if (filters.generateStatus) filtered = filtered.filter(item => item.generateStatus === filters.generateStatus);
  if (filters.statStartTime && filters.statEndTime) {
    filtered = filtered.filter(item => item.statStartTime >= filters.statStartTime && item.statEndTime <= filters.statEndTime);
  }
  return filtered;
};

// ==================== 列表页接口 ====================
export function getWorkReportPage(params) {
  return requestClient.get('/studentmgmt/work-report/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const filters = {
      reportCycle: params?.reportCycle,
      generateStatus: params?.generateStatus,
      statStartTime: params?.statStartTime,
      statEndTime: params?.statEndTime,
    };
    const allData = generateMockReportList(filters);
    const total = allData.length;
    const start = (pageNo - 1) * pageSize;
    const list = allData.slice(start, start + pageSize);
    return Promise.resolve({ code: 200, data: { list, total, pageNo, pageSize }, msg: '成功' });
  });
}

export function createWorkReport(data) {
  return requestClient.post('/studentmgmt/work-report/generate', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '报表生成成功' });
  });
}

export function archiveWorkReport(data) {
  return requestClient.put('/studentmgmt/work-report/archive', data).catch(err => {
    console.warn('归档接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '归档成功' });
  });
}

export function exportWorkReport(params) {
  return requestClient.download('/studentmgmt/work-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}

export function getWorkReportDetail(params) {
  return requestClient.get('/studentmgmt/work-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    const detail = allData.find(item => item.id === Number(params.id)) || allData[0];
    return Promise.resolve({ code: 200, data: detail, msg: '成功' });
  });
}

// ==================== 业务明细接口（真实请求 + 模拟fallback，保证至少一条数据） ====================
const now = Date.now();

// 学生信息模拟数据
const mockStudents = [
  { id: 10, studentNo: '2023112', name: '林壵三', major: '护理', grade: '2023', className: '护理2401班', status: '在籍', createTime: now - 86400000 },
  { id: 11, studentNo: '2023113', name: '张小明', major: '计算机', grade: '2022', className: '计算机2201班', status: '在籍', createTime: now - 172800000 },
  { id: 12, studentNo: '2023114', name: '李芳', major: '软件工程', grade: '2024', className: '软件工程2301班', status: '在籍', createTime: now - 259200000 },
];

export function getStudentInfoPage(params) {
  return requestClient.get('/studentmgmt/student-info/page', { params }).catch(() => {
    let list = [...mockStudents];
    if (params.className) list = list.filter(s => s.className === params.className);
    if (params.status) list = list.filter(s => s.status === params.status);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = list.length;
    const start = (pageNo - 1) * pageSize;
    const sliced = list.slice(start, start + pageSize);
    return Promise.resolve({ code: 200, data: { list: sliced, total, pageNo, pageSize }, msg: '成功' });
  });
}

// 荣誉记录
const mockHonors = [
  { id: 9, studentName: '王五', className: '电子2401班', honorName: '优秀团员', getTime: now - 86400000, createTime: now - 86400000 },
  { id: 10, studentName: '林壵三', className: '护理2401班', honorName: '三好学生', getTime: now - 172800000, createTime: now - 172800000 },
  { id: 11, studentName: '张小明', className: '计算机2201班', honorName: '优秀班干部', getTime: now - 259200000, createTime: now - 259200000 },
];

export function getHonorMgmtPage(params) {
  return requestClient.get('/studentmgmt/honor-mgmt/page', { params }).catch(() => {
    let list = [...mockHonors];
    if (params.className) list = list.filter(h => h.className === params.className);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = list.length;
    const start = (pageNo - 1) * pageSize;
    const sliced = list.slice(start, start + pageSize);
    return Promise.resolve({ code: 200, data: { list: sliced, total, pageNo, pageSize }, msg: '成功' });
  });
}

// 考评记录
const mockAssess = [
  { id: 8, className: '计算机2201班', assessType: '文明班级', cycle: '月', score: 94.8, rankNo: 1, createTime: now - 259200000 },
  { id: 9, className: '护理2401班', assessType: '卫生', cycle: '周', score: 92.0, rankNo: 2, createTime: now - 345600000 },
];

export function getAssessMgmtPage(params) {
  return requestClient.get('/studentmgmt/assess-mgmt/page', { params }).catch(() => {
    let list = [...mockAssess];
    if (params.className) list = list.filter(a => a.className === params.className);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = list.length;
    const start = (pageNo - 1) * pageSize;
    const sliced = list.slice(start, start + pageSize);
    return Promise.resolve({ code: 200, data: { list: sliced, total, pageNo, pageSize }, msg: '成功' });
  });
}

// 违纪记录
const mockViolates = [
  { id: 54, studentName: '赵六', violateType: '行为违纪', punishType: '警告', violateTime: now - 432000000, createTime: now - 432000000 },
  { id: 55, studentName: '林壵三', violateType: '纪律违纪', punishType: '批评', violateTime: now - 518400000, createTime: now - 518400000 },
];

export function getViolateMgmtPage(params) {
  return requestClient.get('/studentmgmt/violate-mgmt/page', { params }).catch(() => {
    let list = [...mockViolates];
    if (params.studentName) list = list.filter(v => v.studentName === params.studentName);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = list.length;
    const start = (pageNo - 1) * pageSize;
    const sliced = list.slice(start, start + pageSize);
    return Promise.resolve({ code: 200, data: { list: sliced, total, pageNo, pageSize }, msg: '成功' });
  });
}

// 心理预警
const mockMental = [
  { id: 15, studentName: '林壵三', mentalStatus: '需关注', riskLevel: '低', evaluateTime: now - 604800000, createTime: now - 604800000 },
];

export function getMentalMgmtPage(params) {
  return requestClient.get('/studentmgmt/mental-mgmt/page', { params }).catch(() => {
    let list = [...mockMental];
    if (params.riskLevel) list = list.filter(m => m.riskLevel === params.riskLevel);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = list.length;
    const start = (pageNo - 1) * pageSize;
    const sliced = list.slice(start, start + pageSize);
    return Promise.resolve({ code: 200, data: { list: sliced, total, pageNo, pageSize }, msg: '成功' });
  });
}

// 用户信息
export function getUserInfo(params) {
  return requestClient.get('/system/user/get', { params }).catch(() => {
    return Promise.resolve({ code: 200, data: { id: params.id, username: 'admin', nickname: '管理员', deptId: 1 }, msg: '成功' });
  });
}

// 图表接口（保持不变）
export function getWorkReportChart(params) {
  return requestClient.get('/studentmgmt/work-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: {
        cardData: {
          studentTotal: 3256,
          studentRegularNum: 3120,
          warnStudentNum: 12,
          newHonorNum: 86,
          newViolateNum: 5,
          newAssessNum: 3256,
          dutyRate: 98.5,
          fundCoverRate: 12.3,
        },
        pieData: [
          { name: '荣誉记录', value: 86 },
          { name: '违纪记录', value: 5 },
          { name: '考评记录', value: 3256 },
          { name: '资助记录', value: 401 },
        ],
        radarData: {
          dimensions: ['学习成绩', '德育表现', '体育健康', '劳动实践', '心理健康'],
          series: [
            { name: '计算机2201班', value: [85, 92, 88, 90, 86] },
            { name: '软件工程2301班', value: [78, 88, 82, 85, 80] },
          ],
        },
        barData: [
          { name: '计算机2201班', honorNum: 12, violateNum: 2 },
          { name: '软件工程2301班', honorNum: 15, violateNum: 1 },
        ],
        lineData: {
          date: ['2025-01', '2025-02', '2025-03'],
          series: [
            { name: '荣誉获奖趋势', data: [78, 82, 86] },
            { name: '违纪趋势', data: [5, 4, 3] },
          ],
        },
      },
      msg: '成功',
    });
  });
}
