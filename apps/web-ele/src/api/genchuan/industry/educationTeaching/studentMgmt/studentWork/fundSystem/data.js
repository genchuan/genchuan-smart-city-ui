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
      console.warn('分页接口失败', err);
      // 分页接口已联调成功，不再使用模拟数据，返回空列表
      return { list: [], total: 0 };
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
      console.warn('详情接口失败', err);
      // 不再使用模拟数据，直接抛出错误让调用方处理
      return Promise.reject(err);
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
  return requestClient.get('/studentmgmt/fund-system/fundCount', { params }).catch(err => {
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
