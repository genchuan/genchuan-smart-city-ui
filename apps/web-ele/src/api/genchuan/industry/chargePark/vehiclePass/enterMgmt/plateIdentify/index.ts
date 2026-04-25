import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace PlateIdentifyApi {
  /** 车牌识别信息 */
  export interface PlateIdentify {
    id?: number | string;
    plateNo?: string; // 车牌
    plateColor?: string; // 车牌颜色（蓝牌/黄牌/绿牌/其他）
    confidence?: number; // 置信度
    imageUrl?: string; // 抓拍图片地址
    status?: string; // 识别状态（识别成功/识别失败）
    stationId?: number; // 场站ID
    remark?: string; // 备注
    isCorrected?: boolean; // 修正记录标记
    reserve1?: string;
    reserve2?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 车牌识别分页请求参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    plateColor?: string;
    confidence?: number;
    status?: string;
    stationId?: number;
    remark?: string;
    isCorrected?: boolean;
  }

  /** 车牌识别创建请求参数 */
  export interface CreateReqVO {
    plateNo: string;
    plateColor: string;
    confidence?: number;
    imageUrl?: string;
    status: string;
    stationId: number;
    remark?: string;
  }

  /** 车牌识别确认请求参数 */
  export interface ConfirmReqVO {
    id: number | string;
  }

  /** 车牌识别修正请求参数 */
  export interface CorrectReqVO {
    id: number | string;
    plateNo: string;
    plateColor: string;
    confidence?: number;
    imageUrl?: string;
    status: string;
    stationId: number;
    remark?: string;
    isCorrected: boolean;
  }

  /** 车牌识别图表请求参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 车牌识别图表响应数据 */
  export interface ChartVO {
    successRateTrend: Array<{ date: string; rate: number }>;
    stationIdentifyCount: Array<{ count: number; stationName: string }>;
    cardData: {
      avgDuration: number;
      successRate: number;
    };
  }
}

/** 查询车牌识别分页 */
export function getPlateIdentifyPage(params: PlateIdentifyApi.PageReqVO) {
  return requestClient.get<PageResult<PlateIdentifyApi.PlateIdentify>>(
    '/vehiclepass/plate-identify/page',
    { params },
  );
}

/** 查询车牌识别详情 */
export function getPlateIdentify(id: number | string) {
  return requestClient.get<PlateIdentifyApi.PlateIdentify>(
    `/vehiclepass/plate-identify/get?id=${id}`,
  );
}

/** 新增车牌识别 */
export function createPlateIdentify(data: PlateIdentifyApi.CreateReqVO) {
  return requestClient.post('/vehiclepass/plate-identify/create', data);
}

/** 导出车牌识别 Excel */
export function exportPlateIdentify(params: PlateIdentifyApi.PageReqVO) {
  return requestClient.download('/vehiclepass/plate-identify/export', {
    params,
  });
}

/** 确认车牌识别 */
export function confirmPlateIdentify(data: PlateIdentifyApi.ConfirmReqVO) {
  return requestClient.put('/vehiclepass/plate-identify/confirm', data);
}

/** 修正车牌识别 */
export function correctPlateIdentify(data: PlateIdentifyApi.CorrectReqVO) {
  return requestClient.put('/vehiclepass/plate-identify/update', data);
}

/** 查询车牌识别图表 */
export function getPlateIdentifyChart(params: PlateIdentifyApi.ChartReqVO) {
  return requestClient.get<PlateIdentifyApi.ChartVO>(
    '/vehiclepass/plate-identify/chart',
    { params },
  );
}
