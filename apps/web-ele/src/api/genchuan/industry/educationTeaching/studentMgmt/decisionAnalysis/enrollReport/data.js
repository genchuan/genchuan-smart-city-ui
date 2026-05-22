import { requestClient } from '#/api/request.js';

// ==================== 模拟数据生成 ====================

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

// 报表列表生成
export const generateMockReportList = (filters = {}) => {
  const reportCycles = ['日报', '周报', '月报', '季报', '半年报', '年报', '自定义报表'];
  const generateStatuses = ['待生成', '已生成', '已归档'];
  const list = [];
  const today = Date.now();

  for (let i = 1; i <= 20; i++) {
    const reportCycle = reportCycles[i % reportCycles.length];
    const generateStatus = generateStatuses[i % generateStatuses.length];
    const { statStartTime, statEndTime } = getStatTimeByPeriod(reportCycle, today - i * 86400000);

    list.push({
      id: i,
      reportCycle,
      statStartTime,
      statEndTime,
      sourceTotal: Math.floor(Math.random() * 3000 + 2000),
      applyNum: Math.floor(Math.random() * 2500 + 1500),
      admitNum: Math.floor(Math.random() * 2000 + 1200),
      checkinNum: Math.floor(Math.random() * 1800 + 1000),
      classAssignRate: (Math.random() * 10 + 90).toFixed(2),
      dormAssignRate: (Math.random() * 10 + 90).toFixed(2),
      generateStatus,
      generateTime: generateStatus !== '待生成' ? today - Math.random() * 86400000 : null,
      operatorId: generateStatus !== '待生成' ? [1, 2, 3][i % 3] : null,
      exportCount: Math.floor(Math.random() * 10),
      sourceTotalYoy: (Math.random() * 10 - 5).toFixed(2),
      sourceTotalQoq: (Math.random() * 8 - 4).toFixed(2),
      applyNumYoy: (Math.random() * 10 - 5).toFixed(2),
      applyNumQoq: (Math.random() * 8 - 4).toFixed(2),
      admitNumYoy: (Math.random() * 10 - 5).toFixed(2),
      admitNumQoq: (Math.random() * 8 - 4).toFixed(2),
      checkinNumYoy: (Math.random() * 10 - 5).toFixed(2),
      checkinNumQoq: (Math.random() * 8 - 4).toFixed(2),
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
export function getEnrollReportPage(params) {
  return requestClient.get('/studentmgmt/enroll-report/page', { params }).catch(err => {
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

export function createEnrollReport(data) {
  return requestClient.post('/studentmgmt/enroll-report/generate', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '报表生成成功' });
  });
}

export function archiveEnrollReport(data) {
  return requestClient.put('/studentmgmt/enroll-report/archive', data).catch(err => {
    console.warn('归档接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '归档成功' });
  });
}

export function exportEnrollReport(params) {
  return requestClient.download('/studentmgmt/enroll-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}

export function getEnrollReportDetail(params) {
  return requestClient.get('/studentmgmt/enroll-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    const detail = allData.find(item => item.id === Number(params.id)) || allData[0];
    return Promise.resolve({ code: 200, data: detail, msg: '成功' });
  });
}

// ==================== 业务明细接口 ====================
const now = Date.now();

// 报名管理（生源、报名、录取共用）
const mockRegisters = [
  { id: 6, studentName: '周八', idCard: '110101200806066789', major: '计算机科学', applyTime: now - 86400000, auditUser: '招生办周老师', auditTime: now - 72000000, confirmTime: now - 43200000, status: 'admitted', createTime: now - 86400000 },
  { id: 7, studentName: '吴九', idCard: '110101200806066790', major: '机电一体化', applyTime: now - 172800000, auditUser: '招生办吴老师', auditTime: now - 144000000, confirmTime: now - 86400000, status: 'admitted', createTime: now - 172800000 },
  { id: 8, studentName: '郑十', idCard: '110101200806066791', major: '财经管理', applyTime: now - 259200000, auditUser: null, auditTime: null, confirmTime: null, status: 'applied', createTime: now - 259200000 },
];

export function getRegisterMgmtPage(params) {
  return requestClient.get('/studentmgmt/register-mgmt/page', { params }).catch(() => {
    let list = [...mockRegisters];
    if (params.status === 'applied') list = list.filter(r => r.status === 'applied');
    else if (params.status === 'admitted') list = list.filter(r => r.status === 'admitted');
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = list.length;
    const start = (pageNo - 1) * pageSize;
    const sliced = list.slice(start, start + pageSize);
    return Promise.resolve({ code: 200, data: { list: sliced, total, pageNo, pageSize }, msg: '成功' });
  });
}

// 报到管理
const mockCheckins = [
  { id: 8, studentId: 8, studentName: '郑十', examScore: 615.5, confirmTime: now - 86400000, auditUser: '招生办郑老师', status: 'checked_in', createTime: now - 86400000 },
  { id: 9, studentId: 9, studentName: '钱多多', examScore: 598.0, confirmTime: now - 172800000, auditUser: '招生办李老师', status: 'checked_in', createTime: now - 172800000 },
];

export function getCheckinPage(params) {
  return requestClient.get('/studentmgmt/check-in/page', { params }).catch(() => {
    let list = [...mockCheckins];
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

// ==================== 图表接口 ====================
export function getEnrollReportChart(params) {
  return requestClient.get('/studentmgmt/enroll-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: {
        cardData: {
          sourceTotal: 4850,
          applyNum: 4120,
          admitNum: 3380,
          checkinNum: 3256,
          classAssignRate: 100.0,
          dormAssignRate: 100.0,
        },
        pieData: [
          { name: '本地生源', value: 3200 },
          { name: '外地生源', value: 1650 },
        ],
        barData: [
          { name: '计算机', applyNum: 850, admitNum: 680 },
          { name: '机电', applyNum: 720, admitNum: 620 },
          { name: '财经', applyNum: 980, admitNum: 820 },
          { name: '商贸', applyNum: 650, admitNum: 560 },
          { name: '汽修', applyNum: 920, admitNum: 700 },
        ],
        lineData: {
          date: ['2023', '2024', '2025'],
          series: [
            { name: '生源总数', data: [4520, 4680, 4850] },
          ],
        },
      },
      msg: '成功',
    });
  });
}
