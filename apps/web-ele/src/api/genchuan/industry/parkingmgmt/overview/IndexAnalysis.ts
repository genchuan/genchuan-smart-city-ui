import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';


// ========== 资源运行概览 ==========
// 资源运行列表
export const fetchParkResourceRunList = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/list`,
        params,
      })
      .then((response) => {
        console.log('资源运行视图-接口请求成功');
        if (response && Array.isArray(response)) {
          console.log('资源运行视图-响应符合实际格式');
          return response.map((item) => ({
            tbParkingName: item.tbParkingName,
            tbRegionName: item.tbRegionName,
            tbParkingSpaceTotalCount: item.tbParkingSpaceTotalCount,
            tbParkingOperationDailyUtilizationRate: item.tbParkingOperationDailyUtilizationRate,
            tbParkingOperationTurnoverRate: item.tbParkingOperationTurnoverRate,
            tbParkingOperationPeakUtilizationRate: item.tbParkingOperationPeakUtilizationRate,
            tbParkingParkingId: item.tbParkingParkingId,
          }));
        }
        throw new Error('真实接口返回无核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源运行视图接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                tbParkingName: '北区停车场',
                tbRegionName: '高新区',
                tbParkingSpaceTotalCount: 500,
                tbParkingOperationDailyUtilizationRate: 78.5,
                tbParkingOperationTurnoverRate: 2.8,
                tbParkingOperationPeakUtilizationRate: 92.3,
                tbParkingParkingId: 'PK20260119001',
              },
              {
                tbParkingName: '南区停车场',
                tbRegionName: '主城区',
                tbParkingSpaceTotalCount: 800,
                tbParkingOperationDailyUtilizationRate: 85.2,
                tbParkingOperationTurnoverRate: 3.2,
                tbParkingOperationPeakUtilizationRate: 95.8,
                tbParkingParkingId: 'PK20260119002',
              },
              {
                tbParkingName: '东区停车场',
                tbRegionName: '经开区',
                tbParkingSpaceTotalCount: 400,
                tbParkingOperationDailyUtilizationRate: 65.7,
                tbParkingOperationTurnoverRate: 2.1,
                tbParkingOperationPeakUtilizationRate: 88.6,
                tbParkingParkingId: 'PK20260119003',
              },
              {
                tbParkingName: '西区停车场',
                tbRegionName: '文旅区',
                tbParkingSpaceTotalCount: 600,
                tbParkingOperationDailyUtilizationRate: 72.4,
                tbParkingOperationTurnoverRate: 2.5,
                tbParkingOperationPeakUtilizationRate: 90.1,
                tbParkingParkingId: 'PK20260119004',
              },
              {
                tbParkingName: '中区停车场',
                tbRegionName: '龙文区',
                tbParkingSpaceTotalCount: 700,
                tbParkingOperationDailyUtilizationRate: 81.8,
                tbParkingOperationTurnoverRate: 3.0,
                tbParkingOperationPeakUtilizationRate: 94.2,
                tbParkingParkingId: 'PK20260119005',
              },
            ]);
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceRunList 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve([]);
  }
};

// 资源运行核心指标
export const fetchParkResourceRunIndicators = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/indicators/get`,
        params,
      })
      .then((response) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response) &&
          response.totalSpaceCount &&
          response.averageUtilizationRate &&
          response.averageTurnoverRate &&
          response.peakAverageUtilizationRate
        ) {
          return response;
        }
        throw new Error('真实接口返回无资源运行核心数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '资源运行指标接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalSpaceCount: 3000, // 全域泊位数
              averageUtilizationRate: 76.7, // 平均使用率
              averageTurnoverRate: 2.7, // 平均周转率
              peakAverageUtilizationRate: 92.2, // 高峰时段平均使用率
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 资源运行指标函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      totalSpaceCount: 0,
      averageUtilizationRate: 0,
      averageTurnoverRate: 0,
      peakAverageUtilizationRate: 0,
    });
  }
};

// 近30天全域使用率趋势（折线图）
export const fetchParkResourceRunUtilizationTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/stat/utilization/trend`,
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
        throw new Error('真实接口返回无使用率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '使用率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 70 + Math.random() * 10);
            resolve({
              xAxis,
              series: [{ name: '全域使用率(%)', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 使用率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '全域使用率(%)', data: [] }],
    });
  }
};

// 重点停车场周转率趋势（折线图）
export const fetchParkResourceRunTurnoverTrend = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/stat/turnover/trend`,
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
        throw new Error('真实接口返回无周转率趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '周转率趋势接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const data = xAxis.map(() => 2.0 + Math.random() * 1.5);
            resolve({
              xAxis,
              series: [{ name: '重点停车场周转率', data }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 周转率趋势函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      xAxis: [],
      series: [{ name: '重点停车场周转率', data: [] }],
    });
  }
};

// 各区域使用率占比（饼图）
export const fetchParkResourceRunRegionRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/stat/region/ratio`,
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
        throw new Error('真实接口返回无区域使用率占比数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '区域使用率占比饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['高新区', '主城区', '经开区', '文旅区', '龙文区'],
              series: [{ name: '区域使用率占比(%)', data: [78.5, 85.2, 65.7, 72.4, 81.8] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 区域使用率占比饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '区域使用率占比(%)', data: [] }],
    });
  }
};

// 各时段使用率分布（饼图）
export const fetchParkResourceRunTimeRatio = (params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/stat/time/ratio`,
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
        throw new Error('真实接口返回无时段使用率分布数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.warn(
          '时段使用率分布饼图接口调用失败-使用模拟数据兜底',
          error.message,
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              legend: ['早高峰(7-9)', '平峰(9-17)', '晚高峰(17-20)', '夜间(20-7)'],
              series: [{ name: '时段使用率分布(%)', data: [88.5, 70.2, 92.7, 45.3] }],
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== 时段使用率分布饼图函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      legend: [],
      series: [{ name: '时段使用率分布(%)', data: [] }],
    });
  }
};

// 资源运行详情查询 - 详情弹窗专用
export const fetchParkResourceRunDetail = (parkingId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/detail/${parkingId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbParkingParkingId === parkingId) {
          return response;
        }
        throw new Error('真实接口返回无详情数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('资源运行详情接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              tbParkingParkingId: parkingId,
              tbParkingName: parkingId === 'PK20260119001' ? '北区停车场' : '南区停车场',
              tbRegionName: parkingId === 'PK20260119001' ? '高新区' : '主城区',
              tbParkingOperationChainUtilizationChange: parkingId === 'PK20260119001' ? 5.2 : 3.8,
              tbParkingOperationMonthlyMaxUtilization: parkingId === 'PK20260119001' ? 95.8 : 98.2,
              tbParkingOperationPeakHour: parkingId === 'PK20260119001' ? '17:00-19:00' : '18:00-20:00',
              runDetail: {
                tbParkingSpaceTotalCount: parkingId === 'PK20260119001' ? 500 : 800,
                tbParkingOperationDailyUtilizationRate: parkingId === 'PK20260119001' ? 78.5 : 85.2,
                tbParkingOperationTurnoverRate: parkingId === 'PK20260119001' ? 2.8 : 3.2,
                tbParkingOperationPeakUtilizationRate: parkingId === 'PK20260119001' ? 92.3 : 95.8,
              },
              timeDistribution: {
                xAxis: ['0-2', '2-4', '4-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24'],
                series: [{ name: '时段使用率(%)', data: [35.2, 28.1, 30.5, 78.6, 88.5, 75.3, 72.1, 70.5, 85.7, 92.3, 80.1, 45.8] }]
              },
              abnormalRecords: [
                {
                  time: Date.now() - 3 * 24 * 60 * 60 * 1000,
                  content: '早高峰时段使用率异常偏低，排查为道闸故障导致',
                  handleStatus: '已处理'
                },
                {
                  time: Date.now() - 7 * 24 * 60 * 60 * 1000,
                  content: '周转率低于平均值，排查为周边道路施工导致',
                  handleStatus: '处理中'
                }
              ]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceRunDetail 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({});
  }
};

// 周转率时段级趋势 - 钻取弹窗专用
export const fetchParkResourceRunTurnoverTimeTrend = (parkingId, params = {}) => {
  try {
    return requestClient
      .get({
        url: `${BASE_URL}/park/resource/run/stat/turnover/time/trend/${parkingId}`,
        params,
      })
      .then((response) => {
        if (response && response.tbParkingParkingId === parkingId) {
          return response;
        }
        throw new Error('真实接口返回无周转率时段趋势数据，使用模拟数据兜底');
      })
      .catch((error) => {
        console.log('周转率时段趋势接口调用失败-使用模拟数据兜底', error.message);
        return new Promise((resolve) => {
          setTimeout(() => {
            const xAxis = ['0-2', '2-4', '4-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24'];
            const data = xAxis.map(() => 1.5 + Math.random() * 2.5);
            resolve({
              tbParkingParkingId: parkingId,
              tbParkingName: parkingId === 'PK20260119001' ? '北区停车场' : '南区停车场',
              xAxis,
              series: [{ name: '时段周转率', data }]
            });
          }, 500);
        });
      });
  } catch (error) {
    console.error('===== fetchParkResourceRunTurnoverTimeTrend 函数初始化异常 =====');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    return Promise.resolve({
      tbParkingParkingId: '',
      tbParkingName: '',
      xAxis: [],
      series: [{ name: '时段周转率', data: [] }]
    });
  }
};
