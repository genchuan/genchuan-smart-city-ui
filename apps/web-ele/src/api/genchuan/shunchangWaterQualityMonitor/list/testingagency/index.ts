import { requestClient } from '#/api/request';

// 检测机构资质管理 VO
export type TestingAgencyVO = {
  agencyCode: string; // 机构编号
  agencyName: string; // 机构名称
  certificateNo: string; // 资质证书编号
  id: number; // 序号
  issuingAuthority: string; // 发证单位
  testingScope: string; // 检测范围
  validDate: Date; // 有效期至
};

// 检测机构资质管理 API
export const TestingAgencyApi = {
  // 查询检测机构资质管理分页
  getTestingAgencyPage: async (params: any) => {
    return await requestClient.get(`/waterdetection/testing-agency/page`, {
      params,
    });
  },

  // 查询检测机构资质管理详情
  getTestingAgency: async (id: number) => {
    return await requestClient.get(`/waterdetection/testing-agency/get`, {
      params: { id },
    });
  },

  // 新增检测机构资质管理
  createTestingAgency: async (data: TestingAgencyVO) => {
    return await requestClient.post(
      `/waterdetection/testing-agency/create`,
      data,
    );
  },

  // 修改检测机构资质管理
  updateTestingAgency: async (data: TestingAgencyVO) => {
    return await requestClient.put(
      `/waterdetection/testing-agency/update`,
      data,
    );
  },

  // 删除检测机构资质管理
  deleteTestingAgency: async (id: number) => {
    return await requestClient.delete(`/waterdetection/testing-agency/delete`, {
      params: { id },
    });
  },

  // 导出检测机构资质管理 Excel
  exportTestingAgency: async (params) => {
    return await requestClient.download(
      `/waterdetection/testing-agency/export-excel`,
      params,
    );
  },
};
