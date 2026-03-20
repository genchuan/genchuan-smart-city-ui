import { requestClient } from '#/api/request';

// 违建上报 VO
export type ReportOfIllegalConstructionsVO = {
  constructionIsLocated: string; // 违建所在区域
  contactReporter: string; // 上报人联系方式
  detailedAddressConstruction: string; // 违建详细地址
  id: number; // 主键
  reportNumber: string; // 上报编号
  reportperson: string; // 上报人
  reportTime: Date; // 上报时间
};

// 违建上报 API
export const ReportOfIllegalConstructionsApi = {
  // 查询违建上报分页
  getReportOfIllegalConstructionsPage: async (params: any) => {
    return await requestClient.get(
      `/smartcity/report-of-illegal-constructions/page`,
      { params },
    );
  },

  // 查询违建上报详情
  getReportOfIllegalConstructions: async (id: number) => {
    return await requestClient.get(
      `/smartcity/report-of-illegal-constructions/get`,
      { params: { id } },
    );
  },

  // 新增违建上报
  createReportOfIllegalConstructions: async (data: any) => {
    return await requestClient.post(
      `/smartcity/report-of-illegal-constructions/create`,
      data,
    );
  },

  // 修改违建上报
  updateReportOfIllegalConstructions: async (data: any) => {
    return await requestClient.put(
      `/smartcity/report-of-illegal-constructions/update`,
      data,
    );
  },

  // 删除违建上报
  deleteReportOfIllegalConstructions: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/report-of-illegal-constructions/delete`,
      { params: { id } },
    );
  },

  // 导出违建上报 Excel
  exportReportOfIllegalConstructions: async (params) => {
    return await requestClient.download(
      `/smartcity/report-of-illegal-constructions/export-excel`,
      params,
    );
  },
};
