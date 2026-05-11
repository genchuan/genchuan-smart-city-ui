import { requestClient } from '#/api/request.js';

// ==================== 模拟数据生成 ====================

/**
 * 生成模拟报表数据列表
 * @param {object} filters - 筛选条件（用于模拟筛选）
 * @returns {Array} 模拟数据数组
 */
export const generateMockReportList = (filters = {}) => {
  const campuses = ['丰泽校区', '洛江校区', '鲤城校区'];
  const grades = ['2022级', '2023级', '2024级'];
  const majors = ['计算机科学与技术', '软件工程', '大数据技术', '人工智能', '网络工程'];
  const classNames = [
    '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
    '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
  ];
  const reportPeriods = ['日报', '周报', '月报', '季报', '半年报', '年报', '自定义报表'];
  const generateStatuses = ['已生成', '生成中', '生成失败', '未生成'];

  const list = [];
  const today = Date.now();
  for (let i = 1; i <= 50; i++) {
    const campus = campuses[i % campuses.length];
    const grade = grades[i % grades.length];
    const major = majors[i % majors.length];
    const className = classNames[i % classNames.length];
    const reportPeriod = reportPeriods[i % reportPeriods.length];
    const generateStatus = generateStatuses[i % generateStatuses.length];

    // 构造统计时段：根据周期不同生成不同格式
    let statisticalPeriod = '';
    if (reportPeriod === '日报') {
      const date = new Date(today - i * 86400000);
      statisticalPeriod = `${date.toISOString().slice(0, 10)} 00:00:00 至 ${date.toISOString().slice(0, 10)} 23:59:59`;
    } else if (reportPeriod === '周报') {
      statisticalPeriod = `第${((i % 52) + 1)}周 (2026年)`;
    } else if (reportPeriod === '月报') {
      statisticalPeriod = `2026-${String((i % 12) + 1).padStart(2, '0')}`;
    } else {
      statisticalPeriod = `2026-Q${(i % 4) + 1}`;
    }

    list.push({
      id: i,
      reportPeriod,
      statisticalPeriod,
      className,
      majorName: major,
      grade,
      campus,
      totalAssessScore: (Math.random() * 40 + 60).toFixed(1),
      healthScore: (Math.random() * 30).toFixed(1),
      morningExerciseScore: (Math.random() * 30).toFixed(1),
      civilizedClassScore: (Math.random() * 30).toFixed(1),
      blackboardNewsScore: (Math.random() * 30).toFixed(1),
      assessRank: Math.floor(Math.random() * 50) + 1,
      generateStatus,
      generateTime: new Date(today - Math.random() * 30 * 86400000).toISOString().replace('T', ' ').slice(0, 19),
      operator: ['admin', '张老师', '李老师', '王主任'][i % 4],
      exportCount: Math.floor(Math.random() * 10),
      dataUpdateTime: new Date(today - Math.random() * 7 * 86400000).toISOString().replace('T', ' ').slice(0, 19),
      creator: 'system',
      createTime: Date.now() - Math.random() * 90 * 86400000,
      updateTime: Date.now() - Math.random() * 30 * 86400000,
    });
  }
  // 应用筛选（简单模拟）
  let filtered = list;
  if (filters.reportPeriod) {
    filtered = filtered.filter(item => item.reportPeriod === filters.reportPeriod);
  }
  if (filters.className) {
    filtered = filtered.filter(item => item.className.includes(filters.className));
  }
  if (filters.majorName) {
    filtered = filtered.filter(item => item.majorName.includes(filters.majorName));
  }
  if (filters.grade) {
    filtered = filtered.filter(item => item.grade === filters.grade);
  }
  if (filters.campus) {
    filtered = filtered.filter(item => item.campus === filters.campus);
  }
  if (filters.assessRank) {
    filtered = filtered.filter(item => item.assessRank === Number(filters.assessRank));
  }
  if (filters.generateStatus) {
    filtered = filtered.filter(item => item.generateStatus === filters.generateStatus);
  }
  return filtered;
};

// ==================== 列表页交互操作接口 ====================

/**
 * 分页查询考评统计报表列表
 * @param {object} params - 请求参数
 * @param {string} [params.reportPeriod] - 报表周期
 * @param {string} [params.statisticalPeriod] - 统计时段
 * @param {string} [params.className] - 班级名称
 * @param {string} [params.majorName] - 专业名称
 * @param {string} [params.grade] - 年级
 * @param {string} [params.campus] - 校区
 * @param {integer} [params.assessRank] - 考评排名
 * @param {string} [params.generateStatus] - 生成状态
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getAssessReportPage(params) {
  return requestClient.get('/studentmgmt/assess-report/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    // 模拟分页
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const filters = {
      reportPeriod: params?.reportPeriod,
      className: params?.className,
      majorName: params?.majorName,
      grade: params?.grade,
      campus: params?.campus,
      assessRank: params?.assessRank,
      generateStatus: params?.generateStatus,
    };
    const allData = generateMockReportList(filters);
    const total = allData.length;
    const start = (pageNo - 1) * pageSize;
    const list = allData.slice(start, start + pageSize);
    return Promise.resolve({
      code: 200,
      data: {
        list,
        total,
        pageNo,
        pageSize,
      },
      msg: '成功',
    });
  });
}

/**
 * 生成考评统计报表（提交生成任务）
 * @param {object} data - 请求参数
 * @returns {Promise}
 */
export function createAssessReport(data) {
  return requestClient.post('/studentmgmt/assess-report/create', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: {
        id: Math.floor(Math.random() * 10000) + 100,
        generateStatus: '生成中',
      },
      msg: '报表生成任务已提交',
    });
  });
}

/**
 * 导出考评统计报表（支持批量/单条导出）
 * @param {object} params - 请求参数
 * @returns {Promise}
 */
export function exportAssessReport(params) {
  // 导出接口通常返回 blob，模拟时直接返回一个模拟 blob
  return requestClient.download('/studentmgmt/assess-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    // 创建一个空 Excel 的模拟 Blob
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}

// ==================== 列表行交互操作接口 ====================

/**
 * 获取考评统计报表详情（查看抽屉弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.id - 报表主键ID
 * @returns {Promise}
 */
export function getAssessReportDetail(params) {
  return requestClient.get('/studentmgmt/assess-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    const detail = allData.find(item => item.id === Number(params.id)) || allData[0];
    return Promise.resolve({
      code: 200,
      data: detail,
      msg: '成功',
    });
  });
}

// ==================== 数据可视化图表接口 ====================

/**
 * 考评数据统计看板（雷达图 + 折线图）
 * @param {object} params - 请求参数
 * @param {string} params.reportPeriod - 报表周期（必填）
 * @param {string} params.statisticalPeriod - 统计时段（必填）
 * @param {string} params.campus - 校区（必填）
 * @returns {Promise}
 */
export function getAssessReportChart(params) {
  return requestClient.get('/studentmgmt/assess-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    // 模拟雷达图数据：班级多维度得分（卫生、早操、文明班级、黑板报）
    const radarData = {
      dimensions: ['卫生', '早操', '文明班级', '黑板报'],
      score: [
        (Math.random() * 30 + 70).toFixed(1),
        (Math.random() * 30 + 70).toFixed(1),
        (Math.random() * 30 + 70).toFixed(1),
        (Math.random() * 30 + 70).toFixed(1),
      ],
    };
    // 模拟折线图数据：最近7天总分趋势
    const lineDates = [];
    const lineScores = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      lineDates.push(date.toISOString().slice(0, 10));
      lineScores.push((Math.random() * 20 + 80).toFixed(1));
    }
    const lineData = {
      date: lineDates,
      totalScore: lineScores,
    };
    return Promise.resolve({
      code: 200,
      data: {
        radarData,
        lineData,
      },
      msg: '成功',
    });
  });
}
