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

/**
 * 分页查询考勤异常学生明细列表
 * @param {object} params - 请求参数
 * @param {string} [params.className] - 班级名称
 * @param {string} [params.dormNo] - 宿舍号
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getAbnormalStudentDetailList(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/abnormal-student-detail', { params }).catch(err => {
    console.warn('考勤异常学生明细接口失败，使用模拟数据', err);
    // 生成模拟考勤异常学生明细数据
    const campuses = ['丰泽校区', '洛江校区', '鲤城校区'];
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const abnormalTypes = ['迟到', '缺勤', '请假未归', '晚归', '夜不归宿'];
    const remarks = ['已通知家长', '待处理', '已记录', '已谈话', '重点关注'];

    // 构建全量模拟数据（总共60条）
    const allMockData = [];
    for (let i = 1; i <= 60; i++) {
      const className = classNames[(i - 1) % classNames.length];
      allMockData.push({
        id: i,
        studentName: `学生${i}`,
        studentNo: `2024${String(i).padStart(3, '0')}`,
        dormNo: `${Math.floor(Math.random() * 500) + 100}`,
        abnormalType: abnormalTypes[Math.floor(Math.random() * abnormalTypes.length)],
        abnormalDate: `2026-04-${String(((i - 1) % 28) + 1).padStart(2, '0')}`,
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
    if (params?.dormNo) {
      filtered = filtered.filter(item => item.dormNo === params.dormNo);
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
 * 分页查询缺勤学生明细列表
 * @param {object} params - 请求参数
 * @param {string} [params.className] - 班级名称
 * @param {string} [params.dormNo] - 宿舍号
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getAbsentStudentDetailList(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/absent-student-detail', { params }).catch(err => {
    console.warn('缺勤学生明细接口失败，使用模拟数据', err);
    // 生成模拟缺勤学生明细数据
    const campuses = ['丰泽校区', '洛江校区', '鲤城校区'];
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const absentReasons = ['未请假', '病假未及时报备', '事假未获批', '旷课', '其他'];

    // 构建全量模拟数据（总共40条，每个班级至少5条缺勤记录）
    const allMockData = [];
    for (let i = 1; i <= 40; i++) {
      const className = classNames[(i - 1) % classNames.length];
      allMockData.push({
        id: i,
        studentName: `学生${i}`,
        studentNo: `2024${String(i).padStart(3, '0')}`,
        dormNo: `${Math.floor(Math.random() * 500) + 100}`,
        absentReason: absentReasons[Math.floor(Math.random() * absentReasons.length)],
        absentDate: `2026-04-${String(((i - 1) % 28) + 1).padStart(2, '0')}`,
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
    if (params?.dormNo) {
      filtered = filtered.filter(item => item.dormNo === params.dormNo);
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
 * 分页查询考勤率计算明细列表（每日在寝统计）
 * @param {object} params - 请求参数
 * @param {string} [params.className] - 班级名称
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getAttendanceRateDetailList(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/attendance-rate-detail', { params }).catch(err => {
    console.warn('考勤率计算明细接口失败，使用模拟数据', err);
    // 生成模拟考勤率计算明细数据（按日期的在寝统计）
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const targetClassName = params?.className || classNames[0];

    // 构建全量模拟数据：一个班级一个月的每日数据（31天）
    const totalDays = 31;
    const totalStudents = 30; // 假设全班30人

    const allMockData = [];
    for (let i = 1; i <= totalDays; i++) {
      // 随机生成在寝人数，范围 20~30
      const inDormCount = Math.floor(Math.random() * 11) + 20;
      const inDormRate = ((inDormCount / totalStudents) * 100).toFixed(2);
      allMockData.push({
        id: i,
        date: `2026-04-${String(i).padStart(2, '0')}`,
        totalCount: totalStudents,
        inDormCount: inDormCount,
        inDormRate: parseFloat(inDormRate),
        formula: `${inDormCount} / ${totalStudents} * 100% = ${inDormRate}%`,
        className: targetClassName,
        createTime: Date.now() - (totalDays - i) * 86400000,
      });
    }

    // 应用筛选（按班级）
    let filtered = allMockData;
    if (params?.className) {
      filtered = filtered.filter(item => item.className === params.className);
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
 * 分页查询班级学生明细列表
 * @param {object} params - 请求参数
 * @param {string} [params.className] - 班级名称
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getClassStudentList(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/class-student-list', { params }).catch(err => {
    console.warn('班级学生明细接口失败，使用模拟数据', err);
    // 生成模拟班级学生数据
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const targetClassName = params?.className || classNames[0];

    // 构建全量模拟数据（每个班级35名学生）
    const totalStudents = 35;
    const allMockData = [];
    for (let i = 1; i <= totalStudents; i++) {
      allMockData.push({
        id: i,
        studentName: `学生${i}`,
        studentNo: `2024${String(i).padStart(3, '0')}`,
        dormNo: `${Math.floor(Math.random() * 500) + 100}`,
        phone: `138${String(Math.random() * 100000000).slice(0, 8)}`,
        className: targetClassName,
        createTime: Date.now() - Math.random() * 30 * 86400000,
      });
    }

    // 应用筛选（按班级）
    let filtered = allMockData;
    if (params?.className) {
      filtered = filtered.filter(item => item.className === params.className);
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
 * 分页查询在寝学生明细列表
 * @param {object} params - 请求参数
 * @param {string} [params.className] - 班级名称
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getPresentStudentDetailList(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/present-student-detail', { params }).catch(err => {
    console.warn('在寝学生明细接口失败，使用模拟数据', err);
    // 生成模拟在寝学生数据
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const targetClassName = params?.className || classNames[0];

    // 构建全量模拟数据（每个班级28名在寝学生）
    const totalStudents = 28;
    const allMockData = [];
    for (let i = 1; i <= totalStudents; i++) {
      // 随机生成在寝时间（4月某天22点前后）
      const day = Math.floor(Math.random() * 28) + 1;
      const hour = 22;
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);
      const inTime = `2026-04-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

      allMockData.push({
        id: i,
        studentName: `学生${i}`,
        studentNo: `2024${String(i).padStart(3, '0')}`,
        dormNo: `${Math.floor(Math.random() * 500) + 100}`,
        inTime: inTime,
        className: targetClassName,
        createTime: Date.now() - Math.random() * 30 * 86400000,
      });
    }

    // 应用筛选（按班级）
    let filtered = allMockData;
    if (params?.className) {
      filtered = filtered.filter(item => item.className === params.className);
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
 * 分页查询迟到学生明细列表
 * @param {object} params - 请求参数
 * @param {string} [params.className] - 班级名称
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getLateStudentDetailList(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/late-student-detail', { params }).catch(err => {
    console.warn('迟到学生明细接口失败，使用模拟数据', err);
    // 生成模拟迟到学生数据
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const targetClassName = params?.className || classNames[0];

    // 构建全量模拟数据（每个班级8名迟到学生）
    const totalStudents = 8;
    const allMockData = [];
    for (let i = 1; i <= totalStudents; i++) {
      // 随机生成迟到时间（4月某天早上7:15-7:50）
      const day = Math.floor(Math.random() * 28) + 1;
      const hour = 7;
      const minute = Math.floor(Math.random() * 35) + 15; // 7:15 ~ 7:50
      const second = Math.floor(Math.random() * 60);
      const lateTime = `2026-04-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
      // 迟到时长：分钟数（5~30）
      const lateMinutes = Math.floor(Math.random() * 26) + 5;

      allMockData.push({
        id: i,
        studentName: `学生${i}`,
        studentNo: `2024${String(i).padStart(3, '0')}`,
        dormNo: `${Math.floor(Math.random() * 500) + 100}`,
        lateTime: lateTime,
        lateMinutes: lateMinutes,
        className: targetClassName,
        createTime: Date.now() - Math.random() * 30 * 86400000,
      });
    }

    // 应用筛选（按班级）
    let filtered = allMockData;
    if (params?.className) {
      filtered = filtered.filter(item => item.className === params.className);
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
 * 分页查询请假学生明细列表
 * @param {object} params - 请求参数
 * @param {string} [params.className] - 班级名称
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise}
 */
export function getLeaveStudentDetailList(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/leave-student-detail', { params }).catch(err => {
    console.warn('请假学生明细接口失败，使用模拟数据', err);
    // 生成模拟请假学生数据
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const targetClassName = params?.className || classNames[0];

    // 构建全量模拟数据（每个班级15名请假学生）
    const totalStudents = 15;
    const allMockData = [];
    const leaveReasons = ['事假', '病假', '回家', '实习', '比赛'];
    for (let i = 1; i <= totalStudents; i++) {
      // 随机生成请假时间（4月某天早上8点左右）
      const day = Math.floor(Math.random() * 28) + 1;
      const hour = 8;
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);
      const leaveTime = `2026-04-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

      allMockData.push({
        id: i,
        studentName: `学生${i}`,
        studentNo: `2024${String(i).padStart(3, '0')}`,
        dormNo: `${Math.floor(Math.random() * 500) + 100}`,
        leaveReason: leaveReasons[Math.floor(Math.random() * leaveReasons.length)],
        leaveTime: leaveTime,
        className: targetClassName,
        createTime: Date.now() - Math.random() * 30 * 86400000,
      });
    }

    // 应用筛选（按班级）
    let filtered = allMockData;
    if (params?.className) {
      filtered = filtered.filter(item => item.className === params.className);
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
 * 宿舍考勤统计看板（柱状图：各班级考勤异常人数、各班级在寝率）
 * @param {object} params - 请求参数
 * @param {string} params.reportPeriod - 报表周期（必填）
 * @param {string} params.statisticalPeriod - 统计时段（必填）
 * @returns {Promise}
 */
export function getDormCheckReportChart(params) {
  return requestClient.get('/studentmgmt/dorm-check-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    const { reportPeriod = '月报', statisticalPeriod = '' } = params;
    console.log('[考勤模拟] 周期:', reportPeriod, '时段:', statisticalPeriod);

    // ---------- 1. 各班级考勤异常人数 ----------
    let classNames = [];
    let abnormalCounts = [];

    switch (reportPeriod) {
      case '日报':
        classNames = ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班', '网络2301班'];
        abnormalCounts = [1, 0, 2, 1, 3];
        break;
      case '周报':
        classNames = ['软件2301班', '计算机2301班', '人工智能2401班', '大数据2401班', '物联网2401班'];
        abnormalCounts = [3, 2, 4, 1, 2];
        break;
      case '月报':
        classNames = ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'];
        abnormalCounts = [0, 2, 1, 3];
        break;
      case '季报':
        classNames = ['人工智能2401班', '计算机2301班', '软件2301班', '大数据2401班', '网络2301班'];
        abnormalCounts = [5, 3, 4, 2, 6];
        break;
      case '半年报':
        classNames = ['大数据2401班', '人工智能2401班', '计算机2301班', '软件2301班'];
        abnormalCounts = [8, 6, 5, 7];
        break;
      case '年报':
        classNames = ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班', '物联网2401班'];
        abnormalCounts = [12, 9, 10, 8, 11];
        break;
      case '自定义报表':
        classNames = ['软件2301班', '大数据2401班', '计算机2301班'];
        abnormalCounts = [2, 1, 0];
        break;
      default:
        classNames = ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'];
        abnormalCounts = [1, 2, 1, 2];
    }

    const abnormalData = {
      className: classNames,
      abnormalCount: abnormalCounts,
    };

    // ---------- 2. 各班级在寝率（百分比） ----------
    let inDormRates = [];

    switch (reportPeriod) {
      case '日报':
        inDormRates = [96.5, 98.0, 94.5, 93.0, 91.5];
        break;
      case '周报':
        inDormRates = [92.0, 94.5, 89.5, 96.0, 90.0];
        break;
      case '月报':
        inDormRates = [93.33, 90.0, 95.5, 88.0];
        break;
      case '季报':
        inDormRates = [90.5, 92.0, 88.5, 93.5, 87.0];
        break;
      case '半年报':
        inDormRates = [89.0, 91.0, 94.0, 86.5];
        break;
      case '年报':
        inDormRates = [85.0, 88.0, 86.5, 90.0, 84.0];
        break;
      case '自定义报表':
        inDormRates = [88.0, 92.0, 94.5];
        break;
      default:
        inDormRates = [94.0, 93.0, 95.0, 92.0];
    }

    // 添加小扰动
    const perturbedRates = inDormRates.map(rate => {
      let perturb = (Math.random() - 0.5) * 1.2;
      return Math.min(100, Math.max(60, rate + perturb)).toFixed(1);
    });

    const inDormRateData = {
      className: classNames,
      inDormRate: perturbedRates,
    };

    console.log('[考勤模拟] 异常人数:', abnormalData);
    console.log('[考勤模拟] 在寝率:', inDormRateData);

    return Promise.resolve({
      code: 200,
      data: { abnormalData, inDormRateData },
      msg: '成功',
    });
  });
}
