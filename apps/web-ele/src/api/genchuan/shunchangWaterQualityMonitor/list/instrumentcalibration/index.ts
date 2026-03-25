import { requestClient } from '#/api/request';

// 仪器零点/量程漂移校验 VO
export type InstrumentCalibrationVO = {
  id: number; // 序号
  instrumentId: string; // 仪器ID
  calibrationDate: Date; // 校验日期
  zeroPointConc: number; // 零点校正液浓度
  zeroDrift: number; // 零点漂移值
  spanConc: number; // 量程校正液浓度
  spanDrift: number; // 量程漂移值
  calibrationResult: string; // 校验结果
  operatorId: string; // 操作人员ID
};

// 仪器零点/量程漂移校验 API
export const InstrumentCalibrationApi = {
  // 查询仪器零点/量程漂移校验分页
  getInstrumentCalibrationPage: async (params: any) => {
    return await requestClient.get(
      `/waterdetection/instrument-calibration/page`,
      { params },
    );
  },

  // 查询仪器零点/量程漂移校验详情
  getInstrumentCalibration: async (id: number) => {
    return await requestClient.get(
      `/waterdetection/instrument-calibration/get`,
      { params: { id } },
    );
  },

  // 新增仪器零点/量程漂移校验
  createInstrumentCalibration: async (data: any) => {
    return await requestClient.post(
      `/waterdetection/instrument-calibration/create`,
      data,
    );
  },

  // 修改仪器零点/量程漂移校验
  updateInstrumentCalibration: async (data: any) => {
    return await requestClient.put(
      `/waterdetection/instrument-calibration/update`,
      data,
    );
  },

  // 删除仪器零点/量程漂移校验
  deleteInstrumentCalibration: async (id: number) => {
    return await requestClient.delete(
      `/waterdetection/instrument-calibration/delete`,
      { params: { id } },
    );
  },

  // 导出仪器零点/量程漂移校验 Excel
  exportInstrumentCalibration: async (params) => {
    return await requestClient.download(
      `/waterdetection/instrument-calibration/export-excel`,
      params,
    );
  },
};
