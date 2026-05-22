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
      leaveTotal: Math.floor(Math.random() * 200 + 50),
      handleFinishRate: (Math.random() * 10 + 90).toFixed(2),
      checkoutFinishRate: (Math.random() * 10 + 90).toFixed(2),
      parentConfirmRate: (Math.random() * 5 + 95).toFixed(2),
      generateStatus,
      generateTime: generateStatus !== '待生成' ? today - Math.random() * 86400000 : null,
      operatorId: generateStatus !== '待生成' ? [1, 2, 3][i % 3] : null,
      exportCount: Math.floor(Math.random() * 10),
      leaveTotalYoy: (Math.random() * 10 - 5).toFixed(2),
      leaveTotalQoq: (Math.random() * 8 - 4).toFixed(2),
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
export function getLeaveReportPage(params) {
  return requestClient.get('/studentmgmt/leave-report/page', { params }).catch(err => {
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

export function createLeaveReport(data) {
  return requestClient.post('/studentmgmt/leave-report/generate', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '报表生成成功' });
  });
}

export function archiveLeaveReport(data) {
  return requestClient.put('/studentmgmt/leave-report/archive', data).catch(err => {
    console.warn('归档接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '归档成功' });
  });
}

export function exportLeaveReport(params) {
  return requestClient.download('/studentmgmt/leave-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}

export function getLeaveReportDetail(params) {
  return requestClient.get('/studentmgmt/leave-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    const detail = allData.find(item => item.id === Number(params.id)) || allData[0];
    return Promise.resolve({ code: 200, data: detail, msg: '成功' });
  });
}

// ==================== 业务明细接口 ====================
const now = Date.now();

// 离校办理模拟数据（至少2条）
const mockLeaves = [
  { id: 7, studentId: 2025007, studentName: '张三', leaveTime: now - 86400000, leaveAddress: '武汉市洪山区珞喻路600号', parentConfirmTime: now - 172800000, handleUser: '辅导员杨老师', handleTime: now - 86400000, checkoutTime: now - 43200000, checkoutStatus: '已退宿', finishRate: 100, status: '已离校', remark: '手续完备', createTime: now - 86400000 },
  { id: 8, studentId: 2025008, studentName: '李四', leaveTime: now - 172800000, leaveAddress: '北京市朝阳区', parentConfirmTime: now - 259200000, handleUser: '辅导员王老师', handleTime: now - 172800000, checkoutTime: now - 86400000, checkoutStatus: '已退宿', finishRate: 100, status: '已离校', remark: '手续完备', createTime: now - 172800000 },
];

export function getLeaveHandlePage(params) {
  return requestClient.get('/studentmgmt/leave-handle/page', { params }).catch(() => {
    let list = [...mockLeaves];
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
export function getLeaveReportChart(params) {
  return requestClient.get('/studentmgmt/leave-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: {
        cardData: {
          leaveTotal: 3256,
          handleFinishRate: 99.6,
          checkoutFinishRate: 99.9,
          parentConfirmRate: 100.0,
        },
        pieData: [
          { name: '毕业离校', value: 3120 },
          { name: '转学离校', value: 86 },
          { name: '退学离校', value: 32 },
          { name: '其他', value: 18 },
        ],
        lineData: {
          date: ['2025-06-15', '2025-06-20', '2025-06-25', '2025-06-30'],
          series: [
            { name: '办理完成率', data: [85.2, 92.5, 98.1, 99.6] },
          ],
        },
      },
      msg: '成功',
    });
  });
}
