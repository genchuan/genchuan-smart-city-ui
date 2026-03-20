import { requestClient } from '#/api/request.js';

/** 分页查询（全部/启用/停用） */
export function getAllPage(params) {
  return requestClient.get('/evaluate/index-system/allpage', { params });
}

/** 获取状态统计数据（用于 tabs 计数） */
export function getStatusCount() {
  return requestClient.get('/evaluate/index-system/status-count');
}

/** 更新指标体系（仅基本信息） */
export function updateIndexSystem(data) {
  return requestClient.put('/evaluate/index-system/update', data);
}

/** 删除指标体系 */
export function deleteIndexSystem(id) {
  return requestClient.delete(`/evaluate/index-system/delete?id=${id}`);
}

/** 查询指标体系详情（树形结构） */
export function getIndexSystemDetail(id) {
  return requestClient.get(`evaluate/index-system/detail/${id}`);
}

/** 获取指标体系概览数据（用于图表） */
export function getOverview() {
  return requestClient.get('/evaluate/index-system/overview');
}

/** 导出 Excel（后端生成） */
export function exportIndexSystem(params) {
  return requestClient.get('/evaluate/index-system/export-excel', {
    params,
    responseType: 'blob',
  });
}

// ========== 字典接口 ==========
// /** 获取指标类型列表（字典），返回 { value, label }[] */
// export async function getIndexTypeList() {
//   const res = await requestClient.get('/evaluate/index-type/page', {
//     params: { pageNo: 1, pageSize: 100 },
//   });
//   const list = res.data?.list || res.list || [];
//   return list.map(item => ({
//     value: item.typeId || item.id,
//     label: item.name,
//   }));
// }



// ========== 完整保存接口 ==========
/** 保存完整的指标体系（包含分类与指标项） */
export function saveFullIndexSystem(data) {
  return requestClient.post('/evaluate/index-system/save-full', data);
}

/** 获取对象类型列表（返回下拉选项格式） */
export function getObjectTypeSimpleList() {
  return requestClient.get('/evaluate/object-type/simple-list');
}

/** 获取状态列表（返回下拉选项格式） */
export function getStatusSimpleList() {
  return requestClient.get('/evaluate/status/page', { params: { pageNo: 1, pageSize: 100 } }).then(res => {
    const list = res.list || res.data?.list || [];
    return list.map(item => ({
      value: item.statusId,
      label: item.name,
    }));
  });
}

/** 获取评价规则列表（用于下拉选择），可传入查询参数，如 status、systemId 等 */
export async function getRuleList(params = {}) {
  const pageSize = 200;
  let pageNo = 1;
  let allList = [];
  let hasMore = true;
  const maxLoop = 100; // 防止无限循环

  while (hasMore && pageNo <= maxLoop) {
    const queryParams = {
      pageNo,
      pageSize,
      ...params,
    };
    try {
      const res = await requestClient.get('/evaluate/comment-rule/page', { params: queryParams });
      const pageData = res.data || {};
      const list = pageData.list || [];
      allList = allList.concat(list);
      if (list.length < pageSize) {
        hasMore = false;
      } else {
        pageNo++;
      }
    } catch (error) {
      console.error('获取规则列表失败', error);
      hasMore = false;
    }
  }

  return allList.map(item => ({
    value: item.id,
    label: item.ruleName,
  }));
}
