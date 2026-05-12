import { requestClient } from '#/api/request.js';

// ==================== 模拟数据生成 ====================

/**
 * 生成模拟宿舍评比报表数据列表
 * @param {object} filters - 筛选条件（用于模拟筛选）
 * @returns {Array} 模拟数据数组
 */
export const generateMockReportList = (filters = {}) => {
  const campuses = ['丰泽校区', '洛江校区', '鲤城校区'];
  const buildings = ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼'];
  const floors = ['1楼', '2楼', '3楼', '4楼', '5楼', '6楼'];
  const classNames = [
    '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
    '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
  ];
  const majors = ['计算机科学与技术', '软件工程', '大数据技术', '人工智能', '网络工程'];
  const reportPeriods = ['日报', '周报', '月报', '季报', '半年报', '年报', '自定义报表'];
  const generateStatuses = ['已生成', '生成中', '生成失败', '未生成'];
  const civilizedTitles = ['文明宿舍', '优秀宿舍', '示范宿舍', ''];

  const list = [];
  const today = Date.now();
  for (let i = 1; i <= 50; i++) {
    const campus = campuses[i % campuses.length];
    const buildingName = buildings[i % buildings.length];
    const floor = floors[i % floors.length];
    const dormNo = `${Math.floor(Math.random() * 500) + 100}`;
    const className = classNames[i % classNames.length];
    const major = majors[i % majors.length];
    const reportPeriod = reportPeriods[i % reportPeriods.length];
    const generateStatus = generateStatuses[i % generateStatuses.length];
    const civilizedDormTitle = civilizedTitles[i % civilizedTitles.length];

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
      dormNo,
      buildingName,
      floor,
      className,
      majorName: major,
      campus,
      totalAssessScore: (Math.random() * 40 + 60).toFixed(1),
      healthScore: (Math.random() * 50).toFixed(1),
      disciplineScore: (Math.random() * 50).toFixed(1),
      civilizedDormTitle,
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
  if (filters.dormNo) {
    filtered = filtered.filter(item => item.dormNo.includes(filters.dormNo));
  }
  if (filters.buildingName) {
    filtered = filtered.filter(item => item.buildingName === filters.buildingName);
  }
  if (filters.floor) {
    filtered = filtered.filter(item => item.floor === filters.floor);
  }
  if (filters.className) {
    filtered = filtered.filter(item => item.className.includes(filters.className));
  }
  if (filters.majorName) {
    filtered = filtered.filter(item => item.majorName.includes(filters.majorName));
  }
  if (filters.campus) {
    filtered = filtered.filter(item => item.campus === filters.campus);
  }
  if (filters.civilizedDormTitle) {
    filtered = filtered.filter(item => item.civilizedDormTitle === filters.civilizedDormTitle);
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
 * 分页查询宿舍评比报表列表
 * @param {object} params - 请求参数
 * @param {string} [params.reportPeriod] - 报表周期
 * @param {string} [params.statisticalPeriod] - 统计时段
 * @param {string} [params.dormNo] - 宿舍号
 * @param {string} [params.buildingName] - 楼栋名称
 * @param {string} [params.floor] - 楼层
 * @param {string} [params.className] - 班级名称
 * @param {string} [params.majorName] - 专业名称
 * @param {string} [params.campus] - 校区
 * @param {string} [params.civilizedDormTitle] - 文明宿舍称号
 * @param {integer} [params.assessRank] - 评比排名
 * @param {string} [params.generateStatus] - 生成状态
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getDormCompareReportPage(params) {
  return requestClient.get('/studentmgmt/dorm-compare-report/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const filters = {
      reportPeriod: params?.reportPeriod,
      dormNo: params?.dormNo,
      buildingName: params?.buildingName,
      floor: params?.floor,
      className: params?.className,
      majorName: params?.majorName,
      campus: params?.campus,
      civilizedDormTitle: params?.civilizedDormTitle,
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
 * 生成宿舍评比报表（提交生成任务）
 * @param {object} data - 请求参数
 * @returns {Promise}
 */
export function createDormCompareReport(data) {
  return requestClient.post('/studentmgmt/dorm-compare-report/create', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: { id: Math.floor(Math.random() * 10000) + 100, generateStatus: '生成中' },
      msg: '报表生成任务已提交',
    });
  });
}

/**
 * 导出宿舍评比报表（支持批量/单条导出）
 * @param {object} params - 请求参数
 * @returns {Promise}
 */
export function exportDormCompareReport(params) {
  return requestClient.download('/studentmgmt/dorm-compare-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}

// ==================== 列表行交互操作接口 ====================
/**
 * 获取宿舍评比报表详情（查看抽屉弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.id - 报表主键ID
 * @returns {Promise}
 */
export function getDormCompareReportDetail(params) {
  return requestClient.get('/studentmgmt/dorm-compare-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    const detail = allData.find(item => item.id === Number(params.id)) || allData[0];
    return Promise.resolve({ code: 200, data: detail, msg: '成功' });
  });
}

/**
 * 分页查询宿舍纪律评比明细列表
 * @param {object} params - 请求参数
 * @param {string} [params.dormNo] - 宿舍号
 * @param {string} [params.buildingName] - 楼栋名称
 * @param {string} [params.campus] - 校区
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getDisciplineDetailList(params) {
  return requestClient.get('/studentmgmt/dorm-compare-report/discipline-detail', { params }).catch(err => {
    console.warn('宿舍纪律明细接口失败，使用模拟数据', err);
    // 根据宿舍号生成模拟数据（保证每个宿舍都有数据）
    const dormNo = params?.dormNo || '101';
    const mockList = [];
    // 生成5条模拟记录（与原代码一致）
    for (let i = 1; i <= 5; i++) {
      mockList.push({
        id: i,
        checkDate: `2026-04-${i * 3}`,
        score: (Math.random() * 30 + 60).toFixed(1),
        inspector: ['值班老师', '宿管员'][Math.floor(Math.random() * 2)],
        violation: i % 2 === 0 ? '晚归' : '卫生不合格',
        remark: i % 2 === 0 ? '已教育' : '已整改',
      });
    }
    // 模拟分页（总共5条，不分页直接返回全部）
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = mockList.length;
    const start = (pageNo - 1) * pageSize;
    const list = mockList.slice(start, start + pageSize);
    return Promise.resolve({
      code: 200,
      data: { list, total, pageNo, pageSize },
      msg: '成功',
    });
  });
}

/**
 * 获取单个宿舍评比明细（根据报表ID）
 * @param {object} params - 请求参数
 * @param {number} params.id - 报表主键ID（必填）
 * @returns {Promise}
 */
export function getDormCompareDetail(params) {
  return requestClient.get('/studentmgmt/dorm-compare-report/dorm-detail', { params }).catch(err => {
    console.warn('宿舍评比明细接口失败，使用模拟数据', err);
    // 从已有的报表模拟数据中查找匹配的记录
    const allData = generateMockReportList();
    let target = allData.find(item => item.id === Number(params.id));
    // 若未找到，则生成一条默认数据
    if (!target) {
      target = {
        dormNo: String(Math.floor(Math.random() * 500) + 100),
        buildingName: ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼'][Math.floor(Math.random() * 5)],
        floor: `${Math.floor(Math.random() * 6) + 1}楼`,
        className: ['计算机2201班', '软件工程2301班', '大数据2401班'][Math.floor(Math.random() * 3)],
        totalAssessScore: (Math.random() * 40 + 60).toFixed(1),
        healthScore: (Math.random() * 50).toFixed(1),
        disciplineScore: (Math.random() * 50).toFixed(1),
        civilizedDormTitle: ['文明宿舍', '优秀宿舍', '示范宿舍', ''][Math.floor(Math.random() * 4)],
        assessRank: Math.floor(Math.random() * 50) + 1,
      };
    }
    return Promise.resolve({
      code: 200,
      data: {
        dormNo: target.dormNo,
        buildingName: target.buildingName,
        floor: target.floor,
        className: target.className,
        totalAssessScore: target.totalAssessScore,
        healthScore: target.healthScore,
        disciplineScore: target.disciplineScore,
        civilizedDormTitle: target.civilizedDormTitle || '',
        assessRank: target.assessRank,
      },
      msg: '成功',
    });
  });
}

/**
 * 分页查询宿舍卫生评比明细列表
 * @param {object} params - 请求参数
 * @param {string} [params.dormNo] - 宿舍号
 * @param {string} [params.campus] - 校区
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getDormHealthDetailList(params) {
  return requestClient.get('/studentmgmt/dorm-compare-report/health-detail', { params }).catch(err => {
    console.warn('宿舍卫生明细接口失败，使用模拟数据', err);

    // 根据传入的宿舍号动态生成模拟明细数据（与原代码行为一致：每个宿舍生成7条记录）
    const dormNo = params?.dormNo || '未知宿舍';
    const mockList = [];
    // 生成7条记录（与原代码一致）
    for (let i = 1; i <= 7; i++) {
      mockList.push({
        id: i,
        checkDate: `2026-04-${String(i).padStart(2, '0')}`,
        score: (Math.random() * 40 + 60).toFixed(1),   // 范围 60~100
        inspector: ['值班老师', '宿管员', '学生会'][Math.floor(Math.random() * 3)],
        remark: i % 2 === 0 ? '地面干净' : '物品摆放整齐',
        dormNo: dormNo,
        campus: params?.campus || '丰泽校区',
        createTime: Date.now() - Math.random() * 30 * 86400000,
      });
    }

    // 分页处理（虽然只有7条，但支持pageSize分页）
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const total = mockList.length;
    const start = (pageNo - 1) * pageSize;
    const list = mockList.slice(start, start + pageSize);

    return Promise.resolve({
      code: 200,
      data: { list, total, pageNo, pageSize },
      msg: '成功',
    });
  });
}


// ==================== 数据可视化图表接口 ====================
/**
 * 宿舍评比统计看板（柱状图：宿舍得分排名、各楼栋文明宿舍数量）
 * @param {object} params - 请求参数
 * @param {string} params.reportPeriod - 报表周期（必填）
 * @param {string} params.statisticalPeriod - 统计时段（必填）
 * @returns {Promise}
 */
export function getDormCompareReportChart(params) {
  return requestClient.get('/studentmgmt/dorm-compare-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    // 根据请求参数生成有差异的模拟数据
    const { reportPeriod = '月报', statisticalPeriod = '' } = params;
    console.log('[宿舍模拟] 周期:', reportPeriod, '时段:', statisticalPeriod);

    // ------------------- 1. 宿舍得分排名 -------------------
    let dormNos = [];
    let totalScores = [];

    switch (reportPeriod) {
      case '日报':
        dormNos = ['101', '102', '103', '104', '105'];
        totalScores = [92.5, 90.0, 88.5, 85.0, 83.5];
        break;
      case '周报':
        dormNos = ['102', '101', '105', '103', '104'];
        totalScores = [97.0, 95.5, 94.0, 92.0, 89.5];
        break;
      case '月报':
        dormNos = ['101', '102', '103', '104'];
        totalScores = [99.0, 98.0, 96.5, 95.0];
        break;
      case '季报':
        dormNos = ['103', '101', '102', '105', '104', '106'];
        totalScores = [98.5, 97.0, 96.0, 94.5, 92.0, 90.0];
        break;
      case '半年报':
        dormNos = ['104', '102', '101', '103', '106'];
        totalScores = [99.5, 98.5, 97.5, 96.0, 94.0];
        break;
      case '年报':
        dormNos = ['101', '103', '102', '104', '106', '105'];
        totalScores = [100.0, 98.5, 98.0, 97.0, 95.5, 94.0];
        break;
      case '自定义报表':
        dormNos = ['102', '104', '101'];
        totalScores = [88.0, 85.5, 84.0];
        break;
      default:
        dormNos = ['101', '102', '103', '104'];
        totalScores = [95.0, 94.0, 93.0, 92.0];
    }

    // 添加小扰动
    const perturbedScores = totalScores.map(s => {
      let perturb = (Math.random() - 0.5) * 1.5;
      return Math.min(100, Math.max(60, s + perturb)).toFixed(1);
    });

    const dormRankData = {
      dormNo: dormNos,
      totalScore: perturbedScores,
    };

    // ------------------- 2. 各楼栋文明宿舍数量统计 -------------------
    let buildingNames = [];
    let counts = [];

    switch (reportPeriod) {
      case '日报':
        buildingNames = ['1号楼', '2号楼', '3号楼', '4号楼'];
        counts = [3, 2, 1, 1];
        break;
      case '周报':
        buildingNames = ['1号楼', '2号楼', '3号楼'];
        counts = [8, 6, 4];
        break;
      case '月报':
        buildingNames = ['1号楼', '2号楼', '3号楼'];
        counts = [15, 12, 8];
        break;
      case '季报':
        buildingNames = ['1号楼', '2号楼', '3号楼', '4号楼'];
        counts = [28, 22, 18, 8];
        break;
      case '半年报':
        buildingNames = ['1号楼', '2号楼', '3号楼'];
        counts = [45, 38, 30];
        break;
      case '年报':
        buildingNames = ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼'];
        counts = [82, 70, 58, 32, 20];
        break;
      case '自定义报表':
        buildingNames = ['1号楼', '2号楼'];
        counts = [6, 4];
        break;
      default:
        buildingNames = ['1号楼', '2号楼', '3号楼'];
        counts = [12, 10, 8];
    }

    // 添加小扰动
    const perturbedCounts = counts.map(c => {
      let perturb = Math.floor((Math.random() - 0.5) * 2);
      return Math.max(0, c + perturb);
    });

    const buildingCivilizedData = {
      buildingName: buildingNames,
      count: perturbedCounts,
    };

    console.log('[宿舍模拟] 宿舍排名:', dormRankData);
    console.log('[宿舍模拟] 楼栋文明宿舍:', buildingCivilizedData);

    return Promise.resolve({
      code: 200,
      data: { dormRankData, buildingCivilizedData },
      msg: '成功',
    });
  });
}
