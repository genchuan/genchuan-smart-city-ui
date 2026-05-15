import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace CarInputApi {
  /** 车辆录入信息 */
  export interface CarInput {
    id?: number | string;
    plateNo?: string;
    plateColor?: string;
    enterTime?: string;
    stationId?: number;
    stationName?: string;
    parkSpaceNo?: string;
    vehicleType?: string;
    auditStatus?: string;
    auditTime?: string;
    auditor?: string;
    auditRemark?: string;
    remark?: string;
    creator?: string;
    updater?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 车辆录入分页查询参数 */
  export interface PageReqVO extends PageParam {
    plateNo?: string;
    plateColor?: string;
    stationId?: number;
    parkSpaceNo?: string;
    vehicleType?: string;
    auditStatus?: string;
  }

  /** 车辆录入创建参数 */
  export interface CreateReqVO {
    plateNo: string;
    plateColor: string;
    enterTime: string;
    stationId: number;
    parkSpaceNo?: string;
    vehicleType?: string;
    remark?: string;
  }

  /** 车辆录入更新参数 */
  export interface UpdateReqVO {
    id: number | string;
    plateNo?: string;
    plateColor?: string;
    enterTime?: string;
    stationId?: number;
    parkSpaceNo?: string;
    vehicleType?: string;
    remark?: string;
  }

  /** 车辆录入审核参数 */
  export interface AuditReqVO {
    id: number | string;
    auditResult: string;
    auditComment?: string;
  }

  /** 车辆录入修正参数 */
  export interface CorrectReqVO {
    id: number | string;
    plateNo: string;
    spaceId: number;
    areaId: number;
    remark?: string;
  }

  /** 车辆录入确认参数 */
  export interface ConfirmReqVO {
    id: number | string;
  }

  /** 车辆录入图表查询参数 */
  export interface ChartReqVO {
    startTime: string;
    endTime: string;
    stationId?: number;
  }

  /** 车辆录入图表数据 */
  export interface ChartVO {
    inputTrend: Array<{ count: number; date: string }>;
    stationInputCount: Array<{ count: number; stationName: string }>;
    cardData: {
      auditRate: number;
      totalInput: number;
    };
  }
}

/** 查询车辆录入分页 */
export function getCarInputPage(params: CarInputApi.PageReqVO) {
  return requestClient.get<PageResult<CarInputApi.CarInput>>(
    '/vehiclepass/car-input/page',
    { params },
  );
}

/** 查询车辆录入详情 */
export function getCarInput(id: number | string) {
  return requestClient.get<CarInputApi.CarInput>(
    `/vehiclepass/car-input/get?id=${id}`,
  );
}

/** 新增车辆录入 */
export function createCarInput(data: CarInputApi.CreateReqVO) {
  return requestClient.post<boolean>('/vehiclepass/car-input/create', data);
}

/** 修改车辆录入 */
export function updateCarInput(data: CarInputApi.UpdateReqVO) {
  return requestClient.put<boolean>('/vehiclepass/car-input/update', data);
}

/** 导出车辆录入 */
export function exportCarInput(params?: CarInputApi.PageReqVO) {
  return requestClient.download('/vehiclepass/car-input/export', {
    params: { ...params },
  });
}

/** 审核车辆录入 */
export function auditCarInput(data: CarInputApi.AuditReqVO) {
  return requestClient.put<boolean>('/vehiclepass/car-input/audit', data);
}

/** 确认车辆录入 */
export function confirmCarInput(data: CarInputApi.ConfirmReqVO) {
  return requestClient.put<boolean>('/vehiclepass/car-input/confirm', data);
}

/** 修正车辆录入 */
export function correctCarInput(data: CarInputApi.CorrectReqVO) {
  return requestClient.put<boolean>('/vehiclepass/car-input/correct', data);
}

/** 查询车辆录入图表 */
export function getCarInputChart(params: CarInputApi.ChartReqVO) {
  return requestClient.get<CarInputApi.ChartVO>(
    '/vehiclepass/car-input/chart',
    {
      params,
    },
  );
}
