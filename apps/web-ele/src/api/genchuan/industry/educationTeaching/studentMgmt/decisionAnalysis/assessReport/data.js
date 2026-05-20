import { requestClient } from '#/api/request.js';

// ==================== 模拟数据生成 ====================

/**
 * 根据报表周期生成合理的起止时间戳
 */
function getStatTimeByPeriod(reportPeriod, baseDate = null) {
  const now = baseDate ? new Date(baseDate) : new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  switch (reportPeriod) {
    case '日报': {
      const start = new Date(year, month, date, 0, 0, 0);
      const end = new Date(year, month, date, 23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
    case '周报': {
      const dayOfWeek = now.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      monday.setHours(0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59);
      return { statStartTime: monday.getTime(), statEndTime: sunday.getTime() };
    }
    case '月报': {
      const start = new Date(year, month, 1, 0, 0, 0);
      const end = new Date(year, month + 1, 0, 23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
    case '季报': {
      const quarter = Math.floor(month / 3);
      const startMonth = quarter * 3;
      const start = new Date(year, startMonth, 1, 0, 0, 0);
      const end = new Date(year, startMonth + 3, 0, 23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
    case '半年报': {
      const half = month < 6 ? 0 : 6;
      const start = new Date(year, half, 1, 0, 0, 0);
      const end = new Date(year, half + 6, 0, 23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
    case '年报': {
      const start = new Date(year, 0, 1, 0, 0, 0);
      const end = new Date(year, 11, 31, 23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
    default: {
      const start = new Date(now);
      start.setDate(now.getDate() - 29);
      start.setHours(0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59);
      return { statStartTime: start.getTime(), statEndTime: end.getTime() };
    }
  }
}

/**
 * 格式化时间戳为展示字符串
 */
function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 生成模拟报表数据列表
 * @param {object} filters - 筛选条件
 * @returns {Array} 模拟数据数组
 */
export const generateMockReportList = (filters = {}) => {
  const grades = ['2022级', '2023级', '2024级'];
  const majors = ['计算机科学与技术', '软件工程', '大数据技术', '人工智能', '网络工程'];
  const classNames = [
    '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
    '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
  ];
  const reportPeriods = ['日报', '周报', '月报', '季报', '半年报', '年报', '自定义报表'];
  // 新生成状态枚举：待生成 / 已生成 / 已归档
  const generateStatuses = ['待生成', '已生成', '已归档'];

  const list = [];
  const today = Date.now();
  for (let i = 1; i <= 50; i++) {
    const grade = grades[i % grades.length];
    const major = majors[i % majors.length];
    const className = classNames[i % classNames.length];
    const reportPeriod = reportPeriods[i % reportPeriods.length];
    const generateStatus = generateStatuses[i % generateStatuses.length];

    // 生成统计起止时间
    const { statStartTime, statEndTime } = getStatTimeByPeriod(reportPeriod, today - i * 86400000);

    list.push({
      id: i,
      reportPeriod,
      statStartTime,
      statEndTime,
      className,
      majorName: major,
      grade,
      totalAssessScore: (Math.random() * 40 + 60).toFixed(1),
      healthScore: (Math.random() * 30).toFixed(1),
      morningExerciseScore: (Math.random() * 30).toFixed(1),
      civilizedClassScore: (Math.random() * 30).toFixed(1),
      blackboardNewsScore: (Math.random() * 30).toFixed(1),
      assessRank: Math.floor(Math.random() * 50) + 1,
      generateStatus,               // 待生成 / 已生成 / 已归档
      generateTime: generateStatus !== '待生成'
        ? new Date(today - Math.random() * 30 * 86400000).toISOString().replace('T', ' ').slice(0, 19)
        : '',
      operator: generateStatus !== '待生成' ? ['admin', '张老师', '李老师', '王主任'][i % 4] : '',
      exportCount: Math.floor(Math.random() * 10),
      dataUpdateTime: new Date(today - Math.random() * 7 * 86400000).toISOString().replace('T', ' ').slice(0, 19),
      creator: 'system',
      createTime: Date.now() - Math.random() * 90 * 86400000,
      updateTime: Date.now() - Math.random() * 30 * 86400000,
    });
  }

  // 应用筛选
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
  if (filters.assessRank) {
    filtered = filtered.filter(item => item.assessRank === Number(filters.assessRank));
  }
  if (filters.generateStatus) {
    filtered = filtered.filter(item => item.generateStatus === filters.generateStatus);
  }
  // 时间范围筛选
  if (filters.statStartTime && filters.statEndTime) {
    filtered = filtered.filter(item =>
      item.statStartTime >= filters.statStartTime && item.statEndTime <= filters.statEndTime
    );
  }
  return filtered;
};

// ==================== 列表页交互操作接口 ====================
/**
 * 分页查询考评统计报表列表
 */
export function getAssessReportPage(params) {
  return requestClient.get('/studentmgmt/assess-report/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    const pageNo = params?.pageNo || 1;
    const pageSize = params?.pageSize || 10;
    const filters = {
      reportPeriod: params?.reportPeriod,
      className: params?.className,
      majorName: params?.majorName,
      grade: params?.grade,
      assessRank: params?.assessRank,
      generateStatus: params?.generateStatus,
      statStartTime: params?.statStartTime,
      statEndTime: params?.statEndTime,
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
 * 生成考评统计报表（提交生成任务）- 支持单个报表生成（待生成状态使用）
 * @param {object} data - 请求参数，可包含 id 或 筛选条件
 * @returns {Promise}
 */
export function createAssessReport(data) {
  return requestClient.post('/studentmgmt/assess-report/create', data).catch(err => {
    console.warn('生成报表接口失败，使用模拟数据', err);
    // 模拟生成成功，返回已生成状态
    return Promise.resolve({
      code: 200,
      data: {
        id: data?.id || Math.floor(Math.random() * 10000) + 100,
        generateStatus: '已生成',
      },
      msg: '报表生成成功',
    });
  });
}

/**
 * 归档考评统计报表
 * @param {object} data - 请求参数，包含报表id
 * @returns {Promise}
 */
export function archiveAssessReport(data) {
  return requestClient.post('/studentmgmt/assess-report/archive', data).catch(err => {
    console.warn('归档接口失败，使用模拟数据', err);
    return Promise.resolve({
      code: 200,
      data: {
        id: data?.id,
        generateStatus: '已归档',
      },
      msg: '归档成功',
    });
  });
}

/**
 * 导出考评统计报表（支持批量/单条导出）
 */
export function exportAssessReport(params) {
  return requestClient.download('/studentmgmt/assess-report/export', params).catch(err => {
    console.warn('导出接口失败，使用模拟数据', err);
    const blob = new Blob(['模拟导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return Promise.resolve(blob);
  });
}

// ==================== 列表行交互操作接口 ====================
/**
 * 获取考评统计报表详情
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

/**
 * 分页查询黑板报评比明细列表
 */
export function getBlackboardDetailList(params) {
  return requestClient.get('/studentmgmt/assess-report/blackboard-detail', { params }).catch(err => {
    console.warn('黑板报明细接口失败，使用模拟数据', err);
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const inspectors = ['美术老师', '德育处主任', '学生会干部'];
    const themes = ['安全主题', '环保主题', '节日主题', '科技主题'];
    const comments = ['内容丰富，版面美观', '主题突出，色彩搭配合理', '创意新颖，整体效果好', '书写工整，插图精美'];

    const allMockData = [];
    for (let i = 1; i <= 30; i++) {
      const className = classNames[(i - 1) % classNames.length];
      allMockData.push({
        id: i,
        evaluateDate: `2026-04-${String(((i - 1) % 30) + 1).padStart(2, '0')}`,
        score: (Math.random() * 30 + 70).toFixed(1),
        inspector: inspectors[Math.floor(Math.random() * inspectors.length)],
        theme: themes[Math.floor(Math.random() * themes.length)],
        comment: comments[Math.floor(Math.random() * comments.length)],
        className,
        createTime: Date.now() - Math.random() * 30 * 86400000,
      });
    }

    let filtered = allMockData;
    if (params?.className) {
      filtered = filtered.filter(item => item.className.includes(params.className));
    }

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
 * 分页查询文明班级评比明细列表
 */
export function getCivilizedClassDetailList(params) {
  return requestClient.get('/studentmgmt/assess-report/civilized-class-detail', { params }).catch(err => {
    console.warn('文明班级明细接口失败，使用模拟数据', err);
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const inspectors = ['王主任', '李主任', '德育处'];
    const itemsOptions = ['班风、卫生、纪律', '班风、出勤、仪表', '卫生、纪律、文明用语', '班风、两操、仪表'];
    const remarks = ['表现优秀', '有待提升', '进步明显', '需加强纪律'];

    const allMockData = [];
    for (let i = 1; i <= 40; i++) {
      const className = classNames[(i - 1) % classNames.length];
      allMockData.push({
        id: i,
        evaluateDate: `2026-04-${String(((i - 1) % 28) + 1).padStart(2, '0')}`,
        score: (Math.random() * 30 + 70).toFixed(1),
        inspector: inspectors[Math.floor(Math.random() * inspectors.length)],
        items: itemsOptions[Math.floor(Math.random() * itemsOptions.length)],
        remark: remarks[Math.floor(Math.random() * remarks.length)],
        className,
        createTime: Date.now() - Math.random() * 30 * 86400000,
      });
    }

    let filtered = allMockData;
    if (params?.className) {
      filtered = filtered.filter(item => item.className.includes(params.className));
    }

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
 * 获取班级考评明细
 */
export function getClassAssessDetail(params) {
  return requestClient.get('/studentmgmt/assess-report/class-detail', { params }).catch(err => {
    console.warn('班级考评明细接口失败，使用模拟数据', err);
    const allData = generateMockReportList();
    let target = allData.find(item => item.className === params.className);
    if (!target) {
      target = {
        className: params.className || '未知班级',
        healthScore: (Math.random() * 30 + 70).toFixed(1),
        morningExerciseScore: (Math.random() * 30 + 70).toFixed(1),
        civilizedClassScore: (Math.random() * 30 + 70).toFixed(1),
        blackboardNewsScore: (Math.random() * 30 + 70).toFixed(1),
        totalAssessScore: (Math.random() * 40 + 60).toFixed(1),
      };
    }
    return Promise.resolve({
      code: 200,
      data: {
        className: target.className,
        healthScore: target.healthScore,
        morningExerciseScore: target.morningExerciseScore,
        civilizedClassScore: target.civilizedClassScore,
        blackboardNewsScore: target.blackboardNewsScore,
        totalScore: target.totalAssessScore,
      },
      msg: '成功',
    });
  });
}

/**
 * 分页查询卫生考评明细列表
 */
export function getHealthDetailList(params) {
  return requestClient.get('/studentmgmt/assess-report/health-detail', { params }).catch(err => {
    console.warn('卫生明细接口失败，使用模拟数据', err);
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const inspectors = ['张老师', '李老师', '王老师', '值周生'];
    const remarks = ['地面干净', '桌椅整齐', '黑板清洁', '窗台无尘', '垃圾桶清理'];

    const allMockData = [];
    for (let i = 1; i <= 56; i++) {
      const className = classNames[(i - 1) % classNames.length];
      allMockData.push({
        id: i,
        date: `2026-04-${String(((i - 1) % 28) + 1).padStart(2, '0')}`,
        score: (Math.random() * 30 + 70).toFixed(1),
        inspector: inspectors[Math.floor(Math.random() * inspectors.length)],
        remark: remarks[Math.floor(Math.random() * remarks.length)],
        className,
        createTime: Date.now() - Math.random() * 30 * 86400000,
      });
    }

    let filtered = allMockData;
    if (params?.className) {
      filtered = filtered.filter(item => item.className.includes(params.className));
    }

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
 * 分页查询早操考评明细列表
 */
export function getMorningExerciseDetailList(params) {
  return requestClient.get('/studentmgmt/assess-report/morning-exercise-detail', { params }).catch(err => {
    console.warn('早操明细接口失败，使用模拟数据', err);
    const classNames = [
      '计算机2201班', '计算机2202班', '软件工程2301班', '软件工程2302班',
      '大数据2401班', '人工智能2401班', '网络工程2201班', '计算机2303班',
    ];
    const inspectors = ['体育老师', '值周老师', '学生会'];

    const allMockData = [];
    for (let i = 1; i <= 56; i++) {
      const className = classNames[(i - 1) % classNames.length];
      const attendanceRate = (Math.random() * 20 + 80).toFixed(1);
      allMockData.push({
        id: i,
        date: `2026-04-${String(((i - 1) % 28) + 1).padStart(2, '0')}`,
        score: (Math.random() * 30 + 70).toFixed(1),
        inspector: inspectors[Math.floor(Math.random() * inspectors.length)],
        attendanceRate: `${attendanceRate}%`,
        className,
        createTime: Date.now() - Math.random() * 30 * 86400000,
      });
    }

    let filtered = allMockData;
    if (params?.className) {
      filtered = filtered.filter(item => item.className.includes(params.className));
    }

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
export function getAssessReportChart(params) {
  return requestClient.get('/studentmgmt/assess-report/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    const { reportPeriod = '月报', statStartTime, statEndTime } = params;

    const dimensions = ['卫生', '早操', '文明班级', '黑板报'];
    const classList = ['计算机2201班', '软件工程2301班', '大数据2401班'];

    const getBaseScoresForClass = (className, period) => {
      let template;
      switch (period) {
        case '日报': template = [96, 88, 72, 68]; break;
        case '周报': template = [78, 80, 96, 88]; break;
        case '月报': template = [86, 84, 87, 92]; break;
        case '季报': template = [90, 92, 83, 85]; break;
        case '半年报': template = [94, 93, 95, 92]; break;
        case '年报': template = [98, 85, 97, 90]; break;
        default: template = [85, 85, 85, 85];
      }
      let offset;
      if (className.includes('计算机')) offset = [2, -1, 3, 0];
      else if (className.includes('软件工程')) offset = [-2, 2, 1, 1];
      else offset = [0, 3, -2, 2];
      return template.map((v, idx) => Math.min(100, Math.max(60, v + offset[idx])));
    };

    const radarSeries = classList.map(className => ({
      name: className,
      value: getBaseScoresForClass(className, reportPeriod).map(v => (v + (Math.random() - 0.5) * 2).toFixed(1))
    }));

    let startDate = statStartTime ? new Date(statStartTime) : new Date();
    let endDate = statEndTime ? new Date(statEndTime) : new Date();
    if (!statStartTime || !statEndTime) {
      endDate = new Date();
      startDate = new Date();
      if (reportPeriod === '日报') startDate.setDate(endDate.getDate());
      else if (reportPeriod === '周报') startDate.setDate(endDate.getDate() - 6);
      else if (reportPeriod === '月报') startDate.setDate(endDate.getDate() - 29);
      else startDate.setDate(endDate.getDate() - 6);
    }

    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const pointCount = Math.min(daysDiff, 30);
    const lineDates = [];
    for (let i = 0; i < pointCount; i++) {
      const cur = new Date(startDate);
      cur.setDate(startDate.getDate() + i);
      lineDates.push(cur.toISOString().slice(0, 10));
    }

    const lineSeries = classList.map(className => {
      const data = [];
      for (let i = 0; i < pointCount; i++) {
        let baseScore = 80;
        switch (reportPeriod) {
          case '日报': baseScore = 75 + (i % 5) * 4; break;
          case '周报': baseScore = 72 + i * 1.8; break;
          case '月报': baseScore = 78 + Math.sin(i / pointCount * Math.PI) * 12; break;
          case '季报': baseScore = i < pointCount / 2 ? 82 : 92; break;
          case '半年报': baseScore = 75 + Math.floor(i / (pointCount / 4)) * 6; break;
          case '年报': baseScore = 80 + (i / pointCount) * 18; break;
          default: baseScore = 80 + (i % 6) * 2;
        }
        let classOffset = 0;
        if (className.includes('计算机')) classOffset = 2;
        else if (className.includes('软件工程')) classOffset = -1;
        else classOffset = 1;
        let finalScore = baseScore + classOffset + (Math.random() - 0.5) * 3;
        finalScore = Math.min(100, Math.max(60, finalScore)).toFixed(1);
        data.push(finalScore);
      }
      return { name: className, data };
    });

    return Promise.resolve({
      code: 200,
      data: {
        radarData: { dimensions, series: radarSeries },
        lineData: { date: lineDates, series: lineSeries },
      },
      msg: '成功',
    });
  });
}
