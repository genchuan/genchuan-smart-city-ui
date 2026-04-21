import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 资助类型映射（aidType）
const aidTypeMap = {
  '奖学金': '1',
  '助学金': '2',
  '助学贷款': '3',
  '勤工俭学': '4'
};
const aidTypeReverse = {
  '1': '奖学金',
  '2': '助学金',
  '3': '助学贷款',
  '4': '勤工俭学'
};

// 状态映射（status）
const statusMap = {
  '待审核': '0',
  '已通过': '1',
  '已完成': '2'
};
const statusReverse = {
  '0': '待审核',
  '1': '已通过',
  '2': '已完成'
};

// 流程状态映射（processStatus）
const processStatusMap = {
  '跟进中': '1',
  '已完成': '2'
};
const processStatusReverse = {
  '1': '跟进中',
  '2': '已完成'
};

// 通用转换函数：后端 → 前端（将数字/代码转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.aidType && aidTypeReverse[result.aidType]) {
    result.aidType = aidTypeReverse[result.aidType];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  if (result.processStatus && processStatusReverse[result.processStatus]) {
    result.processStatus = processStatusReverse[result.processStatus];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为数字/代码）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.aidType && aidTypeMap[result.aidType]) {
    result.aidType = aidTypeMap[result.aidType];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  if (result.processStatus && processStatusMap[result.processStatus]) {
    result.processStatus = processStatusMap[result.processStatus];
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 奖助勤贷接口 ====================
export function getAidWorkPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/aid-work/page', { params: convertedParams })
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

export function createAidWork(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/aid-work/create', convertedData).catch(err => {
    console.warn('申报接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateAidWork(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/aid-work/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function auditAidWork(data) {
  return requestClient.put('/studentmgmt/aid-work/audit', data).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function followAidWork(data) {
  // 跟进接口需要转换 processStatus 字段
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/aid-work/follow', convertedData).catch(err => {
    console.warn('跟进接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportAidWork(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/aid-work/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getAidWorkDetail(params) {
  return requestClient.get('/studentmgmt/aid-work/get', { params })
    .then(res => convertEnToZh(res))
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = dataList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(convertEnToZh(detail));
    });
}

// 获取学生选项（无需转换）
export function getStudentOptions(params) {
  return requestClient.get('/studentmgmt/student/options', { params }).catch(err => {
    console.warn('获取学生选项失败，使用模拟数据', err);
    return Promise.resolve([
      { label: '张三', value: 1 },
      { label: '李四', value: 2 },
      { label: '王五', value: 3 },
      { label: '赵六', value: 4 },
      { label: '孙七', value: 5 },
      { label: '周八', value: 6 },
    ]);
  });
}

// ==================== 图表接口 ====================
// 图表接口暂不处理映射（因未提供后端数据结构），如有需要可参照添加
export function getAidWorkChart(params) {
  return requestClient.get('/studentmgmt/aid-work/chart', { params }).catch(err => {
    console.warn('奖助勤贷看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalApplyCount: 256,
      totalPassCount: 198,
      totalApplyAmount: 768000.00,
      totalGrantAmount: 594000.00,
      statusCountMap: {
        '待审核': 32,
        '已通过': 198,
        '已完成': 26,
      },
      typeCountMap: {
        '奖学金': 86,
        '助学金': 102,
        '助学贷款': 48,
        '勤工俭学': 20,
      },
    });
  });
}

export function getApplyCount(params) {
  return requestClient.get('/studentmgmt/aid-work/chart/applyCount', { params }).catch(err => {
    console.warn('申请人数统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      list: [
        { type: 'scholarship', name: '奖学金', applyCount: 86, finishCount: 78, finishRate: 90.70 },
        { type: 'grant', name: '助学金', applyCount: 102, finishCount: 92, finishRate: 90.20 },
        { type: 'loan', name: '助学贷款', applyCount: 48, finishCount: 42, finishRate: 87.50 },
        { type: 'workStudy', name: '勤工俭学', applyCount: 20, finishCount: 18, finishRate: 90.00 },
      ],
    });
  });
}

// 模拟数据（原始值使用数字/代码，通过转换函数对外提供中文）
export const dataList = () => {
  return [
    {
      id: 1,
      studentId: 1,
      studentName: '张三',
      className: '计算机科学与技术1班',
      aidType: '1',
      applyAmount: 5000.00,
      applyTime: 1672531200000,
      auditUser: null,
      auditTime: null,
      processStatus: '1',
      status: '0',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672531200000,
      updateTime: 1672531200000,
    },
    {
      id: 2,
      studentId: 2,
      studentName: '李四',
      className: '软件工程1班',
      aidType: '2',
      applyAmount: 3000.00,
      applyTime: 1672617600000,
      auditUser: '王老师',
      auditTime: 1672650000000,
      processStatus: '1',
      status: '1',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672617600000,
      updateTime: 1672650000000,
    },
    {
      id: 3,
      studentId: 3,
      studentName: '王五',
      className: '计算机科学与技术2班',
      aidType: '3',
      applyAmount: 8000.00,
      applyTime: 1672704000000,
      auditUser: '李老师',
      auditTime: 1672720000000,
      processStatus: '2',
      status: '2',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672720000000,
    },
    {
      id: 4,
      studentId: 4,
      studentName: '赵六',
      className: '电子信息工程1班',
      aidType: '4',
      applyAmount: 1500.00,
      applyTime: 1672790400000,
      auditUser: null,
      auditTime: null,
      processStatus: '1',
      status: '0',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672790400000,
    },
    {
      id: 5,
      studentId: 5,
      studentName: '孙七',
      className: '大数据1班',
      aidType: '1',
      applyAmount: 4500.00,
      applyTime: 1672876800000,
      auditUser: '王老师',
      auditTime: 1672900000000,
      processStatus: '1',
      status: '1',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672900000000,
    },
    {
      id: 6,
      studentId: 6,
      studentName: '周八',
      className: '软件工程2班',
      aidType: '2',
      applyAmount: 3500.00,
      applyTime: 1672963200000,
      auditUser: null,
      auditTime: null,
      processStatus: '1',
      status: '0',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1672963200000,
    },
  ];
};
