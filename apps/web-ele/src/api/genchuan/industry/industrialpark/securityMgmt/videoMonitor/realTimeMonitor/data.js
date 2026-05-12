import { requestClient } from '#/api/request';

// ==================== 实时监控接口 ====================

// 分页查询
export function getRealTimeMonitorPage(params) {
  return requestClient.get('/securitymgmt/real-time-monitor/page', { params })
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

// 截图（批量）
export function snapRealTimeMonitor(data) {
  return requestClient.post('/securitymgmt/real-time-monitor/snap', data).catch(err => {
    console.warn('截图接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 暂停（批量）
export function pauseRealTimeMonitor(data) {
  return requestClient.put('/securitymgmt/real-time-monitor/pause', data).catch(err => {
    console.warn('暂停接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 重启（批量）
export function restartRealTimeMonitor(data) {
  return requestClient.put('/securitymgmt/real-time-monitor/restart', data).catch(err => {
    console.warn('重启接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 聚焦
export function focusRealTimeMonitor(data) {
  return requestClient.post('/securitymgmt/real-time-monitor/focus', data).catch(err => {
    console.warn('聚焦接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 告警
export function alarmRealTimeMonitor(data) {
  return requestClient.post('/securitymgmt/real-time-monitor/alarm', data).catch(err => {
    console.warn('告警接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 处置
export function handleRealTimeMonitor(data) {
  return requestClient.put('/securitymgmt/real-time-monitor/handle', data).catch(err => {
    console.warn('处置接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 录像
export function recordRealTimeMonitor(data) {
  return requestClient.post('/securitymgmt/real-time-monitor/record', data).catch(err => {
    console.warn('录像接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 详情（摄像头设备详情）
export function getRealTimeMonitorDetail(params) {
  return requestClient.get('/securitymgmt/real-time-monitor/get', { params })
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

// 用户信息详情（关联 sys_user）
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

// 安防事件详情（关联 security_event）
export function getSecurityEventDetail(params) {
  return requestClient.get('/securitymgmt/security-event/get', { params }).catch(err => {
    console.warn('安防事件详情接口失败，使用模拟数据', err);
    return Promise.resolve({
      id: 1,
      eventType: '异常闯入',
      handleResult: '已处置',
      handleTime: Date.now()
    });
  });
}

// 视频监控实时态势（卡片 + 柱状图 + 地图）
export function getRealTimeMonitorChart() {
  return requestClient.get('/securitymgmt/real-time-monitor/chart').catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      onlineCount: 28,
      offlineCount: 2,
      alarmTotalCount: 5,
      handleCompleteCount: 3,
      areaStatList: [
        { area: '园区大门', count: 4, onlineCount: 4, offlineCount: 0 },
        { area: '办公楼', count: 10, onlineCount: 9, offlineCount: 1 },
        { area: '生产车间', count: 8, onlineCount: 7, offlineCount: 1 },
        { area: '仓库区', count: 6, onlineCount: 6, offlineCount: 0 },
        { area: '停车场', count: 2, onlineCount: 2, offlineCount: 0 },
      ],
      cameraMapList: [
        { id: 1, cameraName: '大门摄像头', lon: 118.675, lat: 24.896, runStatus: '正常' },
        { id: 2, cameraName: '办公楼东', lon: 118.678, lat: 24.898, runStatus: '正常' },
        { id: 3, cameraName: '办公楼西', lon: 118.676, lat: 24.897, runStatus: '异常' },
        { id: 4, cameraName: '车间A', lon: 118.672, lat: 24.892, runStatus: '正常' },
        { id: 5, cameraName: '仓库北', lon: 118.680, lat: 24.893, runStatus: '正常' },
        { id: 6, cameraName: '停车场南', lon: 118.682, lat: 24.890, runStatus: '离线' },
      ],
    });
  });
}

// 模拟数据
export const getMockList = () => {
  return [
    {
      id: 1,
      cameraId: 1,
      cameraName: '大门摄像头',
      area: '园区大门',
      runStatus: '正常',
      alarmStatus: '无告警',
      imgUrl: '/monitor/preview1.jpg',
      handleUser: 'admin',
      handleResult: null,
      snapImg: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1744785200000,
      updateTime: 1744785200000,
    },
    {
      id: 2,
      cameraId: 2,
      cameraName: '办公楼东摄像头',
      area: '办公楼',
      runStatus: '正常',
      alarmStatus: '告警中',
      imgUrl: '/monitor/preview2.jpg',
      handleUser: 'security_li',
      handleResult: '可疑人员已驱离',
      snapImg: '/snap/2_1744785300.jpg',
      creator: 'admin',
      updater: 'security_li',
      createTime: 1744785000000,
      updateTime: 1744785300000,
    },
    {
      id: 3,
      cameraId: 3,
      cameraName: '办公楼西摄像头',
      area: '办公楼',
      runStatus: '异常',
      alarmStatus: '无告警',
      imgUrl: '/monitor/preview3.jpg',
      handleUser: null,
      handleResult: null,
      snapImg: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1744785100000,
      updateTime: 1744785400000,
    },
    {
      id: 4,
      cameraId: 4,
      cameraName: '车间A摄像头',
      area: '生产车间',
      runStatus: '正常',
      alarmStatus: '无告警',
      imgUrl: '/monitor/preview4.jpg',
      handleUser: null,
      handleResult: null,
      snapImg: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1744785200000,
      updateTime: 1744785500000,
    },
    {
      id: 5,
      cameraId: 5,
      cameraName: '仓库北摄像头',
      area: '仓库区',
      runStatus: '正常',
      alarmStatus: '告警中',
      imgUrl: '/monitor/preview5.jpg',
      handleUser: 'security_wang',
      handleResult: '货物堆放异常',
      snapImg: '/snap/5_1744785600.jpg',
      creator: 'admin',
      updater: 'security_wang',
      createTime: 1744785300000,
      updateTime: 1744785600000,
    },
    {
      id: 6,
      cameraId: 6,
      cameraName: '停车场南摄像头',
      area: '停车场',
      runStatus: '离线',
      alarmStatus: '无告警',
      imgUrl: '/monitor/preview6.jpg',
      handleUser: null,
      handleResult: null,
      snapImg: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1744785400000,
      updateTime: 1744785700000,
    },
  ];
};
