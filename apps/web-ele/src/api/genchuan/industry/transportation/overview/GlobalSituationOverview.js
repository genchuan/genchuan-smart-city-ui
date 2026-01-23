// 引入axios（假设项目中已配置axios）
import axios from 'axios';

// 基础URL，可根据实际项目配置
const BASE_URL = '/api/transportation';

// 获取交通设备几何数据
export const fetchTransportEquipmentGeometries = async () => {
  try {
    // 1. 优先调用真实接口
    const response = await axios.get(`${BASE_URL}/equipmentGeometries`);
    // 验证接口返回数据有效性（确保是数组）
    if (Array.isArray(response.data)) {
      return response.data; // 返回真实数据
    }
    throw new Error('真实接口返回无效数据，使用模拟数据兜底');
  } catch (error) {
    // 2. 接口调用失败，返回模拟数据
    console.warn('交通设备几何数据接口调用失败，使用模拟数据:', error.message);
    return [
      {
        coord_x: 26.855237, // 纬度
        coord_y: 117.777777, // 经度
        equip_id: "T001", // 设备ID
        equip_name: "城东路口红绿灯", // 设备名称
        run_status: "正常" // 状态
      },
      {
        coord_x: 26.783237,
        coord_y: 117.720114,
        equip_id: "T002",
        equip_name: "南郊大道违章监控",
        run_status: "异常"
      },
      {
        coord_x: 26.733337,
        coord_y: 117.650114,
        equip_id: "T003",
        equip_name: "老城区道路指示牌",
        run_status: "正常"
      },
      {
        coord_x: 26.810237,
        coord_y: 117.800777,
        equip_id: "T004",
        equip_name: "河西快速路测速摄像头",
        run_status: "维护"
      },
      {
        coord_x: 26.756237,
        coord_y: 117.712114,
        equip_id: "T005",
        equip_name: "北站广场人行道闸机",
        run_status: "正常"
      },
      {
        coord_x: 26.832237,
        coord_y: 117.689114,
        equip_id: "T006",
        equip_name: "工业园区入口交通岗亭",
        run_status: "异常"
      },
      {
        coord_x: 26.798237,
        coord_y: 117.833777,
        equip_id: "T007",
        equip_name: "环山路隧道照明设备",
        run_status: "维护"
      },
      {
        coord_x: 26.765237,
        coord_y: 117.755114,
        equip_id: "T008",
        equip_name: "新区主干道交通信号灯",
        run_status: "正常"
      },
      {
        coord_x: 26.822237,
        coord_y: 117.790114,
        equip_id: "T009",
        equip_name: "跨江大桥监控设备",
        run_status: "异常"
      },
      {
        coord_x: 26.745237,
        coord_y: 117.678114,
        equip_id: "T010",
        equip_name: "大学城区域违停抓拍器",
        run_status: "维护"
      }
    ];
  }
};

// 获取交通资源分布数据
export const fetchResourceDistribution = async () => {
  try {
    // 1. 优先调用真实接口
    const response = await axios.get(`${BASE_URL}/resourceDistribution`);
    // 验证接口返回数据有效性
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data; // 返回真实数据
    }
    throw new Error('真实接口返回空数据，使用模拟数据兜底');
  } catch (error) {
    // 2. 接口调用失败，返回模拟数据
    console.warn('交通资源分布接口调用失败，使用模拟数据:', error.message);
    return [
      {
        dist_id: 'dist1001',
        area_id: 'area1001',
        area_name: '东山区',
        resource_type: '1', // 1（道路）
        total_count: 50,
        normal_count: 45,
        abnormal_count: 5,
        stat_time: '2025-06-10 00:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: '日统计',
        ext2: '0.8km/平方公里'
      },
      {
        dist_id: 'dist1002',
        area_id: 'area1001',
        area_name: '东山区',
        resource_type: '2', // 2（公交站）
        total_count: 30,
        normal_count: 28,
        abnormal_count: 2,
        stat_time: '2025-06-10 00:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: '日统计',
        ext2: '1.2个/平方公里'
      },
      {
        dist_id: 'dist1003',
        area_id: 'area1001',
        area_name: '东山区',
        resource_type: '3', // 3（枢纽）
        total_count: 3,
        normal_count: 2,
        abnormal_count: 1,
        stat_time: '2025-06-10 00:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: '日统计',
        ext2: '0.05个/平方公里'
      },
      {
        dist_id: 'dist1004',
        area_id: 'area1002',
        area_name: '西城区',
        resource_type: '1', // 1（道路）
        total_count: 45,
        normal_count: 42,
        abnormal_count: 3,
        stat_time: '2025-06-10 00:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: '日统计',
        ext2: '0.7km/平方公里'
      },
      {
        dist_id: 'dist1005',
        area_id: 'area1002',
        area_name: '西城区',
        resource_type: '2', // 2（公交站）
        total_count: 25,
        normal_count: 23,
        abnormal_count: 2,
        stat_time: '2025-06-10 00:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: '日统计',
        ext2: '1.0个/平方公里'
      },
      {
        dist_id: 'dist1006',
        area_id: 'area1002',
        area_name: '西城区',
        resource_type: '3', // 3（枢纽）
        total_count: 2,
        normal_count: 2,
        abnormal_count: 0,
        stat_time: '2025-06-10 00:00:00',
        create_user: 'system',
        create_time: '2025-02-20 10:30:00',
        ext1: '日统计',
        ext2: '0.03个/平方公里'
      },
      {
        dist_id: 'dist1007',
        area_id: 'area1003',
        area_name: '南城区',
        resource_type: '1', // 1（道路）
        total_count: 35,
        normal_count: 30,
        abnormal_count: 5,
        stat_time: '2025-06-10 00:00:00',
        create_user: 'system',
        create_time: '2025-02-20 10:30:00',
        ext1: '日统计',
        ext2: '0.6km/平方公里'
      },
      {
        dist_id: 'dist1008',
        area_id: 'area1003',
        area_name: '南城区',
        resource_type: '2', // 2（公交站）
        total_count: 20,
        normal_count: 18,
        abnormal_count: 2,
        stat_time: '2025-06-10 00:00:00',
        create_user: 'system',
        create_time: '2025-03-05 14:15:00',
        ext1: '日统计',
        ext2: '0.9个/平方公里'
      },
      {
        dist_id: 'dist1009',
        area_id: 'area1003',
        area_name: '南城区',
        resource_type: '3', // 3（枢纽）
        total_count: 1,
        normal_count: 1,
        abnormal_count: 0,
        stat_time: '2025-06-10 00:00:00',
        create_user: 'system',
        create_time: '2025-03-05 14:15:00',
        ext1: '日统计',
        ext2: '0.02个/平方公里'
      },
      {
        dist_id: 'dist1010',
        area_id: 'area1004',
        area_name: '北城区',
        resource_type: '1', // 1（道路）
        total_count: 40,
        normal_count: 38,
        abnormal_count: 2,
        stat_time: '2025-06-10 00:00:00',
        create_user: 'system',
        create_time: '2025-04-12 09:45:00',
        ext1: '日统计',
        ext2: '0.7km/平方公里'
      }
    ];
  }
};

// 获取交通核心指标数据
export const fetchCoreIndicators = async (timeRange = 'today') => {
  try {
    // 1. 优先调用真实接口
    const response = await axios.get(`${BASE_URL}/coreIndicators`, {
      params: { timeRange }
    });
    // 验证接口返回数据有效性
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data; // 返回真实数据
    }
    throw new Error('真实接口返回空数据，使用模拟数据兜底');
  } catch (error) {
    // 2. 模拟数据：四类指标组，每类包含子指标
    console.warn('交通核心指标接口调用失败，使用模拟数据:', error.message);
    return [
      {
        type: 'traffic_efficiency', // 通行效率指标
        name: '通行效率指标',
        indicators: [
          {
            code: 'avg_speed',
            name: '平均速度',
            value: 32.8, // 单位：km/h
            unit: 'km/h',
            target: 30, // 目标值
            status: '0', // 0正常（≥目标），1异常
            yearOnYear: 5.2, // 同比增长5.2%
          },
          {
            code: 'congest_rate',
            name: '拥堵率',
            value: 8.3, // 单位：%
            unit: '%',
            target: 20, // 目标值
            status: '0', // 0正常（≤目标），1异常
            yearOnYear: -2.1, // 同比下降2.1%
          }
        ]
      },
      {
        type: 'safety', // 安全指标
        name: '安全指标',
        indicators: [
          {
            code: 'accident_count',
            name: '事故数量',
            value: 28, // 单位：起
            unit: '起',
            target: 5, // 目标值（≤5为正常）
            status: '0',
            yearOnYear: -14.3, // 同比下降14.3%
          },
          {
            code: 'warning_count',
            name: '预警数量',
            value: 45, // 单位：次
            unit: '次',
            target: 15, // 目标值（≤15为正常）
            status: '0',
            yearOnYear: 8.7, // 同比增长8.7%
          }
        ]
      },
      {
        type: 'service', // 服务指标
        name: '服务指标',
        indicators: [
          {
            code: 'bus_on_time_rate',
            name: '公交准点率',
            value: 88.0, // 单位：%
            unit: '%',
            target: 85, // 目标值（≥85为正常）
            status: '0',
            yearOnYear: 3.5, // 同比增长3.5%
          },
          {
            code: 'complain_count',
            name: '投诉数量',
            value: 7, // 单位：件
            unit: '件',
            target: 10, // 目标值（≤10为正常）
            status: '0',
            yearOnYear: -23.1, // 同比下降23.1%
          }
        ]
      },
      {
        type: 'emergency', // 应急指标
        name: '应急指标',
        indicators: [
          {
            code: 'emer_resp_time',
            name: '应急响应时间',
            value: 8.2, // 单位：分钟
            unit: '分钟',
            target: 5, // 目标值（≤5为正常）
            status: '0',
            yearOnYear: -11.8, // 同比下降11.8%
          }
        ]
      }
    ];
  }
};

// 获取交通流量总览数据
export const fetchTrafficFlowOverview = async () => {
  try {
    // 1. 优先调用真实接口
    const response = await axios.get(`${BASE_URL}/trafficFlowOverview`);
    // 验证接口返回数据有效性
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data; // 返回真实数据
    }
    throw new Error('真实接口返回空数据，使用模拟数据兜底');
  } catch (error) {
    // 2. 接口调用失败，返回模拟数据（已补充7条路段，共10条路段）
    console.warn('交通流量总览接口调用失败，使用模拟数据:', error.message);
    return [
      // 原有3条路段
      {
        flow_id: 'flow1001',
        monitor_obj_type: '1', // 1（路段）
        monitor_obj_id: 'road1001',
        monitor_obj_name: '城东主干道',
        monitor_period: '07:00-08:00早高峰',
        vehicle_flow: 300,
        people_flow: null,
        saturation_value: 400,
        flow_status: '0', // 0（正常）
        monitor_time: '2025-06-10 08:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-2001',
        ext2: '平稳'
      },
      {
        flow_id: 'flow1002',
        monitor_obj_type: '1', // 1（路段）
        monitor_obj_id: 'road1002',
        monitor_obj_name: '城西快速路',
        monitor_period: '07:00-08:00早高峰',
        vehicle_flow: 380,
        people_flow: null,
        saturation_value: 400,
        flow_status: '1', // 1（接近饱和）
        monitor_time: '2025-06-10 08:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-2002',
        ext2: '上升'
      },
      {
        flow_id: 'flow1005',
        monitor_obj_type: '1', // 1（路段）
        monitor_obj_id: 'road1003',
        monitor_obj_name: '南郊路',
        monitor_period: '09:00-10:00',
        vehicle_flow: 250,
        people_flow: null,
        saturation_value: 300,
        flow_status: '0', // 0（正常）
        monitor_time: '2025-06-10 10:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-2003',
        ext2: '下降'
      },
      // 新增7条路段（共10条路段，满足TOP10需求）
      {
        flow_id: 'flow1006',
        monitor_obj_type: '1', // 1（路段）
        monitor_obj_id: 'road1004',
        monitor_obj_name: '城北高架路',
        monitor_period: '08:00-09:00早高峰',
        vehicle_flow: 420,
        people_flow: null,
        saturation_value: 500,
        flow_status: '1', // 1（接近饱和）
        monitor_time: '2025-06-10 09:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-2004',
        ext2: '上升'
      },
      {
        flow_id: 'flow1007',
        monitor_obj_type: '1', // 1（路段）
        monitor_obj_id: 'road1005',
        monitor_obj_name: '城南快速路',
        monitor_period: '07:30-08:30早高峰',
        vehicle_flow: 480,
        people_flow: null,
        saturation_value: 500,
        flow_status: '2', // 2（超饱和）
        monitor_time: '2025-06-10 08:30:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-2005',
        ext2: '超容'
      },
      {
        flow_id: 'flow1008',
        monitor_obj_type: '1', // 1（路段）
        monitor_obj_id: 'road1006',
        monitor_obj_name: '城中环路',
        monitor_period: '09:30-10:30',
        vehicle_flow: 280,
        people_flow: null,
        saturation_value: 400,
        flow_status: '0', // 0（正常）
        monitor_time: '2025-06-10 10:30:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-2006',
        ext2: '平稳'
      },
      {
        flow_id: 'flow1009',
        monitor_obj_type: '1', // 1（路段）
        monitor_obj_id: 'road1007',
        monitor_obj_name: '东环支路',
        monitor_period: '10:00-11:00',
        vehicle_flow: 350,
        people_flow: null,
        saturation_value: 450,
        flow_status: '0', // 0（正常）
        monitor_time: '2025-06-10 11:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-2007',
        ext2: '平稳'
      },
      {
        flow_id: 'flow1010',
        monitor_obj_type: '1', // 1（路段）
        monitor_obj_id: 'road1008',
        monitor_obj_name: '西环辅路',
        monitor_period: '08:30-09:30',
        vehicle_flow: 390,
        people_flow: null,
        saturation_value: 400,
        flow_status: '1', // 1（接近饱和）
        monitor_time: '2025-06-10 09:30:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-2008',
        ext2: '上升'
      },
      {
        flow_id: 'flow1011',
        monitor_obj_type: '1', // 1（路段）
        monitor_obj_id: 'road1009',
        monitor_obj_name: '北环快速路',
        monitor_period: '07:00-08:00早高峰',
        vehicle_flow: 450,
        people_flow: null,
        saturation_value: 500,
        flow_status: '1', // 1（接近饱和）
        monitor_time: '2025-06-10 08:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-2009',
        ext2: '上升'
      },
      {
        flow_id: 'flow1012',
        monitor_obj_type: '1', // 1（路段）
        monitor_obj_id: 'road1010',
        monitor_obj_name: '南环高架路',
        monitor_period: '08:00-09:00早高峰',
        vehicle_flow: 520,
        people_flow: null,
        saturation_value: 500,
        flow_status: '2', // 2（超饱和）
        monitor_time: '2025-06-10 09:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-2010',
        ext2: '超容'
      },
      // 原有2条枢纽（保留，不影响路段TOP10）
      {
        flow_id: 'flow1003',
        monitor_obj_type: '2', // 2（枢纽）
        monitor_obj_id: 'hub1001',
        monitor_obj_name: '中央枢纽',
        monitor_period: '07:30-08:30早高峰',
        vehicle_flow: null,
        people_flow: 500,
        saturation_value: 600,
        flow_status: '0', // 0（正常）
        monitor_time: '2025-06-10 08:30:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-3001',
        ext2: '平稳'
      },
      {
        flow_id: 'flow1004',
        monitor_obj_type: '2', // 2（枢纽）
        monitor_obj_id: 'hub1002',
        monitor_obj_name: '北站枢纽',
        monitor_period: '08:00-09:00早高峰',
        vehicle_flow: null,
        people_flow: 650,
        saturation_value: 600,
        flow_status: '2', // 2（超饱和）
        monitor_time: '2025-06-10 09:00:00',
        create_user: 'system',
        create_time: '2025-01-15 08:00:00',
        ext1: 'SENSOR-3002',
        ext2: '上升'
      }
    ];
  }
};

// 获取异常信息滚动数据
export const fetchWarningScrollData = async () => {
  try {
    // 1. 优先调用真实接口
    const response = await axios.get(`${BASE_URL}/warningScrollData`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data; // 返回真实数据
    }
    throw new Error('真实接口返回空数据，使用模拟数据兜底');
  } catch (error) {
    // 2. 接口调用失败，返回模拟数据
    console.warn('异常信息滚动数据接口调用失败，使用模拟数据:', error.message);
    return [
      ['南郊路沿线', '公交晚点', '09:20', '未处理'],
      ['北站枢纽', '人流量过大', '10:15', '处理中'],
      ['中央枢纽', '停车位已满', '11:30', '未处理'],
      ['城东主干道', '交通事故', '13:45', '已解决'],
      ['城西快速路', '拥堵', '14:20', '处理中'],
      ['河东路沿线', '公交故障', '15:10', '已解决']
    ];
  }
};

// 处理交通异常
export const handleAbnormal = async (params) => {
  try {
    // 1. 优先调用真实接口
    const response = await axios.post(`${BASE_URL}/handleAbnormal`, params);
    // 验证接口返回数据有效性
    if (response.data && response.data.success) {
      return response.data; // 返回真实结果
    }
    throw new Error('真实接口返回无效结果，使用模拟结果兜底');
  } catch (error) {
    // 2. 接口调用失败，返回模拟结果
    console.warn('处理交通异常接口调用失败，使用模拟结果:', error.message);
    return {
      success: true,
      message: '异常处理成功',
      data: {
        handleTime: new Date().toLocaleString()
      }
    };
  }
};

// 配置指标目标值
export const configureIndicatorTarget = async (params) => {
  try {
    // 1. 优先调用真实接口
    const response = await axios.post(`${BASE_URL}/configureIndicator`, params);
    // 验证接口返回数据有效性
    if (response.data && response.data.success) {
      return response.data; // 返回真实结果
    }
    throw new Error('真实接口返回无效结果，使用模拟结果兜底');
  } catch (error) {
    // 2. 接口调用失败，返回模拟结果
    console.warn('配置指标目标值接口调用失败，使用模拟结果:', error.message);
    return {
      success: true,
      message: '指标目标值配置成功',
      data: {
        configureTime: new Date().toLocaleString()
      }
    };
  }
};

// 获取指标历史趋势数据
export const fetchIndicatorHistory = async (subCode, targetValue) => {
  try {
    // 模拟真实接口调用
    const response = await axios.get(`${BASE_URL}/indicatorHistory`, {
      params: { subCode }
    });
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('指标历史数据无效，使用模拟数据');
  } catch (error) {
    console.warn('指标历史趋势接口调用失败，使用模拟数据:', error.message);
    const xAxis = [];
    const data = [];
    const targetData = [];
    const today = new Date();
    // 根据子指标类型生成基础值
    let baseValue = 0;
    switch (subCode) {
      case 'avg_speed': baseValue = 32; break;
      case 'congest_rate': baseValue = 18; break;
      case 'accident_count': baseValue = 3; break;
      case 'warning_count': baseValue = 12; break;
      case 'bus_on_time_rate': baseValue = 88; break;
      case 'complain_count': baseValue = 7; break;
      case 'emer_resp_time': baseValue = 4.2; break;
      default: baseValue = 50;
    }

    // 生成30天数据
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      xAxis.push(`${date.getMonth() + 1}/${date.getDate()}`);
      // 生成波动数据（不同指标波动范围不同）
      const fluctuation = subCode === 'accident_count' || subCode === 'complain_count'
        ? Math.floor((Math.random() - 0.5) * 2) // 整数指标波动小
        : (Math.random() - 0.5) * (subCode === 'avg_speed' ? 5 : 3); // 小数指标波动
      data.push(parseFloat((baseValue + fluctuation).toFixed(2)));
      targetData.push(targetValue); // 目标值线
    }

    return {
      xAxis,
      series: [
        { name: '指标值', data },
        { name: '目标值', data: targetData, type: 'line', lineStyle: { type: 'dashed' } }
      ]
    };
  }
};

// 获取指标组12个月趋势数据
export const fetchIndicatorTrend = async (indicators) => {
  try {
    const subCodes = indicators.map(sub => sub.code).join(','); // 收集子指标code，传给接口
    const response = await axios.get(`${BASE_URL}/indicatorTrend`, {
      params: { subCodes } // 真实接口需接收子指标codes，按需调整参数名（如接口要求不同可修改）
    });

    if (
      response.data &&
      Array.isArray(response.data.xAxis) &&
      Array.isArray(response.data.series) &&
      response.data.series.length > 0
    ) {
      return response.data; // 返回真实接口数据
    }

    throw new Error('真实接口返回数据无效，使用模拟数据兜底');
  } catch (error) {
    console.warn('指标组趋势接口调用失败，使用模拟数据:', error.message);

    const xAxis = [];
    const series = indicators.map(sub => ({
      name: sub.name,
      data: []
    }));

    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now);
      month.setMonth(now.getMonth() - i);
      xAxis.push(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`);

      indicators.forEach((sub, index) => {
        const baseValue = sub.value;
        const fluctuation = (Math.random() - 0.5) * (sub.code === 'accident_count' ? 2 : 5);
        series[index].data.push(parseFloat((baseValue + fluctuation).toFixed(2)));
      });
    }

    return { xAxis, series };
  }
};

// 获取流量趋势数据
export const fetchFlowTrend = async (flowId) => {
  try {
    // 模拟真实接口调用
    const response = await axios.get(`${BASE_URL}/flowTrend`, {
      params: { flowId }
    });
    if (response.data && response.data.xAxis && response.data.series) {
      return response.data;
    }
    throw new Error('流量趋势数据无效，使用模拟数据');
  } catch (error) {
    console.warn('流量趋势接口调用失败，使用模拟数据:', error.message);
    // 模拟数据生成逻辑
    const xAxis = [];
    const data = [];
    const saturationData = [];
    const now = new Date();
    // 假设通过flowId获取基础值（模拟逻辑）
    const baseValue = 300; // 车流量/人流量基础值
    const saturationValue = 400; // 饱和值

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now);
      hour.setHours(now.getHours() - i);
      xAxis.push(`${hour.getHours()}:00`);
      // 生成波动数据
      const fluctuation = (Math.random() - 0.5) * baseValue * 0.3;
      data.push(Math.max(0, Math.round(baseValue + fluctuation)));
      saturationData.push(saturationValue);
    }

    return {
      xAxis,
      series: [
        { name: '流量', data },
        { name: '饱和值', data: saturationData, type: 'line', lineStyle: { type: 'dashed' } }
      ]
    };
  }
};

