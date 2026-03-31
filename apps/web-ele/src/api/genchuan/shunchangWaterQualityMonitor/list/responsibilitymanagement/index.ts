import { requestClient } from '#/api/request';

// 责任单位及责任人管理 VO
export type ResponsibilityManagementVO = {
  contactInfo: string; // 联系方式
  id: number; // 序号
  position: string; // 职务
  responsibilityScope: string; // 责任范围
  responsibilityType: string; // 责任类型(主体责任/监管责任/运行管理责任)
  responsiblePerson: string; // 责任人姓名
  responsibleUnit: string; // 责任单位
};

// 责任单位及责任人管理 API
export const ResponsibilityManagementApi = {
  // 查询责任单位及责任人管理分页
  getResponsibilityManagementPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/responsibility-management/page`,
      { params },
    );
  },

  // 查询责任单位及责任人管理详情
  getResponsibilityManagement: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/responsibility-management/get`,
      { params: { id } },
    );
  },

  // 新增责任单位及责任人管理
  createResponsibilityManagement: async (data: ResponsibilityManagementVO) => {
    return await requestClient.post(
      `/waterdetection/responsibility-management/create`,
      data,
    );
  },

  // 修改责任单位及责任人管理
  updateResponsibilityManagement: async (data: ResponsibilityManagementVO) => {
    return await requestClient.put(
      `/waterdetection/responsibility-management/update`,
      data,
    );
  },

  // 删除责任单位及责任人管理
  deleteResponsibilityManagement: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/responsibility-management/delete`,
      { params: { id } },
    );
  },

  // 导出责任单位及责任人管理 Excel
  exportResponsibilityManagement: async (params) => {
    return await requestClient.download(
      `/waterdetection/responsibility-management/export-excel`,
      params,
    );
  },
};
