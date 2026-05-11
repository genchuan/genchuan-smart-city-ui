import { requestClient } from '#/api/request.js';

// ==================== 模拟数据生成 ====================

/**
 * 生成模拟宿舍考勤报表数据列表
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
  const dormNumbers = ['101', '102', '103', '201', '202', '301', '302', '401'];

  const list = [];
  const today = Date.now();
  for (let i = 1; i <= 50; i++) {
    const campus = campuses[i % campuses.length];
    const grade = grades[i % grades.length];
    const major = majors[i % majors.length];
    const className = classNames[i % classNames.length];
    const reportPeriod = reportPeriods[i % reportPeriods.length];
    const generateStatus = generateStatuses[i % generateStatuses.length];
    const dormNo = dormNumbers[i % dormNumbers.length];
    const totalStudent = Math.floor(Math.random() * 20) + 20; // 20-40人
    const inDorm = Math.floor(Math.random() * (totalStudent + 1));
    const leave = Math.floor(Math.random() * 5);
    const absent = Math.floor(Math.random() * 3);
    const late = Math.floor(Math.random() * 3);
    const abnormal = Math.floor(Math.random() * 2);
    const inDormRate = totalStudent > 0 ? ((inDorm / totalStudent) * 100).toFixed(2) : 0;

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
      dormNo,
      totalStudentCount: totalStudent,
      inDormCount: inDorm,
      absentCount: absent,
      leaveCount: leave,
      lateCount: late,
      inDormRate: parseFloat(inDormRate),
      abnormalCount: abnormal,
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
  if (filters.dormNo) {
    filtered = filtered.filter(item => item.dormNo.includes(filters.dormNo));
  }
  if (filters.generateStatus) {
    filtered = filtered.filter(item => item.generateStatus === filters.generateStatus);
  }
  return filtered;
};

// ==================== 列表页交互操作接口 ====================

/**
 * 分页查询宿舍考勤报表列表
 * @param {object} params - 请求参数
 * @param {string} [params.reportPeriod] - 报表周期
 * @param {string} [params.statisticalPeriod] - 统计时段
 * @param {string} [params.className] - 班级名称
 * @param {string} [params.majorName] - 专业名称
 * @param {string} [params.grade] - 年级
 * @param {string} [params.campus] - 校区
 * @param {string} [params.dormNo] - 宿舍号
 * @param {string} [params.generateStatus] - 生成状态
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getDormCheckReportPage(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const filters = {
      reportPeriod: params?.reportPeriod,
      className: params?.className,
      majorName: params?.majorName,
      grade: params?.grade,
      campus: params?.campus,
      dormNo: params?.dormNo,
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
 * 生成宿舍考勤报表（提交生成任务）
 * @param {object} data - 请求参数
 * @returns {Promise}
 */
export function createDormCheckReport(data) {
  return requestClient.post('/studentmgmt/dorm-check-report/create', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: { id: Math.floor(Math.random() * 10000) + 100, generateStatus: '生成中' },
      msg: '报表生成任务已提交',
    });
  });
}

/**
 * 导出宿舍考勤报表（支持批量/单条导出）
 * @param {object} params - 请求参数
 * @returns {Promise}
 */
export function exportDormCheckReport(params) {
  return requestClient.download('/studentmgmt/dorm-check-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}

// ==================== 列表行交互操作接口 ====================

/**
 * 获取宿舍考勤报表详情（查看抽屉弹窗）
 * @param {object} params - 请求参数
 * @param {number} params.id - 报表主键ID
 * @returns {Promise}
 */
export function getDormCheckReportDetail(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    const detail = allData.find(item => item.id === Number(params.id)) || allData[0];
    return Promise.resolve({ code: 200, data: detail, msg: '成功' });
  });
}

// ==================== 数据可视化图表接口 ====================

/**
 * 宿舍考勤统计看板（柱状图：各班级考勤异常人数、各班级在寝率）
 * @param {object} params - 请求参数
 * @param {string} params.reportPeriod - 报表周期（必填）
 * @param {string} params.statisticalPeriod - 统计时段（必填）
 * @param {string} params.campus - 校区（必填）
 * @returns {Promise}
 */
export function getDormCheckReportChart(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    // 各班级考勤异常人数
    const abnormalData = {
      className: ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'],
      abnormalCount: [0, 2, 1, 3],
    };
    // 各班级在寝率
    const inDormRateData = {
      className: ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'],
      inDormRate: [93.33, 90.0, 95.5, 88.0],
    };
    return Promise.resolve({
      code: 200,
      data: { abnormalData, inDormRateData },
      msg: '成功',
    });
  });
}
