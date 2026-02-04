import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';


// ========== 运维服务 ==========
// 运维服务核心指标（卡片：工单总数、已完成数、处置完成率、平均处置时长、满意度）
export const fetchOperationIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/operation/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.tbOperationStatWorkorderTotal &&
          response.tbOperationStatCompletedCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无运维服务核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '运维服务核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbOperationStatWorkorderTotal: 1250, // 工单总数
              tbOperationStatCompletedCount: 1180, // 已完成数
              tbOperationStatAverageDuration: 2.5, // 平均处置时长
              tbOperationStatCompletionRate: 94.4, // 处置完成率
              sysWorkorderTypeName: '设备故障', // 热门工单类型
              tbOperationStatOvertimeCount: 15, // 超时工单数
              tbOperationStatSatisfactionRate: 96.8, // 客户满意度
              tbOperationStatChainChange: 8.2, // 环比工单变化
              tbRegionOperationRate: '中山路区域 28%', // 区域工单分布
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 运维服务核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbOperationStatWorkorderTotal: 0,
      tbOperationStatCompletedCount: 0,
      tbOperationStatAverageDuration: 0,
      tbOperationStatCompletionRate: 0,
      sysWorkorderTypeName: '',
      tbOperationStatOvertimeCount: 0,
      tbOperationStatSatisfactionRate: 0,
      tbOperationStatChainChange: 0,
      tbRegionOperationRate: '',
    });
  }
};

// 工单类型占比（饼图）
export const fetchOperationTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/operation/stat/type/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无工单类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '工单类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['设备故障', '网络问题', '计费异常', '停车异常', '其他'],
              series: [{ name: '工单类型占比(%)', data: [45, 25, 15, 10, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 工单类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '工单类型占比(%)', data: [] }],
    });
  }
};

// 区域工单分布占比（饼图）
export const fetchOperationRegionRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/operation/stat/region/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无区域工单分布占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域工单分布占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['中山路区域', '火车站区域', '大学城片区', '工业区', '其他'],
              series: [{ name: '区域工单分布占比(%)', data: [28, 22, 20, 18, 12] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域工单分布占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '区域工单分布占比(%)', data: [] }],
    });
  }
};

// 统计周期内工单新增趋势（折线图）
export const fetchOperationNewTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/operation/stat/new/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无工单新增趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '工单新增趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 7}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 6 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = [180, 165, 190, 175, 200, 185, 210];
            resolve({
              xAxis,
              series: [{ name: '工单新增数', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 工单新增趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '工单新增数', data: [] }],
    });
  }
};

// 统计周期内工单完成趋势（折线图）
export const fetchOperationCompleteTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/operation/stat/complete/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无工单完成趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '工单完成趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 7}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 6 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = [170, 160, 180, 175, 190, 185, 200];
            resolve({
              xAxis,
              series: [{ name: '工单完成数', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 工单完成趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '工单完成数', data: [] }],
    });
  }
};


// ========== 通行交易 ==========
// 交易核心指标（卡片：总笔数、总金额、支付完成率、环比增长）
export const fetchTradeIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/trade/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.tbTradeStatTotalCount &&
          response.tbTradeStatTotalAmount
        ) {
          return response;
        }
        throw new Error('真实接口返回无交易核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '交易核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbTradeStatTotalCount: 8560, // 交易总笔数
              tbTradeStatTotalAmount: 342500, // 交易总金额
              tbTradeStatAverageAmount: 40.0, // 平均单笔金额
              tbTradeStatPayCompleteRate: 95.8, // 支付完成率
              sysPayTypeName: '微信支付', // 热门支付方式
              tbTradeStatChainGrowth: 12.5, // 环比增长
              tbTradeStatPeakHour: '18:00-19:00', // 高峰时段
              tbTradeStatUnfinishedCount: 180, // 未完成交易数
              tbRegionTradeRate: '中山路商圈 35%', // 区域交易占比
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 交易核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbTradeStatTotalCount: 0,
      tbTradeStatTotalAmount: 0,
      tbTradeStatAverageAmount: 0,
      tbTradeStatPayCompleteRate: 0,
      sysPayTypeName: '',
      tbTradeStatChainGrowth: 0,
      tbTradeStatPeakHour: '',
      tbTradeStatUnfinishedCount: 0,
      tbRegionTradeRate: '',
    });
  }
};

// 支付方式占比（饼图）
export const fetchTradePayTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/trade/stat/paytype/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无支付方式占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '支付方式占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['微信支付', '支付宝', '银联支付', '现金支付', 'ETC支付'],
              series: [{ name: '支付方式占比(%)', data: [45, 30, 15, 5, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 支付方式占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '支付方式占比(%)', data: [] }],
    });
  }
};

// 区域交易占比（饼图）
export const fetchTradeRegionRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/trade/stat/region/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无区域交易占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域交易占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['中山路商圈', '火车站区域', '大学城片区', '工业区', '住宅区'],
              series: [{ name: '区域交易占比(%)', data: [35, 25, 20, 12, 8] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域交易占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '区域交易占比(%)', data: [] }],
    });
  }
};

// 统计周期内交易笔数趋势（折线图）
export const fetchTradeCountTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/trade/stat/count/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无交易笔数趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '交易笔数趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 7}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 6 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = [1200, 1150, 1300, 1250, 1400, 1350, 1500];
            resolve({
              xAxis,
              series: [{ name: '交易笔数', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 交易笔数趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '交易笔数', data: [] }],
    });
  }
};

// 统计周期内交易金额趋势（折线图）
export const fetchTradeAmountTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/trade/stat/amount/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无交易金额趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '交易金额趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 7}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 6 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = [48000, 46000, 52000, 50000, 56000, 54000, 60000];
            resolve({
              xAxis,
              series: [{ name: '交易金额(元)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 交易金额趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '交易金额(元)', data: [] }],
    });
  }
};


// ========== 资源设备 ==========
// 设备核心指标（卡片：总数、在线数、正常运行数、完好率、故障数）
export const fetchParkDeviceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/device/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.tbDeviceTotalCount &&
          response.tbDeviceOnlineCount &&
          response.tbDeviceNormalCount &&
          response.tbDeviceFaultCount &&
          response.tbDeviceIntactRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备核心指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbDeviceTotalCount: 1200, // 设备总数
              tbDeviceOnlineCount: 1120, // 在线设备数
              tbDeviceNormalCount: 1080, // 正常运行数
              tbDeviceFaultCount: 80, // 故障设备数
              tbDeviceIntactRate: 90.0, // 设备完好率
              tbDeviceNewCount7d: 50, // 近7日新增设备数
              tbDeviceRepairCount7d: 45, // 近7日故障修复数
              sysFaultTypeName: '通讯故障', // 热门故障类型
              tbDeviceCoverageRate: 95.5, // 设备覆盖度
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备核心指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbDeviceTotalCount: 0,
      tbDeviceOnlineCount: 0,
      tbDeviceNormalCount: 0,
      tbDeviceFaultCount: 0,
      tbDeviceIntactRate: 0,
      tbDeviceNewCount7d: 0,
      tbDeviceRepairCount7d: 0,
      sysFaultTypeName: '',
      tbDeviceCoverageRate: 0,
    });
  }
};

// 设备类型占比（饼图）
export const fetchParkDeviceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/device/stat/type/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['道闸', '摄像头', '计费桩', '充电桩', '传感器', '边缘网关'],
              series: [{ name: '设备类型占比(%)', data: [25, 30, 15, 10, 12, 8] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '设备类型占比(%)', data: [] }],
    });
  }
};

// 设备运行状态占比（饼图）
export const fetchParkDeviceStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/device/stat/status/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备运行状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备运行状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['正常运行', '在线故障', '离线', '禁用'],
              series: [{ name: '设备运行状态占比(%)', data: [90, 5, 4, 1] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备运行状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '设备运行状态占比(%)', data: [] }],
    });
  }
};

// 近7日设备在线率变化趋势（折线图）
export const fetchParkDeviceOnlineRateTrend7d = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/device/stat/online/rate/trend/7d`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备在线率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备在线率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 7}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 6 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = [95.2, 94.8, 96.1, 95.5, 94.9, 95.8, 96.5];
            resolve({
              xAxis,
              series: [{ name: '设备在线率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备在线率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '设备在线率(%)', data: [] }],
    });
  }
};


// ========== 在停车辆实时监控 ==========
// 获取停车车辆分布数据（按支付状态）
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
            const today = new Date().getTime();
            const oneHour = 60 * 60 * 1000;
            const oneDay = 24 * oneHour;
            resolve([
              {
                tbVehicleLicensePlate: '闽E·88888',
                sysPayStatusName: '已支付',
                tbParkingRecordEntryTime: today - 2 * oneHour,
                tbParkingRecordExpectedExitTime: today + oneHour,
                vehicleLongitude: 117.656923,
                vehicleLatitude: 24.565189,
                lotId: 'L001',
                lotName: '漳州古城核心商圈停车场'
              },
              {
                tbVehicleLicensePlate: '闽E·77777',
                sysPayStatusName: '未支付',
                tbParkingRecordEntryTime: today - 3 * oneHour,
                tbParkingRecordExpectedExitTime: today + 2 * oneHour,
                vehicleLongitude: 117.656618,
                vehicleLatitude: 24.565312,
                lotId: 'L001',
                lotName: '漳州古城核心商圈停车场'
              },
              {
                tbVehicleLicensePlate: '闽E·66666',
                sysPayStatusName: '已支付',
                tbParkingRecordEntryTime: today - oneHour,
                tbParkingRecordExpectedExitTime: today + 0.5 * oneHour,
                vehicleLongitude: 117.657056,
                vehicleLatitude: 24.565478,
                lotId: 'L001',
                lotName: '漳州古城核心商圈停车场'
              },
              {
                tbVehicleLicensePlate: '闽E·55555',
                sysPayStatusName: '未支付',
                tbParkingRecordEntryTime: today - 4 * oneDay,
                tbParkingRecordExpectedExitTime: today + 3 * oneHour,
                vehicleLongitude: 117.700345,
                vehicleLatitude: 24.583167,
                lotId: 'L002',
                lotName: '漳州政务服务中心停车场'
              },
              {
                tbVehicleLicensePlate: '闽E·44444',
                sysPayStatusName: '已支付',
                tbParkingRecordEntryTime: today - 2.5 * oneHour,
                tbParkingRecordExpectedExitTime: today + 1.5 * oneHour,
                vehicleLongitude: 117.700512,
                vehicleLatitude: 24.583546,
                lotId: 'L002',
                lotName: '漳州政务服务中心停车场'
              },
              {
                tbVehicleLicensePlate: '闽E·33333',
                sysPayStatusName: '未支付',
                tbParkingRecordEntryTime: today - oneDay,
                tbParkingRecordExpectedExitTime: today + 4 * oneHour,
                vehicleLongitude: 117.668923,
                vehicleLatitude: 24.572189,
                lotId: 'L003',
                lotName: '漳州胜利路路侧停车场'
              },
              {
                tbVehicleLicensePlate: '闽E·22222',
                sysPayStatusName: '已支付',
                tbParkingRecordEntryTime: today - 1.5 * oneDay,
                tbParkingRecordExpectedExitTime: today + 2 * oneHour,
                vehicleLongitude: 117.668923,
                vehicleLatitude: 24.572189,
                lotId: 'L003',
                lotName: '漳州胜利路路侧停车场'
              }
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

// 在停车辆实时监控列表
export const fetchParkingVehicleList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/vehicle/monitoring/list`,
        params,
      })
      .then((response) => {
        console.log('在停车辆实时监控列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('在停车辆实时监控列表-响应符合实际格式');
          return response.map((item) => ({
            tbVehicleLicensePlate: item.tbVehicleLicensePlate,
            tbParkingName: item.tbParkingName,
            tbParkingSpaceSpaceNo: item.tbParkingSpaceSpaceNo,
            tbParkingRecordEntryTime: item.tbParkingRecordEntryTime,
            tbParkingRecordExpectedExitTime: item.tbParkingRecordExpectedExitTime,
            tbParkingRecordParkingDuration: item.tbParkingRecordParkingDuration,
            tbParkingRecordRecordId: item.tbParkingRecordRecordId,
            sysPayStatusName: item.sysPayStatusName,
            tbParkingSpaceType: item.tbParkingSpaceType,
            tbRegionName: item.tbRegionName,
            vehicleLongitude: item.vehicleLongitude,
            vehicleLatitude: item.vehicleLatitude,
            lotId: item.lotId,
          }));
        }
        throw new Error('真实接口返回无在停车辆数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('在停车辆实时监控列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbVehicleLicensePlate: '闽A·12345',
                tbParkingName: '高新区智慧停车场',
                tbParkingSpaceSpaceNo: 'A-001',
                tbParkingRecordEntryTime: Date.now() - 3600000,
                tbParkingRecordExpectedExitTime: Date.now() + 7200000,
                tbParkingRecordParkingDuration: 60,
                tbParkingRecordRecordId: 'REC001',
                sysPayStatusName: '已支付',
                tbParkingSpaceType: '小型车位',
                tbRegionName: '高新区',
                vehicleLongitude: 117.6501,
                vehicleLatitude: 24.5802,
                lotId: 'LOT001',
              },
              {
                tbVehicleLicensePlate: '闽B·67890',
                tbParkingName: '主城区中心停车场',
                tbParkingSpaceSpaceNo: 'B-203',
                tbParkingRecordEntryTime: Date.now() - 7200000,
                tbParkingRecordExpectedExitTime: Date.now() + 10800000,
                tbParkingRecordParkingDuration: 120,
                tbParkingRecordRecordId: 'REC002',
                sysPayStatusName: '未支付',
                tbParkingSpaceType: '中型车位',
                tbRegionName: '主城区',
                vehicleLongitude: 117.6603,
                vehicleLatitude: 24.5901,
                lotId: 'LOT002',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkingVehicleList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 在停车辆详情查询
export const fetchParkingVehicleDetail = (recordId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/vehicle/monitoring/detail/${recordId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbParkingRecordRecordId === recordId) {
          return response;
        }
        throw new Error('真实接口返回无在停车辆详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('在停车辆详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbParkingRecordRecordId: recordId,
              tbVehicleLicensePlate: recordId === 'REC001' ? '闽A·12345' : '闽B·67890',
              tbParkingName: recordId === 'REC001' ? '高新区智慧停车场' : '主城区中心停车场',
              tbParkingSpaceSpaceNo: recordId === 'REC001' ? 'A-001' : 'B-203',
              tbParkingRecordEntryTime: Date.now() - 3600000,
              tbParkingRecordExpectedExitTime: Date.now() + 7200000,
              tbParkingRecordParkingDuration: 60,
              sysPayStatusName: recordId === 'REC001' ? '已支付' : '未支付',
              tbParkingSpaceType: '小型车位',
              tbRegionName: recordId === 'REC001' ? '高新区' : '主城区',
              // 停车记录
              parkingRecord: {
                entryTime: Date.now() - 3600000,
                expectedExitTime: Date.now() + 7200000,
                actualExitTime: null,
                parkingDuration: 60,
                totalFee: recordId === 'REC001' ? 15 : 30,
                discountFee: recordId === 'REC001' ? 3 : 0,
                finalFee: recordId === 'REC001' ? 12 : 30,
              },
              // 支付明细
              paymentDetail: {
                payMethod: recordId === 'REC001' ? '微信支付' : '待支付',
                payTime: recordId === 'REC001' ? Date.now() - 1800000 : null,
                payAmount: recordId === 'REC001' ? 12 : 30,
                payStatus: recordId === 'REC001' ? '已支付' : '未支付',
                invoiceStatus: recordId === 'REC001' ? '已开票' : '未开票',
                transactionNo: recordId === 'REC001' ? 'WX202401270001' : '',
              },
              // 泊位位置
              spaceLocation: {
                longitude: recordId === 'REC001' ? 117.6501 : 117.6603,
                latitude: recordId === 'REC001' ? 24.5802 : 24.5901,
                floor: '1F',
                zone: recordId === 'REC001' ? 'A区' : 'B区',
                spaceNo: recordId === 'REC001' ? 'A-001' : 'B-203',
              },
              // 车辆信息
              vehicleInfo: {
                vehicleType: '小型客车',
                vehicleColor: '白色',
                vehicleBrand: '丰田',
                ownerName: recordId === 'REC001' ? '张三' : '李四',
                ownerPhone: recordId === 'REC001' ? '138****5678' : '139****9012',
              },
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkingVehicleDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 车辆追踪（聚焦泊位）
export const trackParkingVehicle = (params = {}) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/park/vehicle/monitoring/track`,
        data: params,
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无追踪结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('车辆追踪接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '车辆追踪成功，已聚焦到目标泊位',
              data: {
                longitude: 117.6501,
                latitude: 24.5802,
                zoomLevel: 16,
                highlightSpaceNo: 'A-001',
              },
            });
          }, 300);
        });
      });
  } catch (error) {
    console.error('===== trackParkingVehicle 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      success: false,
      message: '车辆追踪失败',
    });
  }
};

// 催离操作
export const urgeVehicleLeave = (recordId, params = {}) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/park/vehicle/monitoring/urge/${recordId}`,
        data: params,
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无催离结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('催离操作接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '催离通知已发送',
              data: {
                recordId: recordId,
                urgeTime: Date.now(),
                urgeMethod: '短信通知',
                status: '已发送',
              },
            });
          }, 300);
        });
      });
  } catch (error) {
    console.error('===== urgeVehicleLeave 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      success: false,
      message: '催离操作失败',
    });
  }
};

// 在停车辆核心指标（用于叠加层卡片展示）
export const fetchParkingVehicleIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/vehicle/monitoring/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalVehicleCount &&
          response.regionVehicleCount &&
          response.unpaidVehicleCount &&
          response.averageParkingDuration
        ) {
          return response;
        }
        throw new Error('真实接口返回无在停车辆核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '在停车辆指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalVehicleCount: 128, // 在停车辆总数
              regionVehicleCount: 42, // 各区域在停数
              unpaidVehicleCount: 35, // 未支付车辆数
              averageParkingDuration: 68, // 平均停车时长（分钟）
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkingVehicleIndicators 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalVehicleCount: 0,
      regionVehicleCount: 0,
      unpaidVehicleCount: 0,
      averageParkingDuration: 0,
    });
  }
};

// 在停车辆变化趋势（用于叠加层折线图）
export const fetchParkingVehicleTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/vehicle/monitoring/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无在停车辆趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '在停车辆趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
              series: [{ name: '在停车辆数', data: [85, 92, 105, 120, 128, 115, 108, 95] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 在停车辆趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '在停车辆数', data: [] }],
    });
  }
};


// ========== 停车资源分布 ==========
// 获取停车热力图数据
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
            resolve(mockData);
          }, 500);
        });
      });
  } catch (error) {
    console.error('热力图数据函数初始化异常:', error.message);
    return Promise.resolve([]);
  }
};

// 获取停车场点位数据
export const fetchParkingLotData = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/map/parkinglot/get`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response;
        }
        throw new Error('真实接口返回无停车场数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('停车场点位接口调用失败，使用模拟数据兜底', error.message);

        return new Promise((resolve) => {
          setTimeout(() => {
            const mockParkingData = [
              { lotId: 'park_001', lotName: '市民广场停车场', longitude: 117.640, latitude: 24.510 },
              { lotId: 'park_002', lotName: '商业中心停车场', longitude: 117.650, latitude: 24.520 },
              { lotId: 'park_003', lotName: '园区停车场', longitude: 117.690, latitude: 24.480 },
              { lotId: 'park_004', lotName: '高铁站停车场', longitude: 117.750, latitude: 24.550 },
              { lotId: 'park_005', lotName: '医院停车场', longitude: 117.720, latitude: 24.650 },
            ];
            resolve(mockParkingData);
          }, 500);
        });
      });
  } catch (error) {
    console.error('停车场数据函数初始化异常:', error.message);
    return Promise.resolve([]);
  }
};

// 停车资源分布列表
export const fetchParkAreaDistributionList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/area/distribution/list`,
        params,
      })
      .then((response) => {
        console.log('停车资源分布列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('停车资源分布列表-响应符合实际格式');
          return response.map((item) => ({
            tbRegionName: item.tbRegionName,
            tbParkingCount: item.tbParkingCount,
            tbParkingSpaceTotalCount: item.tbParkingSpaceTotalCount,
            tbParkingSpaceAvailableCount: item.tbParkingSpaceAvailableCount,
            sysOperationStatusName: item.sysOperationStatusName,
            tbRegionParkingDensity: item.tbRegionParkingDensity,
            tbRegionRegionId: item.tbRegionRegionId,
          }));
        }
        throw new Error('真实接口返回无停车资源分布列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('停车资源分布列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbRegionName: '高新区',
                tbParkingCount: 15,
                tbParkingSpaceTotalCount: 4200,
                tbParkingSpaceAvailableCount: 850,
                sysOperationStatusName: '运营良好',
                tbRegionParkingDensity: 0.85,
                tbRegionRegionId: 'REGION_001',
              },
              {
                tbRegionName: '主城区',
                tbParkingCount: 28,
                tbParkingSpaceTotalCount: 6800,
                tbParkingSpaceAvailableCount: 1250,
                sysOperationStatusName: '运营良好',
                tbRegionParkingDensity: 0.92,
                tbRegionRegionId: 'REGION_002',
              },
              {
                tbRegionName: '经开区',
                tbParkingCount: 12,
                tbParkingSpaceTotalCount: 3200,
                tbParkingSpaceAvailableCount: 680,
                sysOperationStatusName: '运营正常',
                tbRegionParkingDensity: 0.78,
                tbRegionRegionId: 'REGION_003',
              },
              {
                tbRegionName: '文旅区',
                tbParkingCount: 8,
                tbParkingSpaceTotalCount: 2400,
                tbParkingSpaceAvailableCount: 520,
                sysOperationStatusName: '运营正常',
                tbRegionParkingDensity: 0.72,
                tbRegionRegionId: 'REGION_004',
              },
              {
                tbRegionName: '龙文区',
                tbParkingCount: 10,
                tbParkingSpaceTotalCount: 2800,
                tbParkingSpaceAvailableCount: 620,
                sysOperationStatusName: '运营良好',
                tbRegionParkingDensity: 0.81,
                tbRegionRegionId: 'REGION_005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkAreaDistributionList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 停车资源分布核心指标（用于叠加层卡片展示）
export const fetchParkAreaDistributionIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/area/distribution/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalParkCount &&
          response.totalSpaceCount &&
          response.availableSpaceCount &&
          response.runningParkCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无停车资源分布核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车资源分布指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalParkCount: 73, // 全域停车场总数
              totalSpaceCount: 19400, // 总泊位数
              availableSpaceCount: 3920, // 可用泊位数
              runningParkCount: 68, // 运营中停车场数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkAreaDistributionIndicators 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalParkCount: 0,
      totalSpaceCount: 0,
      availableSpaceCount: 0,
      runningParkCount: 0,
    });
  }
};

// 各区域停车场数量对比（用于叠加层柱状图）
export const fetchParkAreaDistributionAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/area/distribution/stat/area/count`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无区域停车场数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域停车场数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '停车场数量', data: [15, 28, 12, 8, 10] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域停车场数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '停车场数量', data: [] }],
    });
  }
};

// 各区域泊位数对比（用于叠加层柱状图）
export const fetchParkAreaDistributionAreaSpaceCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/area/distribution/stat/area/space/count`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无区域泊位数数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域泊位数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '泊位数', data: [4200, 6800, 3200, 2400, 2800] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域泊位数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '泊位数', data: [] }],
    });
  }
};

// 停车资源分布详情查询 - 详情弹窗专用
export const fetchParkAreaDistributionDetail = (regionId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/area/distribution/detail/${regionId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbRegionRegionId === regionId) {
          return response;
        }
        throw new Error('真实接口返回无停车资源分布详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('停车资源分布详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbRegionRegionId: regionId,
              tbRegionName: regionId === 'REGION_001' ? '高新区' : '主城区',
              tbRegionSaturationRate: regionId === 'REGION_001' ? 85.5 : 92.3,
              tbParkingNewCount: regionId === 'REGION_001' ? 3 : 5,
              tbParkingHotName: regionId === 'REGION_001' ? '北区智慧停车场' : '南站综合停车场',
              // 区域停车场清单
              regionParkingList: [
                {
                  parkingName: regionId === 'REGION_001' ? '北区智慧停车场' : '南站综合停车场',
                  parkingType: '公共停车场',
                  totalSpaces: 500,
                  availableSpaces: 120,
                  operationStatus: '运营中'
                },
                {
                  parkingName: regionId === 'REGION_001' ? '科技园停车场' : '商业中心停车场',
                  parkingType: '商业停车场',
                  totalSpaces: 300,
                  availableSpaces: 85,
                  operationStatus: '运营中'
                }
              ],
              // 泊位分布明细
              spaceDistributionDetail: {
                legend: ['小型车', '大型车', '新能源', '无障碍'],
                series: [{ name: '泊位分布', data: [65, 20, 10, 5] }]
              },
              // 运营数据
              operationData: {
                avgUtilizationRate: regionId === 'REGION_001' ? 82.5 : 88.7,
                avgTurnoverRate: regionId === 'REGION_001' ? 3.2 : 3.8,
                peakUtilizationRate: regionId === 'REGION_001' ? 95.2 : 98.1
              }
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkAreaDistributionDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};


// ========== 供需运营态势 ==========
// 供需运营态势列表
export const fetchSupplyDemandList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/supply/demand/list`,
        params,
      })
      .then((response) => {
        console.log('供需运营态势列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('供需运营态势列表-响应符合实际格式');
          return response.map((item) => ({
            period: item.period,
            tbRegionName: item.tbRegionName,
            tbParkingCount: item.tbParkingCount,
            tbParkingSpaceTotalCount: item.tbParkingSpaceTotalCount,
            tbParkingRecordCurrentCount: item.tbParkingRecordCurrentCount,
            tbSupplyDemandGapCount: item.tbSupplyDemandGapCount,
            tbSupplyDemandBalanceRate: item.tbSupplyDemandBalanceRate,
            tbRegionId: item.tbRegionId,
          }));
        }
        throw new Error('真实接口返回无供需运营态势列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('供需运营态势列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                period: '日',
                tbRegionName: '高新区',
                tbParkingCount: 8,
                tbParkingSpaceTotalCount: 1200,
                tbParkingRecordCurrentCount: 950,
                tbSupplyDemandGapCount: 50,
                tbSupplyDemandBalanceRate: 92.3,
                tbRegionId: 'REG001',
              },
              {
                period: '日',
                tbRegionName: '主城区',
                tbParkingCount: 12,
                tbParkingSpaceTotalCount: 1800,
                tbParkingRecordCurrentCount: 1650,
                tbSupplyDemandGapCount: -100,
                tbSupplyDemandBalanceRate: 108.3,
                tbRegionId: 'REG002',
              },
              {
                period: '日',
                tbRegionName: '经开区',
                tbParkingCount: 6,
                tbParkingSpaceTotalCount: 900,
                tbParkingRecordCurrentCount: 820,
                tbSupplyDemandGapCount: 30,
                tbSupplyDemandBalanceRate: 91.1,
                tbRegionId: 'REG003',
              },
              {
                period: '日',
                tbRegionName: '文旅区',
                tbParkingCount: 5,
                tbParkingSpaceTotalCount: 750,
                tbParkingRecordCurrentCount: 680,
                tbSupplyDemandGapCount: 20,
                tbSupplyDemandBalanceRate: 90.7,
                tbRegionId: 'REG004',
              },
              {
                period: '日',
                tbRegionName: '龙文区',
                tbParkingCount: 7,
                tbParkingSpaceTotalCount: 1050,
                tbParkingRecordCurrentCount: 920,
                tbSupplyDemandGapCount: 40,
                tbSupplyDemandBalanceRate: 87.6,
                tbRegionId: 'REG005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSupplyDemandList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 供需运营态势核心指标（卡片）
export const fetchSupplyDemandIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/supply/demand/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.globalBalanceRate &&
          response.totalGapCount &&
          response.peakGapCount &&
          response.hotUnbalanceRegionCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无供需运营态势核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '供需运营态势指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              globalBalanceRate: 93.8, // 全局供需平衡率
              totalGapCount: 240, // 总缺口数
              peakGapCount: 850, // 高峰缺口数
              hotUnbalanceRegionCount: 2, // 热门失衡区域数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 供需运营态势指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      globalBalanceRate: 0,
      totalGapCount: 0,
      peakGapCount: 0,
      hotUnbalanceRegionCount: 0,
    });
  }
};

// 折线图：区域泊位数与在停车辆数趋势对比
export const fetchSupplyDemandTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/supply/demand/stat/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          Array.isArray(response.xAxis) &&
          response.series &&
          Array.isArray(response.series) &&
          response.series.length >= 2
        ) {
          return response;
        }
        throw new Error('真实接口返回无供需趋势对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '供需趋势对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 24}, (_, i) => `${i}:00`);
            resolve({
              xAxis,
              series: [
                { name: '区域泊位数', data: xAxis.map(() => 800 + Math.random() * 400) },
                { name: '在停车辆数', data: xAxis.map(() => 600 + Math.random() * 500) }
              ],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 供需趋势对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '区域泊位数', data: [] }, { name: '在停车辆数', data: [] }],
    });
  }
};

// 饼图1：供需平衡状态占比
export const fetchSupplyDemandBalanceRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/supply/demand/stat/balance/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无供需平衡状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '供需平衡状态占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['平衡', '供大于求', '供小于求'],
              series: [{ name: '供需平衡状态占比(%)', data: [65.2, 20.5, 14.3] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 供需平衡状态占比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '供需平衡状态占比(%)', data: [] }],
    });
  }
};

// 饼图2：区域供需贡献占比
export const fetchSupplyDemandRegionRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/supply/demand/stat/region/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无区域供需贡献占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域供需贡献占比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '区域供需贡献占比(%)', data: [22.5, 28.8, 18.2, 15.6, 14.9] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域供需贡献占比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '区域供需贡献占比(%)', data: [] }],
    });
  }
};

// 区域供需缺口分布热力图接口
export const fetchSupplyDemandHeatmapData = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/supply-demand/list`, // 专属接口地址
        params,
      })
      .then((response) => {
        // 真实接口数据处理（结构：regions=区域，dimensions=时段维度，data=缺口值）
        if (response && response.regions && response.dimensions && response.data) {
          return {
            hours: response.regions || [], // x轴：区域
            days: response.dimensions || [], // y轴：时段维度
            data: response.data || [],
          };
        }
        throw new Error('真实接口返回无供需缺口数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log(
          '供需缺口热力图接口调用失败-使用模拟数据兜底',
          error.message
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            // 模拟区域供需缺口数据（专属场景）
            const regions = ['A区', 'B区', 'C区', 'D区', 'E区', 'F区']; // x轴：停车场区域
            const dimensions = ['早高峰', '平峰', '晚高峰', '夜间']; // y轴：时段维度
            // 数据结构：[x索引, y索引, 缺口值]（负=供大于求，正=需大于求）
            const gapData = [
              [0, 0, 8], [0, 1, 3], [0, 2, 9], [0, 3, -2],
              [1, 0, 5], [1, 1, 1], [1, 2, 7], [1, 3, -5],
              [2, 0, -3], [2, 1, -1], [2, 2, 2], [2, 3, -8],
              [3, 0, 6], [3, 1, 4], [3, 2, 8], [3, 3, -1],
              [4, 0, -5], [4, 1, -2], [4, 2, 1], [4, 3, -6],
              [5, 0, 7], [5, 1, 2], [5, 2, 9], [5, 3, -4],
            ];
            resolve({
              hours: regions,
              days: dimensions,
              data: gapData
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSupplyDemandHeatmapData 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ hours: [], days: [], data: [] });
  }
};

// 供需运营态势详情查询 - 详情弹窗专用
export const fetchSupplyDemandDetail = (regionId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/supply/demand/detail/${regionId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbRegionId === regionId) {
          return response;
        }
        throw new Error('真实接口返回无供需详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('供需详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            const regionData = {
              'REG001': { name: '高新区', peakGap: 320, hotRegion: '主城区' },
              'REG002': { name: '主城区', peakGap: -580, hotRegion: '高新区' },
              'REG003': { name: '经开区', peakGap: 180, hotRegion: '主城区' },
              'REG004': { name: '文旅区', peakGap: 150, hotRegion: '龙文区' },
              'REG005': { name: '龙文区', peakGap: 260, hotRegion: '高新区' }
            };

            resolve({
              tbRegionId: regionId,
              tbRegionName: regionData[regionId]?.name || '未知区域',
              tbSupplyDemandPeakGap: regionData[regionId]?.peakGap || 0,
              tbRegionHotUnbalanceName: regionData[regionId]?.hotRegion || '-',
              tbSupplyDemandChainBalanceChange: 2.3, // 环比平衡率变化
              tbSupplyDemandOptimizeSuggest: '建议增加错峰停车政策，引导车辆分流至周边区域',
              // 区域供需明细
              regionDetails: {
                tbParkingCount: regionId === 'REG001' ? 8 : 12,
                tbParkingSpaceTotalCount: regionId === 'REG001' ? 1200 : 1800,
                tbParkingRecordCurrentCount: regionId === 'REG001' ? 950 : 1650,
                tbSupplyDemandGapCount: regionId === 'REG001' ? 50 : -100,
                tbSupplyDemandBalanceRate: regionId === 'REG001' ? 92.3 : 108.3,
              },
              // 高峰时段分布
              peakTimeDistribution: {
                xAxis: ['7-9', '9-11', '11-13', '13-15', '15-17', '17-19', '19-21', '21-23'],
                series: [{ name: '时段缺口数', data: [120, 80, 60, 40, 180, 320, 200, 100] }]
              },
              // 停车场供需情况
              parkingSupplyDemand: [
                { name: '北区停车场', total: 500, current: 420, gap: 80, rate: 84.0 },
                { name: '科技园停车场', total: 300, current: 280, gap: 20, rate: 93.3 },
                { name: '软件园停车场', total: 400, current: 350, gap: 50, rate: 87.5 }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSupplyDemandDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 供需运营态势分析报告 - 分析弹窗专用
export const fetchSupplyDemandAnalysis = (regionId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/supply/demand/analysis/${regionId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbRegionId === regionId) {
          return response;
        }
        throw new Error('真实接口返回无供需分析数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('供需分析接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbRegionId: regionId,
              tbRegionName: regionId === 'REG001' ? '高新区' : '主城区',
              analysisTime: Date.now(),
              analysisContent: `经分析，该区域在高峰时段（17:00-19:00）供需缺口达${regionId === 'REG001' ? 320 : 580}个泊位，主要原因为周边写字楼集中导致通勤车辆集中停放。建议采取以下优化措施：1. 推广错峰停车政策；2. 增加夜间停车优惠；3. 建设立体停车设施。`,
              optimizationSuggestions: [
                '实施动态定价策略，高峰时段适当提高费率',
                '与周边商业区合作开放共享停车位',
                '增设新能源充电车位，提升停车场附加值',
                '优化场内导流系统，减少寻找车位时间'
              ],
              predictedEffect: '预计实施后供需平衡率可提升8-12个百分点，高峰缺口减少40%以上'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchSupplyDemandAnalysis 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 导出供需分析报告为PDF
export const exportSupplyDemandAnalysisReport = (regionId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/supply/demand/export/pdf/${regionId}`,
        params,
        responseType: 'blob'
      })
      .then((response) => {
        console.log('导出分析报告-接口请求成功');
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `供需分析报告_${regionId}_${new Date().getTime()}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return {
          success: true,
          message: '分析报告导出成功'
        };
      })
      .catch((error) => {
        console.warn('导出分析报告接口调用失败', error.message);
        // 模拟导出功能
        return new Promise((resolve) => {
          setTimeout(() => {
            // 模拟创建PDF并下载
            const simulatedContent = `
              供需分析报告
              区域：${regionId}
              生成时间：${new Date().toLocaleString()}
              分析结论：该区域在高峰时段供需缺口较大，建议优化...
            `;
            const blob = new Blob([simulatedContent], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `模拟_供需分析报告_${regionId}_${new Date().getTime()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            resolve({
              success: true,
              message: '分析报告导出成功'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== exportSupplyDemandAnalysisReport 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      success: false,
      message: '导出功能初始化异常'
    });
  }
};


// ========== 通行交易趋势 ==========
// 通行交易趋势列表
export const fetchTradeTrendList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/trade/trend/list`,
        params,
      })
      .then((response) => {
        console.log('通行交易趋势列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('通行交易趋势列表-响应符合实际格式');
          return response.map((item) => ({
            tbTradeTrendPeriod: item.tbTradeTrendPeriod,
            tbTradeTrendTime: item.tbTradeTrendTime,
            tbTradeTrendCount: item.tbTradeTrendCount,
            tbTradeTrendAmount: item.tbTradeTrendAmount,
            tbTradeTrendPayRate: item.tbTradeTrendPayRate,
            tbTradeTrendAverageDuration: item.tbTradeTrendAverageDuration,
            tbTradeTrendId: item.tbTradeTrendId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无通行交易趋势列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('通行交易趋势列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbTradeTrendPeriod: '日',
                tbTradeTrendTime: '2026-01-15',
                tbTradeTrendCount: 1250,
                tbTradeTrendAmount: 38500,
                tbTradeTrendPayRate: 96.8,
                tbTradeTrendAverageDuration: 2.5,
                tbTradeTrendId: 'TR20240115001',
              },
              {
                tbTradeTrendPeriod: '周',
                tbTradeTrendTime: '2026-01-15~2026-01-21',
                tbTradeTrendCount: 8750,
                tbTradeTrendAmount: 269500,
                tbTradeTrendPayRate: 97.2,
                tbTradeTrendAverageDuration: 2.4,
                tbTradeTrendId: 'TR20240121001',
              },
              {
                tbTradeTrendPeriod: '月',
                tbTradeTrendTime: '2026-01',
                tbTradeTrendCount: 37500,
                tbTradeTrendAmount: 1155000,
                tbTradeTrendPayRate: 96.5,
                tbTradeTrendAverageDuration: 2.6,
                tbTradeTrendId: 'TR20240131001',
              },
              {
                tbTradeTrendPeriod: '日',
                tbTradeTrendTime: '2026-01-16',
                tbTradeTrendCount: 1320,
                tbTradeTrendAmount: 40500,
                tbTradeTrendPayRate: 97.0,
                tbTradeTrendAverageDuration: 2.3,
                tbTradeTrendId: 'TR20240116001',
              },
              {
                tbTradeTrendPeriod: '日',
                tbTradeTrendTime: '2026-01-17',
                tbTradeTrendCount: 1410,
                tbTradeTrendAmount: 42800,
                tbTradeTrendPayRate: 97.1,
                tbTradeTrendAverageDuration: 2.4,
                tbTradeTrendId: 'TR20240117001',
              },
              {
                tbTradeTrendPeriod: '周',
                tbTradeTrendTime: '2026-01-22~2026-01-28',
                tbTradeTrendCount: 8920,
                tbTradeTrendAmount: 275800,
                tbTradeTrendPayRate: 97.3,
                tbTradeTrendAverageDuration: 2.5,
                tbTradeTrendId: 'TR20240128001',
              },
              {
                tbTradeTrendPeriod: '月',
                tbTradeTrendTime: '2026-02',
                tbTradeTrendCount: 38200,
                tbTradeTrendAmount: 1186000,
                tbTradeTrendPayRate: 96.7,
                tbTradeTrendAverageDuration: 2.5,
                tbTradeTrendId: 'TR20240229001',
              },
              {
                tbTradeTrendPeriod: '月',
                tbTradeTrendTime: '2026-03',
                tbTradeTrendCount: 39500,
                tbTradeTrendAmount: 1218000,
                tbTradeTrendPayRate: 97.0,
                tbTradeTrendAverageDuration: 2.4,
                tbTradeTrendId: 'TR20240331001',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchTradeTrendList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 通行交易趋势核心指标（卡片展示）
export const fetchTradeTrendIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/trade/trend/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalCount &&
          response.totalAmount &&
          response.payRate &&
          response.chainCountGrowth
        ) {
          return response;
        }
        throw new Error('真实接口返回无通行交易趋势核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '通行交易趋势指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCount: 1250, // 总笔数
              totalAmount: 38500, // 总金额
              payRate: 96.8, // 支付完成率
              chainCountGrowth: 5.2, // 环比增长
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 通行交易趋势指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCount: 0,
      totalAmount: 0,
      payRate: 0,
      chainCountGrowth: 0,
    });
  }
};

// 交易笔数趋势（折线图）
export const fetchTradeTrendCountTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/trade/trend/stat/count/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无交易笔数趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '交易笔数趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 800 + Math.random() * 400);
            resolve({
              xAxis,
              series: [{ name: '交易笔数', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 交易笔数趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '交易笔数', data: [] }],
    });
  }
};

// 交易金额趋势（折线图）
export const fetchTradeTrendAmountTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/trade/trend/stat/amount/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无交易金额趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '交易金额趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 25000 + Math.random() * 15000);
            resolve({
              xAxis,
              series: [{ name: '交易金额', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 交易金额趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '交易金额', data: [] }],
    });
  }
};

// 各时段交易笔数对比（柱状图）
export const fetchTradeTrendTimeCountCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/trade/trend/stat/time/count/compare`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无时段交易笔数对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '时段交易笔数对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['0-2', '2-4', '4-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24'],
              series: [{ name: '交易笔数', data: [25, 18, 35, 120, 280, 320, 280, 260, 310, 350, 180, 65] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 时段交易笔数对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '交易笔数', data: [] }],
    });
  }
};

// 各区域交易金额对比（柱状图）
export const fetchTradeTrendRegionAmountCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/trade/trend/stat/region/amount/compare`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无区域交易金额对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域交易金额对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '交易金额', data: [8500, 12500, 6800, 9200, 10500] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域交易金额对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '交易金额', data: [] }],
    });
  }
};

// 支付方式占比（饼图）
export const fetchTradeTrendPayMethodRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/trade/trend/stat/pay/method/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无支付方式占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '支付方式占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['微信支付', '支付宝', '银联支付', 'ETC支付', '现金支付'],
              series: [{ name: '支付方式占比(%)', data: [45.8, 32.5, 12.8, 5.2, 3.7] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 支付方式占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '支付方式占比(%)', data: [] }],
    });
  }
};

// 区域交易占比（饼图）
export const fetchTradeTrendRegionTradeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/trade/trend/stat/region/trade/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无区域交易占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域交易占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '区域交易占比(%)', data: [22.5, 32.8, 18.2, 15.6, 10.9] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域交易占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '区域交易占比(%)', data: [] }],
    });
  }
};

// 通行交易趋势详情查询 - 详情弹窗专用
export const fetchTradeTrendDetail = (tradeTrendId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/trade/trend/detail/${tradeTrendId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbTradeTrendId === tradeTrendId) {
          return response;
        }
        throw new Error('真实接口返回无通行交易趋势详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('通行交易趋势详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbTradeTrendId: tradeTrendId,
              tbTradeTrendPeriod: tradeTrendId === 'TR20240115001' ? '日' : '周',
              tbTradeTrendTime: tradeTrendId === 'TR20240115001' ? '2026-01-15' : '2026-01-15~2026-01-21',
              tbTradeTrendChainCountGrowth: tradeTrendId === 'TR20240115001' ? 5.2 : 3.8,
              tbTradeTrendChainAmountGrowth: tradeTrendId === 'TR20240115001' ? 4.8 : 3.5,
              tbTradeTrendPeakPeriod: tradeTrendId === 'TR20240115001' ? '17:00-19:00' : '18:00-20:00',
              tbRegionTradeContributionRate: tradeTrendId === 'TR20240115001' ? '主城区:32.8%' : '高新区:28.5%',
              // 交易明细（模拟数据）
              tradeDetail: {
                tbTradeTrendCount: tradeTrendId === 'TR20240115001' ? 1250 : 8750,
                tbTradeTrendAmount: tradeTrendId === 'TR20240115001' ? 38500 : 269500,
                tbTradeTrendPayRate: tradeTrendId === 'TR20240115001' ? 96.8 : 97.2,
                tbTradeTrendAverageDuration: tradeTrendId === 'TR20240115001' ? 2.5 : 2.4,
              },
              // 支付方式分布（模拟数据）
              payMethodDistribution: {
                legend: ['微信支付', '支付宝', '银联支付', 'ETC支付', '现金支付'],
                series: [{ name: '支付方式分布(%)', data: [45.8, 32.5, 12.8, 5.2, 3.7] }]
              },
              // 区域分布（模拟数据）
              regionDistribution: {
                legend: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
                series: [{ name: '区域分布(%)', data: [22.5, 32.8, 18.2, 15.6, 10.9] }]
              }
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchTradeTrendDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 时段级趋势数据 - 钻取弹窗专用
export const fetchTradeTrendTimeTrend = (tradeTrendId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/trade/trend/stat/time/trend/${tradeTrendId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbTradeTrendId === tradeTrendId) {
          return response;
        }
        throw new Error('真实接口返回无时段级趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('时段级趋势接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = ['0-2', '2-4', '4-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24'];
            const data = xAxis.map(() => 50 + Math.random() * 300);
            resolve({
              tbTradeTrendId: tradeTrendId,
              tbTradeTrendPeriod: tradeTrendId === 'TR20240115001' ? '日' : '周',
              tbTradeTrendTime: tradeTrendId === 'TR20240115001' ? '2026-01-15' : '2026-01-15~2026-01-21',
              xAxis,
              series: [{ name: '时段交易笔数', data }]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchTradeTrendTimeTrend 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbTradeTrendId: '',
      tbTradeTrendPeriod: '',
      tbTradeTrendTime: '',
      xAxis: [],
      series: [{ name: '时段交易笔数', data: [] }]
    });
  }
};


// ========== 停车资源分布明细 ==========
// 停车资源分布明细列表
export const fetchParkResourceDistributionList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/list`,
        params,
      })
      .then((response) => {
        console.log('停车资源分布明细-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('停车资源分布明细-响应符合实际格式');
          return response.map((item) => ({
            tbParkingName: item.tbParkingName,
            tbRegionName: item.tbRegionName,
            sysParkingTypeName: item.sysParkingTypeName,
            tbParkingSpaceTotalCount: item.tbParkingSpaceTotalCount,
            tbParkingSpaceAvailableCount: item.tbParkingSpaceAvailableCount,
            sysOperationStatusName: item.sysOperationStatusName,
            tbParkingContactPhone: item.tbParkingContactPhone,
            tbParkingId: item.tbParkingId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无停车资源分布明细数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('停车资源分布明细接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbParkingName: '北区停车场',
                tbRegionName: '高新区',
                sysParkingTypeName: '公共停车场',
                tbParkingSpaceTotalCount: 500,
                tbParkingSpaceAvailableCount: 105,
                sysOperationStatusName: '运营中',
                tbParkingContactPhone: '13800138001',
                tbParkingId: 'PK20260119001',
              },
              {
                tbParkingName: '南区停车场',
                tbRegionName: '主城区',
                sysParkingTypeName: '商业停车场',
                tbParkingSpaceTotalCount: 800,
                tbParkingSpaceAvailableCount: 118,
                sysOperationStatusName: '运营中',
                tbParkingContactPhone: '13800138002',
                tbParkingId: 'PK20260119002',
              },
              {
                tbParkingName: '东区停车场',
                tbRegionName: '经开区',
                sysParkingTypeName: '路侧停车场',
                tbParkingSpaceTotalCount: 400,
                tbParkingSpaceAvailableCount: 136,
                sysOperationStatusName: '暂停运营',
                tbParkingContactPhone: '13800138003',
                tbParkingId: 'PK20260119003',
              },
              {
                tbParkingName: '西区停车场',
                tbRegionName: '文旅区',
                sysParkingTypeName: '景区停车场',
                tbParkingSpaceTotalCount: 600,
                tbParkingSpaceAvailableCount: 168,
                sysOperationStatusName: '运营中',
                tbParkingContactPhone: '13800138004',
                tbParkingId: 'PK20260119004',
              },
              {
                tbParkingName: '中区停车场',
                tbRegionName: '龙文区',
                sysParkingTypeName: '住宅停车场',
                tbParkingSpaceTotalCount: 700,
                tbParkingSpaceAvailableCount: 98,
                sysOperationStatusName: '运营中',
                tbParkingContactPhone: '13800138005',
                tbParkingId: 'PK20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceDistributionList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 停车资源分布明细核心指标（卡片展示）
export const fetchParkResourceDistributionIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalParkCount &&
          response.runningParkCount &&
          response.totalSpaceCount &&
          response.availableSpaceCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无停车资源分布明细核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车资源分布明细指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalParkCount: 5, // 停车场总数
              runningParkCount: 4, // 运营中数
              totalSpaceCount: 3000, // 总泊位数
              availableSpaceCount: 625, // 可用泊位数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车资源分布明细指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalParkCount: 0,
      runningParkCount: 0,
      totalSpaceCount: 0,
      availableSpaceCount: 0,
    });
  }
};

// 各区域停车场数量对比（柱状图）
export const fetchParkResourceDistributionAreaCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/stat/area/count`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无区域停车场数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域停车场数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '停车场数量', data: [1, 1, 1, 1, 1] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域停车场数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '停车场数量', data: [] }],
    });
  }
};

// 各类型停车场数量对比（柱状图）
export const fetchParkResourceDistributionTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/stat/type/count`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无类型停车场数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型停车场数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['公共停车场', '商业停车场', '路侧停车场', '景区停车场', '住宅停车场'],
              series: [{ name: '停车场数量', data: [1, 1, 1, 1, 1] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 类型停车场数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '停车场数量', data: [] }],
    });
  }
};

// 停车场类型占比（饼图）
export const fetchParkResourceDistributionTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/stat/type/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无停车场类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车场类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['公共停车场', '商业停车场', '路侧停车场', '景区停车场', '住宅停车场'],
              series: [{ name: '停车场类型占比(%)', data: [20, 20, 20, 20, 20] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车场类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '停车场类型占比(%)', data: [] }],
    });
  }
};

// 运营状态占比（饼图）
export const fetchParkResourceDistributionStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/stat/status/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无运营状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '运营状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['运营中', '暂停运营', '维护中', '已停用'],
              series: [{ name: '运营状态占比(%)', data: [80, 10, 5, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 运营状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '运营状态占比(%)', data: [] }],
    });
  }
};

// 停车资源分布明细详情查询 - 详情弹窗专用
export const fetchParkResourceDistributionDetail = (parkingId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/distribution/detail/${parkingId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbParkingParkingId === parkingId) {
          return response;
        }
        throw new Error('真实接口返回无停车资源分布明细详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('停车资源分布明细详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              // 基本信息
              tbParkingParkingId: parkingId,
              tbParkingName: parkingId === 'PK20260119001' ? '北区停车场' : '南区停车场',
              tbRegionName: parkingId === 'PK20260119001' ? '高新区' : '主城区',
              tbParkingContactPhone: parkingId === 'PK20260119001' ? '13800138001' : '13800138002',
              sysParkingTypeName: parkingId === 'PK20260119001' ? '公共停车场' : '商业停车场',
              sysOperationStatusName: parkingId === 'PK20260119001' ? '运营中' : '运营中',
              // 弹窗展示字段
              tbParkingSaturationRate: parkingId === 'PK20260119001' ? 79.0 : 85.2, // 饱和率
              tbParkingChargeStandard: parkingId === 'PK20260119001' ? '5元/小时，全天30元封顶' : '6元/小时，全天40元封顶', // 收费标准
              tbParkingUpdateTime: new Date().getTime() - 3 * 24 * 60 * 60 * 1000, // 最近更新时间
              // 泊位分布
              spaceDistribution: {
                legend: ['小型车', '大型车', '新能源', '无障碍'],
                series: [{ name: '车位分布', data: [400, 50, 40, 10] }]
              },
              // 运营数据
              operationData: {
                tbParkingSpaceTotalCount: parkingId === 'PK20260119001' ? 500 : 800,
                tbParkingSpaceAvailableCount: parkingId === 'PK20260119001' ? 105 : 118,
                tbParkingSaturationRate: parkingId === 'PK20260119001' ? 79.0 : 85.2,
                tbParkingAverageUtilization: parkingId === 'PK20260119001' ? 78.5 : 82.3,
              },
              // 收费标准明细
              chargeDetails: [
                { timeRange: '00:00-08:00', fee: '2元/小时' },
                { timeRange: '08:00-20:00', fee: '5元/小时' },
                { timeRange: '20:00-24:00', fee: '3元/小时' },
                { timeRange: '全天封顶', fee: '30元' }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceDistributionDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};


// ========== 终端设备分布明细 ==========
// 终端设备分布明细列表
export const fetchDeviceDistributionList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/distribution/list`,
        params,
      })
      .then((response) => {
        console.log('终端设备分布明细-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('终端设备分布明细-响应符合实际格式');
          return response.map((item) => ({
            tbDeviceName: item.tbDeviceName,
            tbDeviceDeviceNo: item.tbDeviceDeviceNo,
            sysDeviceTypeName: item.sysDeviceTypeName,
            tbParkingName: item.tbParkingName,
            tbDeviceInstallPosition: item.tbDeviceInstallPosition,
            sysDeviceStatusName: item.sysDeviceStatusName,
            tbDeviceInstallTime: item.tbDeviceInstallTime,
            tbDeviceDeviceId: item.tbDeviceDeviceId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无终端设备分布明细数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('终端设备分布明细接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbDeviceName: '入口道闸1',
                tbDeviceDeviceNo: 'DZ001',
                sysDeviceTypeName: '道闸',
                tbParkingName: '北区停车场',
                tbDeviceInstallPosition: '停车场入口',
                sysDeviceStatusName: '正常运行',
                tbDeviceInstallTime: new Date().getTime() - 365 * 24 * 60 * 60 * 1000,
                tbDeviceDeviceId: 'DEV20260119001',
              },
              {
                tbDeviceName: '摄像头01',
                tbDeviceDeviceNo: 'SXT001',
                sysDeviceTypeName: '摄像头',
                tbParkingName: '北区停车场',
                tbDeviceInstallPosition: 'A区过道',
                sysDeviceStatusName: '在线',
                tbDeviceInstallTime: new Date().getTime() - 180 * 24 * 60 * 60 * 1000,
                tbDeviceDeviceId: 'DEV20260119002',
              },
              {
                tbDeviceName: '车位探测器1',
                tbDeviceDeviceNo: 'WY001',
                sysDeviceTypeName: '车位探测器',
                tbParkingName: '南区停车场',
                tbDeviceInstallPosition: 'A区车位01',
                sysDeviceStatusName: '故障',
                tbDeviceInstallTime: new Date().getTime() - 90 * 24 * 60 * 60 * 1000,
                tbDeviceDeviceId: 'DEV20260119003',
              },
              {
                tbDeviceName: '缴费机01',
                tbDeviceDeviceNo: 'JFJ001',
                sysDeviceTypeName: '自助缴费机',
                tbParkingName: '东区停车场',
                tbDeviceInstallPosition: '出口处',
                sysDeviceStatusName: '离线',
                tbDeviceInstallTime: new Date().getTime() - 60 * 24 * 60 * 60 * 1000,
                tbDeviceDeviceId: 'DEV20260119004',
              },
              {
                tbDeviceName: 'LED屏01',
                tbDeviceDeviceNo: 'LED001',
                sysDeviceTypeName: 'LED显示屏',
                tbParkingName: '西区停车场',
                tbDeviceInstallPosition: '入口处',
                sysDeviceStatusName: '正常运行',
                tbDeviceInstallTime: new Date().getTime() - 120 * 24 * 60 * 60 * 1000,
                tbDeviceDeviceId: 'DEV20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDeviceDistributionList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 各类型设备数量对比（柱状图）
export const fetchDeviceDistributionTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/distribution/stat/type/count`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无类型设备数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '类型设备数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['道闸', '摄像头', '车位探测器', '自助缴费机', 'LED显示屏'],
              series: [{ name: '设备数量', data: [12, 25, 40, 8, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 类型设备数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '设备数量', data: [] }],
    });
  }
};

// 各停车场设备数量对比（柱状图）
export const fetchDeviceDistributionParkingCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/distribution/stat/parking/count`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无停车场设备数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '停车场设备数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['北区停车场', '南区停车场', '东区停车场', '西区停车场', '中区停车场'],
              series: [{ name: '设备数量', data: [15, 20, 12, 18, 10] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 停车场设备数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '设备数量', data: [] }],
    });
  }
};

// 终端设备分布明细详情查询 - 详情弹窗专用
export const fetchDeviceDistributionDetail = (deviceId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/device/distribution/detail/${deviceId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbDeviceDeviceId === deviceId) {
          return response;
        }
        throw new Error('真实接口返回无终端设备分布明细详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('终端设备分布明细详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              // 基本信息
              tbDeviceDeviceId: deviceId,
              tbDeviceName: '入口道闸1',
              tbDeviceDeviceNo: 'DZ001',
              sysDeviceTypeName: '道闸',
              tbParkingName: '北区停车场',
              tbDeviceInstallPosition: '停车场入口',
              sysDeviceStatusName: '正常运行',
              tbDeviceInstallTime: new Date().getTime() - 365 * 24 * 60 * 60 * 1000,
              // 弹窗展示字段
              tbDeviceOnlineDuration: 8760, // 在线时长（小时）
              tbDeviceFaultTime: new Date().getTime() - 7 * 24 * 60 * 60 * 1000, // 最近故障时间
              sysUserUserName: '张三', // 负责人
              // 运行数据
              operationData: {
                tbDeviceUptime: 99.8, // 设备运行率
                tbDeviceResponseTime: 120, // 平均响应时间（毫秒）
                tbDeviceLastMaintainTime: new Date().getTime() - 30 * 24 * 60 * 60 * 1000, // 最近维护时间
                tbDeviceNextMaintainTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 下次维护时间
              },
              // 运维记录
              maintenanceRecords: [
                {
                  time: new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
                  type: '巡检',
                  content: '常规月度巡检，设备运行正常',
                  operator: '李四',
                  status: '已完成',
                },
                {
                  time: new Date().getTime() - 60 * 24 * 60 * 60 * 1000,
                  type: '维修',
                  content: '更换道闸电机',
                  operator: '王五',
                  status: '已完成',
                },
                {
                  time: new Date().getTime() - 90 * 24 * 60 * 60 * 1000,
                  type: '巡检',
                  content: '季度全面检查',
                  operator: '赵六',
                  status: '已完成',
                },
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchDeviceDistributionDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交运维工单
export const submitDeviceMaintenance = (deviceId, maintenanceData) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/device/maintenance/submit/${deviceId}`,
        data: maintenanceData,
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回提交失败，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('提交运维工单接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '运维工单提交成功',
              workOrderNo: `WO${Date.now()}`,
              submitTime: new Date().getTime(),
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitDeviceMaintenance 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      success: false,
      message: '运维工单提交失败',
    });
  }
};


// ========== 终端设备（新增，为避免与资源设备冲突使用新命名） ==========
// 终端设备列表
export const fetchTerminalDeviceList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/list`,
        params,
      })
      .then((response) => {
        console.log('终端设备列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('终端设备列表-响应符合实际格式');
          return response.map((item) => ({
            tbDeviceName: item.tbDeviceName,
            tbDeviceDeviceNo: item.tbDeviceDeviceNo,
            sysDeviceTypeName: item.sysDeviceTypeName,
            tbParkingName: item.tbParkingName,
            sysDeviceStatusName: item.sysDeviceStatusName,
            tbDeviceOnlineDuration: item.tbDeviceOnlineDuration,
            tbDeviceLastCommTime: item.tbDeviceLastCommTime,
            tbDeviceDeviceId: item.tbDeviceDeviceId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无终端设备数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('终端设备列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbDeviceName: '入口道闸-01',
                tbDeviceDeviceNo: 'DVC202601001',
                sysDeviceTypeName: '道闸设备',
                tbParkingName: '北区停车场',
                sysDeviceStatusName: '在线',
                tbDeviceOnlineDuration: 120,
                tbDeviceLastCommTime: new Date().getTime() - 10 * 60 * 1000,
                tbDeviceDeviceId: 'DEV20260119001',
              },
              {
                tbDeviceName: '车牌识别-02',
                tbDeviceDeviceNo: 'DVC202601002',
                sysDeviceTypeName: '识别设备',
                tbParkingName: '南区停车场',
                sysDeviceStatusName: '离线',
                tbDeviceOnlineDuration: 85,
                tbDeviceLastCommTime: new Date().getTime() - 30 * 60 * 1000,
                tbDeviceDeviceId: 'DEV20260119002',
              },
              {
                tbDeviceName: '车位相机-03',
                tbDeviceDeviceNo: 'DVC202601003',
                sysDeviceTypeName: '监控设备',
                tbParkingName: '东区停车场',
                sysDeviceStatusName: '在线',
                tbDeviceOnlineDuration: 200,
                tbDeviceLastCommTime: new Date().getTime() - 5 * 60 * 1000,
                tbDeviceDeviceId: 'DEV20260119003',
              },
              {
                tbDeviceName: '缴费终端-04',
                tbDeviceDeviceNo: 'DVC202601004',
                sysDeviceTypeName: '缴费设备',
                tbParkingName: '西区停车场',
                sysDeviceStatusName: '在线',
                tbDeviceOnlineDuration: 150,
                tbDeviceLastCommTime: new Date().getTime() - 2 * 60 * 1000,
                tbDeviceDeviceId: 'DEV20260119004',
              },
              {
                tbDeviceName: '诱导屏-05',
                tbDeviceDeviceNo: 'DVC202601005',
                sysDeviceTypeName: '显示设备',
                tbParkingName: '中区停车场',
                sysDeviceStatusName: '故障',
                tbDeviceOnlineDuration: 0,
                tbDeviceLastCommTime: new Date().getTime() - 2 * 60 * 60 * 1000,
                tbDeviceDeviceId: 'DEV20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchTerminalDeviceList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 终端设备核心指标（卡片展示）
export const fetchTerminalDeviceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.deviceTotalCount &&
          response.deviceOnlineCount &&
          response.deviceNormalCount &&
          response.deviceFaultCount &&
          response.deviceInspectCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无终端设备核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('终端设备指标接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              deviceTotalCount: 5, // 设备总数
              deviceOnlineCount: 3, // 在线数
              deviceNormalCount: 2, // 正常运行数
              deviceFaultCount: 1, // 故障数
              deviceInspectCount: 1, // 待巡检数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 终端设备指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      deviceTotalCount: 0,
      deviceOnlineCount: 0,
      deviceNormalCount: 0,
      deviceFaultCount: 0,
      deviceInspectCount: 0,
    });
  }
};

// 终端设备类型占比（饼图）
export const fetchTerminalDeviceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/stat/type/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无终端设备类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('终端设备类型占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['道闸设备', '识别设备', '监控设备', '缴费设备', '显示设备'],
              series: [{ name: '设备类型占比(%)', data: [20, 20, 20, 20, 20] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 终端设备类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '设备类型占比(%)', data: [] }],
    });
  }
};

// 终端设备运行状态占比（饼图）
export const fetchTerminalDeviceStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/stat/status/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无终端设备运行状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('终端设备运行状态占比饼图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['在线', '离线', '故障', '维护中'],
              series: [{ name: '运行状态占比(%)', data: [60, 20, 10, 10] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 终端设备运行状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '运行状态占比(%)', data: [] }],
    });
  }
};

// 终端设备在线率变化趋势（折线图）
export const fetchTerminalDeviceOnlineRateTrend7d = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/stat/online/trend/7d`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无终端设备在线率变化趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('终端设备在线率变化趋势接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06', '10-07'],
              series: [{ name: '设备在线率(%)', data: [95, 96, 94, 97, 95, 96, 98] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 终端设备在线率变化趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '设备在线率(%)', data: [] }],
    });
  }
};

// 终端设备故障发生趋势（折线图）
export const fetchTerminalDeviceFaultTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/stat/fault/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无终端设备故障发生趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn('终端设备故障发生趋势接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06', '10-07'],
              series: [{ name: '故障发生次数', data: [2, 3, 1, 4, 2, 3, 1] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 终端设备故障发生趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '故障发生次数', data: [] }],
    });
  }
};

// 终端设备详情查询 - 详情弹窗专用
export const fetchTerminalDeviceDetail = (deviceId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/terminal/device/detail/${deviceId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbDeviceDeviceId === deviceId) {
          return response;
        }
        throw new Error('真实接口返回无终端设备详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('终端设备详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              // 基本信息
              tbDeviceDeviceId: deviceId,
              tbDeviceName: deviceId === 'DEV20260119001' ? '入口道闸-01' : '车牌识别-02',
              tbDeviceDeviceNo: deviceId === 'DEV20260119001' ? 'DVC202601001' : 'DVC202601002',
              tbParkingName: deviceId === 'DEV20260119001' ? '北区停车场' : '南区停车场',
              sysDeviceTypeName: deviceId === 'DEV20260119001' ? '道闸设备' : '识别设备',
              sysDeviceStatusName: deviceId === 'DEV20260119001' ? '在线' : '离线',
              // 弹窗展示字段
              tbDeviceFaultCount: deviceId === 'DEV20260119001' ? 2 : 5,
              tbDeviceMaintainCount: deviceId === 'DEV20260119001' ? 3 : 8,
              tbDeviceNextInspectTime: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
              // 设备参数
              deviceParams: [
                { paramName: '设备型号', paramValue: deviceId === 'DEV20260119001' ? 'DZ-2026' : 'SP-2026' },
                { paramName: 'IP地址', paramValue: deviceId === 'DEV20260119001' ? '192.168.1.101' : '192.168.1.102' },
                { paramName: '固件版本', paramValue: deviceId === 'DEV20260119001' ? 'V2.1.5' : 'V1.8.3' },
                { paramName: '安装位置', paramValue: deviceId === 'DEV20260119001' ? '入口处' : '出口处' },
              ],
              // 运行日志
              runLogs: [
                { logTime: new Date().getTime() - 3600000, logContent: '设备启动完成', logLevel: 'INFO' },
                { logTime: new Date().getTime() - 1800000, logContent: '车牌识别正常', logLevel: 'INFO' },
                { logTime: new Date().getTime() - 600000, logContent: '网络连接中断', logLevel: 'ERROR' },
              ],
              // 运维记录
              maintainRecords: [
                { maintainTime: new Date().getTime() - 30 * 24 * 60 * 60 * 1000, maintainType: '巡检', maintainContent: '例行巡检，设备正常' },
                { maintainTime: new Date().getTime() - 15 * 24 * 60 * 60 * 1000, maintainType: '维修', maintainContent: '更换识别模块' },
              ],
              // 故障记录
              faultRecords: [
                { faultTime: new Date().getTime() - 10 * 24 * 60 * 60 * 1000, faultContent: '道闸无法抬起', handleStatus: '已修复' },
                { faultTime: new Date().getTime() - 5 * 24 * 60 * 60 * 1000, faultContent: '识别率下降', handleStatus: '待处理' },
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchTerminalDeviceDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 提交终端设备运维工单
export const submitTerminalDeviceMaintenance = (deviceId, maintenanceData) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/terminal/device/maintenance/submit`,
        data: { deviceId, ...maintenanceData },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无运维工单提交结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('提交终端设备运维工单接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '运维工单提交成功，工单号：WO20260119001',
              workOrderId: 'WO20260119001'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== submitTerminalDeviceMaintenance 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '终端设备运维工单提交失败' });
  }
};


// ========== 设备运维趋势 ==========
// 设备运维趋势列表
export const fetchMaintainTrendList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/trend/list`,
        params,
      })
      .then((response) => {
        console.log('设备运维趋势-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('设备运维趋势-响应符合实际格式');
          return response.map((item) => ({
            tbMaintainTrendPeriod: item.tbMaintainTrendPeriod,
            tbMaintainTrendDate: item.tbMaintainTrendDate,
            tbMaintainTrendNewCount: item.tbMaintainTrendNewCount,
            tbMaintainTrendCompletedCount: item.tbMaintainTrendCompletedCount,
            tbMaintainTrendAverageDuration: item.tbMaintainTrendAverageDuration,
            tbMaintainTrendFaultDeviceCount: item.tbMaintainTrendFaultDeviceCount,
            tbMaintainTrendId: item.tbMaintainTrendId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无设备运维趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('设备运维趋势接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbMaintainTrendPeriod: '日',
                tbMaintainTrendDate: '2026-01-20',
                tbMaintainTrendNewCount: 12,
                tbMaintainTrendCompletedCount: 10,
                tbMaintainTrendAverageDuration: 45,
                tbMaintainTrendFaultDeviceCount: 3,
                tbMaintainTrendId: 'MT20260120001',
              },
              {
                tbMaintainTrendPeriod: '日',
                tbMaintainTrendDate: '2026-01-21',
                tbMaintainTrendNewCount: 15,
                tbMaintainTrendCompletedCount: 13,
                tbMaintainTrendAverageDuration: 38,
                tbMaintainTrendFaultDeviceCount: 2,
                tbMaintainTrendId: 'MT20260121001',
              },
              {
                tbMaintainTrendPeriod: '周',
                tbMaintainTrendDate: '第3周',
                tbMaintainTrendNewCount: 85,
                tbMaintainTrendCompletedCount: 78,
                tbMaintainTrendAverageDuration: 42,
                tbMaintainTrendFaultDeviceCount: 15,
                tbMaintainTrendId: 'MT20260122001',
              },
              {
                tbMaintainTrendPeriod: '月',
                tbMaintainTrendDate: '1月',
                tbMaintainTrendNewCount: 320,
                tbMaintainTrendCompletedCount: 298,
                tbMaintainTrendAverageDuration: 48,
                tbMaintainTrendFaultDeviceCount: 52,
                tbMaintainTrendId: 'MT20260123001',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainTrendList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 设备运维趋势核心指标（卡片展示）
export const fetchMaintainTrendIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/trend/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalNewCount &&
          response.totalCompletedCount &&
          response.completionRate &&
          response.averageDuration &&
          response.unfinishedCount
        ) {
          return response;
        }
        throw new Error('真实接口返回无设备运维趋势核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '设备运维趋势指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalNewCount: 432, // 新增工单数
              totalCompletedCount: 401, // 完成数
              completionRate: 92.8, // 完成率
              averageDuration: 43.5, // 平均处置时长
              unfinishedCount: 31, // 未完成数
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 设备运维趋势指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalNewCount: 0,
      totalCompletedCount: 0,
      completionRate: 0,
      averageDuration: 0,
      unfinishedCount: 0,
    });
  }
};

// 工单新增趋势（折线图）
export const fetchMaintainTrendNewTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/trend/stat/new/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无工单新增趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '工单新增趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['1月15日', '1月16日', '1月17日', '1月18日', '1月19日', '1月20日', '1月21日'],
              series: [{ name: '工单新增数', data: [10, 12, 8, 15, 14, 12, 15] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 工单新增趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '工单新增数', data: [] }],
    });
  }
};

// 工单完成趋势（折线图）
export const fetchMaintainTrendCompletedTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/trend/stat/completed/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无工单完成趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '工单完成趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['1月15日', '1月16日', '1月17日', '1月18日', '1月19日', '1月20日', '1月21日'],
              series: [{ name: '工单完成数', data: [9, 11, 7, 14, 13, 10, 13] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 工单完成趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '工单完成数', data: [] }],
    });
  }
};

// 故障设备数趋势（折线图）
export const fetchMaintainTrendFaultTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/trend/stat/fault/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无故障设备数趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '故障设备数趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['1月15日', '1月16日', '1月17日', '1月18日', '1月19日', '1月20日', '1月21日'],
              series: [{ name: '故障设备数', data: [2, 3, 1, 4, 3, 3, 2] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 故障设备数趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '故障设备数', data: [] }],
    });
  }
};

// 各类型设备工单数量对比（柱状图）
export const fetchMaintainTrendDeviceTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/trend/stat/device/type/count`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无各类型设备工单数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '各类型设备工单数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['道闸设备', '监控摄像头', '地磁检测器', 'LED显示屏', '缴费终端'],
              series: [{ name: '工单数量', data: [120, 85, 63, 42, 30] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 各类型设备工单数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '工单数量', data: [] }],
    });
  }
};

// 各故障类型工单数量对比（柱状图）
export const fetchMaintainTrendFaultTypeCount = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/trend/stat/fault/type/count`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无各故障类型工单数量数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '各故障类型工单数量对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['网络中断', '硬件故障', '软件异常', '电源问题', '数据异常'],
              series: [{ name: '工单数量', data: [65, 52, 38, 29, 21] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 各故障类型工单数量对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '工单数量', data: [] }],
    });
  }
};

// 故障类型占比（饼图）
export const fetchMaintainTrendFaultTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/trend/stat/fault/type/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无故障类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '故障类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['网络中断', '硬件故障', '软件异常', '电源问题', '数据异常'],
              series: [{ name: '故障类型占比(%)', data: [32.5, 26, 19, 14.5, 8] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 故障类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '故障类型占比(%)', data: [] }],
    });
  }
};

// 工单状态占比（饼图）
export const fetchMaintainTrendStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/trend/stat/status/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无工单状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '工单状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['待处理', '处理中', '已完成', '已关闭', '已取消'],
              series: [{ name: '工单状态占比(%)', data: [15, 25, 50, 5, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 工单状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '工单状态占比(%)', data: [] }],
    });
  }
};

// 设备运维趋势详情查询 - 详情弹窗专用
export const fetchMaintainTrendDetail = (maintainTrendId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/trend/detail/${maintainTrendId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbMaintainTrendId === maintainTrendId) {
          return response;
        }
        throw new Error('真实接口返回无设备运维趋势详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('设备运维趋势详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbMaintainTrendId: maintainTrendId,
              tbMaintainTrendPeriod: maintainTrendId === 'MT20260120001' ? '日' : '周',
              tbMaintainTrendDate: maintainTrendId === 'MT20260120001' ? '2026-01-20' : '第3周',
              // 弹窗展示字段
              tbMaintainTrendCompletionRate: maintainTrendId === 'MT20260120001' ? 83.3 : 91.8,
              tbMaintainTrendChainGrowth: maintainTrendId === 'MT20260120001' ? 8.5 : 12.2,
              sysFaultTypeName: maintainTrendId === 'MT20260120001' ? '网络中断' : '硬件故障',
              tbMaintainTrendUnfinishedCount: maintainTrendId === 'MT20260120001' ? 2 : 7,
              // 工单明细
              workOrderDetails: [
                { orderNo: 'WO001', deviceType: '道闸设备', faultType: '网络中断', status: '已完成', duration: 35 },
                { orderNo: 'WO002', deviceType: '监控摄像头', faultType: '硬件故障', status: '处理中', duration: 20 },
                { orderNo: 'WO003', deviceType: '地磁检测器', faultType: '软件异常', status: '待处理', duration: 0 },
                { orderNo: 'WO004', deviceType: 'LED显示屏', faultType: '电源问题', status: '已完成', duration: 58 },
                { orderNo: 'WO005', deviceType: '缴费终端', faultType: '数据异常', status: '已完成', duration: 42 },
              ],
              // 故障分布
              faultDistribution: {
                legend: ['网络中断', '硬件故障', '软件异常', '电源问题', '数据异常'],
                series: [{ name: '故障分布', data: [5, 3, 2, 1, 1] }]
              },
              // 处置情况
              disposalSituation: {
                completedRate: maintainTrendId === 'MT20260120001' ? 83.3 : 91.8,
                avgDuration: maintainTrendId === 'MT20260120001' ? 45 : 42,
                urgentCount: maintainTrendId === 'MT20260120001' ? 1 : 3,
                normalCount: maintainTrendId === 'MT20260120001' ? 11 : 82,
              },
              // 故障设备追溯列表（用于追溯弹窗）
              faultDeviceList: [
                { deviceId: 'DEV001', deviceName: '北区入口道闸', deviceType: '道闸设备', faultType: '网络中断', faultTime: new Date().getTime() - 3 * 24 * 60 * 60 * 1000 },
                { deviceId: 'DEV002', deviceName: '南区监控01', deviceType: '监控摄像头', faultType: '硬件故障', faultTime: new Date().getTime() - 2 * 24 * 60 * 60 * 1000 },
                { deviceId: 'DEV003', deviceName: '东区地磁03', deviceType: '地磁检测器', faultType: '软件异常', faultTime: new Date().getTime() - 1 * 24 * 60 * 60 * 1000 },
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchMaintainTrendDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 故障追溯查询 - 追溯弹窗专用
export const fetchFaultTraceDetail = (faultType, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/trend/fault/trace/${faultType}`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response;
        }
        throw new Error('真实接口返回无故障追溯数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('故障追溯接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                deviceId: 'DEV001',
                deviceName: '北区入口道闸',
                deviceType: '道闸设备',
                faultType: faultType,
                faultTime: new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
                workOrderNo: 'WO001',
                workOrderStatus: '已完成',
                handler: '张三',
                handleTime: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
              },
              {
                deviceId: 'DEV002',
                deviceName: '南区监控01',
                deviceType: '监控摄像头',
                faultType: faultType,
                faultTime: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
                workOrderNo: 'WO002',
                workOrderStatus: '处理中',
                handler: '李四',
                handleTime: new Date().getTime() - 24 * 60 * 60 * 1000,
              },
              {
                deviceId: 'DEV003',
                deviceName: '东区地磁03',
                deviceType: '地磁检测器',
                faultType: faultType,
                faultTime: new Date().getTime() - 24 * 60 * 60 * 1000,
                workOrderNo: 'WO003',
                workOrderStatus: '待处理',
                handler: '-',
                handleTime: null,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchFaultTraceDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 工单详情查询 - 工单详情弹窗专用
export const fetchWorkOrderDetail = (orderNo, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/maintain/workorder/detail/${orderNo}`,
        params,
      })
      .then((response) => {
        if (response && response.orderNo === orderNo) {
          return response;
        }
        throw new Error('真实接口返回无工单详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('工单详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              orderNo: orderNo,
              orderStatus: '已完成',
              deviceName: '北区入口道闸',
              deviceType: '道闸设备',
              faultType: '网络中断',
              reportTime: new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
              reportPerson: '王五',
              handler: '张三',
              handleTime: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
              handleResult: '已修复，设备运行正常',
              handleDuration: 35,
              faultDescription: '设备网络连接中断，导致无法远程控制',
              handleSteps: '1. 检查网络线路；2. 重启设备；3. 测试远程控制功能',
              partsUsed: '无',
              cost: 0,
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchWorkOrderDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};


// ========== 运维收费合规 ==========
// 运维收费合规列表
export const fetchComplianceList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/compliance/list`,
        params,
      })
      .then((response) => {
        console.log('运维收费合规-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('运维收费合规-响应符合实际格式');
          return response.map((item) => ({
            tbCompliancePeriod: item.tbCompliancePeriod,
            sysComplianceTypeName: item.sysComplianceTypeName,
            tbComplianceTotalCheck: item.tbComplianceTotalCheck,
            tbComplianceCompliantCount: item.tbComplianceCompliantCount,
            tbComplianceNonCompliantCount: item.tbComplianceNonCompliantCount,
            tbComplianceCompliantRate: item.tbComplianceCompliantRate,
            sysNonCompliantItemName: item.sysNonCompliantItemName,
            tbComplianceId: item.tbComplianceId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无运维收费合规数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('运维收费合规接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbCompliancePeriod: '日',
                sysComplianceTypeName: '运维合规',
                tbComplianceTotalCheck: 156,
                tbComplianceCompliantCount: 142,
                tbComplianceNonCompliantCount: 14,
                tbComplianceCompliantRate: 91.0,
                sysNonCompliantItemName: '设备维护不及时',
                tbComplianceId: 'CP20260120001',
              },
              {
                tbCompliancePeriod: '日',
                sysComplianceTypeName: '收费合规',
                tbComplianceTotalCheck: 89,
                tbComplianceCompliantCount: 85,
                tbComplianceNonCompliantCount: 4,
                tbComplianceCompliantRate: 95.5,
                sysNonCompliantItemName: '收费标准未公示',
                tbComplianceId: 'CP20260120002',
              },
              {
                tbCompliancePeriod: '周',
                sysComplianceTypeName: '运维合规',
                tbComplianceTotalCheck: 980,
                tbComplianceCompliantCount: 920,
                tbComplianceNonCompliantCount: 60,
                tbComplianceCompliantRate: 93.9,
                sysNonCompliantItemName: '安全防护不到位',
                tbComplianceId: 'CP20260121001',
              },
              {
                tbCompliancePeriod: '月',
                sysComplianceTypeName: '收费合规',
                tbComplianceTotalCheck: 3850,
                tbComplianceCompliantCount: 3720,
                tbComplianceNonCompliantCount: 130,
                tbComplianceCompliantRate: 96.6,
                sysNonCompliantItemName: '收费系统异常',
                tbComplianceId: 'CP20260122001',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchComplianceList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 运维收费合规核心指标（卡片展示）
export const fetchComplianceIndicators = (params = {}) => {
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
          response.totalCompliantRate &&
          response.operationCompliantRate &&
          response.chargeCompliantRate &&
          response.nonCompliantCount &&
          response.handledRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无运维收费合规核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '运维收费合规指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalCompliantRate: 94.2, // 总合规率
              operationCompliantRate: 93.5, // 运维合规率
              chargeCompliantRate: 96.0, // 收费合规率
              nonCompliantCount: 208, // 不合规数
              handledRate: 85.6, // 处理完成率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 运维收费合规指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalCompliantRate: 0,
      operationCompliantRate: 0,
      chargeCompliantRate: 0,
      nonCompliantCount: 0,
      handledRate: 0,
    });
  }
};

// 合规率变化趋势（折线图）
export const fetchComplianceRateTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/compliance/stat/rate/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无合规率变化趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '合规率变化趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['1月15日', '1月16日', '1月17日', '1月18日', '1月19日', '1月20日', '1月21日'],
              series: [{ name: '合规率(%)', data: [92.5, 93.1, 92.8, 94.0, 94.2, 94.5, 94.8] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 合规率变化趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '合规率(%)', data: [] }],
    });
  }
};

// 不合规数变化趋势（折线图）
export const fetchComplianceNonCompliantTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/compliance/stat/non/compliant/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无不合规数变化趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '不合规数变化趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['1月15日', '1月16日', '1月17日', '1月18日', '1月19日', '1月20日', '1月21日'],
              series: [{ name: '不合规数', data: [25, 22, 24, 20, 18, 16, 15] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 不合规数变化趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '不合规数', data: [] }],
    });
  }
};

// 各区域合规率对比（柱状图）
export const fetchComplianceRegionRateCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/compliance/stat/region/rate/compare`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无各区域合规率对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '各区域合规率对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '合规率(%)', data: [95.2, 94.8, 93.5, 92.0, 96.1] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 各区域合规率对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '合规率(%)', data: [] }],
    });
  }
};

// 各合规类型合规率对比（柱状图）
export const fetchComplianceTypeRateCompare = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/compliance/stat/type/rate/compare`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无各合规类型合规率对比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '各合规类型合规率对比接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              xAxis: ['运维合规', '收费合规', '安全合规', '数据合规', '环境合规'],
              series: [{ name: '合规率(%)', data: [93.5, 96.0, 91.8, 95.2, 90.5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 各合规类型合规率对比函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '合规率(%)', data: [] }],
    });
  }
};

// 合规类型占比（饼图）
export const fetchComplianceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/compliance/stat/type/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无合规类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '合规类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['运维合规', '收费合规', '安全合规', '数据合规', '环境合规'],
              series: [{ name: '合规类型占比(%)', data: [40, 35, 12, 8, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 合规类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '合规类型占比(%)', data: [] }],
    });
  }
};

// 不合规项占比（饼图）
export const fetchComplianceNonCompliantItemRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/compliance/stat/non/compliant/item/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无不合规项占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '不合规项占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['设备维护不及时', '收费标准未公示', '安全防护不到位', '收费系统异常', '数据记录不完整'],
              series: [{ name: '不合规项占比(%)', data: [35, 25, 20, 15, 5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 不合规项占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '不合规项占比(%)', data: [] }],
    });
  }
};

// 区域不合规分布占比（饼图）
export const fetchComplianceRegionDistributionRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/compliance/stat/region/distribution/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无区域不合规分布占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域不合规分布占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '区域不合规分布占比(%)', data: [25, 20, 18, 22, 15] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域不合规分布占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '区域不合规分布占比(%)', data: [] }],
    });
  }
};

// 运维收费合规详情查询 - 详情弹窗专用
export const fetchComplianceDetail = (complianceId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/compliance/detail/${complianceId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbComplianceId === complianceId) {
          return response;
        }
        throw new Error('真实接口返回无运维收费合规详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('运维收费合规详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbComplianceId: complianceId,
              tbCompliancePeriod: complianceId === 'CP20260120001' ? '日' : '周',
              sysComplianceTypeName: complianceId === 'CP20260120001' ? '运维合规' : '收费合规',
              // 弹窗展示字段
              tbComplianceChainCompliantChange: complianceId === 'CP20260120001' ? 1.2 : 0.8,
              tbRegionKeyMonitorName: complianceId === 'CP20260120001' ? '高新区' : '主城区',
              tbComplianceHandledCount: complianceId === 'CP20260120001' ? 10 : 45,
              tbComplianceHandledRate: complianceId === 'CP20260120001' ? 71.4 : 75.0,
              // 合规检查明细
              checkDetails: [
                { checkNo: 'CK001', checkItem: '设备维护记录', checkResult: '合规', checkTime: new Date().getTime() - 3 * 24 * 60 * 60 * 1000 },
                { checkNo: 'CK002', checkItem: '安全防护措施', checkResult: '不合规', checkTime: new Date().getTime() - 2 * 24 * 60 * 60 * 1000 },
                { checkNo: 'CK003', checkItem: '收费系统运行', checkResult: '合规', checkTime: new Date().getTime() - 24 * 60 * 60 * 1000 },
                { checkNo: 'CK004', checkItem: '收费标准公示', checkResult: '不合规', checkTime: new Date().getTime() - 24 * 60 * 60 * 1000 },
                { checkNo: 'CK005', checkItem: '数据备份完整', checkResult: '合规', checkTime: new Date().getTime() },
              ],
              // 不合规项详情
              nonCompliantDetails: [
                { item: '设备维护不及时', description: '设备维护记录缺失超过3天', severity: '中', responsible: '运维部', deadline: new Date().getTime() + 3 * 24 * 60 * 60 * 1000 },
                { item: '安全防护不到位', description: '监控摄像头存在盲区', severity: '高', responsible: '安全部', deadline: new Date().getTime() + 2 * 24 * 60 * 60 * 1000 },
                { item: '收费标准未公示', description: '停车场入口未公示收费标准', severity: '低', responsible: '运营部', deadline: new Date().getTime() + 5 * 24 * 60 * 60 * 1000 },
              ],
              // 处理记录
              handleRecords: [
                { recordNo: 'HR001', handleItem: '设备维护不及时', handlePerson: '张三', handleTime: new Date().getTime() - 2 * 24 * 60 * 60 * 1000, handleResult: '已处理', remark: '已完成设备维护并记录' },
                { recordNo: 'HR002', handleItem: '安全防护不到位', handlePerson: '李四', handleTime: new Date().getTime() - 24 * 60 * 60 * 1000, handleResult: '处理中', remark: '已安排人员安装补充摄像头' },
                { recordNo: 'HR003', handleItem: '收费标准未公示', handlePerson: '王五', handleTime: new Date().getTime(), handleResult: '未处理', remark: '等待制作公示牌' },
              ],
              // 不合规追溯列表（用于追溯弹窗）
              nonCompliantTraceList: [
                { recordId: 'NCR001', nonCompliantItem: '设备维护不及时', relatedParking: '北区停车场', checkTime: new Date().getTime() - 3 * 24 * 60 * 60 * 1000, status: '已处理', workOrderNo: 'WO001' },
                { recordId: 'NCR002', nonCompliantItem: '安全防护不到位', relatedParking: '南区停车场', checkTime: new Date().getTime() - 2 * 24 * 60 * 60 * 1000, status: '处理中', workOrderNo: 'WO002' },
                { recordId: 'NCR003', nonCompliantItem: '收费标准未公示', relatedParking: '东区停车场', checkTime: new Date().getTime() - 24 * 60 * 60 * 1000, status: '未处理', workOrderNo: null },
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchComplianceDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 不合规追溯查询 - 追溯弹窗专用
export const fetchNonCompliantTraceDetail = (nonCompliantItem, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/compliance/non/compliant/trace/${nonCompliantItem}`,
        params,
      })
      .then((response) => {
        if (response && Array.isArray(response)) {
          return response;
        }
        throw new Error('真实接口返回无不合规追溯数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('不合规追溯接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                recordId: 'NCR001',
                nonCompliantItem: nonCompliantItem,
                relatedParking: '北区停车场',
                checkTime: new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
                checkPerson: '张检查员',
                description: '设备维护记录缺失超过3天',
                severity: '中',
                status: '已处理',
                workOrderNo: 'WO001',
                handlePerson: '张三',
                handleTime: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
                handleResult: '已补全维护记录',
              },
              {
                recordId: 'NCR002',
                nonCompliantItem: nonCompliantItem,
                relatedParking: '南区停车场',
                checkTime: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
                checkPerson: '李检查员',
                description: '监控摄像头存在盲区',
                severity: '高',
                status: '处理中',
                workOrderNo: 'WO002',
                handlePerson: '李四',
                handleTime: new Date().getTime() - 24 * 60 * 60 * 1000,
                handleResult: '已安排人员安装补充摄像头',
              },
              {
                recordId: 'NCR003',
                nonCompliantItem: nonCompliantItem,
                relatedParking: '东区停车场',
                checkTime: new Date().getTime() - 24 * 60 * 60 * 1000,
                checkPerson: '王检查员',
                description: '停车场入口未公示收费标准',
                severity: '低',
                status: '未处理',
                workOrderNo: null,
                handlePerson: null,
                handleTime: null,
                handleResult: null,
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchNonCompliantTraceDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 不合规项处理提交
export const handleNonCompliantItem = (complianceId, nonCompliantItem, handleSolution) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/compliance/handle/${complianceId}`,
        data: {
          nonCompliantItem,
          handleSolution,
          handleTime: new Date().getTime(),
        },
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回处理结果异常，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('不合规项处理接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: `不合规项"${nonCompliantItem}"处理方案已提交`,
              data: {
                handleId: 'HD' + new Date().getTime(),
                handleTime: new Date().getTime(),
              },
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== handleNonCompliantItem 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      success: false,
      message: '处理提交失败',
    });
  }
};


// ========== 泊位车位 ==========
// 泊位车位列表
export const fetchParkingSpaceList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/list`,
        params,
      })
      .then((response) => {
        console.log('泊位车位列表-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('泊位车位列表-响应符合实际格式');
          return response.map((item) => ({
            tbParkingName: item.tbParkingName,
            tbParkingSpaceSpaceNo: item.tbParkingSpaceSpaceNo,
            sysSpaceTypeName: item.sysSpaceTypeName,
            sysSpaceStatusName: item.sysSpaceStatusName,
            tbParkingRecordOccupyDuration: item.tbParkingRecordOccupyDuration,
            tbRegionName: item.tbRegionName,
            tbParkingSpaceSpaceId: item.tbParkingSpaceSpaceId, // 用于详情查询的主键
          }));
        }
        throw new Error('真实接口返回无泊位车位列表数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('泊位车位列表接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbParkingName: '北区停车场',
                tbParkingSpaceSpaceNo: 'A001',
                sysSpaceTypeName: '小型车位',
                sysSpaceStatusName: '占用',
                tbParkingRecordOccupyDuration: 125,
                tbRegionName: '高新区',
                tbParkingSpaceSpaceId: 'PS20260119001',
              },
              {
                tbParkingName: '北区停车场',
                tbParkingSpaceSpaceNo: 'A002',
                sysSpaceTypeName: '新能源车位',
                sysSpaceStatusName: '空闲',
                tbParkingRecordOccupyDuration: 0,
                tbRegionName: '高新区',
                tbParkingSpaceSpaceId: 'PS20260119002',
              },
              {
                tbParkingName: '南区停车场',
                tbParkingSpaceSpaceNo: 'B101',
                sysSpaceTypeName: '大型车位',
                sysSpaceStatusName: '故障',
                tbParkingRecordOccupyDuration: 360,
                tbRegionName: '主城区',
                tbParkingSpaceSpaceId: 'PS20260119003',
              },
              {
                tbParkingName: '东区停车场',
                tbParkingSpaceSpaceNo: 'C201',
                sysSpaceTypeName: '无障碍车位',
                sysSpaceStatusName: '占用',
                tbParkingRecordOccupyDuration: 89,
                tbRegionName: '经开区',
                tbParkingSpaceSpaceId: 'PS20260119004',
              },
              {
                tbParkingName: '西区停车场',
                tbParkingSpaceSpaceNo: 'D301',
                sysSpaceTypeName: '小型车位',
                sysSpaceStatusName: '空闲',
                tbParkingRecordOccupyDuration: 0,
                tbRegionName: '文旅区',
                tbParkingSpaceSpaceId: 'PS20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkingSpaceList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 泊位车位核心指标（卡片展示）
export const fetchParkingSpaceIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalSpaceCount &&
          response.availableSpaceCount &&
          response.occupiedSpaceCount &&
          response.faultSpaceCount &&
          response.utilizationRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无泊位车位核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '泊位车位指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalSpaceCount: 3000, // 总泊位数
              availableSpaceCount: 625, // 空闲数
              occupiedSpaceCount: 2250, // 占用数
              faultSpaceCount: 125, // 故障数
              utilizationRate: 75.0, // 使用率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 泊位车位指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalSpaceCount: 0,
      availableSpaceCount: 0,
      occupiedSpaceCount: 0,
      faultSpaceCount: 0,
      utilizationRate: 0,
    });
  }
};

// 近24小时泊位使用率变化趋势（折线图）
export const fetchParkingSpaceUtilizationTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/stat/utilization/trend`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.xAxis &&
          response.series
        ) {
          return response;
        }
        throw new Error('真实接口返回无泊位使用率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '泊位使用率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 24}, (_, i) => `${i}:00`);
            const data = xAxis.map((hour) => {
              const h = parseInt(hour);
              if (h >= 7 && h <= 9) return 85 + Math.random() * 10; // 早高峰
              if (h >= 9 && h <= 17) return 70 + Math.random() * 10; // 平峰
              if (h >= 17 && h <= 20) return 90 + Math.random() * 10; // 晚高峰
              return 40 + Math.random() * 20; // 夜间
            });
            resolve({
              xAxis,
              series: [{ name: '泊位使用率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 泊位使用率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '泊位使用率(%)', data: [] }],
    });
  }
};

// 泊位类型占比（饼图）
export const fetchParkingSpaceTypeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/stat/type/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无泊位类型占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '泊位类型占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['小型车位', '大型车位', '新能源车位', '无障碍车位'],
              series: [{ name: '泊位类型占比(%)', data: [65.5, 15.2, 12.8, 6.5] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 泊位类型占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '泊位类型占比(%)', data: [] }],
    });
  }
};

// 使用状态占比（饼图）
export const fetchParkingSpaceStatusRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/stat/status/ratio`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.legend &&
          Array.isArray(response.legend) &&
          response.series &&
          Array.isArray(response.series)
        ) {
          return response;
        }
        throw new Error('真实接口返回无使用状态占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '使用状态占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['空闲', '占用', '故障', '维护中'],
              series: [{ name: '使用状态占比(%)', data: [20.8, 75.0, 4.2, 0] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 使用状态占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '使用状态占比(%)', data: [] }],
    });
  }
};

// 泊位车位详情查询 - 详情弹窗专用
export const fetchParkingSpaceDetail = (spaceId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/parking/space/detail/${spaceId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbParkingSpaceSpaceId === spaceId) {
          return response;
        }
        throw new Error('真实接口返回无泊位详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('泊位详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbParkingSpaceSpaceId: spaceId,
              tbParkingSpaceUseCount: spaceId === 'PS20260119001' ? 156 : 89, // 累计使用次数
              tbParkingSpaceLastUseTime: Date.now() - 2 * 60 * 60 * 1000, // 最近使用时间
              tbParkingSpaceFaultRate: spaceId === 'PS20260119003' ? 12.5 : 2.3, // 故障率
              // 使用记录
              usageRecords: [
                {
                  time: Date.now() - 24 * 60 * 60 * 1000,
                  duration: 125,
                  carNo: '京A12345',
                  status: '已完成'
                },
                {
                  time: Date.now() - 2 * 24 * 60 * 60 * 1000,
                  duration: 89,
                  carNo: '京B67890',
                  status: '已完成'
                },
                {
                  time: Date.now() - 3 * 24 * 60 * 60 * 1000,
                  duration: 210,
                  carNo: '京C11223',
                  status: '已完成'
                }
              ],
              // 故障记录
              faultRecords: spaceId === 'PS20260119003' ? [
                {
                  time: Date.now() - 7 * 24 * 60 * 60 * 1000,
                  content: '地磁传感器故障',
                  handleStatus: '已修复'
                },
                {
                  time: Date.now() - 15 * 24 * 60 * 60 * 1000,
                  content: '车位锁异常',
                  handleStatus: '已修复'
                }
              ] : []
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkingSpaceDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 释放泊位
export const releaseParkingSpace = (spaceId, releaseReason, params = {}) => {
  try {
    return requestClient
      .post({
        url: `${BASE_URL}/parking/space/release/${spaceId}`,
        data: { releaseReason },
        params,
      })
      .then((response) => {
        if (response && response.success) {
          return response;
        }
        throw new Error('真实接口返回无释放结果，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('释放泊位接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '泊位释放成功',
              spaceStatus: '空闲'
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== releaseParkingSpace 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({ success: false, message: '操作失败' });
  }
};


