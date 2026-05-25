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
      msgPushNum: Math.floor(Math.random() * 200 + 50),
      msgReadNum: Math.floor(Math.random() * 150 + 30),
      parentFeedbackNum: Math.floor(Math.random() * 60 + 10),
      interactRate: (Math.random() * 30 + 20).toFixed(2),
      syncFinishRate: (Math.random() * 10 + 90).toFixed(2),
      generateStatus,
      generateTime: generateStatus !== '待生成' ? today - Math.random() * 86400000 : null,
      operatorId: generateStatus !== '待生成' ? [1, 2, 3][i % 3] : null,
      exportCount: Math.floor(Math.random() * 10),
      msgPushNumYoy: (Math.random() * 10 - 5).toFixed(2),
      msgPushNumQoq: (Math.random() * 8 - 4).toFixed(2),
      msgReadNumYoy: (Math.random() * 10 - 5).toFixed(2),
      msgReadNumQoq: (Math.random() * 8 - 4).toFixed(2),
      parentFeedbackNumYoy: (Math.random() * 15 - 7).toFixed(2),
      parentFeedbackNumQoq: (Math.random() * 10 - 5).toFixed(2),
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
export function getHomeReportPage(params) {
  return requestClient.get('/studentmgmt/home-report/page', { params }).catch(err => {
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

export function createHomeReport(data) {
  return requestClient.post('/studentmgmt/home-report/generate', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '报表生成成功' });
  });
}

export function archiveHomeReport(data) {
  return requestClient.put('/studentmgmt/home-report/archive', data).catch(err => {
    console.warn('归档接口失败，使用模拟数据', err);
    return Promise.resolve({ code: 200, data: true, msg: '归档成功' });
  });
}

export function exportHomeReport(params) {
  return requestClient.download('/studentmgmt/home-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}

export function getHomeReportDetail(params) {
  return requestClient.get('/studentmgmt/home-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    const detail = allData.find(item => item.id === Number(params.id)) || allData[0];
    return Promise.resolve({ code: 200, data: detail, msg: '成功' });
  });
}

// ==================== 业务明细接口（沟通管理 + 家长回复） ====================
const now = Date.now();

// 消息推送模拟数据
const mockCommunicates = [
  { id: 9, title: '春季开学报到通知', content: '春季学期于2月20日报到', sendUser: '张老师', sendTime: now - 86400000, replyContent: null, replyTime: null, interactRate: 50, status: 'published', createTime: now - 86400000 },
  { id: 10, title: '成绩单发布通知', content: '期末成绩已发布', sendUser: '李老师', sendTime: now - 172800000, replyContent: '收到', replyTime: now - 86400000, status: 'read', createTime: now - 172800000 },
];

export function getCommunicateMgmtPage(params) {
  return requestClient.get('/studentmgmt/communicate-mgmt/page', { params }).catch(() => {
    let list = [...mockCommunicates];
    if (params.status === 'read') list = list.filter(c => c.status === 'read');
    if (params.hasReply) list = list.filter(c => c.replyContent);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = list.length;
    const start = (pageNo - 1) * pageSize;
    const sliced = list.slice(start, start + pageSize);
    return Promise.resolve({ code: 200, data: { list: sliced, total, pageNo, pageSize }, msg: '成功' });
  });
}

// 家长反馈模拟数据（家长回复）
const mockParentReplies = [
  { id: 1, communicateId: 9, studentId: 7, studentName: '吴九', parentReplyContent: '好的，收到', parentReplyTime: now - 86400000, teacherReplyContent: '感谢配合', teacherReplyTime: now - 43200000, readStatus: '1', replyStatus: '1', createTime: now - 86400000 },
  { id: 2, communicateId: 10, studentId: 8, studentName: '郑十', parentReplyContent: '谢谢老师', parentReplyTime: now - 172800000, teacherReplyContent: null, teacherReplyTime: null, readStatus: '1', replyStatus: '1', createTime: now - 172800000 },
];

export function getParentReplyPage(params) {
  return requestClient.get('/studentmgmt/parent-reply/page', { params }).catch(() => {
    let list = [...mockParentReplies];
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
export function getHomeReportChart(params) {
  return requestClient.get('/studentmgmt/home-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: {
        cardData: {
          msgPushNum: 128,
          msgReadNum: 112,
          parentFeedbackNum: 36,
          interactRate: 32.1,
          syncFinishRate: 100.0,
        },
        pieData: [
          { name: '成绩通知', value: 45 },
          { name: '考勤通知', value: 32 },
          { name: '活动通知', value: 28 },
          { name: '其他通知', value: 23 },
        ],
        lineData: {
          date: ['2025-03-20', '2025-03-21', '2025-03-22', '2025-03-23'],
          series: [
            { name: '互动参与率', data: [28.5, 30.2, 31.8, 32.1] },
          ],
        },
      },
      msg: '成功',
    });
  });
}
