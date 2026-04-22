import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
const schoolTypeMap = {
  '公办': 'public',
  '民办': 'private'
};
const schoolTypeReverseMap = {
  'public': '公办',
  'private': '民办'
};

const statusMap = {
  '待规划': 'pending_plan',
  '已规划': 'planned'
};
const statusReverseMap = {
  'pending_plan': '待规划',
  'planned': '已规划'
};

// 响应数据：英文 → 中文
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.schoolType && schoolTypeReverseMap[result.schoolType]) {
    result.schoolType = schoolTypeReverseMap[result.schoolType];
  }
  if (result.status && statusReverseMap[result.status]) {
    result.status = statusReverseMap[result.status];
  }
  return result;
}

// 请求参数：中文 → 英文
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.schoolType && schoolTypeMap[result.schoolType]) {
    result.schoolType = schoolTypeMap[result.schoolType];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  return result;
}

// 转换列表
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 升学管理接口 ====================

// 分页查询
export function getStudyUpPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/study-up/page', { params: convertedParams })
    .then(res => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = convertList(getMockList());
      return { list: mock, total: mock.length };
    });
}

// 选择（目标院校）
export function selectStudyUp(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/study-up/select', convertedData).catch(err => {
    console.warn('选择接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 规划
export function planStudyUp(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/study-up/plan', convertedData).catch(err => {
    console.warn('规划接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 记录（跟踪）
export function recordStudyUp(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/study-up/record', convertedData).catch(err => {
    console.warn('记录接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 导出
export function exportStudyUp(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/study-up/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

// 详情
export function getStudyUpDetail(params) {
  return requestClient.get('/studentmgmt/study-up/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// 学生升学统计看板（卡片 + 柱状图）
export function getStudyUpChart(params) {
  return requestClient.get('/studentmgmt/study-up/chart', { params }).catch(err => {
    console.warn('看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalStudent: 128,
      waitPlanStudent: 32,
      plannedStudent: 96,
      schoolTopCount: [
        { schoolName: '福建师范大学', count: 28 },
        { schoolName: '华侨大学', count: 22 },
        { schoolName: '福州大学', count: 18 },
        { schoolName: '其他', count: 60 },
      ],
    });
  });
}

// 升学意向 / 院校选择统计（饼图）
export function getStudyUpCount(params) {
  return requestClient.get('/studentmgmt/study-up/chart/studyCount', { params }).catch(err => {
    console.warn('统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      intentionDistribution: [
        { name: '专升本', value: 86 },
        { name: '考研', value: 32 },
        { name: '其他', value: 10 },
      ],
      schoolTypeDistribution: [
        { name: '公办', value: 92 },
        { name: '民办', value: 36 },
      ],
    });
  });
}

// 模拟数据（原始值使用英文）
export const getMockList = () => {
  return [
    {
      id: 1,
      studentId: 1001,
      studentName: '张三',
      schoolName: '福建师范大学',
      schoolType: 'public',
      major: '计算机科学与技术',
      planContent: '重点复习高数、英语，参加专升本集训',
      planTime: 1735689600000,
      recordTime: 1735776000000,
      status: 'planned',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1735603200000,
      updateTime: 1735689600000,
    },
    {
      id: 2,
      studentId: 1002,
      studentName: '李四',
      schoolName: null,
      schoolType: null,
      major: null,
      planContent: null,
      planTime: null,
      recordTime: null,
      status: 'pending_plan',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1735603200000,
      updateTime: 1735603200000,
    },
    {
      id: 3,
      studentId: 1003,
      studentName: '王五',
      schoolName: '华侨大学',
      schoolType: 'public',
      major: '机械工程',
      planContent: '备考研究生，目标华大机电学院',
      planTime: 1738281600000,
      recordTime: 1738368000000,
      status: 'planned',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1738195200000,
      updateTime: 1738281600000,
    },
    {
      id: 4,
      studentId: 1004,
      studentName: '赵六',
      schoolName: null,
      schoolType: null,
      major: null,
      planContent: null,
      planTime: null,
      recordTime: null,
      status: 'pending_plan',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1738195200000,
      updateTime: 1738195200000,
    },
    {
      id: 5,
      studentId: 1005,
      studentName: '孙七',
      schoolName: '厦门大学',
      schoolType: 'public',
      major: '会计学',
      planContent: '准备考研，英语和专业课需加强',
      planTime: 1738886400000,
      recordTime: 1738972800000,
      status: 'planned',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1738800000000,
      updateTime: 1738886400000,
    },
  ];
};
