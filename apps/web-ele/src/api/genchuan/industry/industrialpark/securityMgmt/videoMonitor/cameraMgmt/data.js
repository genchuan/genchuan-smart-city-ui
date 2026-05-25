// 文件1: src/views/genchuan/industrialPark/securityMgmt/cameraMgmt/data.js
import { requestClient } from '#/api/request';

// ==================== 设备管理接口 ====================

// 分页查询
export function getCameraMgmtPage(params) {
  return requestClient.get('/securitymgmt/camera-mgmt/page', { params })
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

// 新增
export function createCameraMgmt(data) {
  return requestClient.post('/securitymgmt/camera-mgmt/create', data).catch(err => {
    console.warn('新增接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 编辑
export function updateCameraMgmt(data) {
  return requestClient.put('/securitymgmt/camera-mgmt/update', data).catch(err => {
    console.warn('编辑接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 删除（批量）
export function deleteCameraMgmt(data) {
  return requestClient.delete('/securitymgmt/camera-mgmt/delete', { data }).catch(err => {
    console.warn('删除接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 重启（批量）
export function restartCameraMgmt(data) {
  return requestClient.put('/securitymgmt/camera-mgmt/restart', data).catch(err => {
    console.warn('重启接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 报修（批量）
export function repairCameraMgmt(data) {
  return requestClient.post('/securitymgmt/camera-mgmt/repair', data).catch(err => {
    console.warn('报修接口失败，模拟成功', err);
    return Promise.resolve({ success: true, orderId: Date.now() });
  });
}

// 排查
export function checkCameraMgmt(data) {
  return requestClient.post('/securitymgmt/camera-mgmt/check', data).catch(err => {
    console.warn('排查接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 派单
export function orderCameraMgmt(data) {
  return requestClient.post('/securitymgmt/camera-mgmt/order', data).catch(err => {
    console.warn('派单接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 验收
export function acceptCameraMgmt(data) {
  return requestClient.put('/securitymgmt/camera-mgmt/accept', data).catch(err => {
    console.warn('验收接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

// 详情
export function getCameraMgmtDetail(params) {
  return requestClient.get('/securitymgmt/camera-mgmt/get', { params })
    .catch(err => {
      console.warn('详情接口失败，使用模拟数据', err);
      const mockList = getMockList();
      const detail = mockList.find(item => item.id === params.id) || mockList[0];
      return Promise.resolve(detail);
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

// 报修记录明细（根据设备ID查询工单列表）
export function getRepairOrders(params) {
  return requestClient.get('/securitymgmt/work-order/list', { params }).catch(err => {
    console.warn('报修记录查询失败，使用模拟数据', err);
    return Promise.resolve([
      { id: 1, orderType: '故障报修', orderStatus: '已完成', createTime: Date.now() - 86400000 }
    ]);
  });
}

// 设备管理图表数据（卡片+柱状图）
export function getCameraMgmtChart() {
  return requestClient.get('/securitymgmt/camera-mgmt/chart').catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      deviceTotalCount: 30,
      onlineCount: 28,
      offlineCount: 1,
      faultCount: 1,
      areaDeviceList: [
        { area: '园区大门', count: 4 },
        { area: '办公楼', count: 10 },
        { area: '生产车间', count: 8 },
        { area: '仓库区', count: 6 },
        { area: '停车场', count: 2 },
      ],
      faultAreaList: [
        { area: '办公楼', count: 1 },
      ],
    });
  });
}

// 模拟数据
export const getMockList = () => {
  return [
    {
      id: 1,
      deviceName: '大门摄像头',
      deviceModel: 'DS-2CD2T25F',
      area: '园区大门',
      runStatus: '在线',
      factory: '海康威视',
      factoryPhone: '138****1234',
      repairCount: 0,
      lastRepairTime: null,
      handleUser: 'admin',
      creator: 'admin',
      updater: 'admin',
      createTime: 1744704000000,
      updateTime: 1744707600000,
    },
    {
      id: 2,
      deviceName: '办公楼东摄像头',
      deviceModel: 'DS-2CD2T25F',
      area: '办公楼',
      runStatus: '在线',
      factory: '海康威视',
      factoryPhone: '138****1234',
      repairCount: 1,
      lastRepairTime: 1744617600000,
      handleUser: 'security_li',
      creator: 'admin',
      updater: 'security_li',
      createTime: 1744790400000,
      updateTime: 1744794000000,
    },
    {
      id: 3,
      deviceName: '办公楼西摄像头',
      deviceModel: 'DS-2CD2T25F',
      area: '办公楼',
      runStatus: '离线',
      factory: '海康威视',
      factoryPhone: '138****1234',
      repairCount: 0,
      lastRepairTime: null,
      handleUser: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1744876800000,
      updateTime: 1744876800000,
    },
    {
      id: 4,
      deviceName: '车间A摄像头',
      deviceModel: 'DH-IPC-HFW',
      area: '生产车间',
      runStatus: '在线',
      factory: '大华',
      factoryPhone: '188****5678',
      repairCount: 2,
      lastRepairTime: 1744963200000,
      handleUser: 'security_wang',
      creator: 'admin',
      updater: 'security_wang',
      createTime: 1744963200000,
      updateTime: 1744966800000,
    },
    {
      id: 5,
      deviceName: '仓库北摄像头',
      deviceModel: 'DS-2CD2T25F',
      area: '仓库区',
      runStatus: '故障',
      factory: '海康威视',
      factoryPhone: '138****1234',
      repairCount: 1,
      lastRepairTime: 1745049600000,
      handleUser: null,
      creator: 'admin',
      updater: 'admin',
      createTime: 1745049600000,
      updateTime: 1745049600000,
    },
  ];
};
