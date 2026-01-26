import { requestClient } from '#/api/request';

// 基础URL，可根据实际项目配置
const BASE_URL = '/api/eco';

// 空气质量专题视图相关接口
export const fetchAirQualityTrend = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/airQualityTrend`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('空气质量趋势接口调用失败，使用模拟数据:', error.message);
    // 生成30天日期（用于趋势图）
    const today = new Date();
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }
    return {
      xAxis: dates,
      series: [
        { name: 'PM2.5', data: Array(30).fill(0).map(() => Math.floor(Math.random() * 50) + 10) },
        { name: 'PM10', data: Array(30).fill(0).map(() => Math.floor(Math.random() * 80) + 30) },
        { name: 'AQI', data: Array(30).fill(0).map(() => Math.floor(Math.random() * 100) + 30) }
      ]
    };
  }
};

export const fetchAirQualityStations = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/airQualityStations`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('空气质量监测站点接口调用失败，使用模拟数据:', error.message);
    return [
      {
        station_id: 'AQ-001',
        station_name: '城区监测点',
        lng: 116.4,
        lat: 39.9,
        region: '市中心',
        region_type: 'urban',
        station_type: 'standard',
        establish_date: '2020-05-15',
        real_time_aqi: 58,
        pm25: 32,
        pm10: 65,
        so2: 15,
        no2: 45,
        o3: 85,
        main_pollutant: 'PM2.5',
        status: '正常',
        device_status: '运行中',
        update_time: '2025-10-30 14:30:00',
        calibration_time: '2025-10-15',
        address: '人民广场东侧'
      },
      {
        station_id: 'AQ-002',
        station_name: '工业区监测点',
        lng: 116.5,
        lat: 39.8,
        region: '东部工业区',
        region_type: 'industrial',
        station_type: 'standard',
        establish_date: '2019-11-20',
        real_time_aqi: 120,
        pm25: 68,
        pm10: 110,
        so2: 35,
        no2: 75,
        o3: 92,
        main_pollutant: 'PM10',
        status: '轻度污染',
        device_status: '运行中',
        update_time: '2025-10-30 14:30:00',
        calibration_time: '2025-10-10',
        address: '化工园区北门'
      },
      {
        station_id: 'AQ-003',
        station_name: '郊区监测点',
        lng: 116.3,
        lat: 40.0,
        region: '西部郊区',
        region_type: 'suburban',
        station_type: 'background',
        establish_date: '2021-03-05',
        real_time_aqi: 45,
        pm25: 18,
        pm10: 42,
        so2: 8,
        no2: 22,
        o3: 75,
        main_pollutant: '',
        status: '正常',
        device_status: '运行中',
        update_time: '2025-10-30 14:30:00',
        calibration_time: '2025-10-05',
        address: '生态公园内'
      }
    ];
  }
};

export const fetchAirQualityCoreIndicators = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/airQualityCoreIndicators`);
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('空气质量核心指标接口调用失败，使用模拟数据:', error.message);
    return {
      currentAqi: 65,
      pm25Value: 32,
      pm25Change: -5,
      pm10Value: 78,
      pm10Change: 3,
      qualifiedDays: 22,
      totalDays: 30,
      qualifiedRate: Math.round((22 / 30) * 100)
    };
  }
};

export const fetchAirQualityStationTrend = async (stationId) => {
  try {
    const response = await requestClient.get(`${BASE_URL}/airQualityStationTrend/${stationId}`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('空气质量站点详情趋势接口调用失败，使用模拟数据:', error.message);
    return {
      xAxis: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      series: [
        { name: 'PM2.5', data: [32, 28, 35, 42, 38, 32] },
        { name: 'PM10', data: [65, 60, 72, 85, 78, 70] },
        { name: 'AQI', data: [58, 62, 75, 82, 70, 65] }
      ]
    };
  }
};

export const fetchAirQualityDetails = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/airQualityDetails`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('空气质量详细数据接口调用失败，使用模拟数据:', error.message);
    // 生成表格数据
    const today = new Date();
    const stationIds = ['AQ-001', 'AQ-002', 'AQ-003'];
    const data = [];

    // 生成过去30天的数据（每天8-17点）
    for (let day = 29; day >= 0; day--) {
      for (let hour = 8; hour <= 17; hour++) {
        const date = new Date(today);
        date.setDate(today.getDate() - day);
        const regionTypeIndex = Math.floor(Math.random() * 3);
        const region = regionTypeIndex === 0 ? '城区' : regionTypeIndex === 1 ? '郊区' : '工业区';
        const stationId = stationIds[Math.floor(Math.random() * stationIds.length)];

        data.push({
          monitor_time: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${hour}:00`,
          station_id: stationId,
          region,
          aqi: Math.floor(Math.random() * 150) + 30,
          pm25: Math.floor(Math.random() * 80) + 10,
          pm10: Math.floor(Math.random() * 100) + 20,
          so2: Math.floor(Math.random() * 50) + 5,
          no2: Math.floor(Math.random() * 60) + 10,
          status: Math.random() > 0.2 ? '正常' : '轻度污染'
        });
      }
    }
    return data;
  }
};

// 饮用水水源地专题视图相关接口
export const fetchWaterSourceOverview = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/waterSourceOverview`);
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('饮用水水源地概览接口调用失败，使用模拟数据:', error.message);
    return {
      totalSources: 12,
      surfaceCount: 8,
      groundCount: 4,
      qualifiedRate: 92,
      rateChange: -3,
      unqualifiedCount: 1,
      mainPollutant: '总大肠菌群',
      monitorFrequency: '每周2次',
      lastMonitorTime: '2025-10-29 09:30'
    };
  }
};

export const fetchWaterSourceTrend = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/waterSourceTrend`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('饮用水水源地趋势接口调用失败，使用模拟数据:', error.message);
    const months = ['5月', '6月', '7月', '8月', '9月', '10月'];
    return {
      xAxis: months,
      series: [{
        name: '达标率',
        data: [98, 96, 95, 94, 95, 92]
      }]
    };
  }
};

export const fetchWaterSourceDistribution = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/waterSourceDistribution`);
    if (response.data && response.data.legend && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('饮用水水源地分布接口调用失败，使用模拟数据:', error.message);
    return {
      legend: ['地表水', '地下水'],
      series: [{
        name: '数量（个）',
        data: [8, 4]
      }]
    };
  }
};

export const fetchWaterSources = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/waterSources`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('饮用水水源地列表接口调用失败，使用模拟数据:', error.message);
    return [
      {
        source_id: 'WS-001',
        name: '青山水库',
        type: 'surface',
        lng: 116.45,
        lat: 39.92,
        region: '东部城区',
        status: 'qualified',
        last_check: '2025-10-29 08:15'
      },
      {
        source_id: 'WS-002',
        name: '地下水源地A',
        type: 'ground',
        lng: 116.38,
        lat: 39.88,
        region: '南部郊区',
        status: 'qualified',
        last_check: '2025-10-29 09:30'
      },
      {
        source_id: 'WS-003',
        name: '东湖水源地',
        type: 'surface',
        lng: 116.52,
        lat: 40.01,
        region: '北部新区',
        status: 'unqualified',
        last_check: '2025-10-29 10:45'
      }
    ];
  }
};

export const fetchWaterSourceData = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/waterSourceData`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('饮用水水源地详细数据接口调用失败，使用模拟数据:', error.message);
    return Array(12).fill(0).map((_, index) => ({
      source_id: `WS-${String(index + 100).slice(1)}`,
      name: `${['青山', '东湖', '西湖', '龙潭', '地下'][index % 5]}水源地${index + 1}`,
      type: index % 3 === 0 ? 'ground' : 'surface',
      region: ['东部城区', '南部郊区', '西部县区', '北部新区'][index % 4],
      ph: (7 + Math.random() * 0.8).toFixed(1),
      dissolved_oxygen: (6 + Math.random() * 1.5).toFixed(1),
      total_coliform: index === 2 ? 15 : Math.floor(Math.random() * 5),
      turbidity: (0.5 + Math.random() * 0.3).toFixed(2),
      cod_mn: (2 + Math.random() * 1).toFixed(1),
      ammonia_nitrogen: (0.5 + Math.random() * 0.3).toFixed(2),
      status: index === 2 ? 'unqualified' : 'qualified',
      last_check: `2025-10-${29 - (index % 3)} ${8 + (index % 4)}:${index % 2 === 0 ? '15' : '45'}`,
      population_served: (5 + Math.random() * 15).toFixed(1),
      area: (10 + Math.random() * 30).toFixed(1),
      build_time: `20${10 + (index % 10)}-${String(index % 12 + 1).padStart(2, '0')}`,
      unqualified_item: index === 2 ? '总大肠菌群' : '',
      actual_value: index === 2 ? '15' : '',
      standard_limit: index === 2 ? '10' : '',
      unit: index === 2 ? 'MPN/100mL' : '',
      treatment_measures: index === 2 ? '已启动应急处理，增加消毒频次' : ''
    }));
  }
};

export const fetchWaterSourceDetailTrend = async (sourceId) => {
  try {
    const response = await requestClient.get(`${BASE_URL}/waterSourceDetailTrend/${sourceId}`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('饮用水水源地详情趋势接口调用失败，使用模拟数据:', error.message);
    return {
      xAxis: ['8月', '9月', '10月'],
      series: [
        { name: 'pH值', data: [7.2, 7.3, 7.1] },
        { name: '溶解氧', data: [6.8, 7.0, 6.5] }
      ]
    };
  }
};

// 重点污染源专题视图相关接口
export const fetchPollutantStatistics = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/pollutantStatistics`);
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('重点污染源统计数据接口调用失败，使用模拟数据:', error.message);
    return {
      totalPollutants: 45,
      onlineRate: 93,
      overstandardCount: 5,
      overstandardRate: 11,
      mainPollutant: '化学需氧量(COD)',
      maxConcentration: 185,
      concentrationUnit: 'mg/L',
      supervisionCount: 12,
      rectificationCount: 3
    };
  }
};

export const fetchPollutantDetailTrend = async (pollutantId) => {
  try {
    const response = await requestClient.get(`${BASE_URL}/pollutantDetailTrend/${pollutantId}`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('污染源详情趋势接口调用失败，使用模拟数据:', error.message);
    // 生成近7天日期
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }
    // 生成模拟数据（基于污染源ID的哈希值生成相对稳定的随机数）
    const baseValue = (parseInt(pollutantId.replace(/\D/g, '')) % 10) + 5;
    return {
      xAxis: days,
      series: [{
        name: '日排放量 (吨)',
        data: Array(7).fill(0).map(() => (Math.random() * 5 + baseValue).toFixed(2))
      }]
    };
  }
};

export const fetchPollutantTypeDistribution = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/pollutantTypeDistribution`);
    if (response.data && response.data.legend && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('污染源类型分布接口调用失败，使用模拟数据:', error.message);
    return {
      legend: ['工业', '农业', '生活', '机动车'],
      series: [{
        name: '数量',
        data: [22, 8, 10, 5]
      }]
    };
  }
};

export const fetchPollutantEmissionTrend = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/pollutantEmissionTrend`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('污染物排放趋势接口调用失败，使用模拟数据:', error.message);
    const days = [];
    const today = new Date();
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(`${date.getMonth()+1}/${date.getDate()}`);
    }
    return {
      xAxis: days,
      series: [
        {
          name: 'COD',
          data: Array(15).fill(0).map(() => (Math.random() * 5 + 15).toFixed(2))
        },
        {
          name: '氨氮',
          data: Array(15).fill(0).map(() => (Math.random() * 2 + 3).toFixed(2))
        },
        {
          name: '二氧化硫',
          data: Array(15).fill(0).map(() => (Math.random() * 3 + 8).toFixed(2))
        }
      ]
    };
  }
};

export const fetchPollutantList = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/pollutantList`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('污染源列表接口调用失败，使用模拟数据:', error.message);
    return [
      {
        id: 'PS-001',
        name: '东方化工厂',
        type: 'industrial',
        lng: 116.55,
        lat: 39.85,
        region: '东部工业区',
        emission: 28.5,
        overstandard: '1',
        last_monitor: '2025-10-30 08:30'
      },
      {
        id: 'PS-002',
        name: '城南污水处理厂',
        type: 'domestic',
        lng: 116.42,
        lat: 39.82,
        region: '南部城区',
        emission: 12.3,
        overstandard: '0',
        last_monitor: '2025-10-30 09:15'
      },
      {
        id: 'PS-003',
        name: '北郊农田区',
        type: 'agricultural',
        lng: 116.38,
        lat: 40.05,
        region: '北部郊区',
        emission: 8.7,
        overstandard: '1',
        last_monitor: '2025-10-30 10:00'
      },
      {
        id: 'PS-004',
        name: '城西交通枢纽',
        type: 'vehicle',
        lng: 116.30,
        lat: 39.92,
        region: '西部城区',
        emission: 15.2,
        overstandard: '0',
        last_monitor: '2025-10-30 07:45'
      }
    ];
  }
};

export const fetchPollutantTableData = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/pollutantTableData`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('污染源表格数据接口调用失败，使用模拟数据:', error.message);
    return Array(45).fill(0).map((_, index) => {
      const typeList = ['industrial', 'agricultural', 'domestic', 'vehicle'];
      const type = typeList[index % 4];
      const emission = (Math.random() * 30 + 5).toFixed(1);
      const standard = (Math.random() * 20 + 10).toFixed(1);
      const overstandard = parseFloat(emission) > parseFloat(standard) ? '1' : '0';

      return {
        id: `PS-${String(index + 100).slice(1)}`,
        name: `${['东方', '南方', '西方', '北方', '中环'][index % 5]}${
          {
            industrial: '工业',
            agricultural: '农业',
            domestic: '生活',
            vehicle: '机动车'
          }[type]
        }污染源${index + 1}`,
        type,
        region: ['东部工业区', '南部城区', '西部县区', '北部郊区'][index % 4],
        emission,
        standard,
        overstandard,
        overstandard_multiple: overstandard === '1' ? ((parseFloat(emission) / parseFloat(standard)).toFixed(2)) : '0',
        main_pollutant: index % 3 === 0 ? 'COD' : index % 3 === 1 ? '氨氮' : '二氧化硫',
        monitor_status: index % 10 === 0 ? 'offline' : 'online',
        last_monitor: `2025-10-${30 - (index % 2)} ${7 + (index % 12)}:${index % 2 === 0 ? '00' : '30'}`,
        last_calibration: `2025-10-${15 - (index % 10)}`,
        address: `${['化工路', '环保路', '科技园', '产业园'][index % 4]}${index + 100}号`,
        manager: `负责人${index + 1}`,
        contact: `138${String(10000000 + index * 123456).slice(1)}`,
        treatment_records: overstandard === '1' ? [
          {
            time: `2025-10-${28 - (index % 2)} 14:${index % 60}`,
            content: '已下发整改通知，要求15日内完成治理',
            handler: `监管员${(index % 5) + 1}`
          }
        ] : []
      };
    });
  }
};

// 固废处置专题视图相关接口
export const fetchSolidWasteStats = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/solidWasteStats`);
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('固废处置统计数据接口调用失败，使用模拟数据:', error.message);
    return {
      totalWaste: 12560,
      totalChange: 2.5,
      disposedWaste: 11980,
      disposalRate: Math.round((11980 / 12560) * 100),
      harmlessWaste: 11560,
      harmlessRate: Math.round((11560 / 11980) * 100),
      facilityCount: 18,
      runningFacility: 16
    };
  }
};

export const fetchSolidWasteTypeDistribution = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/solidWasteTypeDistribution`);
    if (response.data && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('固废类型分布接口调用失败，使用模拟数据:', error.message);
    return {
      legend: ['生活垃圾', '工业固废', '危险废物', '医疗废物'],
      series: [{
        name: '产生量 (吨)',
        data: [
          { name: '生活垃圾', value: 6500 },
          { name: '工业固废', value: 4200 },
          { name: '危险废物', value: 1200 },
          { name: '医疗废物', value: 660 }
        ]
      }]
    };
  }
};

export const fetchSolidWasteTrend = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/solidWasteTrend`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('固废处置趋势接口调用失败，使用模拟数据:', error.message);
    const months = ['5月', '6月', '7月', '8月', '9月', '10月'];
    return {
      xAxis: months,
      series: [
        {
          name: '产生量',
          data: [11200, 11800, 12100, 12400, 12300, 12560]
        },
        {
          name: '处置量',
          data: [10800, 11500, 11700, 12000, 11800, 11980]
        }
      ]
    };
  }
};

export const fetchSolidWasteFacilityTrend = async (facilityId) => {
  try {
    const response = await requestClient.get(`${BASE_URL}/solidWasteFacilityTrend/${facilityId}`);
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('固废处置设施趋势接口调用失败，使用模拟数据:', error.message);
    // 生成近7天日期
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }

    // 基于设施ID获取基础值
    const facilities = await fetchSolidWasteFacilities();
    const facility = facilities.find(f => f.id === facilityId) || { actual_daily: 100 };
    const baseValue = parseFloat(facility.actual_daily) * 0.8;

    return {
      xAxis: days,
      series: [{
        name: '日处理量 (吨)',
        data: Array(7).fill(0).map(() => (Math.random() * 50 + baseValue).toFixed(1))
      }]
    };
  }
};

export const fetchSolidWasteFacilities = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/solidWasteFacilities`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('固废处置设施接口调用失败，使用模拟数据:', error.message);
    return [
      {
        id: 'FW-001',
        name: '城市生活垃圾填埋场',
        type: 'domestic',
        lng: 116.58,
        lat: 39.98,
        region: '东北部',
        daily_capacity: 800,
        actual_daily: 750,
        status: 'running',
        address: '东郊环保产业园1号',
        commissioning_time: '2018-05-10',
        technology: '卫生填埋+沼气回收',
        discharge_standard: 'GB16889-2008',
        last_inspection: '2025-10-25',
        operator: '城市环境服务集团'
      },
      {
        id: 'FW-002',
        name: '工业固废综合处理厂',
        type: 'industrial',
        lng: 116.35,
        lat: 39.85,
        region: '西南部',
        daily_capacity: 500,
        actual_daily: 480,
        status: 'running',
        address: '西郊工业园8号',
        commissioning_time: '2019-03-15',
        technology: '焚烧发电+资源回收',
        discharge_standard: 'GB18484-2020',
        last_inspection: '2025-10-26',
        operator: '绿色工业处理有限公司'
      },
      {
        id: 'FW-003',
        name: '危险废物处置中心',
        type: 'hazardous',
        lng: 116.62,
        lat: 39.78,
        region: '东南部',
        daily_capacity: 150,
        actual_daily: 130,
        status: 'running',
        address: '南郊危险品处理区',
        commissioning_time: '2020-07-20',
        technology: '高温焚烧+安全填埋',
        discharge_standard: 'GB18484-2020',
        last_inspection: '2025-10-28',
        operator: '环安危废处理有限公司'
      },
      {
        id: 'FW-004',
        name: '医疗废物处理站',
        type: 'medical',
        lng: 116.30,
        lat: 40.02,
        region: '西北部',
        daily_capacity: 50,
        actual_daily: 45,
        status: 'running',
        address: '北郊医疗产业园',
        commissioning_time: '2021-01-10',
        technology: '高温蒸汽灭菌+焚烧',
        discharge_standard: 'GB18484-2020',
        last_inspection: '2025-10-27',
        operator: '健康环保科技有限公司'
      }
    ];
  }
};

export const fetchSolidWasteDetailData = async () => {
  try {
    const response = await requestClient.get(`${BASE_URL}/solidWasteDetailData`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    console.warn('固废处置详情数据接口调用失败，使用模拟数据:', error.message);
    const types = ['domestic', 'industrial', 'hazardous', 'medical'];
    const facilities = [
      '城市生活垃圾填埋场',
      '工业固废综合处理厂',
      '危险废物处置中心',
      '医疗废物处理站'
    ];

    return Array(20).fill(0).map((_, index) => {
      const type = types[index % 4];
      const generation = Math.round(Math.random() * 1000 + 500);
      const disposalRate = Math.round(Math.random() * 20 + 80);
      const disposal = Math.round(generation * disposalRate / 100);

      return {
        region: ['东部城区', '南部城区', '西部县区', '北部郊区', '市中心'][index % 5],
        type,
        generation,
        disposal,
        disposal_rate: disposalRate,
        disposal_method: index % 3 === 0 ? '填埋' : index % 3 === 1 ? '焚烧' : '综合利用',
        main_facility: facilities[index % facilities.length],
        update_time: `2025-10-${30 - (index % 3)} ${9 + (index % 10)}:${index % 2 === 0 ? '00' : '30'}`
      };
    });
  }
};

