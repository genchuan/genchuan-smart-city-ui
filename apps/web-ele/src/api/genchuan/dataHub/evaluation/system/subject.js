// <!-- 文件 1: subject.js (API) -->
import { requestClient } from '#/api/request';

/** 全量联表查询（分页）- 用于列表展示 */
export function getAllPage(params) {
  return requestClient.get('/evaluate/subject/allpage', { params });
}

/** 创建评价主体 */
export function createSubject(data) {
  return requestClient.post('/evaluate/subject/create', data);
}

/** 删除评价主体（按主键 ID） */
export function deleteSubject(id) {
  return requestClient.delete(`/evaluate/subject/delete?id=${id}`);
}

/** 更新编辑评价主体 */
export function updateSubject(data) {
  return requestClient.put('/evaluate/subject/update', data);
}

/** 批量导入评价主体 */
export function importSubjects(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/evaluate/subject/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** 获取状态统计数据（用于 tabs 计数） */
export function getStatusCount() {
  return requestClient.get('/evaluate/subject/status-count');
}

/** 获取评价主体概览数据（用于图表） */
export function getOverview() {
  return requestClient.get('/evaluate/subject/overview');
}

// ========== 下拉选项接口（与后端实际地址对应） ==========

/** 获取用户简单列表（用于联系人、成员、创建人/更新人） */
export function getUserSimpleList() {
  return requestClient.get('/evaluate/user/simple-list');
}

/** 获取主体类型简单列表 */
export function getSubjectTypeSimpleList() {
  return requestClient.get('/evaluate/subject-type/simple-list');
}

/** 获取状态列表（使用分页接口） */
export function getStatusSimpleList() {
  return requestClient.get('/evaluate/status/page', { params: { pageNo: 1, pageSize: 100 } }).then(res => {
    // 转换为下拉选项格式
    return (res.list || []).map(item => ({
      value: item.statusId,
      label: item.name
    }));
  });
}
