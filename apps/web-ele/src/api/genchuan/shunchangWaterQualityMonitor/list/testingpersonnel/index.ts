import { requestClient } from '#/api/request';

// 检测人员信息管理 VO
export type TestingPersonnelVO = {
  agencyCode: string; // 所属机构编号
  certificateNo: string; // 资格证书编号
  id: number; // 序号
  position: string; // 职称
  staffName: string; // 姓名
  staffNo: string; // 人员编号
  trainingRecord: string; // 培训记录
};

// 检测人员信息管理 API
export const TestingPersonnelApi = {
  // 查询检测人员信息管理分页
  getTestingPersonnelPage: async (params: any) => {
    return await requestClient.get(`/waterdetection/testing-personnel/page`, {
      params,
    });
  },

  // 查询检测人员信息管理详情
  getTestingPersonnel: async (id: number) => {
    return await requestClient.get(`/waterdetection/testing-personnel/get`, {
      params: { id },
    });
  },

  // 新增检测人员信息管理
  createTestingPersonnel: async (data: TestingPersonnelVO) => {
    return await requestClient.post(
      `/waterdetection/testing-personnel/create`,
      data,
    );
  },

  // 修改检测人员信息管理
  updateTestingPersonnel: async (data: TestingPersonnelVO) => {
    return await requestClient.put(
      `/waterdetection/testing-personnel/update`,
      data,
    );
  },

  // 删除检测人员信息管理
  deleteTestingPersonnel: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/testing-personnel/delete`,
      { params: { id } },
    );
  },

  // 导出检测人员信息管理 Excel
  exportTestingPersonnel: async (params) => {
    return await requestClient.download(
      `/waterdetection/testing-personnel/export-excel`,
      params,
    );
  },
};
