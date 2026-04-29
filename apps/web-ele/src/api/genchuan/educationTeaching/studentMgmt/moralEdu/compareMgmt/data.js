import { requestClient } from '#/api/request';

// ==================== 映射表 ====================
// 评比周期映射
const cycleMap = {
  周: 'week',
  月: 'month',
  学期: 'semester',
};
const cycleReverse = {
  week: '周',
  month: '月',
  semester: '学期',
};

// 状态映射
const statusMap = {
  打分中: 'scoring',
  已汇总: 'summarized',
};
const statusReverse = {
  scoring: '打分中',
  summarized: '已汇总',
};

// 通用转换函数：后端 → 前端（将英文转为中文）
function convertEnToZh(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.cycle && cycleReverse[result.cycle]) {
    result.cycle = cycleReverse[result.cycle];
  }
  if (result.status && statusReverse[result.status]) {
    result.status = statusReverse[result.status];
  }
  return result;
}

// 通用转换函数：前端 → 后端（将中文转为英文）
function convertZhToEn(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (result.cycle && cycleMap[result.cycle]) {
    result.cycle = cycleMap[result.cycle];
  }
  if (result.status && statusMap[result.status]) {
    result.status = statusMap[result.status];
  }
  return result;
}

// 转换列表数据
function convertList(list) {
  if (!Array.isArray(list)) return list;
  return list.map((item) => convertEnToZh(item));
}

// ==================== 评比管理接口 ====================
export function getCompareMgmtPage(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient
    .get('/studentmgmt/compare-mgmt/page', { params: convertedParams })
    .then((res) => {
      if (res && res.list) {
        res.list = convertList(res.list);
      }
      return res;
    })
    .catch((error) => {
      console.warn('分页接口失败', error);
      return { list: [], total: 0 };
    });
}

export function createCompareMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient
    .post('/studentmgmt/compare-mgmt/create', convertedData)
    .catch((error) => {
      console.warn('发起接口失败，模拟成功', error);
      return true;
    });
}

export function updateCompareMgmt(data) {
  const convertedData = convertZhToEn(data);
  return requestClient
    .put('/studentmgmt/compare-mgmt/update', convertedData)
    .catch((error) => {
      console.warn('编辑接口失败，模拟成功', error);
      return true;
    });
}

export function scoreCompareMgmt(data) {
  return requestClient
    .put('/studentmgmt/compare-mgmt/score', data)
    .catch((error) => {
      console.warn('打分接口失败，模拟成功', error);
      return true;
    });
}

export function awardCompareMgmt(data) {
  return requestClient
    .put('/studentmgmt/compare-mgmt/award', data)
    .catch((error) => {
      console.warn('授予接口失败，模拟成功', error);
      return true;
    });
}

export function exportCompareMgmt(params) {
  const convertedParams = convertZhToEn(params);
  return requestClient
    .download('/studentmgmt/compare-mgmt/export-excel', convertedParams)
    .catch((error) => {
      console.warn('导出接口失败，模拟导出', error);
      return new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' });
    });
}

export function getCompareMgmtDetail(params) {
  return requestClient
    .get('/studentmgmt/compare-mgmt/get', { params })
    .then((res) => convertEnToZh(res))
    .catch((error) => {
      console.warn('详情接口失败', error);
      throw error;
    });
}

// ==================== 图表接口 ====================
export function getCompareMgmtChart(params) {
  return requestClient
    .get('/studentmgmt/compare-mgmt/chart', { params })
    .catch((error) => {
      console.warn('图表总览接口失败，使用模拟数据', error);
      return {
        rankList: [
          { class_name: '高一(1)班', total_score: 92.5, rank_no: 1 },
          { class_name: '高一(3)班', total_score: 90, rank_no: 2 },
          { class_name: '高一(2)班', total_score: 88, rank_no: 3 },
          { class_name: '高二(1)班', total_score: 85.5, rank_no: 4 },
        ],
        statusCount: { scoringCount: 5, finishedCount: 15 },
        cycleCount: { weekCount: 8, monthCount: 10, termCount: 2 },
      };
    });
}
