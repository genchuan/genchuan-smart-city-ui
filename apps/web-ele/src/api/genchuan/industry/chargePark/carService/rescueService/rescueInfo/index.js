import { requestClient } from '#/api/request';

// 分页查询救援信息
export function getRescueInfoPage(params) {
  return requestClient.get('/carservice/rescue-info/page', { params });
}

// 导出救援信息
export function exportRescueInfoExcel(params) {
  return requestClient.download('/carservice/rescue-info/export', params);
}

// 批量派发
export function batchDispatchRescue(data) {
  return requestClient.put('/carservice/rescue-info/batch-dispatch', data);
}

// 单条派发
export function dispatchRescue(data) {
  return requestClient.put('/carservice/rescue-info/dispatch', data);
}

// 认领（id 作为 query 参数）
export function claimRescue(id) {
  return requestClient.put('/carservice/rescue-info/claim', null, { params: { id } });
}

// 更新进度
export function updateRescueProgress(data) {
  return requestClient.put('/carservice/rescue-info/update-progress', data);
}

// 转派
export function transferRescue(data) {
  return requestClient.put('/carservice/rescue-info/transfer', data);
}

// 评价
export function evaluateRescue(data) {
  return requestClient.put('/carservice/rescue-info/evaluate', data);
}

// 归档（id 作为 query 参数）
export function archiveRescue(id) {
  return requestClient.put('/carservice/rescue-info/archive', null, { params: { id } });
}

// 详情
export function getRescueInfoDetail(params) {
  return requestClient.get('/carservice/rescue-info/get', { params });
}

// 救援服务统计看板数据
export function getRescueChartData(params) {
  return requestClient.get('/carservice/rescue-info/chart', { params });
}

// 获取救援人员列表（使用 simple-list 接口）
export async function getRescueUserList() {
  try {
    const res = await requestClient.get('/system/user/simple-list');
    return (res || []).map(user => ({
      userId: user.id,
      userName: user.nickname,
      nickname: user.nickname,
    }));
  } catch {
    return [
      { userId: 2001, userName: '救援张三', nickname: '救援张三' },
      { userId: 2002, userName: '救援李四', nickname: '救援李四' },
    ];
  }
}

// 上传文件
export function uploadFile(file, directory = 'rescue') {
  const formData = new FormData();
  formData.append('file', file);
  if (directory) formData.append('directory', directory);
  return requestClient.post('/infra/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// 获取用户详情
export function getUserDetail(userId) {
  return requestClient.get('/system/user/get', { params: { id: userId } });
}
