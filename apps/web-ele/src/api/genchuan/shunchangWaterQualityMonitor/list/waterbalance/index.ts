import { requestClient } from '#/api/request';

// 水量平衡与漏损分析 VO
export type WaterBalanceVO = {
  id: number; // 序号
  isExceeded: boolean; // 是否超标(0否1是)
  leakageRate: number; // 漏损率(%)
  leakageVolume: number; // 漏损量(立方米)
  partitionId: string; // 分区ID
  reasonableLoss: number; // 合理损耗量(立方米)
  salesVolume: number; // 售水量(立方米)
  statisticsDate: Date; // 统计日期
  statisticsPeriod: string; // 统计周期(日/月/年)
  supplyVolume: number; // 供水量(立方米)
};

// 水量平衡与漏损分析 API
export const WaterBalanceApi = {
  // 查询水量平衡与漏损分析分页
  getWaterBalancePage: async (params: any) => {
    return await requestClient.get(`/waterdetection/water-balance/page`, {
      params,
    });
  },

  // 查询水量平衡与漏损分析详情
  getWaterBalance: async (id: number) => {
    return await requestClient.get(`/waterdetection/water-balance/get`, {
      params: { id },
    });
  },

  // 新增水量平衡与漏损分析
  createWaterBalance: async (data: WaterBalanceVO) => {
    return await requestClient.post(
      `/waterdetection/water-balance/create`,
      data,
    );
  },

  // 修改水量平衡与漏损分析
  updateWaterBalance: async (data: WaterBalanceVO) => {
    return await requestClient.put(
      `/waterdetection/water-balance/update`,
      data,
    );
  },

  // 删除水量平衡与漏损分析
  deleteWaterBalance: async (id: number) => {
    return await requestClient.delete(`/waterdetection/water-balance/delete`, {
      params: { id },
    });
  },

  // 导出水量平衡与漏损分析 Excel
  exportWaterBalance: async (params) => {
    return await requestClient.download(
      `/waterdetection/water-balance/export-excel`,
      params,
    );
  },
};
