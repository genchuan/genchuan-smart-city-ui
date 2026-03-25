import { requestClient } from '#/api/request';

// 工程基本信息管理 VO
export type ProjectBasicInfoVO = {
  administrativeRegion: string; // 所属行政区
  commissioningDate: Date; // 投产日期
  designCapacity: string; // 设计供水规模(吨/日)
  id: number; // 序号
  managementUnit: string; // 管理单位
  processType: string; // 工艺类型
  projectCode: string; // 工程编码
  projectName: string; // 工程名称
  projectStatus: string; // 工程状态
};

// 工程基本信息管理 API
export const ProjectBasicInfoApi = {
  // 查询工程基本信息管理分页
  getProjectBasicInfoPage: async (params: any) => {
    return await requestClient.get(`/waterdetection/project-basic-info/page`, {
      params,
    });
  },

  // 查询工程基本信息管理详情
  getProjectBasicInfo: async (id: number) => {
    return await requestClient.get(`/waterdetection/project-basic-info/get`, {
      params: { id },
    });
  },

  // 新增工程基本信息管理
  createProjectBasicInfo: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/project-basic-info/create`,
      data,
    );
  },

  // 修改工程基本信息管理
  updateProjectBasicInfo: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/project-basic-info/update`,
      data,
    );
  },

  // 删除工程基本信息管理
  deleteProjectBasicInfo: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/project-basic-info/delete`,
      { params: { id } },
    );
  },

  // 导出工程基本信息管理 Excel
  exportProjectBasicInfo: async (params) => {
    return await requestClient.download(
      `/waterdetection/project-basic-info/export-excel`,
      params,
    );
  },
};
