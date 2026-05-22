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
      coopEnterpriseNum: Math.floor(Math.random() * 50 + 20),
      employRate: (Math.random() * 15 + 85).toFixed(2),
      studyUpNum: Math.floor(Math.random() * 100 + 30),
      jobMatchRate: (Math.random() * 20 + 70).toFixed(2),
      generateStatus,
      generateTime: generateStatus !== '待生成' ? today - Math.random() * 86400000 : null,
      operatorId: generateStatus !== '待生成' ? [1, 2, 3][i % 3] : null,
      exportCount: Math.floor(Math.random() * 10),
      coopEnterpriseNumYoy: (Math.random() * 10 - 5).toFixed(2),
      coopEnterpriseNumQoq: (Math.random() * 8 - 4).toFixed(2),
      studyUpNumYoy: (Math.random() * 15 - 7).toFixed(2),
      studyUpNumQoq: (Math.random() * 10 - 5).toFixed(2),
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
export function getEmployReportPage(params) {
  return requestClient.get('/studentmgmt/employ-report/page', { params }).catch(err => {
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

export function createEmployReport(data) {
  return requestClient.post('/studentmgmt/employ-report/generate', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '报表生成成功' });
  });
}

export function archiveEmployReport(data) {
  return requestClient.put('/studentmgmt/employ-report/archive', data).catch(err => {
    console.warn('归档接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '归档成功' });
  });
}

export function exportEmployReport(params) {
  return requestClient.download('/studentmgmt/employ-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}

export function getEmployReportDetail(params) {
  return requestClient.get('/studentmgmt/employ-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    const detail = allData.find(item => item.id === Number(params.id)) || allData[0];
    return Promise.resolve({ code: 200, data: detail, msg: '成功' });
  });
}

// ==================== 业务明细接口 ====================
const now = Date.now();

// 合作企业模拟数据
const mockEnterprises = [
  { id: 9, enterpriseName: '中国电信股份有限公司', enterpriseType: '国有企业', deptId: 2002, contactUser: '郑主任', contactPhone: '13900139009', coopStartTime: now - 86400000, coopEndTime: now + 86400000, status: '合作中', createTime: now - 86400000 },
  { id: 10, enterpriseName: '华为技术有限公司', enterpriseType: '民营企业', deptId: 2003, contactUser: '李经理', contactPhone: '13800138000', coopStartTime: now - 172800000, coopEndTime: now + 172800000, status: '合作中', createTime: now - 172800000 },
];

export function getCoopEnterprisePage(params) {
  return requestClient.get('/studentmgmt/coop-enterprise/page', { params }).catch(() => {
    let list = [...mockEnterprises];
    if (params.enterpriseType) list = list.filter(e => e.enterpriseType === params.enterpriseType);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = list.length;
    const start = (pageNo - 1) * pageSize;
    const sliced = list.slice(start, start + pageSize);
    return Promise.resolve({ code: 200, data: { list: sliced, total, pageNo, pageSize }, msg: '成功' });
  });
}

// 升学记录模拟数据
const mockStudyUps = [
  { id: 4, studentId: 4, studentName: '赵六', schoolName: '复旦大学', schoolType: '公办本科', major: '信息安全', status: '已录取', createTime: now - 86400000 },
  { id: 5, studentId: 5, studentName: '钱七', schoolName: '浙江大学', schoolType: '公办本科', major: '计算机技术', status: '已录取', createTime: now - 172800000 },
];

export function getStudyUpPage(params) {
  return requestClient.get('/studentmgmt/study-up/page', { params }).catch(() => {
    let list = [...mockStudyUps];
    if (params.schoolType) list = list.filter(s => s.schoolType === params.schoolType);
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
export function getEmployReportChart(params) {
  return requestClient.get('/studentmgmt/employ-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: {
        cardData: {
          coopEnterpriseNum: 92,
          employRate: 96.8,
          studyUpNum: 135,
          jobMatchRate: 89.2,
        },
        pieData: [
          { name: '制造业', value: 35 },
          { name: '服务业', value: 28 },
          { name: '互联网', value: 18 },
          { name: '其他', value: 11 },
        ],
        barData: [
          { name: '计算机系', enterpriseNum: 25 },
          { name: '机电系', enterpriseNum: 22 },
          { name: '财经系', enterpriseNum: 18 },
          { name: '商贸系', enterpriseNum: 15 },
          { name: '汽修系', enterpriseNum: 12 },
        ],
        lineData: {
          date: ['2023', '2024', '2025'],
          series: [
            { name: '就业率', data: [95.5, 96.2, 96.8] },
          ],
        },
      },
      msg: '成功',
    });
  });
}
