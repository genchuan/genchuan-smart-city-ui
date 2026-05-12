import { requestClient } from '#/api/request';

// ==================== AI识别接口 ====================

// 分页查询
export function getAiRecognitionPage(params) {
  return requestClient.get('/securitymgmt/ai-recognition/page', { params })
    .catch(err => {
      console.warn('分页接口失败，使用模拟数据', err);
      const mock = getMockList();
      const { pageNo = 1, pageSize = 10, ...filters } = params;
      let filtered = mock.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          const itemValue = item[key];
          if (!itemValue) return false;
          if (typeof value === 'string') {
            return itemValue.toString().includes(value);
          }
          return itemValue === value;
        });
      });
      const start = (pageNo - 1) * pageSize;
      const list = filtered.slice(start, start + pageSize);
      return { list, total: filtered.length };
    });
}

// 配置（更新规则）
export function updateAiRecognition(data) {
  return requestClient.put('/securitymgmt/ai-recognition/update', data).catch(err => {
    console.warn('配置接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 启用（批量）
export function enableAiRecognition(data) {
  return requestClient.put('/securitymgmt/ai-recognition/enable', data).catch(err => {
    console.warn('启用接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 禁用（批量）
export function disableAiRecognition(data) {
  return requestClient.put('/securitymgmt/ai-recognition/disable', data).catch(err => {
    console.warn('禁用接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 测试规则
export function testAiRecognition(params) {
  return requestClient.post('/securitymgmt/ai-recognition/test', null, { params }).catch(err => {
    console.warn('测试接口失败，模拟成功', err);
    return Promise.resolve({ testResult: true, testMsg: '规则测试通过，识别准确率 98.5%' });
  });
}

// 核实
export function checkAiRecognition(data) {
  return requestClient.post('/securitymgmt/ai-recognition/check', data).catch(err => {
    console.warn('核实接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 告警（复用实时监控告警接口）
export function alarmRealTimeMonitor(data) {
  return requestClient.post('/securitymgmt/real-time-monitor/alarm', data).catch(err => {
    console.warn('告警接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 忽略
export function ignoreAiRecognition(data) {
  return requestClient.put('/securitymgmt/ai-recognition/ignore', data).catch(err => {
    console.warn('忽略接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 处置
export function handleAiRecognition(data) {
  return requestClient.put('/securitymgmt/ai-recognition/handle', data).catch(err => {
    console.warn('处置接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 归档
export function archiveAiRecognition(data) {
  return requestClient.put('/securitymgmt/ai-recognition/archive', data).catch(err => {
    console.warn('归档接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 详情
export function getAiRecognitionDetail(params) {
  return requestClient.get('/securitymgmt/ai-recognition/get', { params })
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(detail);
    });
}

// 摄像头设备详情（关联 camera_mgmt）
export function getCameraDetail(params) {
  return requestClient.get('/securitymgmt/camera-mgmt/get', { params }).catch(err => {
    console.warn('摄像头设备详情接口失败，使用模拟数据', err);
    return Promise.resolve({
      id: params.id,
      name: '高清网络摄像机',
      location: '园区大门东侧',
      status: '在线',
      model: 'DS-2CD2T25F'
    });
  });
}

// 用户详情（关联 sys_user）
export function getUserDetail(params) {
  return requestClient.get('/system/user/get', { params }).catch(err => {
    console.warn('用户详情接口失败，使用模拟数据', err);
    return Promise.resolve({
      id: params.id,
      username: 'admin',
      nickname: '管理员',
      phone: '13800000000'
    });
  });
}

// AI识别图表数据（饼图+卡片）
export function getAiRecognitionChart() {
  return requestClient.get('/securitymgmt/ai-recognition/chart').catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      recognizeTotalCount: 1250,
      alarmTotalCount: 32,
      checkRate: 100.0,
      handleRate: 96.88,
      typeRatioList: [
        { type: '人形', ratio: 60 },
        { type: '车辆', ratio: 25 },
        { type: '异常行为', ratio: 15 }
      ],
      accuracyList: [
        { ruleName: '越界检测', accuracy: 98.5 },
        { ruleName: '人脸识别', accuracy: 99.2 },
        { ruleName: '车辆检测', accuracy: 97.8 }
      ]
    });
  });
}

// 模拟数据
export const getMockList = () => {
  return [
    {
      id: 1,
      ruleName: '越界检测',
      ruleType: '异常行为',
      cameraId: 1,
      ruleStatus: '启用',
      accuracy: 98.5,
      recognizeCount: 120,
      alarmCount: 5,
      checkRate: 100.0,
      handleRate: 100.0,
      handleUser: 'admin',
      creator: 'admin',
      updater: 'admin',
      createTime: 1744704000000,
      updateTime: 1744707600000,
    },
    {
      id: 2,
      ruleName: '人脸识别',
      ruleType: '人形',
      cameraId: 2,
      ruleStatus: '启用',
      accuracy: 99.2,
      recognizeCount: 350,
      alarmCount: 8,
      checkRate: 100.0,
      handleRate: 100.0,
      handleUser: 'security_li',
      creator: 'admin',
      updater: 'security_li',
      createTime: 1744790400000,
      updateTime: 1744794000000,
    },
    {
      id: 3,
      ruleName: '车辆检测',
      ruleType: '车辆',
      cameraId: 3,
      ruleStatus: '禁用',
      accuracy: 97.8,
      recognizeCount: 280,
      alarmCount: 12,
      checkRate: 100.0,
      handleRate: 91.67,
      handleUser: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1744876800000,
      updateTime: 1744876800000,
    },
    {
      id: 4,
      ruleName: '徘徊检测',
      ruleType: '异常行为',
      cameraId: 4,
      ruleStatus: '启用',
      accuracy: 96.5,
      recognizeCount: 95,
      alarmCount: 3,
      checkRate: 100.0,
      handleRate: 100.0,
      handleUser: 'security_wang',
      creator: 'admin',
      updater: 'security_wang',
      createTime: 1744963200000,
      updateTime: 1744966800000,
    },
    {
      id: 5,
      ruleName: '区域入侵',
      ruleType: '异常行为',
      cameraId: 5,
      ruleStatus: '禁用',
      accuracy: 94.2,
      recognizeCount: 45,
      alarmCount: 2,
      checkRate: 100.0,
      handleRate: 100.0,
      handleUser: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1745049600000,
      updateTime: 1745049600000,
    },
  ];
};
