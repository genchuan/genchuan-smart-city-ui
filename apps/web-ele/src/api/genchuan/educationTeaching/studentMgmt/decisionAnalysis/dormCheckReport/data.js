import { requestClient } from '#/api/request';

// ==================== 宿舍考勤报表接口 ====================
// 分页查询报表列表
export function getDormCheckReportPage(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const mock = getMockList();
    return { list: mock, total: mock.length };
  });
}

// 生成自定义报表
export function createDormCheckReport(data) {
  return requestClient.post('/studentmgmt/dorm-check-report/create', data).catch(err => {
    console.warn('生成接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出报表（列表导出或单行导出，参数带 ids 或直接传参）
export function exportDormCheckReport(params) {
  return requestClient.download('/studentmgmt/dorm-check-report/export', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getDormCheckReportDetail(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = getMockList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// ==================== 图表接口 ====================
// 宿舍考勤统计看板（卡片数据）
export function getDormCheckReportChart(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalCheckCount: 480,
      normalCount: 450,
      abnormalCount: 30,
      avgInRate: 93.75,
      lateCount: 18,
      absentCount: 12,
    });
  });
}

// 各班级考勤异常人数 / 在寝率统计（柱状图数据）
export function getDormCheckReportCheckCount(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/chart/checkCount', { params }).catch(err => {
    console.warn('班级统计接口失败，使用模拟数据', err);
    return Promise.resolve([
      { className: '高一(1)班', abnormalCount: 2, inRate: 96.67, totalStudentCount: 60 },
      { className: '高一(2)班', abnormalCount: 3, inRate: 95.0, totalStudentCount: 60 },
      { className: '高一(3)班', abnormalCount: 5, inRate: 91.67, totalStudentCount: 60 },
      { className: '高二(1)班', abnormalCount: 1, inRate: 98.33, totalStudentCount: 60 },
    ]);
  });
}

// 模拟报表数据
export const getMockList = () => {
  return [
    {
      id: 1,
      timeScale: '月',
      statStartTime: 1767225600000,   // 2026-01-01
      statEndTime: 1769904000000,     // 2026-01-31
      statFinishTime: 1769990400000,
      reportType: '月度宿舍考勤汇总',
      yoyGrowth: 5.2,
      qoqGrowth: 2.1,
      creator: 'admin',
      createTime: 1769990400000,
    },
    {
      id: 2,
      timeScale: '周',
      statStartTime: 1767225600000,
      statEndTime: 1767830400000,
      statFinishTime: 1767916800000,
      reportType: '第一周宿舍考勤报告',
      yoyGrowth: 3.5,
      qoqGrowth: -1.2,
      creator: 'teacher_li',
      createTime: 1767916800000,
    },
    {
      id: 3,
      timeScale: '学期',
      statStartTime: 1767225600000,
      statEndTime: 1780358400000,
      statFinishTime: 1780444800000,
      reportType: '上学期宿舍考勤总结',
      yoyGrowth: 8.0,
      qoqGrowth: null,
      creator: 'admin',
      createTime: 1780444800000,
    },
    {
      id: 4,
      timeScale: '月',
      statStartTime: 1775174400000,
      statEndTime: 1777680000000,
      statFinishTime: 1777766400000,
      reportType: '三月宿舍考勤汇总',
      yoyGrowth: 6.1,
      qoqGrowth: 2.5,
      creator: 'admin',
      createTime: 1777766400000,
    },
    {
      id: 5,
      timeScale: '季',
      statStartTime: 1777680000000,
      statEndTime: 1785628800000,
      statFinishTime: 1785715200000,
      reportType: '第二季度宿舍考勤报告',
      yoyGrowth: 7.3,
      qoqGrowth: 3.2,
      creator: 'teacher_wang',
      createTime: 1785715200000,
    },
    {
      id: 6,
      timeScale: '年',
      statStartTime: 1767225600000,
      statEndTime: 1801440000000,
      statFinishTime: 1801526400000,
      reportType: '2026年度宿舍考勤报告',
      yoyGrowth: 12.5,
      qoqGrowth: null,
      creator: 'admin',
      createTime: 1801526400000,
    },
  ];
};
