import { requestClient } from '#/api/request';
import { getRefreshToken } from '#/utils/genchuan/auth';

// 外检统计水质检测结果汇总 VO
export type WaterSampleTestSummaryVO = {
  aluminum: number; // 铝(mg/L)
  ammoniaN: string; // 氨(以N计)(mg/L)
  arsenic: string; // 砷(mg/L)
  bromoform: string; // 三溴甲烷(mg/L)
  cadmium: string; // 镉(mg/L)
  chlorate: string; // 氯酸盐(mg/L)
  chloride: string; // 氯化物(mg/L)
  chlorineDioxide: string; // 二氧化氯(mg/L)
  chlorite: string; // 亚氯酸盐(mg/L)
  chloroform: string; // 三氯甲烷(mg/L)
  chromium: string; // 铬(六价)(mg/L)
  clientName: string; // 委托单位
  colorDegree: number; // 色度(度)
  copper: string; // 铜(mg/L)
  createTime: Date; // 检测日期
  cyanide: string; // 氰化物(mg/L)
  dibromochloromethane: string; // 一氯二溴甲烷(mg/L)
  dichloroaceticAcid: string; // 二氯乙酸(mg/L)
  dichlorobromomethane: string; // 二氯一溴甲烷(mg/L)
  dissolvedSolids: number; // 溶解性总固体(mg/L)
  escherichiaColi: string; // 大肠埃希氏菌(CFU/100mL)
  fluoride: string; // 氟化物(mg/L)
  id: number; // 序号
  iron: number; // 铁(mg/L)
  lead: string; // 铅(mg/L)
  manganese: number; // 锰(mg/L)
  mercury: number; // 汞(mg/L)
  nitrateN: string; // 硝酸盐(以N计)(mg/L)
  odourTaste: string; // 臭和味
  permanganateIndex: number; // 高锰酸盐指数(以O2计)(mg/L)
  phValue: number; // pH值
  receiveDate: Date; // 收样日期
  sampleName: string; // 样品名称
  sampleNo: string; // 样品编号
  samplingLocation: string; // 采样地点
  sulfate: string; // 硫酸盐(mg/L)
  totalAlphaRadioactivity: string; // 总α放射性(Bq/L)
  totalBacteriaCount: number; // 菌落总数(CFU/mL)
  totalBetaRadioactivity: string; // 总β放射性(Bq/L)
  totalColiform: string; // 总大肠菌群(CFU/100mL)
  totalHardness: number; // 总硬度(以CaCO3计)(mg/L)
  trichloroaceticAcid: string; // 三氯乙酸(mg/L)
  trihalomethanes: string; // 三卤甲烷
  turbidity: number; // 浑浊度(NTU)
  visibleObject: string; // 肉眼可见物
  zinc: number; // 锌(mg/L)
};

export type JmReportParams = {
  base64Arry?: string[]; // 可选：Base64资源数组（无图片时传空数组或undefined）
  excelConfigId: string; // 必传：报表导出配置唯一ID（从积木报表平台获取）
  fileName?: string; // 可选：导出文件名（后端可覆盖，前端用于预定义）
  queryParam: {
    // 必传：查询参数（无需序列化，后端直接解析JSON对象）
    SAMPLE_NO?: string; // 样品编号
  };
};

// 外检统计水质检测结果汇总 API
export const WaterSampleTestSummaryApi = {
  // 查询外检统计水质检测结果汇总分页
  getWaterSampleTestSummaryPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/water-sample-test-summary/page`,
      { params },
    );
  },

  // 查询外检统计水质检测结果汇总详情
  getWaterSampleTestSummary: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/water-sample-test-summary/get`,
      { params: { id } },
    );
  },

  // 新增外检统计水质检测结果汇总
  createWaterSampleTestSummary: async (data: WaterSampleTestSummaryVO) => {
    return await requestClient.post(
      `/waterdetection/water-sample-test-summary/create`,
      data,
    );
  },

  // 修改外检统计水质检测结果汇总
  updateWaterSampleTestSummary: async (data: WaterSampleTestSummaryVO) => {
    return await requestClient.put(
      `/waterdetection/water-sample-test-summary/update`,
      data,
    );
  },

  // 删除外检统计水质检测结果汇总
  deleteWaterSampleTestSummary: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/water-sample-test-summary/delete`,
      { params: { id } },
    );
  },

  // 导出外检统计水质检测结果汇总 Excel
  exportWaterSampleTestSummary: async (params) => {
    return await requestClient.download(
      `/waterdetection/water-sample-test-summary/export-excel`,
      params,
    );
  },

  generateReportExcel: async (data: JmReportParams) => {
    console.log('data======', data);
    // 使用原生 fetch 或 axios 方式实现 generate 功能
    const baseURL = import.meta.env.VITE_BASE_URL;
    const url = `${baseURL}/jmreport/exportAllExcelStream`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': getRefreshToken() || '',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.blob();
  },
};
