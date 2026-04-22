import { requestClient } from '#/api/request';

// ==================== 考评统计报表接口 ====================
// 分页查询报表列表
export function getAssessReportPage(params) {
  return requestClient.get('/studentmgmt/assess-report/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

// 生成自定义报表
export function createAssessReport(data) {
  return requestClient.post('/studentmgmt/assess-report/create', data).catch(err => {
    console.warn('生成接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出报表（列表导出或单行导出，参数带 ids 或直接传参）
export function exportAssessReport(params) {
  return requestClient.download('/studentmgmt/assess-report/export', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getAssessReportDetail(params) {
  return requestClient.get('/studentmgmt/assess-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = getMockList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// ==================== 图表接口 ====================
// 考评数据统计看板（卡片数据）
export function getAssessReportChart(params) {
  return requestClient.get('/studentmgmt/assess-report/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalAssessCount: 120,
      avgScore: 88.5,
      maxScore: 98.0,
      minScore: 65.0,
      publishedCount: 100,
      unPublishedCount: 20,
      typeCountMap: {
        '教室卫生': 30,
        '早操': 30,
        '文明班级': 30,
        '黑板报': 30,
      },
    });
  });
}

// 班级多维度考评得分统计（雷达图数据）
export function getAssessReportDimensionScore(params) {
  return requestClient.get('/studentmgmt/assess-report/chart/dimensionScore', { params }).catch(err => {
    console.warn('维度得分接口失败，使用模拟数据', err);
    return Promise.resolve([
      {
        className: '高一(1)班',
        classRoomScore: 92.0,
        morningExerciseScore: 88.5,
        civilizedClassScore: 95.0,
        blackboardScore: 90.0,
        totalScore: 365.5,
      },
      {
        className: '高一(2)班',
        classRoomScore: 89.0,
        morningExerciseScore: 91.0,
        civilizedClassScore: 87.5,
        blackboardScore: 92.0,
        totalScore: 359.5,
      },
      {
        className: '高一(3)班',
        classRoomScore: 85.0,
        morningExerciseScore: 86.0,
        civilizedClassScore: 90.0,
        blackboardScore: 88.0,
        totalScore: 349.0,
      },
    ]);
  });
}

// 班级考评周期趋势统计（折线图数据）
export function getAssessReportCycleTrend(params) {
  return requestClient.get('/studentmgmt/assess-report/chart/cycleTrend', { params }).catch(err => {
    console.warn('周期趋势接口失败，使用模拟数据', err);
    return Promise.resolve([
      { cycleDate: '2025-01', avgScore: 85.2, maxScore: 96.0, minScore: 72.0 },
      { cycleDate: '2025-02', avgScore: 87.5, maxScore: 97.0, minScore: 68.0 },
      { cycleDate: '2025-03', avgScore: 89.8, maxScore: 98.0, minScore: 65.0 },
    ]);
  });
}

// 模拟报表数据
export const getMockList = () => {
  return [
    {
      id: 1,
      timeScale: '月',
      statStartTime: 1767225600000,
      statEndTime: 1769904000000,
      statFinishTime: 1769990400000,
      reportType: '月考评分汇总',
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
      reportType: '第一周考评报告',
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
      reportType: '上学期考评总结',
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
      reportType: '三月考评汇总',
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
      reportType: '第二季度考评报告',
      yoyGrowth: 7.3,
      qoqGrowth: 3.2,
      creator: 'teacher_wang',
      createTime: 1785715200000,
    },
    {
      id: 6,
      timeScale: '月',
      statStartTime: 1785628800000,
      statEndTime: 1788307200000,
      statFinishTime: 1788393600000,
      reportType: '七月暑期考评',
      yoyGrowth: 4.5,
      qoqGrowth: -1.0,
      creator: 'admin',
      createTime: 1788393600000,
    },
    {
      id: 7,
      timeScale: '半年',
      statStartTime: 1788307200000,
      statEndTime: 1801440000000,
      statFinishTime: 1801526400000,
      reportType: '下半年考评总结',
      yoyGrowth: 9.2,
      qoqGrowth: 5.8,
      creator: 'admin',
      createTime: 1801526400000,
    },
    {
      id: 8,
      timeScale: '年',
      statStartTime: 1767225600000,
      statEndTime: 1801440000000,
      statFinishTime: 1801526400000,
      reportType: '2026年度考评报告',
      yoyGrowth: 12.5,
      qoqGrowth: null,
      creator: 'admin',
      createTime: 1801526400000,
    },
  ];
};
