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

// ==================== 数据可视化图表接口 ====================

/**
 * 宿舍评比统计看板（柱状图：宿舍得分排名、各楼栋文明宿舍数量）
 * @param {object} params - 请求参数
 * @param {string} params.reportPeriod - 报表周期（必填）
 * @param {string} params.statisticalPeriod - 统计时段（必填）
 * @param {string} params.campus - 校区（必填）
 * @returns {Promise}
 */
export function getDormCompareReportChart(params) {
  return requestClient.get('/studentmgmt/dorm-compare-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    // 宿舍得分排名
    const dormRankData = {
      dormNo: ['101', '102', '103', '104'],
      totalScore: [99.0, 98.0, 96.5, 95.0],
    };
    // 各楼栋文明宿舍数量统计
    const buildingCivilizedData = {
      buildingName: ['1号楼', '2号楼', '3号楼'],
      count: [15, 12, 8],
    };
    return Promise.resolve({
      code: 200,
      data: { dormRankData, buildingCivilizedData },
      msg: '成功',
    });
  });
}
