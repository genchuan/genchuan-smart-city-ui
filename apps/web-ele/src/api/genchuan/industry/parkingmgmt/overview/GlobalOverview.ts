import { requestClient } from '#/api/request';

const BASE_URL = '/industry/parking';


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
