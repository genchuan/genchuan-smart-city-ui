import request from '@/config/axios';

// 责任单位及责任人管理 VO
export interface ResponsibilityManagementVO {
  id: number; // 序号
  responsibilityType: string; // 责任类型(主体责任/监管责任/运行管理责任)
  responsibleUnit: string; // 责任单位
  responsiblePerson: string; // 责任人姓名
  position: string; // 职务
  contactInfo: string; // 联系方式
  responsibilityScope: string; // 责任范围
}

// 责任单位及责任人管理 API
export const ResponsibilityManagementApi = {
  // 查询责任单位及责任人管理分页
  getResponsibilityManagementPage: async (params: any) => {
    return await request.get({
      url: `/waterdetection/responsibility-management/page`,
      params,
    });
  },

  // 查询责任单位及责任人管理详情
  getResponsibilityManagement: async (id: number) => {
    return await request.get({
      url: `/waterdetection/responsibility-management/get?id=${id}`,
    });
  },

  // 新增责任单位及责任人管理
  createResponsibilityManagement: async (data: ResponsibilityManagementVO) => {
    return await request.post({
      url: `/waterdetection/responsibility-management/create`,
      data,
    });
  },

  // 修改责任单位及责任人管理
  updateResponsibilityManagement: async (data: ResponsibilityManagementVO) => {
    return await request.put({
      url: `/waterdetection/responsibility-management/update`,
      data,
    });
  },

  // 删除责任单位及责任人管理
  deleteResponsibilityManagement: async (id: number) => {
    return await request.delete({
      url: `/waterdetection/responsibility-management/delete?id=${id}`,
    });
  },

  // 导出责任单位及责任人管理 Excel
  exportResponsibilityManagement: async (params) => {
    return await request.download({
      url: `/waterdetection/responsibility-management/export-excel`,
      params,
    });
  },
};
