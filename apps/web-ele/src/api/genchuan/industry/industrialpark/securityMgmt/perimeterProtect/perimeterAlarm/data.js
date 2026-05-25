// 文件1: src/api/genchuan/industry/industrialpark/securityMgmt/perimeterProtect/perimeterAlarm/index.js
import { requestClient } from '#/api/request';

// ==================== 周界报警接口 ====================

// 分页查询
export function getPerimeterAlarmPage(params) {
  return requestClient.get('/securitymgmt/perimeter-alarm/page', { params })
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

// 布防（批量）
export function defendPerimeterAlarm(data) {
  return requestClient.put('/securitymgmt/perimeter-alarm/defend', data).catch(err => {
    console.warn('布防接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 撤防（批量）
export function cancelDefendPerimeterAlarm(data) {
  return requestClient.put('/securitymgmt/perimeter-alarm/cancel-defend', data).catch(err => {
    console.warn('撤防接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 灵敏度调整（批量）
export function updateSensitivityPerimeterAlarm(data) {
  return requestClient.put('/securitymgmt/perimeter-alarm/update-sensitivity', data).catch(err => {
    console.warn('灵敏度调整接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 处置（批量）
export function handlePerimeterAlarm(data) {
  return requestClient.put('/securitymgmt/perimeter-alarm/handle', data).catch(err => {
    console.warn('处置接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 忽略
export function ignorePerimeterAlarm(data) {
  return requestClient.put('/securitymgmt/perimeter-alarm/ignore', data).catch(err => {
    console.warn('忽略接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 联动监控
export function linkMonitorPerimeterAlarm(params) {
  return requestClient.post('/securitymgmt/perimeter-alarm/link-monitor', null, { params }).catch(err => {
    console.warn('联动监控接口失败，模拟成功', err);
    return Promise.resolve({ monitorUrl: '/mock/monitor/' + params.id + '.jpg' });
  });
}

// 确认
export function confirmPerimeterAlarm(data) {
  return requestClient.put('/securitymgmt/perimeter-alarm/confirm', data).catch(err => {
    console.warn('确认接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 详情
export function getPerimeterAlarmDetail(params) {
  return requestClient.get('/securitymgmt/perimeter-alarm/get', { params })
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(detail);
    });
}

// 防护区域详情（关联 protect_area）
export function getProtectAreaDetail(params) {
  return requestClient.get('/securitymgmt/protect-area/get', { params }).catch(err => {
    console.warn('防护区域详情接口失败，使用模拟数据', err);
    return Promise.resolve({
      id: params.id,
      areaName: '北围墙',
      location: '园区北侧围墙',
      defendStatus: '布防中',
      sensitivity: 7
    });
  });
}

// 周界设备详情（关联 perimeter_device）
export function getPerimeterDeviceDetail(params) {
  return requestClient.get('/securitymgmt/perimeter-device/get', { params }).catch(err => {
    console.warn('周界设备详情接口失败，使用模拟数据', err);
    return Promise.resolve({
      id: params.id,
      name: '振动光纤探测器',
      model: 'GX-01',
      status: '在线'
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

// 周界报警图表数据（地图+卡片+柱状图）
export function getPerimeterAlarmChart() {
  return requestClient.get('/securitymgmt/perimeter-alarm/chart').catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      alarmTotalCount: 15,
      handleCount: 12,
      unHandleCount: 3,
      dailyAlarmList: [
        { date: '2025-05-01', count: 2 },
        { date: '2025-05-02', count: 3 },
        { date: '2025-05-03', count: 4 },
        { date: '2025-05-04', count: 2 },
        { date: '2025-05-05', count: 3 },
        { date: '2025-05-06', count: 1 },
      ],
      areaAlarmList: [
        { area: '北围墙', count: 5 },
        { area: '东围墙', count: 3 },
        { area: '南围墙', count: 4 },
        { area: '西围墙', count: 3 },
      ],
      alarmMapList: [
        { id: 1, alarmArea: '北围墙东段', lon: 118.675, lat: 24.896, alarmType: '入侵' },
        { id: 2, alarmArea: '北围墙西段', lon: 118.672, lat: 24.896, alarmType: '破坏' },
        { id: 3, alarmArea: '东围墙北段', lon: 118.680, lat: 24.898, alarmType: '入侵' },
        { id: 4, alarmArea: '南围墙中段', lon: 118.678, lat: 24.890, alarmType: '入侵' },
        { id: 5, alarmArea: '西围墙南段', lon: 118.668, lat: 24.892, alarmType: '破坏' },
      ],
    });
  });
}

// 模拟数据
export const getMockList = () => {
  return [
    {
      id: 1,
      areaId: 1,
      alarmArea: '北围墙东段',
      alarmTime: 1744704000000,
      alarmType: '入侵',
      deviceId: 1,
      alarmStatus: '告警中',
      handleUser: null,
      handleResult: null,
      linkStatus: null,
      creator: 'system',
      updater: 'system',
      createTime: 1744704000000,
      updateTime: 1744704000000,
    },
    {
      id: 2,
      areaId: 1,
      alarmArea: '北围墙西段',
      alarmTime: 1744790400000,
      alarmType: '破坏',
      deviceId: 2,
      alarmStatus: '已处置',
      handleUser: 'security_li',
      handleResult: '已修复围栏破损',
      linkStatus: '已联动',
      creator: 'system',
      updater: 'security_li',
      createTime: 1744790400000,
      updateTime: 1744794000000,
    },
    {
      id: 3,
      areaId: 2,
      alarmArea: '东围墙北段',
      alarmTime: 1744876800000,
      alarmType: '入侵',
      deviceId: 3,
      alarmStatus: '告警中',
      handleUser: null,
      handleResult: null,
      linkStatus: null,
      creator: 'system',
      updater: 'system',
      createTime: 1744876800000,
      updateTime: 1744876800000,
    },
    {
      id: 4,
      areaId: 3,
      alarmArea: '南围墙中段',
      alarmTime: 1744963200000,
      alarmType: '入侵',
      deviceId: 4,
      alarmStatus: '告警中',
      handleUser: null,
      handleResult: null,
      linkStatus: null,
      creator: 'system',
      updater: 'system',
      createTime: 1744963200000,
      updateTime: 1744963200000,
    },
    {
      id: 5,
      areaId: 4,
      alarmArea: '西围墙南段',
      alarmTime: 1745049600000,
      alarmType: '破坏',
      deviceId: 5,
      alarmStatus: '已处置',
      handleUser: 'security_wang',
      handleResult: '已处理破坏点',
      linkStatus: '已联动',
      creator: 'system',
      updater: 'security_wang',
      createTime: 1745049600000,
      updateTime: 1745053200000,
    },
  ];
};
