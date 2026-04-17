import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 学历层次映射
const educationLevelMap = {
  '中专': '1',
  '大专': '2',
  '本科': '3',
  '研究生': '4'
};
const educationLevelReverse = {
  '1': '中专',
  '2': '大专',
  '3': '本科',
  '4': '研究生'
};

// 学习形式映射
const studyFormMap = {
  '全日制': '1',
  '非全日制': '2',
  '函授': '3'
};
const studyFormReverse = {
  '1': '全日制',
  '2': '非全日制',
  '3': '函授'
};

// 学生类型映射
const studentTypeMap = {
  '普通生': '1',
  '特长生': '2',
  '转学生': '3'
};
const studentTypeReverse = {
  '1': '普通生',
  '2': '特长生',
  '3': '转学生'
};

// 学籍状态映射
const statusMap = {
  '在籍': '1',
  '休学': '2',
  '退学': '3',
  '异动': '4'
};
const statusReverse = {
  '1': '在籍',
  '2': '休学',
  '3': '退学',
  '4': '异动'
};

// 年级映射（将纯数字年份转为“XX级”）
function formatGrade(grade) {
  if (!grade) return grade;
  // 如果是纯数字（如"2024"），转为"2024级"
  if (/^\d{4}$/.test(grade)) {
    return `${grade}级`;
  }
  // 如果已经是"2024级"格式，保持不变
  return grade;
}

// 逆向年级映射（将“2024级”转为"2024"）
function parseGrade(grade) {
  if (!grade) return grade;
  // 如果格式为"2024级"，去掉"级"
  if (grade.endsWith('级')) {
    return grade.slice(0, -1);
  }
  return grade;
}

// 通用转换函数：后端 → 前端（将数字/代码转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.educationLevel && educationLevelReverse[result.educationLevel]) {
    result.educationLevel = educationLevelReverse[result.educationLevel];
  }
  if (result.studyForm && studyFormReverse[result.studyForm]) {
    result.studyForm = studyFormReverse[result.studyForm];
  }
  if (result.studentType && studentTypeReverse[result.studentType]) {
    result.studentType = studentTypeReverse[result.studentType];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  if (result.grade) {
    result.grade = formatGrade(result.grade);
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为数字/代码）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.educationLevel && educationLevelMap[result.educationLevel]) {
    result.educationLevel = educationLevelMap[result.educationLevel];
  }
  if (result.studyForm && studyFormMap[result.studyForm]) {
    result.studyForm = studyFormMap[result.studyForm];
  }
  if (result.studentType && studentTypeMap[result.studentType]) {
    result.studentType = studentTypeMap[result.studentType];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  if (result.grade) {
    result.grade = parseGrade(result.grade);
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 学生信息接口 ====================
export function getStudentInfoPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/student-info/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mockData = convertList(dataList());
      return { list: mockData, total: mockData.length };
    });
}

export function createStudentInfo(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/student-info/create', convertedData).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateStudentInfo(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/student-info/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function deleteStudentInfo(params) {
  // 删除接口只传 id，无需转换
  return requestClient.delete('/studentmgmt/student-info/delete', { params }).catch(err => {
    console.warn('删除接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function deleteStudentInfoList(data) {
  // 批量删除接口只传 ids，无需转换
  return requestClient.delete('/studentmgmt/student-info/delete-list', { params: data }).catch(err => {
    console.warn('批量删除接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportStudentInfo(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/student-info/export', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getStudentInfoDetail(params) {
  return requestClient.get('/studentmgmt/student-info/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = dataList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// ==================== 图表接口 ====================
// 图表接口暂不处理映射（因未提供后端数据结构），如有需要可参照添加
export function getStudentInfoChart(params) {
  return requestClient.get('/studentmgmt/student-info/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalStudent: 1256,
      inSchoolStudent: 1220,
      suspendStudent: 15,
      transferStudent: 12,
      specialStudent: 9,
    });
  });
}

export function getStudentInfoDistribution(params) {
  return requestClient.get('/studentmgmt/student-info/chart/distributionCount', { params }).catch(err => {
    console.warn('分布统计接口失败，使用模拟数据', err);
    const mockDistribution = {
      grade: [
        { name: '2021级', count: 320 },
        { name: '2022级', count: 310 },
        { name: '2023级', count: 305 },
        { name: '2024级', count: 321 },
      ],
      major: [
        { name: '计算机科学与技术', count: 328 },
        { name: '软件工程', count: 286 },
        { name: '电子信息工程', count: 252 },
        { name: '网络工程', count: 215 },
        { name: '数据科学与大数据技术', count: 175 },
      ],
      class: [
        { name: '计算机1班', count: 45 },
        { name: '计算机2班', count: 42 },
        { name: '软件1班', count: 48 },
        { name: '软件2班', count: 50 },
        { name: '电子1班', count: 40 },
      ],
    };
    const dimension = params.dimension || 'grade';
    return Promise.resolve(mockDistribution[dimension] || []);
  });
}

export function getStudentInfoCoreIndex(params) {
  return requestClient.get('/studentmgmt/student-info/chart/coreIndex', { params }).catch(err => {
    console.warn('核心指标接口失败，使用模拟数据', err);
    return Promise.resolve([
      { date: '2025-01', newStudentCount: 45, transferCount: 2, suspendCount: 1 },
      { date: '2025-02', newStudentCount: 12, transferCount: 1, suspendCount: 0 },
      { date: '2025-03', newStudentCount: 8, transferCount: 3, suspendCount: 2 },
    ]);
  });
}

// 模拟数据（原始值使用数字/代码，通过转换函数对外提供中文）
export const dataList = () => {
  return [
    {
      id: 1,
      studentNo: '20210001',
      name: '张三',
      idCard: '41010119900307663X',
      photo: '',
      grade: '2021',
      educationLevel: '3',
      studyForm: '1',
      major: '计算机科学与技术',
      className: '计算机科学与技术1班',
      studentType: '1',
      status: '1',
      phone: '13800138001',
      parentPhone: '13800138000',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      studentNo: '20210002',
      name: '李四',
      idCard: '410101199003076631',
      photo: '',
      grade: '2021',
      educationLevel: '3',
      studyForm: '1',
      major: '软件工程',
      className: '软件工程1班',
      studentType: '1',
      status: '1',
      phone: '13800138002',
      parentPhone: '13800138001',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672617600000,
    },
    {
      id: 3,
      studentNo: '20210003',
      name: '王五',
      idCard: '410101199003076632',
      photo: '',
      grade: '2021',
      educationLevel: '3',
      studyForm: '2',
      major: '计算机科学与技术',
      className: '计算机科学与技术2班',
      studentType: '2',
      status: '2',
      phone: '13800138003',
      parentPhone: '13800138002',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672704000000,
    },
    {
      id: 4,
      studentNo: '20210004',
      name: '赵六',
      idCard: '410101199003076633',
      photo: '',
      grade: '2021',
      educationLevel: '2',
      studyForm: '3',
      major: '电子信息工程',
      className: '电子信息工程1班',
      studentType: '3',
      status: '4',
      phone: '13800138004',
      parentPhone: '13800138003',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672790400000,
    },
    {
      id: 5,
      studentNo: '20210005',
      name: '孙七',
      idCard: '410101199003076634',
      photo: '',
      grade: '2021',
      educationLevel: '4',
      studyForm: '1',
      major: '数据科学与大数据技术',
      className: '大数据1班',
      studentType: '1',
      status: '1',
      phone: '13800138005',
      parentPhone: '13800138004',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672876800000,
    },
    {
      id: 6,
      studentNo: '20210006',
      name: '周八',
      idCard: '410101199003076635',
      photo: '',
      grade: '2021',
      educationLevel: '3',
      studyForm: '1',
      major: '软件工程',
      className: '软件工程2班',
      studentType: '2',
      status: '1',
      phone: '13800138006',
      parentPhone: '13800138005',
      remark: '',
      reserve1: '',
      reserve2: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
