import { requestClient } from '#/api/request';

// 监测仪表校准管理 VO
export type MeterCalibrationVO = {
  id: number; // 序号
  meterId: string; // 仪表ID
  meterType: string; // 仪表类型
  calibrationCycle: number; // 校准周期(天)
  lastCalibrationDate: Date; // 上次校准日期
  currentCalibrationDate: Date; // 本次校准日期
  standardSolutionConc: number; // 标准溶液浓度
  beforeCalibrationValue: number; // 校准前示值
  afterCalibrationValue: number; // 校准后示值
  operatorId: string; // 操作人员ID
};

// 监测仪表校准管理 API
export const MeterCalibrationApi = {
  // 查询监测仪表校准管理分页
  getMeterCalibrationPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/meter-calibration/page`,
      { params },
    );
  },

  // 查询监测仪表校准管理详情
  getMeterCalibration: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/meter-calibration/get`,
      { params: { id } },
    );
  },

  // 新增监测仪表校准管理
  createMeterCalibration: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/meter-calibration/create`,
      data,
    );
  },

  // 修改监测仪表校准管理
  updateMeterCalibration: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/meter-calibration/update`,
      data,
    );
  },

  // 删除监测仪表校准管理
  deleteMeterCalibration: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/meter-calibration/delete`,
      { params: { id } },
    );
  },

  // 导出监测仪表校准管理 Excel
  exportMeterCalibration: async (params) => {
    return await requestClient.download(
      `/waterdetection/meter-calibration/export-excel`,
      params,
    );
  },
};
