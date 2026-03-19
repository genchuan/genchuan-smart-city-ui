import { requestClient } from '#/api/request';

// 排水许可证申请 VO
export type DrainagePermitApplyVO = {
  applyNo: string; // 申请编号
  applyStatus: string; // 申请状态
  approveComment: string; // 审核意见
  approver: string; // 审核人
  approveTime: Date; // 审核时间
  dailyDrainage: number; // 日均排水量（吨）
  id: number; // ID
  pollutionProof: string; // 重点排污单位证明文件路径
  userName: string; // 排水户名称
  violationHistory: string; // 历史违规记录
  waterQualityReport: string; // 排水水质检测报告文件
};

// 排水许可证申请 API
export const DrainagePermitApplyApi = {
  // 查询排水许可证申请分页
  getDrainagePermitApplyPage: async (params: any) => {
    return await requestClient.get(`/smartcity/drainage-permit-apply/page`, {
      params,
    });
  },

  // 查询排水许可证申请详情
  getDrainagePermitApply: async (id: number) => {
    return await requestClient.get(`/smartcity/drainage-permit-apply/get`, {
      params: { id },
    });
  },

  // 新增排水许可证申请
  createDrainagePermitApply: async (data: any) => {
    return await requestClient.post(
      `/smartcity/drainage-permit-apply/create`,
      data,
    );
  },

  // 修改排水许可证申请
  updateDrainagePermitApply: async (data: any) => {
    return await requestClient.put(
      `/smartcity/drainage-permit-apply/update`,
      data,
    );
  },

  // 删除排水许可证申请
  deleteDrainagePermitApply: async (id: number) => {
    return await requestClient.delete(
      `/smartcity/drainage-permit-apply/delete`,
      { params: { id } },
    );
  },

  // 导出排水许可证申请 Excel
  exportDrainagePermitApply: async (params) => {
    return await requestClient.download(
      `/smartcity/drainage-permit-apply/export-excel`,
      params,
    );
  },

  // 上传排水水质检测报告文件
  uploadWaterQualityReport: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return await requestClient.post(
      `/smartcity/drainage-permit-apply/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },
};
