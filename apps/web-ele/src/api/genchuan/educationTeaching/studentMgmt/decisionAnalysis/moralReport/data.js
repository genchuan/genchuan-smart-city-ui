import { requestClient } from '#/api/request';

// ==================== 德育评比报表接口 ====================
// 分页查询报表列表
export function getMoralReportPage(params) {
  return requestClient.get('/studentmgmt/moral-report/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const mock = getMockList();
    return { list: mock, total: mock.length };
  });
}

// 生成自定义报表
export function createMoralReport(data) {
  return requestClient.post('/studentmgmt/moral-report/create', data).catch(err => {
    console.warn('生成接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出报表（列表导出或单行导出，参数带 ids 或直接传参）
export function exportMoralReport(params) {
  return requestClient.download('/studentmgmt/moral-report/export', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getMoralReportDetail(params) {
  return requestClient.get('/studentmgmt/moral-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = getMockList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// ==================== 图表接口 ====================
// 德育评比统计看板（卡片数据）
export function getMoralReportChart(params) {
  return requestClient.get('/studentmgmt/moral-report/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalMoralCount: 110,
      avgScore: 90.2,
      maxScore: 99.0,
      minScore: 70.0,
      goodPersonCount: 45,
      civilizedBehaviorCount: 65,
    });
  });
}

// 班级德育得分排名统计（柱状图数据）
export function getMoralReportScoreRank(params) {
  return requestClient.get('/studentmgmt/moral-report/chart/scoreRank', { params }).catch(err => {
    console.warn('得分排名接口失败，使用模拟数据', err);
    return Promise.resolve([
      { className: '高一(1)班', score: 95.5, rank: 1 },
      { className: '高一(3)班', score: 93.2, rank: 2 },
      { className: '高一(2)班', score: 90.8, rank: 3 },
      { className: '高二(1)班', score: 88.5, rank: 4 },
      { className: '高二(2)班', score: 85.0, rank: 5 },
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
      reportType: '月度德育评比汇总',
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
      reportType: '第一周德育报告',
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
      reportType: '上学期德育总结',
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
      reportType: '三月德育汇总',
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
      reportType: '第二季度德育报告',
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
      reportType: '2026年度德育报告',
      yoyGrowth: 12.5,
      qoqGrowth: null,
      creator: 'admin',
      createTime: 1801526400000,
    },
  ];
};
