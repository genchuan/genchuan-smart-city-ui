import { requestClient } from '#/api/request';

// ==================== 学籍档案管理接口 ====================

// 分页查询
export function getStudentArchivePage(params) {
  return requestClient.get('/smartcampus/student-archive/page', { params })
    .then(res => res)
    .catch(err => {
      console.warn('分页接口失败', err);
      return { list: [], total: 0 };
    });
}

// 新增
export function createStudentArchive(data) {
  return requestClient.post('/smartcampus/student-archive/create', data);
}

// 编辑
export function updateStudentArchive(data) {
  return requestClient.put('/smartcampus/student-archive/update', data);
}

// 审核（批量）
export function auditStudentArchive(data) {
  const params = new URLSearchParams();
  // ids 转换为逗号分隔的字符串
  if (data.ids && Array.isArray(data.ids)) {
    params.append('ids', data.ids.join(','));
  } else if (data.ids) {
    params.append('ids', data.ids);
  }
  if (data.processStatus !== undefined && data.processStatus !== null) {
    params.append('processStatus', data.processStatus);
  }
  if (data.rejectReason) {
    params.append('rejectReason', data.rejectReason);
  }
  return requestClient.put('/smartcampus/student-archive/audit', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

// 维护（学籍状态变更）
export function maintainStudentArchive(data) {
  return requestClient.put('/smartcampus/student-archive/maintain', data);
}

// 导出（批量）
export function exportStudentArchive(params) {
  return requestClient.download('/smartcampus/student-archive/export-excel', params);
}

// 详情
export function getStudentArchiveDetail(params) {
  return requestClient.get('/smartcampus/student-archive/get', { params })
    .catch(err => {
      console.warn('详情接口失败', err);
      return Promise.reject(err);
    });
}

// 批量导入（待实现）
export function importStudentArchive(file) {
  return Promise.reject(new Error('接口待实现'));
}

// ==================== 图表接口（真实后端） ====================
// 卡片统计数据
export function getStudentArchiveCard() {
  return requestClient.get('/smartcampus/student-archive/statistic/card').catch(err => {
    console.warn('卡片接口失败', err);
    // 返回空数据，避免前端报错
    return {
      studentTotal: 0,
      inStudentTotal: 0,
      suspendStudentTotal: 0,
      quitStudentTotal: 0,
      changeStudentTotal: 0,
      studentTotalYoy: 0,
      inStudentTotalYoy: 0,
    };
  });
}

// 饼图 + 折线图数据
export function getStudentArchiveChart() {
  return requestClient.get('/smartcampus/student-archive/statistic/chart').catch(err => {
    console.warn('图表接口失败', err);
    return {
      statusPieList: [],
      changeTrendList: [],
    };
  });
}
