import { requestClient } from '#/api/request';

// 供水协议管理 VO
export type WaterSupplyAgreementVO = {
  id: number; // 序号
  agreementNo: string; // 协议编号
  supplierName: string; // 供水单位
  consumerName: string; // 用水方
  supplyScope: string; // 供水范围
  waterPriceStandard: string; // 水价标准
  responsibilityTerms: string; // 责任条款
  signDate: Date; // 签订日期
  validDate: Date; // 有效期至
};

// 供水协议管理 API
export const WaterSupplyAgreementApi = {
  // 查询供水协议管理分页
  getWaterSupplyAgreementPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/water-supply-agreement/page`,
      { params },
    );
  },

  // 查询供水协议管理详情
  getWaterSupplyAgreement: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/water-supply-agreement/get`,
      { params: { id } },
    );
  },

  // 新增供水协议管理
  createWaterSupplyAgreement: async (data: WaterSupplyAgreementVO) => {
    return await requestClient.post(
      `/waterdetection/water-supply-agreement/create`,
      data,
    );
  },

  // 修改供水协议管理
  updateWaterSupplyAgreement: async (data: WaterSupplyAgreementVO) => {
    return await requestClient.put(
      `/waterdetection/water-supply-agreement/update`,
      data,
    );
  },

  // 删除供水协议管理
  deleteWaterSupplyAgreement: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/water-supply-agreement/delete`,
      { params: { id } },
    );
  },

  // 导出供水协议管理 Excel
  exportWaterSupplyAgreement: async (params) => {
    return await requestClient.download(
      `/waterdetection/water-supply-agreement/export-excel`,
      params,
    );
  },
};
