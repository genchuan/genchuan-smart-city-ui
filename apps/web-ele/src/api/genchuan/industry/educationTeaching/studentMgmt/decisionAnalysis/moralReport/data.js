import { requestClient } from '#/api/request.js';

// ==================== 模拟数据生成 ====================

/**
 * 生成模拟德育报表数据列表
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
  const civilizedTitles = ['文明班级', '优秀班级', '先进班集体', ''];

  const list = [];
  const today = Date.now();
  for (let i = 1; i <= 50; i++) {
    const campus = campuses[i % campuses.length];
    const grade = grades[i % grades.length];
    const major = majors[i % majors.length];
    const className = classNames[i % classNames.length];
    const reportPeriod = reportPeriods[i % reportPeriods.length];
    const generateStatus = generateStatuses[i % generateStatuses.length];
    const civilizedClassTitle = civilizedTitles[i % civilizedTitles.length];

    // 构造统计时段
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
      totalMoralScore: (Math.random() * 40 + 60).toFixed(1),
      goodDeedScore: (Math.random() * 50).toFixed(1),
      civilizedBehaviorScore: (Math.random() * 50).toFixed(1),
      assessRank: Math.floor(Math.random() * 50) + 1,
      civilizedClassTitle,
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
  if (filters.civilizedClassTitle) {
    filtered = filtered.filter(item => item.civilizedClassTitle === filters.civilizedClassTitle);
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
 * 分页查询德育评比报表列表
 * @param {object} params - 请求参数
 * @param {string} [params.reportPeriod] - 报表周期
 * @param {string} [params.statisticalPeriod] - 统计时段
 * @param {string} [params.className] - 班级名称
 * @param {string} [params.majorName] - 专业名称
 * @param {string} [params.grade] - 年级
 * @param {string} [params.campus] - 校区
 * @param {string} [params.civilizedClassTitle] - 文明班级称号
 * @param {integer} [params.assessRank] - 评比排名
 * @param {string} [params.generateStatus] - 生成状态
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getMoralReportPage(params) {
  return requestClient.get('/studentmgmt/moral-report/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const filters = {
      reportPeriod: params?.reportPeriod,
      className: params?.className,
      majorName: params?.majorName,
      grade: params?.grade,
      campus: params?.campus,
      civilizedClassTitle: params?.civilizedClassTitle,
      assessRank: params?.assessRank,
      generateStatus: params?.generateStatus,
    };
    const allData = generateMockReportList(filters);
    const total = allData.length;
    const start = (pageNo - 1) * pageSize;
    const list = allData.slice(start, start + pageSize);
    return Promise.resolve({
      code: 200,
      data: { list, total, pageNo, pageSize },
      msg: '成功',
    });
  });
}

/**
 * 生成德育评比报表（提交生成任务）
 * @param {object} data - 请求参数
 * @returns {Promise}
 */
export function createMoralReport(data) {
  return requestClient.post('/studentmgmt/moral-report/create', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: { id: Math.floor(Math.random() * 10000) + 100, generateStatus: '生成中' },
      msg: '报表生成任务已提交',
    });
  });
}

/**
 * 导出德育评比报表（支持批量/单条导出）
 * @param {object} params - 请求参数
 * @returns {Promise}
 */
export function exportMoralReport(params) {
  return requestClient.download('/studentmgmt/moral-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}


// ==================== 列表行交互操作接口 ====================
/**
 * 获取德育评比报表详情（查看抽屉弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.id - 报表主键ID
 * @returns {Promise}
 */
export function getMoralReportDetail(params) {
  return requestClient.get('/studentmgmt/moral-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    const detail = allData.find(item => item.id === Number(params.id)) || allData[0];
    return Promise.resolve({ code: 200, data: detail, msg: '成功' });
  });
}

/**
 * 分页查询文明行为评比明细列表
 * @param {object} params - 请求参数
 * @param {string} [params.className] - 班级名称
 * @param {string} [params.campus] - 校区
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getCivilizedBehaviorDetailList(params) {
  return requestClient.get('/studentmgmt/moral-report/civilized-behavior-detail', { params }).catch(err => {
    console.warn('文明行为评比明细接口失败，使用模拟数据', err);
    // 生成模拟文明行为评比明细数据
    const campuses = ['丰泽校区', '洛江校区', '鲤城校区'];
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const inspectors = ['德育处', '学生处', '值周教师', '年段长'];
    const itemsOptions = [
      '文明礼仪、卫生保持、纪律遵守',
      '语言文明、仪容仪表、课间秩序',
      '尊师爱友、环境保洁、考勤',
      '文明行为、公物爱护、安全规范'
    ];
    const remarks = ['表现优秀', '有待提升', '进步明显', '需加强文明礼仪', '整体良好'];

    // 构建全量模拟数据（总共48条，每个班级至少6条）
    const allMockData = [];
    for (let i = 1; i <= 48; i++) {
      const className = classNames[(i - 1) % classNames.length];
      allMockData.push({
        id: i,
        evaluateDate: `2026-04-${String(((i - 1) % 28) + 1).padStart(2, '0')}`,
        score: (Math.random() * 30 + 65).toFixed(1),
        inspector: inspectors[Math.floor(Math.random() * inspectors.length)],
        items: itemsOptions[Math.floor(Math.random() * itemsOptions.length)],
        remark: remarks[Math.floor(Math.random() * remarks.length)],
        className,
        campus: campuses[(i - 1) % campuses.length],
        createTime: Date.now() - Math.random() * 30 * 86400000,
      });
    }

    // 应用筛选条件
    let filtered = allMockData;
    if (params?.className) {
      filtered = filtered.filter(item => item.className.includes(params.className));
    }
    if (params?.campus) {
      filtered = filtered.filter(item => item.campus === params.campus);
    }

    // 分页
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = filtered.length;
    const start = (pageNo - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);

    return Promise.resolve({
      code: 200,
      data: { list, total, pageNo, pageSize },
      msg: '成功',
    });
  });
}

/**
 * 获取班级德育明细（单个班级的德育各分项得分）
 * @param {object} params - 请求参数
 * @param {string} params.className - 班级名称（必填）
 * @returns {Promise}
 */
export function getMoralClassDetail(params) {
  return requestClient.get('/studentmgmt/moral-report/class-detail', { params }).catch(err => {
    console.warn('班级德育明细接口失败，使用模拟数据', err);
    // 从已有的报表模拟数据中查找匹配班级的记录
    const allData = generateMockReportList();
    let target = allData.find(item => item.className === params.className);
    // 若未找到，则生成一条默认数据
    if (!target) {
      target = {
        className: params.className || '未知班级',
        totalMoralScore: (Math.random() * 40 + 60).toFixed(1),
        goodDeedScore: (Math.random() * 50).toFixed(1),
        civilizedBehaviorScore: (Math.random() * 50).toFixed(1),
        assessRank: Math.floor(Math.random() * 50) + 1,
        civilizedClassTitle: ['文明班级', '优秀班级', '先进班集体', ''][Math.floor(Math.random() * 4)],
      };
    }
    return Promise.resolve({
      code: 200,
      data: {
        className: target.className,
        totalMoralScore: target.totalMoralScore,
        goodDeedScore: target.goodDeedScore,
        civilizedBehaviorScore: target.civilizedBehaviorScore,
        assessRank: target.assessRank,
        civilizedClassTitle: target.civilizedClassTitle || '',
      },
      msg: '成功',
    });
  });
}

/**
 * 分页查询好人好事记录明细列表
 * @param {object} params - 请求参数
 * @param {string} [params.className] - 班级名称
 * @param {string} [params.campus] - 校区
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getGoodDeedList(params) {
  return requestClient.get('/studentmgmt/moral-report/good-deed-list', { params }).catch(err => {
    console.warn('好人好事记录明细接口失败，使用模拟数据', err);
    // 生成模拟好人好事记录数据
    const campuses = ['丰泽校区', '洛江校区', '鲤城校区'];
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const eventNames = ['拾金不昧', '助人为乐', '义务劳动', '爱心捐赠', '见义勇为', '环保卫士'];
    const recorders = ['班主任', '德育处', '班长', '学生处', '年段长'];

    // 构建全量模拟数据（总共60条）
    const allMockData = [];
    for (let i = 1; i <= 60; i++) {
      const className = classNames[(i - 1) % classNames.length];
      allMockData.push({
        id: i,
        eventDate: `2026-04-${String(((i - 1) % 28) + 1).padStart(2, '0')}`,
        eventName: eventNames[Math.floor(Math.random() * eventNames.length)],
        score: (Math.random() * 10 + 5).toFixed(1),
        recorder: recorders[Math.floor(Math.random() * recorders.length)],
        className,
        campus: campuses[(i - 1) % campuses.length],
        createTime: Date.now() - Math.random() * 30 * 86400000,
      });
    }

    // 应用筛选条件
    let filtered = allMockData;
    if (params?.className) {
      filtered = filtered.filter(item => item.className.includes(params.className));
    }
    if (params?.campus) {
      filtered = filtered.filter(item => item.campus === params.campus);
    }

    // 分页
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = filtered.length;
    const start = (pageNo - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);

    return Promise.resolve({
      code: 200,
      data: { list, total, pageNo, pageSize },
      msg: '成功',
    });
  });
}


// ==================== 数据可视化图表接口 ====================
/**
 * 德育评比统计看板（柱状图：班级德育得分排名、各校区文明班级数量）
 * @param {object} params - 请求参数
 * @param {string} params.reportPeriod - 报表周期（必填）
 * @param {string} params.statisticalPeriod - 统计时段（必填）
 * @returns {Promise}
 */
export function getMoralReportChart(params) {
  return requestClient.get('/studentmgmt/moral-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    // 根据请求参数生成有差异的模拟数据
    const { reportPeriod = '月报', statisticalPeriod = '' } = params;
    console.log('[道德模拟] 周期:', reportPeriod, '时段:', statisticalPeriod);

    // ------------------- 1. 班级德育得分排名 -------------------
    let classNames = [];
    let totalScores = [];

    switch (reportPeriod) {
      case '日报':
        classNames = ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班', '网络2301班'];
        totalScores = [92.5, 90.0, 88.5, 85.0, 83.5];
        break;
      case '周报':
        classNames = ['软件2301班', '计算机2301班', '人工智能2401班', '大数据2401班', '网络2301班'];
        totalScores = [97.0, 95.5, 94.0, 92.0, 89.5];
        break;
      case '月报':
        classNames = ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'];
        totalScores = [99.0, 98.0, 96.5, 95.0];
        break;
      case '季报':
        classNames = ['人工智能2401班', '计算机2301班', '软件2301班', '大数据2401班', '网络2301班', '物联网2401班'];
        totalScores = [98.5, 97.0, 96.0, 94.5, 92.0, 90.0];
        break;
      case '半年报':
        classNames = ['大数据2401班', '人工智能2401班', '计算机2301班', '软件2301班', '物联网2401班'];
        totalScores = [99.5, 98.5, 97.5, 96.0, 94.0];
        break;
      case '年报':
        classNames = ['计算机2301班', '大数据2401班', '人工智能2401班', '软件2301班', '物联网2401班', '网络2301班'];
        totalScores = [100.0, 98.5, 98.0, 97.0, 95.5, 94.0];
        break;
      case '自定义报表':
        classNames = ['软件2301班', '大数据2401班', '计算机2301班'];
        totalScores = [88.0, 85.5, 84.0];
        break;
      default:
        classNames = ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'];
        totalScores = [95.0, 94.0, 93.0, 92.0];
    }

    // 添加小扰动
    const perturbedScores = totalScores.map(s => {
      let perturb = (Math.random() - 0.5) * 1.5;
      return Math.min(100, Math.max(60, s + perturb)).toFixed(1);
    });

    const classRankData = {
      className: classNames,
      totalScore: perturbedScores,
    };

    // ------------------- 2. 各校区文明班级数量统计 -------------------
    let campuses = [];
    let counts = [];

    switch (reportPeriod) {
      case '日报':
        campuses = ['丰泽校区', '洛江校区', '鲤城校区', '台商校区'];
        counts = [5, 3, 2, 1];
        break;
      case '周报':
        campuses = ['丰泽校区', '洛江校区', '鲤城校区'];
        counts = [12, 10, 8];
        break;
      case '月报':
        campuses = ['丰泽校区', '洛江校区', '鲤城校区'];
        counts = [20, 15, 12];
        break;
      case '季报':
        campuses = ['丰泽校区', '洛江校区', '鲤城校区', '台商校区'];
        counts = [35, 28, 22, 10];
        break;
      case '半年报':
        campuses = ['丰泽校区', '洛江校区', '鲤城校区'];
        counts = [58, 46, 38];
        break;
      case '年报':
        campuses = ['丰泽校区', '洛江校区', '鲤城校区', '台商校区', '晋江校区'];
        counts = [110, 95, 82, 45, 30];
        break;
      case '自定义报表':
        campuses = ['丰泽校区', '洛江校区'];
        counts = [7, 5];
        break;
      default:
        campuses = ['丰泽校区', '洛江校区', '鲤城校区'];
        counts = [15, 12, 10];
    }

    // 添加小扰动
    const perturbedCounts = counts.map(c => {
      let perturb = Math.floor((Math.random() - 0.5) * 2);
      return Math.max(0, c + perturb);
    });

    const campusCivilizedData = {
      campus: campuses,
      count: perturbedCounts,
    };

    console.log('[道德模拟] 班级排名数据:', classRankData);
    console.log('[道德模拟] 校区文明数据:', campusCivilizedData);

    return Promise.resolve({
      code: 200,
      data: { classRankData, campusCivilizedData },
      msg: '成功',
    });
  });
}
