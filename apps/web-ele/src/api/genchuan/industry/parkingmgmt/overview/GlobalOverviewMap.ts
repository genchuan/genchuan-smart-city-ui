import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';

/**
 * 获取停车地图点位数据
 */
export const fetchParkingLotGeometries = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/map/geometries/get`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response;
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('地图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            const today = new Date(2026, 0, 7).getTime(); // 月份是0开始，0=1月
            const oneHour = 60 * 60 * 1000;
            const oneDay = 24 * oneHour;
            resolve([
              {
                areaCode: '350602',
                lotId: 'L001',
                lotName: '漳州古城核心商圈停车场',
                lotType: '公共',
                lotStatus: '正常',
                lotLongitude: 117.656_923,
                lotLatitude: 24.565_189,
                roadside: 120,
                availableRoadside: 36,
                roadsideId: 'RS001001',
                berthNumber: 'ZZ-GC-001',
                roadsideStatus: '占用',
                berthLongitude: 117.6569,
                berthLatitude: 24.5651,
                deviceId: 'D001-B001',
                deviceType: '摄像头',
                deviceStatus: '在线',
                deviceLongitude: 117.657_023,
                deviceLatitude: 24.565_289,
                alertId: 'A001001',
                alertType: '路侧泊位超时长占用',
                alertLevel: '高',
                createTime: today + 10 * oneHour,
              },
              {
                areaCode: '350602',
                lotId: 'L001',
                lotName: '漳州古城核心商圈停车场',
                lotType: '公共',
                lotStatus: '正常',
                lotLongitude: 117.656_923,
                lotLatitude: 24.565_189,
                roadside: 120,
                availableRoadside: 36,
                roadsideId: 'RS001001',
                berthNumber: 'ZZ-GC-002',
                roadsideStatus: '空闲',
                berthLongitude: 117.656_618,
                berthLatitude: 24.565_312,
                deviceId: 'D001-B002',
                deviceType: '道闸',
                deviceStatus: '在线',
                deviceLongitude: 117.656_718,
                deviceLatitude: 24.565_412,
                alertId: '',
                alertType: '',
                alertLevel: '低',
                createTime: today + 2 * oneHour,
              },
              {
                areaCode: '350602',
                lotId: 'L001',
                lotName: '漳州古城核心商圈停车场',
                lotType: '公共',
                lotStatus: '正常',
                lotLongitude: 117.656_923,
                lotLatitude: 24.565_189,
                roadside: 120,
                availableRoadside: 36,
                roadsideId: 'RS001001',
                berthNumber: 'ZZ-GC-003',
                roadsideStatus: '故障',
                berthLongitude: 117.657_056,
                berthLatitude: 24.565_478,
                deviceId: 'D001-B003',
                deviceType: '传感器',
                deviceStatus: '故障',
                deviceLongitude: 117.657_156,
                deviceLatitude: 24.565_578,
                alertId: 'A001003',
                alertType: '泊位传感器故障',
                alertLevel: '中',
                createTime: today - 2 * oneHour,
              },
              {
                areaCode: '350602',
                lotId: 'L001',
                lotName: '漳州古城核心商圈停车场',
                lotType: '公共',
                lotStatus: '维护',
                lotLongitude: 117.656_923,
                lotLatitude: 24.565_189,
                roadside: 120,
                availableRoadside: 36,
                roadsideId: 'RS001001',
                berthNumber: 'ZZ-GC-004',
                roadsideStatus: '禁用',
                berthLongitude: 117.656_489,
                berthLatitude: 24.565_098,
                deviceId: 'D001-B004',
                deviceType: '道闸',
                deviceStatus: '离线',
                deviceLongitude: 117.656_589,
                deviceLatitude: 24.565_198,
                alertId: 'A001004',
                alertType: '泊位禁用',
                alertLevel: '低',
                createTime: today - 8 * oneDay,
              },
              {
                areaCode: '350603',
                lotId: 'L002',
                lotName: '漳州政务服务中心停车场',
                lotType: '专用',
                lotStatus: '正常',
                lotLongitude: 117.700_345,
                lotLatitude: 24.583_167,
                roadside: 80,
                availableRoadside: 45,
                roadsideId: 'RS002001',
                berthNumber: 'ZZ-ZW-001',
                roadsideStatus: '禁用',
                berthLongitude: 117.7003,
                berthLatitude: 24.5831,
                deviceId: 'D002-B001',
                deviceType: '传感器',
                deviceStatus: '离线',
                deviceLongitude: 117.700_445,
                deviceLatitude: 24.583_267,
                alertId: 'A002001',
                alertType: '泊位禁用',
                alertLevel: '低',
                createTime: today - 5 * oneDay,
              },
              {
                areaCode: '350603',
                lotId: 'L002',
                lotName: '漳州政务服务中心停车场',
                lotType: '专用',
                lotStatus: '正常',
                lotLongitude: 117.700_345,
                lotLatitude: 24.583_167,
                roadside: 80,
                availableRoadside: 45,
                roadsideId: 'RS002001',
                berthNumber: 'ZZ-ZW-003',
                roadsideStatus: '占用',
                berthLongitude: 117.700_512,
                berthLatitude: 24.583_546,
                deviceId: 'D002-B003',
                deviceType: '道闸',
                deviceStatus: '在线',
                deviceLongitude: 117.700_612,
                deviceLatitude: 24.583_646,
                alertId: 'A002003',
                alertType: '路侧泊位超时长占用',
                alertLevel: '中',
                createTime: today + 15 * oneHour,
              },
              {
                areaCode: '350603',
                lotId: 'L002',
                lotName: '漳州政务服务中心停车场',
                lotType: '专用',
                lotStatus: '正常',
                lotLongitude: 117.700_345,
                lotLatitude: 24.583_167,
                roadside: 80,
                availableRoadside: 45,
                roadsideId: 'RS002001',
                berthNumber: 'ZZ-ZW-004',
                roadsideStatus: '故障',
                berthLongitude: 117.699_943,
                berthLatitude: 24.583_078,
                deviceId: 'D002-B004',
                deviceType: '传感器',
                deviceStatus: '故障',
                deviceLongitude: 117.700_043,
                deviceLatitude: 24.583_178,
                alertId: 'A002004',
                alertType: '泊位传感器故障',
                alertLevel: '高',
                createTime: today - 3 * oneDay,
              },
              {
                areaCode: '350601',
                lotId: 'L003',
                lotName: '漳州胜利路路侧停车场',
                lotType: '路侧',
                lotStatus: '正常',
                lotLongitude: 117.668_923,
                lotLatitude: 24.572_189,
                roadside: 60,
                availableRoadside: 18,
                roadsideId: 'RS003001',
                berthNumber: 'ZZ-SL-001',
                roadsideStatus: '占用',
                berthLongitude: 117.6689,
                berthLatitude: 24.5721,
                deviceId: 'D003-B001',
                deviceType: '摄像头',
                deviceStatus: '在线',
                deviceLongitude: 117.669_023,
                deviceLatitude: 24.572_289,
                alertId: 'A003001',
                alertType: '路侧泊位超时长占用',
                alertLevel: '中',
                createTime: today + 15 * oneHour,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车地图数据函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

/**
 * 获取停车热力图数据
 */
export const fetchHeatmapData = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/map/heatdata/get`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response;
        }
        throw new Error('真实接口返回无热力图数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('热力图接口调用失败，使用模拟数据兜底', error.message);

        return new Promise((resolve) => {
          setTimeout(() => {
            const mockData = [
              [24.510, 117.640, 280],
              [24.513, 117.643, 50],
              [24.514, 117.644, 80],
              [24.515, 117.645, 20],
              [24.520, 117.650, 180],
              [24.525, 117.655, 240],
              [24.518, 117.648, 150],
              [24.512, 117.642, 190],
              [24.522, 117.652, 210],
              [24.480, 117.690, 260],
              [24.485, 117.695, 10],
              [24.490, 117.700, 170],
              [24.495, 117.705, 220],
              [24.488, 117.698, 140],
              [24.550, 117.750, 290],
              [24.555, 117.755, 40],
              [24.560, 117.760, 200],
              [24.565, 117.765, 250],
              [24.558, 117.758, 160],
              [24.080, 117.580, 270],
              [24.085, 117.585, 30],
              [24.090, 117.590, 190],
              [24.095, 117.595, 230],
              [24.650, 117.720, 300],
              [24.655, 117.725, 350],
              [24.660, 117.730, 210],
              [24.665, 117.735, 260],
              [24.658, 117.728, 170],
              [24.420, 117.620, 110],
              [24.580, 117.780, 130],
              [24.350, 117.550, 90],
              [24.700, 117.680, 120],
            ];
            console.log('【热力图排查】🔌 模拟数据返回：', mockData);
            resolve(mockData);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 热力图数据函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};


/**
 * 获取核心指标看板数据
 */
export const fetchParkingCoreIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/core/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.citywideLot
        ) {
          return response;
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('核心指标接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              citywideLot: 268,
              totalRoadside: 15_690,
              faultDevice: 12,
              earlyWarningEvent: 8,
              feeEvasionOrder: 36,
              dailyEntryVehicle: 98_765,
              dailyTotalChargeAmount: 156_890.78,
              roadsideUtilizationRate: 0.785,
              deviceOnlineRate: 0.962,
              lotOpeningRate: 0.92,
              orderCompletionRate: 0.988,
              yearOnYear: {
                citywideLot: 0.08,
                dailyEntryVehicle: 0.12,
                dailyTotalChargeAmount: 0.15,
              },
              monthOnMonth: {
                citywideLot: 0.03,
                dailyEntryVehicle: 0.06,
                dailyTotalChargeAmount: 0.09,
              },
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      citywideLot: 0,
      totalRoadside: 0,
      roadsideUtilizationRate: 0,
      deviceOnlineRate: 0,
      lotOpeningRate: 0,
      dailyEntryVehicle: 0,
      dailyTotalChargeAmount: 0,
      orderCompletionRate: 0,
      faultDevice: 0,
      earlyWarningEvent: 0,
      feeEvasionOrder: 0,
      yearOnYear: {},
      monthOnMonth: {},
    });
  }
};

/**
 * 获取全局态势趋势数据
 */
export const fetchParkingGlobalTrendIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.roadsideUtilizationRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '全局态势趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              roadsideUtilizationRate: 0.768,
              deviceFaultRate: 0.025,
              orderCompletionRate: 0.989,
              feeEvasionRate: 0.012,
              entryVehicleCount: 12_560,
              totalChargeAmount: 289_650.56,
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车全局态势趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      roadsideUtilizationRate: 0,
      entryVehicleCount: 0,
      totalChargeAmount: 0,
      deviceFaultRate: 0,
      orderCompletionRate: 0,
      feeEvasionRate: 0,
    });
  }
};

/**
 * 获取核心对象分布数据
 */
export const fetchParkingCoreObjectList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking-core-object/list`,
        params,
      })
      .then((response) => {
        if (Array.isArray(response)) {
          return response;
        }
        throw new Error('真实接口返回无效数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '核心对象分布接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            console.warn('核心对象分布接口调用失败-使用模拟数据兜底');
            resolve([
              {
                lotId: 'P001',
                lotName: '漳州万达广场室内地下停车场',
                parkType: '公共',
                areaCode: '350602',
                roadside: 50,
                availableRoadside: 23,
                lotStatus: '正常',
                roadsideId: 'RS001001',
                roadsideType: '普通',
                roadsideStatus: '空闲',
                deviceId: 'D001001001',
                deviceCode: 'ZZ_PK_DEV_350602_P001_001',
                deviceType: '车牌识别相机',
                deviceStatus: '在线',
                createTime: '1727783400000',
              },
              {
                lotId: 'P002',
                lotName: '漳州政务服务中心室外停车场',
                parkType: '公共',
                areaCode: '350603',
                roadside: 30,
                availableRoadside: 8,
                lotStatus: '正常',
                roadsideId: 'RS002001',
                roadsideType: '充电',
                roadsideStatus: '占用',
                deviceId: 'D002001001',
                deviceCode: 'ZZ_PK_DEV_350603_P002_001',
                deviceType: '充电桩',
                deviceStatus: '在线',
                createTime: '1727783600000',
              },
              {
                lotId: 'P003',
                lotName: '漳州正兴医院立体停车场',
                parkType: '公共',
                areaCode: '350602',
                roadside: 20,
                availableRoadside: 0,
                lotStatus: '正常',
                roadsideId: 'RS003001',
                roadsideType: '无障碍',
                roadsideStatus: '占用',
                deviceId: 'D003001001',
                deviceCode: 'ZZ_PK_DEV_350602_P003_001',
                deviceType: '车位检测器',
                deviceStatus: '在线',
                createTime: '1727783800000',
              },
              {
                lotId: 'P004',
                lotName: '漳州体育中心露天停车场',
                parkType: '专用',
                areaCode: '350603',
                roadside: 80,
                availableRoadside: 45,
                lotStatus: '暂停运营',
                roadsideId: 'RS004001',
                roadsideType: '普通',
                roadsideStatus: '禁用',
                deviceId: 'D004001001',
                deviceCode: 'ZZ_PK_DEV_350603_P004_001',
                deviceType: '道闸',
                deviceStatus: '故障',
                createTime: '1727784000000',
              },
              {
                lotId: 'P005',
                lotName: '厦门大学漳州校区混合停车场',
                parkType: '专用',
                areaCode: '350623',
                roadside: 60,
                availableRoadside: 12,
                lotStatus: '维护',
                roadsideId: 'RS005001',
                roadsideType: '充电',
                roadsideStatus: '故障',
                deviceId: 'D005001001',
                deviceCode: 'ZZ_PK_DEV_350623_P005_001',
                deviceType: '停车计费终端',
                deviceStatus: '在线',
                createTime: '1727784200000',
              },
              {
                lotId: 'P006',
                lotName: '漳州滨江公园路侧停车场',
                parkType: '路侧',
                areaCode: '350602',
                roadside: 40,
                availableRoadside: 18,
                lotStatus: '正常',
                roadsideId: 'RS006001',
                roadsideType: '普通',
                roadsideStatus: '空闲',
                deviceId: 'D006001001',
                deviceCode: 'ZZ_PK_DEV_350602_P006_001',
                deviceType: '视频监控',
                deviceStatus: '在线',
                createTime: '1727784400000',
              },
              {
                lotId: 'P007',
                lotName: '漳州站北广场地下停车场',
                parkType: '公共',
                areaCode: '350604',
                roadside: 100,
                availableRoadside: 36,
                lotStatus: '正常',
                roadsideId: 'RS007001',
                roadsideType: '无障碍',
                roadsideStatus: '空闲',
                deviceId: 'D007001001',
                deviceCode: 'ZZ_PK_DEV_350604_P007_001',
                deviceType: '紧急呼叫终端',
                deviceStatus: '在线',
                createTime: '1727784600000',
              },
              {
                lotId: 'P008',
                lotName: '漳州汽车客运中心专用停车场',
                parkType: '专用',
                areaCode: '350603',
                roadside: 25,
                availableRoadside: 5,
                lotStatus: '正常',
                roadsideId: 'RS008001',
                roadsideType: '普通',
                roadsideStatus: '占用',
                deviceId: 'D008001001',
                deviceCode: 'ZZ_PK_DEV_350603_P008_001',
                deviceType: '地磁检测器',
                deviceStatus: '故障',
                createTime: '1727784800000',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

/**
 * 核心要素运行查询接口
 */
export const fetchRoadsideBerthCoreElements = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/roadside-berth/core-elements/list`,
        params,
      })
      .then((response) => {
        if (Array.isArray(response)) {
          return response;
        }
        throw new Error('真实接口返回无效数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '核心要素运行接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            console.warn('核心要素接口调用失败-使用模拟数据兜底');
            resolve([
              {
                roadsideId: 'ZZ-RSB0001',
                berthNumber: 'ZZ-A-001',
                lotId: 'ZZ-PL001',
                roadsideStatus: '占用',
                parkingTime: 135,
                overtimeOccupationWarnId: '是',
                nMVOccupationWarnId: '否',
                deviceId: 'ZZ-DEV0001',
                deviceType: '地磁检测器',
                deviceStatus: '在线',
                faultType: '无故障',
                offlineDuration: 0,
                paymentSuccessRate: 98.6,
                chargeAbnormal: 0,
                chargePileId: 'ZZ-CP0001',
                chargePileStatus: '充电中',
                chargePilePower: '7kW',
                chargePileRemainingPower: '85%',
                updateTime: '1727783400000',
              },
              {
                roadsideId: 'ZZ-RSB0002',
                berthNumber: 'ZZ-A-002',
                lotId: 'ZZ-PL001',
                roadsideStatus: '空闲',
                parkingTime: 0,
                overtimeOccupationWarnId: '否',
                nMVOccupationWarnId: '否',
                deviceId: 'ZZ-DEV0002',
                deviceType: '地磁检测器',
                deviceStatus: '离线',
                faultType: '信号中断',
                offlineDuration: 240,
                paymentSuccessRate: 99.2,
                chargeAbnormal: 1,
                chargePileId: '',
                chargePileStatus: '',
                chargePilePower: '',
                chargePileRemainingPower: '',
                updateTime: '1727783400000',
              },
              {
                roadsideId: 'ZZ-RSB0003',
                berthNumber: 'ZZ-B-001',
                lotId: 'ZZ-PL002',
                roadsideStatus: '占用',
                parkingTime: 360,
                overtimeOccupationWarnId: '是',
                nMVOccupationWarnId: '是',
                deviceId: 'ZZ-DEV0003',
                deviceType: '高清摄像头',
                deviceStatus: '故障',
                faultType: '镜头损坏',
                offlineDuration: 180,
                paymentSuccessRate: 97.8,
                chargeAbnormal: 3,
                chargePileId: 'ZZ-CP0002',
                chargePileStatus: '正常待机',
                chargePilePower: '20kW',
                chargePileRemainingPower: '100%',
                updateTime: '1727783400000',
              },
              {
                roadsideId: 'ZZ-RSB0004',
                berthNumber: 'ZZ-B-002',
                lotId: 'ZZ-PL002',
                roadsideStatus: '故障',
                parkingTime: 0,
                overtimeOccupationWarnId: '否',
                nMVOccupationWarnId: '否',
                deviceId: 'ZZ-DEV0004',
                deviceType: '地磁检测器',
                deviceStatus: '故障',
                faultType: '硬件损坏',
                offlineDuration: 720,
                paymentSuccessRate: 96.5,
                chargeAbnormal: 2,
                chargePileId: '',
                chargePileStatus: '',
                chargePilePower: '',
                chargePileRemainingPower: '',
                updateTime: '1727783400000',
              },
              {
                roadsideId: 'ZZ-RSB0005',
                berthNumber: 'ZZ-C-001',
                lotId: 'ZZ-PL003',
                roadsideStatus: '占用',
                parkingTime: 45,
                overtimeOccupationWarnId: '否',
                nMVOccupationWarnId: '否',
                deviceId: 'ZZ-DEV0005',
                deviceType: '高清摄像头',
                deviceStatus: '在线',
                faultType: '无故障',
                offlineDuration: 0,
                paymentSuccessRate: 99.5,
                chargeAbnormal: 0,
                chargePileId: 'ZZ-CP0003',
                chargePileStatus: '停止服务',
                chargePilePower: '15kW',
                chargePileRemainingPower: '0%',
                updateTime: '1727783400000',
              },
              {
                roadsideId: 'ZZ-RSB0006',
                berthNumber: 'ZZ-C-002',
                lotId: 'ZZ-PL003',
                roadsideStatus: '空闲',
                parkingTime: 0,
                overtimeOccupationWarnId: '否',
                nMVOccupationWarnId: '否',
                deviceId: 'ZZ-DEV0006',
                deviceType: '地磁检测器',
                deviceStatus: '在线',
                faultType: '无故障',
                offlineDuration: 0,
                paymentSuccessRate: 99,
                chargeAbnormal: 0,
                chargePileId: 'ZZ-CP0004',
                chargePileStatus: '正常待机',
                chargePilePower: '10kW',
                chargePileRemainingPower: '90%',
                updateTime: '1727783400000',
              },
              {
                roadsideId: 'ZZ-RSB0007',
                berthNumber: 'ZZ-D-001',
                lotId: 'ZZ-PL004',
                roadsideStatus: '占用',
                parkingTime: 210,
                overtimeOccupationWarnId: '是',
                nMVOccupationWarnId: '否',
                deviceId: 'ZZ-DEV0007',
                deviceType: '高清摄像头',
                deviceStatus: '离线',
                faultType: '网络断开',
                offlineDuration: 120,
                paymentSuccessRate: 98.2,
                chargeAbnormal: 1,
                chargePileId: '',
                chargePileStatus: '',
                chargePilePower: '',
                chargePileRemainingPower: '',
                updateTime: '1727783400000',
              },
              {
                roadsideId: 'ZZ-RSB0008',
                berthNumber: 'ZZ-D-002',
                lotId: 'ZZ-PL004',
                roadsideStatus: '故障',
                parkingTime: 0,
                overtimeOccupationWarnId: '否',
                nMVOccupationWarnId: '否',
                deviceId: 'ZZ-DEV0008',
                deviceType: '地磁检测器',
                deviceStatus: '故障',
                faultType: '线路故障',
                offlineDuration: 480,
                paymentSuccessRate: 97,
                chargeAbnormal: 2,
                chargePileId: 'ZZ-CP0005',
                chargePileStatus: '故障维修',
                chargePilePower: '25kW',
                chargePileRemainingPower: '50%',
                updateTime: '1727783400000',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 路侧泊位核心要素函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

/**
 * 获取特色态势聚合数据
 */
export const fetchParkingFeatureSituation = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking-feature-situation/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          'lotUtilizationRate' in response &&
          'revenueProportion' in response &&
          'maintenanceTimelinessRate' in response
        ) {
          return response;
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车特色态势聚合接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              lotUtilizationRate: 78.5,
              revenueProportion: 65.2,
              maintenanceTimelinessRate: 92.8,
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车特色态势聚合函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      lotUtilizationRate: 0,
      revenueProportion: 0,
      maintenanceTimelinessRate: 0,
      updateTime: '',
      lotCount: 0,
      highUtilizationLotCount: 0,
    });
  }
};

/**
 * 获取停车三大统计分布数据
 */
export const fetchParkingStatisticsDistribution = (params = {}) => {
  try {
    return Promise.all([
      (async () => {
        try {
          const res = await requestClient.get({
            url: `${BASE_URL}/fault/device/distribution`,
            params,
          });
          if (
            res &&
            typeof res === 'object' &&
            !Array.isArray(res) &&
            res.data &&
            res.data.labels &&
            res.data.data
          ) {
            return res.data;
          }
        } catch (error) {
          console.warn(
            '故障设备分布接口调用失败-使用模拟数据兜底',
            error.message,
          );
          const timeRange = params.time_range || '';
          let faultDeviceData = [45, 32, 28, 19, 15];
          switch (timeRange) {
            case 'today': {
              faultDeviceData = [5, 3, 2, 2, 1];

              break;
            }
            case 'week': {
              faultDeviceData = [38, 27, 23, 16, 12];

              break;
            }
            case 'yesterday': {
              faultDeviceData = [12, 8, 7, 5, 4];

              break;
            }
            // No default
          }
          return {
            labels: ['摄像头', '传感器', '道闸', '充电桩', '计费桩'],
            data: faultDeviceData,
          };
        }
      })(),
      (async () => {
        try {
          const res = await requestClient.get({
            url: `${BASE_URL}/charge/abnormal/order/distribution`,
            params,
          });
          if (
            res &&
            typeof res === 'object' &&
            !Array.isArray(res) &&
            res.data &&
            res.data.labels &&
            res.data.data
          ) {
            return res.data;
          }
        } catch (error) {
          console.warn(
            '收费异常订单分布接口调用失败-使用模拟数据兜底',
            error.message,
          );
          const timeRange = params.time_range || '';
          let abnormalOrderData = [89, 67, 45, 32, 18];
          switch (timeRange) {
            case 'today': {
              abnormalOrderData = [9, 7, 5, 3, 2];

              break;
            }
            case 'week': {
              abnormalOrderData = [78, 59, 39, 28, 16];

              break;
            }
            case 'yesterday': {
              abnormalOrderData = [22, 16, 11, 8, 5];

              break;
            }
            // No default
          }
          return {
            labels: [
              '支付超时',
              '金额不符',
              '重复计费',
              '未识别车牌',
              '系统异常',
            ],
            data: abnormalOrderData,
          };
        }
      })(),
      (async () => {
        try {
          const res = await requestClient.get({
            url: `${BASE_URL}/fee/evasion/region/distribution`,
            params,
          });
          if (
            res &&
            typeof res === 'object' &&
            !Array.isArray(res) &&
            res.data &&
            res.data.labels &&
            res.data.data
          ) {
            return res.data;
          }
        } catch (error) {
          console.warn(
            '逃费高发区域接口调用失败-使用模拟数据兜底',
            error.message,
          );
          const timeRange = params.time_range || '';
          let evasionRegionData = [126, 98, 75, 62, 45, 33];
          switch (timeRange) {
            case 'today': {
              evasionRegionData = [15, 10, 8, 6, 5, 3];

              break;
            }
            case 'week': {
              evasionRegionData = [108, 85, 66, 54, 39, 29];

              break;
            }
            case 'yesterday': {
              evasionRegionData = [32, 25, 19, 15, 12, 8];

              break;
            }
            // No default
          }
          return {
            labels: [
              '漳州古城商圈',
              '万达广场商圈',
              '漳州站周边',
              '漳浦县城核心区',
              '云霄江滨新区',
              '东山景区周边',
            ],
            data: evasionRegionData,
          };
        }
      })(),
    ]).then(([faultDeviceDist, chargeAbnormalDist, feeEvasionRegionDist]) => {
      return {
        faultDevice: faultDeviceDist,
        chargeAbnormal: chargeAbnormalDist,
        feeEvasionRegion: feeEvasionRegionDist,
      };
    });
  } catch (error) {
    console.error('===== 停车三大统计分布函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      faultDevice: { labels: [], data: [] },
      chargeAbnormal: { labels: [], data: [] },
      feeEvasionRegion: { labels: [], data: [] },
    });
  }
};
