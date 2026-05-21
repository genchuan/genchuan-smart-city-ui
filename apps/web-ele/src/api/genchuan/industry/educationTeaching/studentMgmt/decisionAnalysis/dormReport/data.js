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
      bedTotal: 3520,
      bedUsedNum: 3486,
      bedFreeNum: 34,
      repairFinishRate: (Math.random() * 10 + 90).toFixed(2),
      inDormRate: (Math.random() * 10 + 90).toFixed(2),
      stayNum: Math.floor(Math.random() * 200 + 50),
      generateStatus,
      generateTime: generateStatus !== '待生成' ? today - Math.random() * 86400000 : null,
      operatorId: generateStatus !== '待生成' ? [1, 2, 3][i % 3] : null,
      exportCount: Math.floor(Math.random() * 10),
      bedTotalYoy: (Math.random() * 5 - 2.5).toFixed(2),
      bedTotalQoq: (Math.random() * 4 - 2).toFixed(2),
      bedUsedNumYoy: (Math.random() * 5 - 2.5).toFixed(2),
      bedUsedNumQoq: (Math.random() * 4 - 2).toFixed(2),
      stayNumYoy: (Math.random() * 10 - 5).toFixed(2),
      stayNumQoq: (Math.random() * 8 - 4).toFixed(2),
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
export function getDormReportPage(params) {
  return requestClient.get('/studentmgmt/dorm-report/page', { params }).catch(err => {
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

export function createDormReport(data) {
  return requestClient.post('/studentmgmt/dorm-report/generate', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '报表生成成功' });
  });
}

export function archiveDormReport(data) {
  return requestClient.put('/studentmgmt/dorm-report/archive', data).catch(err => {
    console.warn('归档接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '归档成功' });
  });
}

export function exportDormReport(params) {
  return requestClient.download('/studentmgmt/dorm-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}

export function getDormReportDetail(params) {
  return requestClient.get('/studentmgmt/dorm-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    const detail = allData.find(item => item.id === Number(params.id)) || allData[0];
    return Promise.resolve({ code: 200, data: detail, msg: '成功' });
  });
}

// ==================== 业务明细接口（模拟数据，保证至少一条） ====================
const now = Date.now();

// 床位管理模拟数据
const mockBeds = [
  { id: 15, building: 'C栋', floor: 4, roomNum: '401', bedNum: '3号床', studentId: 413, assignTime: now - 86400000, status: 'allocated', createTime: now - 86400000 },
  { id: 16, building: 'A栋', floor: 2, roomNum: '203', bedNum: '1号床', studentId: null, assignTime: null, status: 'free', createTime: now - 172800000 },
];

export function getBedMgmtPage(params) {
  return requestClient.get('/studentmgmt/bed-mgmt/page', { params }).catch(() => {
    let list = [...mockBeds];
    if (params.status) list = list.filter(b => b.status === params.status);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = list.length;
    const start = (pageNo - 1) * pageSize;
    const sliced = list.slice(start, start + pageSize);
    return Promise.resolve({ code: 200, data: { list: sliced, total, pageNo, pageSize }, msg: '成功' });
  });
}

// 留宿管理模拟数据
const mockStays = [
  { id: 10, studentId: 2024002, studentName: '张三', stayDate: [2026, 5, 2], stayReason: '图书馆查阅资料', applyTime: now - 86400000, status: 'approved', createTime: now - 86400000 },
  { id: 11, studentId: 2024003, studentName: '李四', stayDate: [2026, 5, 3], stayReason: '宿舍维修', applyTime: now - 172800000, status: 'approved', createTime: now - 172800000 },
];

export function getStayMgmtPage(params) {
  return requestClient.get('/studentmgmt/stay-mgmt/page', { params }).catch(() => {
    let list = [...mockStays];
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
export function getDormReportChart(params) {
  return requestClient.get('/studentmgmt/dorm-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: {
        cardData: {
          bedTotal: 3520,
          bedUsedNum: 3486,
          bedFreeNum: 34,
          repairFinishRate: 99.2,
          inDormRate: 98.7,
          stayNum: 126,
        },
        pieData: [
          { name: '1号楼', value: 880 },
          { name: '2号楼', value: 880 },
          { name: '3号楼', value: 880 },
          { name: '4号楼', value: 880 },
        ],
        barData: [
          { name: '101宿舍', score: 98 },
          { name: '102宿舍', score: 95 },
          { name: '201宿舍', score: 96 },
          { name: '202宿舍', score: 92 },
        ],
        lineData: {
          date: ['2025-01', '2025-02', '2025-03'],
          series: [
            { name: '在寝率', data: [98.2, 98.5, 98.7] },
            { name: '留宿人数', data: [112, 118, 126] },
          ],
        },
      },
      msg: '成功',
    });
  });
}
