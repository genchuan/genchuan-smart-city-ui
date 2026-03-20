import { requestClient } from '#/api/request';

// 部件信息 VO
export type ComponentInformationVO = {
  administrativeDepartment: string; // 管理部门
  belongingRegion: string; // 所属区域
  componentName: string; // 部件名称
  componentStatus: string; // 部件状态
  constructionDate: string; // 建设日期
  contactNumber: string; // 联系电话
  id: number; // 主键
  installationPosition: string; // 安装位置
  latitudeLongitude: string; // 经纬度坐标
  maintenanceUnit: string; // 维护单位
  partNumber: string; // 部件编号
  partType: string; // 部件类型
  relatedEventRecords: string; // 关联事件记录
  serviceLife: string; // 使用寿命
  specificationAndModel: string; // 设备图片
};

// 部件信息 API
export const ComponentInformationApi = {
  // 查询部件信息分页
  getComponentInformationPage: async (params: any) => {
    return await requestClient.get(`/smartcity/component-information/page`, {
      params,
    });
  },

  // 查询部件信息详情
  getComponentInformation: async (id: number) => {
    return await requestClient.get(`/smartcity/component-information/get`, {
      params: { id },
    });
  },

  // 新增部件信息
  createComponentInformation: async (data: any) => {
    return await requestClient.post(
      `/smartcity/component-information/create`,
      data,
    );
  },

  // 修改部件信息
  updateComponentInformation: async (data: any) => {
    return await requestClient.put(
      `/smartcity/component-information/update`,
      data,
    );
  },

  // 删除部件信息
  deleteComponentInformation: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/component-information/delete`,
      { params: { id } },
    );
  },

  // 导出部件信息 Excel
  exportComponentInformation: async (params) => {
    return await requestClient.download(
      `/smartcity/component-information/export-excel`,
      params,
    );
  },
};
