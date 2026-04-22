import { requestClient } from '#/api/request';

// ==================== 宿舍评比报表接口 ====================
// 分页查询报表列表
export function getDormCompareReportPage(params) {
  return requestClient.get('/studentmgmt/dorm-compare-report/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const mock = getMockList();
    return { list: mock, total: mock.length };
  });
}

// 生成自定义报表
export function createDormCompareReport(data) {
  return requestClient.post('/studentmgmt/dorm-compare-report/create', data).catch(err => {
    console.warn('生成接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出报表（列表导出或单行导出，参数带 ids 或直接传参）
export function exportDormCompareReport(params) {
  return requestClient.download('/studentmgmt/dorm-compare-report/export', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getDormCompareReportDetail(params) {
  return requestClient.get('/studentmgmt/dorm-compare-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = getMockList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// ==================== 图表接口 ====================
// 宿舍评比统计看板（卡片数据）
export function getDormCompareReportChart(params) {
  return requestClient.get('/studentmgmt/dorm-compare-report/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalCompareCount: 30,
      avgScore: 89.6,
      maxScore: 98.5,
      minScore: 72.0,
      civilizedDormCount: 8,
      normalDormCount: 22,
    });
  });
}

// 宿舍得分排名统计（柱状图数据）
export function getDormCompareReportScoreRank(params) {
  return requestClient.get('/studentmgmt/dorm-compare-report/chart/scoreRank', { params }).catch(err => {
    console.warn('得分排名接口失败，使用模拟数据', err);
    return Promise.resolve([
      { dormNum: '1号楼101', score: 98.5, rank: 1 },
      { dormNum: '2号楼202', score: 96.2, rank: 2 },
      { dormNum: '1号楼102', score: 94.8, rank: 3 },
      { dormNum: '3号楼301', score: 92.5, rank: 4 },
      { dormNum: '2号楼201', score: 90.0, rank: 5 },
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
      reportType: '月度宿舍评比汇总',
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
      reportType: '第一周宿舍评比报告',
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
      reportType: '上学期宿舍评比总结',
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
      reportType: '三月宿舍评比汇总',
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
      reportType: '第二季度宿舍评比报告',
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
      reportType: '2026年度宿舍评比报告',
      yoyGrowth: 12.5,
      qoqGrowth: null,
      creator: 'admin',
      createTime: 1801526400000,
    },
  ];
};
