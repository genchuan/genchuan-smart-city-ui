import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';

/**
 * 获取停车管理运行类指标数据
 */
export const fetchParkingOperationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/operation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.parkingLotOpeningRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无运行类核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车管理运行类指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              parkingLotOpeningRate: 0.93,
              roadsideUtilizationRate: 0.79,
              deviceOnlineRate: 0.968,
              deviceIntegrityRate: 0.945,
              chargeResponseSuccessRate: 0.992,
              faultOccurrenceRate: 0.028,
              deviceOfflineCount: 18,
              deviceStartStopTimes: 26,
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车管理运行类指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      parkingLotOpeningRate: 0,
      roadsideUtilizationRate: 0,
      deviceOnlineRate: 0,
      deviceIntegrityRate: 0,
      chargeResponseSuccessRate: 0,
      faultOccurrenceRate: 0,
      deviceOfflineCount: 0,
      deviceStartStopTimes: 0,
    });
  }
};

/**
 * 获取停车管理资源类指标数据
 */
export const fetchParkingResourceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/resource/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalRoadside
        ) {
          return response;
        }
        throw new Error('真实接口返回无资源类核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车管理资源类指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalRoadside: 15_690,
              availableRoadside: 12_865,
              idleRoadside: 3680,
              roadsideTurnoverTimes: 8,
              totalDevice: 2860,
              availableDevice: 2752,
              sparePartInventory: 560,
              maintenanceStaff: 48,
              emergencyMaterial: 126,
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车管理资源类指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalRoadside: 0,
      availableRoadside: 0,
      idleRoadside: 0,
      roadsideTurnoverTimes: 0,
      totalDevice: 0,
      availableDevice: 0,
      sparePartInventory: 0,
      maintenanceStaff: 0,
      emergencyMaterial: 0,
    });
  }
};

/**
 * 获取停车管理服务类指标数据
 */
export const fetchParkingServiceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/service/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.reservationSuccessRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无服务类核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车管理服务类指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              reservationSuccessRate: 0.982,
              entryResponseDuration: 1.2,
              paymentConvenienceRate: 0.995,
              userSatisfactionRate: 0.967,
              complaintRate: 0.008,
              complaintSettlementRate: 0.95,
              repetitiveComplaintRate: 0.012,
              oneTimeSettlementRate: 0.923,
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车管理服务类指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      reservationSuccessRate: 0,
      entryResponseDuration: 0,
      paymentConvenienceRate: 0,
      userSatisfactionRate: 0,
      complaintRate: 0,
      complaintSettlementRate: 0,
      repetitiveComplaintRate: 0,
      oneTimeSettlementRate: 0,
    });
  }
};

/**
 * 获取停车管理效率类指标数据
 */
export const fetchParkingEfficiencyIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/efficiency/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.roadsideTurnoverRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无效率类核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车管理效率类指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              roadsideTurnoverRate: 6.8,
              orderProcessingDuration: 3.5,
              faultDisposalDuration: 25.6,
              workOrderClosedLoopRate: 0.948,
              collaborationDuration: 48.2,
              repetitiveDisposalRate: 0.036,
              dispatchResponseSpeed: 2.8,
              workOrderTimeoutRate: 0.021,
              perCapitaDisposalVolume: 15,
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车管理效率类指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      roadsideTurnoverRate: 0,
      orderProcessingDuration: 0,
      faultDisposalDuration: 0,
      workOrderClosedLoopRate: 0,
      collaborationDuration: 0,
      repetitiveDisposalRate: 0,
      dispatchResponseSpeed: 0,
      workOrderTimeoutRate: 0,
      perCapitaDisposalVolume: 0,
    });
  }
};

/**
 * 获取停车管理合规类指标数据
 */
export const fetchParkingComplianceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/compliance/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.chargeComplianceRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无合规类核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车管理合规类指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            // 模拟数据贴合业务实际，数值合理
            resolve({
              chargeComplianceRate: 0.996, // 收费合规率
              orderAccuracyRate: 0.991, // 订单准确率
              rectificationCompletionRate: 0.978, // 整改完成率
              servicePositiveCommentRate: 0.965, // 服务好评率
              illegalParkingCount: 23, // 违法违规停车次数
              arrearsClearanceRate: 0.942, // 欠费结清率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车管理合规类指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    // 兜底默认数据，避免前端字段缺失报错
    return Promise.resolve({
      chargeComplianceRate: 0,
      orderAccuracyRate: 0,
      rectificationCompletionRate: 0,
      servicePositiveCommentRate: 0,
      illegalParkingCount: 0,
      arrearsClearanceRate: 0,
    });
  }
};

/**
 * 获取停车管理风险类指标数据
 */
export const fetchParkingRiskIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/risk/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.fireHazard
        ) {
          return response;
        }
        throw new Error('真实接口返回无风险类核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车管理风险类指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            // 模拟数据贴合安全管理业务场景
            resolve({
              fireHazard: 5, // 火灾隐患数
              accidentOccurrenceRate: 0.003, // 事故发生率
              earlyWarningDisposalRate: 0.985, // 预警处置率
              rectificationClosedLoopRate: 0.969, // 安全整改闭环率
              highRiskAreaProportion: 0.08, // 高风险区域占比
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车管理风险类指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    // 兜底默认数据，避免前端字段缺失报错
    return Promise.resolve({
      fireHazard: 0,
      accidentOccurrenceRate: 0,
      earlyWarningDisposalRate: 0,
      rectificationClosedLoopRate: 0,
      highRiskAreaProportion: 0,
    });
  }
};

/**
 * 获取停车管理发展类指标数据
 */
export const fetchParkingDevelopmentIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/development/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.lotGrowthSpeed
        ) {
          return response;
        }
        throw new Error('真实接口返回无发展类核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车管理发展类指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            // 模拟数据贴合业务增长与智慧化发展场景
            resolve({
              lotGrowthSpeed: 0.12, // 停车场增长速度
              roadsideExpansionCount: 1250, // 路侧泊位扩容数量
              serviceCoverageGrowthRate: 0.15, // 服务覆盖增长率
              utilizationImprovementRate: 0.09, // 使用率提升率
              chargingServicePenetrationRate: 0.28, // 充电服务渗透率
              smartDeviceCoverageRate: 0.86, // 智慧化设备覆盖率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车管理发展类指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    // 兜底默认数据，避免前端字段缺失报错
    return Promise.resolve({
      lotGrowthSpeed: 0,
      roadsideExpansionCount: 0,
      serviceCoverageGrowthRate: 0,
      utilizationImprovementRate: 0,
      chargingServicePenetrationRate: 0,
      smartDeviceCoverageRate: 0,
    });
  }
};
