import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 信用配置 VO
export type CreditConfigVO = {
  createTime?: string;
  creator?: string;
  effectTime?: string;
  id?: number;
  levelThreshold: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  ruleDesc: string;
  status: string;
  updateTime?: string;
};

// 信用配置分页请求
export type CreditConfigPageReqVO = PageParam & {
  effectTime?: string;
  levelThreshold?: string;
  remark?: string;
  ruleDesc?: string;
  status?: string;
};

export type CreditConfigSaveReqVO = CreditConfigVO & {
  id?: number;
};

export type CreditConfigOperateReqVO = {
  ids: number[];
};

export type CreditConfigChartReqVO = {
  timeRange?: string;
};

export type CreditConfigChartVO = {
  configTypeDistribution: Array<{
    count: number;
    type: string;
  }>;
  creditScoreAccuracy: number;
  effectConfigCount: number;
};

// 信用配置 API
export const CreditConfigApi = {
  getCreditConfigPage: async (params: CreditConfigPageReqVO) => {
    return await requestClient.get<PageResult<CreditConfigVO>>(
      '/usermerchant/credit-config/page',
      { params },
    );
  },

  getCreditConfig: async (id: number) => {
    return await requestClient.get<CreditConfigVO>(
      '/usermerchant/credit-config/get',
      {
        params: { id },
      },
    );
  },

  createCreditConfig: async (data: CreditConfigVO) => {
    return await requestClient.post('/usermerchant/credit-config/create', data);
  },

  saveCreditConfig: async (data: CreditConfigSaveReqVO) => {
    return await requestClient.post('/usermerchant/credit-config/save', data);
  },

  updateCreditConfig: async (data: CreditConfigVO) => {
    return await requestClient.put('/usermerchant/credit-config/update', data);
  },

  enableCreditConfig: async (data: CreditConfigOperateReqVO) => {
    return await requestClient.put('/usermerchant/credit-config/enable', data);
  },

  disableCreditConfig: async (data: CreditConfigOperateReqVO) => {
    return await requestClient.put('/usermerchant/credit-config/disable', data);
  },

  getCreditConfigChart: async (params?: CreditConfigChartReqVO) => {
    return await requestClient.get<CreditConfigChartVO>(
      '/usermerchant/credit-config/chart',
      { params },
    );
  },
};
