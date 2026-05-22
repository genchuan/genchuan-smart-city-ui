import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const educationLevelMap = { '中专': '1', '大专': '2', '本科': '3', '研究生': '4' };
const educationLevelReverse = { '1': '中专', '2': '大专', '3': '本科', '4': '研究生' };

const studyFormMap = { '全日制': '1', '非全日制': '2', '函授': '3' };
const studyFormReverse = { '1': '全日制', '2': '非全日制', '3': '函授' };

const studentTypeMap = { '普通生': '1', '特长生': '2', '转学生': '3' };
const studentTypeReverse = { '1': '普通生', '2': '特长生', '3': '转学生' };

const statusMap = { '在籍': '1', '休学': '2', '退学': '3', '异动': '4' };
const statusReverse = { '1': '在籍', '2': '休学', '3': '退学', '4': '异动' };

function formatGrade(grade) {
  if (!grade) return grade;
  if (/^\d{4}$/.test(grade)) return `${grade}级`;
  return grade;
}
function parseGrade(grade) {
  if (!grade) return grade;
  if (grade.endsWith('级')) return grade.slice(0, -1);
  return grade;
}

function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.educationLevel && educationLevelReverse[result.educationLevel])
    result.educationLevel = educationLevelReverse[result.educationLevel];
  if (result.studyForm && studyFormReverse[result.studyForm])
    result.studyForm = studyFormReverse[result.studyForm];
  if (result.studentType && studentTypeReverse[result.studentType])
    result.studentType = studentTypeReverse[result.studentType];
  if (result.status && statusReverse[result.status])
    result.status = statusReverse[result.status];
  if (result.grade) result.grade = formatGrade(result.grade);
  return result;
}

function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.educationLevel && educationLevelMap[result.educationLevel])
    result.educationLevel = educationLevelMap[result.educationLevel];
  if (result.studyForm && studyFormMap[result.studyForm])
    result.studyForm = studyFormMap[result.studyForm];
  if (result.studentType && studentTypeMap[result.studentType])
    result.studentType = studentTypeMap[result.studentType];
  if (result.status && statusMap[result.status])
    result.status = statusMap[result.status];
  if (result.grade) result.grade = parseGrade(result.grade);
  return result;
}

function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 文件上传接口 ====================
export function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/studentmgmt/file/upload-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// ==================== 学生信息接口 ====================
export function getStudentInfoPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/student-info/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) res.list = convertList(res.list);
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败', err);
      return { list: [], total: 0 };
    });
}

export function createStudentInfo(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/student-info/create', convertedData)
}

export function updateStudentInfo(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/student-info/update', convertedData)
}

export function deleteStudentInfo(params) {
  return requestClient.delete('/studentmgmt/student-info/delete', { params })
}

export function deleteStudentInfoList(data) {
  return requestClient.delete('/studentmgmt/student-info/delete-list', { params: data })
}

export function exportStudentInfo(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/student-info/export', convertedParams)
}

export function getStudentInfoDetail(params) {
  return requestClient.get('/studentmgmt/student-info/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败', err);
      return Promise.reject(err);
    });
}

// ==================== 图表接口（保持原样）====================
export function getStudentInfoChart(params) {
  return requestClient.get('/studentmgmt/student-info/chart', { params }).catch(err => {
    console.warn('图表总览接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalStudentCount: 1256,
      inSchoolCount: 1220,
      suspendCount: 15,
      dropOutCount: 9,
      transferCount: 12,
      normalStudentCount: 1100,
      specialStudentCount: 156,
      transferStudentCount: 12
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
      { date: '2025-01', newStudentCount: 45, statusChangeCount: 3 },
      { date: '2025-02', newStudentCount: 12, statusChangeCount: 1 },
      { date: '2025-03', newStudentCount: 8, statusChangeCount: 5 },
    ]);
  });
}
