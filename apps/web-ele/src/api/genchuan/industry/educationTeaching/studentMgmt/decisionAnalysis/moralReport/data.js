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
      targetTotal: Math.floor(Math.random() * 80 + 20),
      targetEnableNum: Math.floor(Math.random() * 60 + 15),
      targetWarnNum: Math.floor(Math.random() * 8 + 1),
      activityJoinNum: Math.floor(Math.random() * 500 + 100),
      resourceLearnRate: (Math.random() * 30 + 70).toFixed(2),
      generateStatus,
      generateTime: generateStatus !== '待生成' ? today - Math.random() * 86400000 : null,
      operatorId: generateStatus !== '待生成' ? [1, 2, 3][i % 3] : null,
      exportCount: Math.floor(Math.random() * 10),
      targetTotalYoy: (Math.random() * 10 - 5).toFixed(2),
      targetTotalQoq: (Math.random() * 8 - 4).toFixed(2),
      targetEnableNumYoy: (Math.random() * 10 - 5).toFixed(2),
      targetEnableNumQoq: (Math.random() * 8 - 4).toFixed(2),
      targetWarnNumYoy: (Math.random() * 20 - 10).toFixed(2),
      targetWarnNumQoq: (Math.random() * 15 - 7).toFixed(2),
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
export function getMoralReportPage(params) {
  return requestClient.get('/studentmgmt/moral-report/page', { params }).catch(err => {
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

export function createMoralReport(data) {
  return requestClient.post('/studentmgmt/moral-report/generate', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '报表生成成功' });
  });
}

export function archiveMoralReport(data) {
  return requestClient.put('/studentmgmt/moral-report/archive', data).catch(err => {
    console.warn('归档接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '归档成功' });
  });
}

export function exportMoralReport(params) {
  return requestClient.download('/studentmgmt/moral-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}

export function getMoralReportDetail(params) {
  return requestClient.get('/studentmgmt/moral-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    const detail = allData.find(item => item.id === Number(params.id)) || allData[0];
    return Promise.resolve({ code: 200, data: detail, msg: '成功' });
  });
}

// ==================== 业务明细接口（模拟数据） ====================
const now = Date.now();

// 指标管理模拟数据
const mockTargets = [
  { id: 15, targetName: '德育积分', totalScore: 100, warnThreshold: 60, evaluatorType: 'teacher', scoreType: '累计赋分', status: 'enable', createTime: now - 86400000 },
  { id: 16, targetName: '志愿服务时长', totalScore: 50, warnThreshold: 20, evaluatorType: 'self', scoreType: '累计赋分', status: 'enable', createTime: now - 172800000 },
  { id: 17, targetName: '违纪扣分', totalScore: 80, warnThreshold: 30, evaluatorType: 'teacher', scoreType: '累计赋分', status: 'disable', createTime: now - 259200000 },
];

export function getTargetMgmtPage(params) {
  return requestClient.get('/studentmgmt/target-mgmt/page', { params }).catch(() => {
    let list = [...mockTargets];
    if (params.status) list = list.filter(t => t.status === params.status);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = list.length;
    const start = (pageNo - 1) * pageSize;
    const sliced = list.slice(start, start + pageSize);
    return Promise.resolve({ code: 200, data: { list: sliced, total, pageNo, pageSize }, msg: '成功' });
  });
}

// 德育活动模拟数据
const mockActivities = [
  { id: 10, activityName: '学雷锋志愿服务', activityType: 'volunteer', hostDept: 1001, startTime: now - 86400000, endTime: now - 43200000, joinNum: 120, status: 'published', createTime: now - 86400000 },
  { id: 11, activityName: '诚信主题教育', activityType: 'theme', hostDept: 1002, startTime: now - 172800000, endTime: now - 86400000, joinNum: 85, status: 'published', createTime: now - 172800000 },
];

export function getMoralActivityPage(params) {
  return requestClient.get('/studentmgmt/moral-activity/page', { params }).catch(() => {
    let list = [...mockActivities];
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
export function getMoralReportChart(params) {
  return requestClient.get('/studentmgmt/moral-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: {
        cardData: {
          targetTotal: 56,
          targetEnableNum: 48,
          targetWarnNum: 3,
          activityJoinNum: 2890,
          resourceLearnRate: 92.5,
        },
        pieData: [
          { name: '德育课件', value: 22 },
          { name: '德育视频', value: 18 },
          { name: '德育文章', value: 16 },
        ],
        barData: [
          { name: '高一1班', score: 95 },
          { name: '高一2班', score: 92 },
          { name: '高二1班', score: 88 },
          { name: '高二2班', score: 90 },
        ],
        lineData: {
          date: ['2025-01', '2025-02', '2025-03'],
          series: [
            { name: '预警触发趋势', data: [5, 4, 3] },
            { name: '活动完成率趋势', data: [88, 90, 92] },
          ],
        },
      },
      msg: '成功',
    });
  });
}
