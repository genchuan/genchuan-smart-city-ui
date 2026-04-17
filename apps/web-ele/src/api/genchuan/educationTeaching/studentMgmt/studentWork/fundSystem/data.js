import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 资助类型映射
const fundTypeMap = {
  '助学金': '1',
  '勤工俭学': '2',
  '其他': '3'
};
const fundTypeReverse = {
  '1': '助学金',
  '2': '勤工俭学',
  '3': '其他'
};

// 状态映射（待审核、已汇总）
const statusMap = {
  '待审核': '0',
  '已汇总': '1'
};
const statusReverse = {
  '0': '待审核',
  '1': '已汇总'
};

// 通用转换函数：后端 → 前端（将数字/代码转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.fundType && fundTypeReverse[result.fundType]) {
    result.fundType = fundTypeReverse[result.fundType];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为数字/代码）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.fundType && fundTypeMap[result.fundType]) {
    result.fundType = fundTypeMap[result.fundType];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(item => convertEnToZh(item));
}

// ==================== 资助系统接口 ====================
export function getFundSystemPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.get('/studentmgmt/fund-system/page', { params: convertedParams })
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

export function createFundSystem(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.post('/studentmgmt/fund-system/create', convertedData).catch(err => {
    console.warn('申请接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function updateFundSystem(data) {
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/fund-system/update', convertedData).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function auditFundSystem(data) {
  // 审核接口需要转换 status 字段（前端传“已汇总”转为后端数字“1”）
  const convertedData = convertZhToEn(data);
  return requestClient.put('/studentmgmt/fund-system/audit', convertedData).catch(err => {
    console.warn('审核接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportFundSystem(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient.download('/studentmgmt/fund-system/export-excel', convertedParams).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getFundSystemDetail(params) {
  return requestClient.get('/studentmgmt/fund-system/get', { params })
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
export function getFundSystemChart(params) {
  return requestClient.get('/studentmgmt/fund-system/chart', { params }).catch(err => {
    console.warn('资助看板接口失败，使用模拟数据', err);
    return Promise.resolve({
      totalApplyCount: 128,
      pendingAuditCount: 23,
      totalApplyAmount: 425600.00,
      approvedCount: 105,
      fundTypeDistribution: [
        { name: '助学金', value: 89 },
        { name: '勤工俭学', value: 26 },
        { name: '其他', value: 13 },
      ],
      gradeApplyTrend: [
        { grade: '2022级', count: 45 },
        { grade: '2023级', count: 42 },
        { grade: '2024级', count: 41 },
        { grade: '2025级', count: 38 },
        { grade: '2026级', count: 35 },
      ],
    });
  });
}

export function getFundCount(params) {
  return requestClient.get('/studentmgmt/fund-system/chart/fundCount', { params }).catch(err => {
    console.warn('资助人数统计接口失败，使用模拟数据', err);
    return Promise.resolve({
      gradeStatistics: [
        {
          grade: '2022级',
          fundCount: 45,
          typeDistribution: [
            { name: '助学金', value: 32 },
            { name: '勤工俭学', value: 10 },
            { name: '其他', value: 3 },
          ],
        },
        {
          grade: '2023级',
          fundCount: 42,
          typeDistribution: [
            { name: '助学金', value: 28 },
            { name: '勤工俭学', value: 11 },
            { name: '其他', value: 3 },
          ],
        },
        {
          grade: '2024级',
          fundCount: 41,
          typeDistribution: [
            { name: '助学金', value: 29 },
            { name: '勤工俭学', value: 8 },
            { name: '其他', value: 4 },
          ],
        },
        {
          grade: '2025级',
          fundCount: 38,
          typeDistribution: [
            { name: '助学金', value: 25 },
            { name: '勤工俭学', value: 10 },
            { name: '其他', value: 3 },
          ],
        },
        {
          grade: '2026级',
          fundCount: 35,
          typeDistribution: [
            { name: '助学金', value: 22 },
            { name: '勤工俭学', value: 9 },
            { name: '其他', value: 4 },
          ],
        },
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
      grade: '2022级',
      fundType: '1',
      applyAmount: 3000.00,
      applyTime: 1672531200000,
      auditUser: null,
      auditTime: null,
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
      grade: '2023级',
      fundType: '2',
      applyAmount: 1500.00,
      applyTime: 1672617600000,
      auditUser: '王老师',
      auditTime: 1672650000000,
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
      grade: '2022级',
      fundType: '3',
      applyAmount: 500.00,
      applyTime: 1672704000000,
      auditUser: null,
      auditTime: null,
      status: '0',
      remark: '',
      creator: 'teacher_zhang',
      updater: 'teacher_zhang',
      createTime: 1672704000000,
      updateTime: 1672704000000,
    },
    {
      id: 4,
      studentId: 4,
      studentName: '赵六',
      className: '电子信息工程1班',
      grade: '2024级',
      fundType: '1',
      applyAmount: 2500.00,
      applyTime: 1672790400000,
      auditUser: '李老师',
      auditTime: 1672820000000,
      status: '1',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672790400000,
      updateTime: 1672820000000,
    },
    {
      id: 5,
      studentId: 5,
      studentName: '孙七',
      className: '大数据1班',
      grade: '2025级',
      fundType: '2',
      applyAmount: 1800.00,
      applyTime: 1672876800000,
      auditUser: null,
      auditTime: null,
      status: '0',
      remark: '',
      creator: 'teacher_li',
      updater: 'teacher_li',
      createTime: 1672876800000,
      updateTime: 1672876800000,
    },
    {
      id: 6,
      studentId: 6,
      studentName: '周八',
      className: '软件工程2班',
      grade: '2026级',
      fundType: '1',
      applyAmount: 3000.00,
      applyTime: 1672963200000,
      auditUser: '王老师',
      auditTime: 1673000000000,
      status: '1',
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1672963200000,
      updateTime: 1673000000000,
    },
  ];
};
