// import { requestClient } from '#/api/request';

// // 分页列表
// export function getChargingPilePage(params) {
//   return requestClient.get('/vehiclecharging/charging_pile/page', { params });
// }
//
// // 新增
// export function createChargingPile(data) {
//   return requestClient.post('/vehiclecharging/charging_pile/create', data);
// }
//
// // 编辑
// export function updateChargingPile(data) {
//   return requestClient.put('/vehiclecharging/charging_pile/update', data);
// }
//
// // 详情
// export function getChargingPileDetail(id) {
//   return requestClient.get(`/vehiclecharging/charging_pile/get?id=${id}`);
// }
//
// // 调试
// export function debugChargingPile(data) {
//   return requestClient.put('/vehiclecharging/charging_pile/debug', data);
// }
//
// // 启用
// export function enableChargingPile(data) {
//   return requestClient.put('/vehiclecharging/charging_pile/enable', data);
// }
//
// // 停用
// export function disableChargingPile(data) {
//   return requestClient.put('/vehiclecharging/charging_pile/disable', data);
// }
//
// // 重启
// export function restartChargingPile(data) {
//   return requestClient.put('/vehiclecharging/charging_pile/restart', data);
// }
//
// // 导出
// export function exportChargingPile(params) {
//   return requestClient.download('/vehiclecharging/charging_pile/export', { params });
// }
//
// // 刷新（即时获取最新数据）
// export function refreshChargingPile(params) {
//   return requestClient.get('/vehiclecharging/charging_pile/refresh', { params });
// }
//
// // 充电枪二维码预览
// export function getQrcode(id) {
//   return requestClient.get(`/vehiclecharging/charging_pile/qrcode?id=${id}`);
// }
//
// // 图表数据
// export function getChartData(params) {
//   return requestClient.get('/vehiclecharging/charging_pile/chart', { params });
// }
//
// // 运行时长趋势（钻取）
// export function getRunTimeTrend(params) {
//   return requestClient.get('/vehiclecharging/charging_pile/chart/runTimeTrend', { params });
// }
//
// // 各类型充电桩数量（钻取）
// export function getTypeCount(params) {
//   return requestClient.get('/vehiclecharging/charging_pile/chart/typeCount', { params });
// }
//
// // 状态统计钻取列表
// export function getStatusList(params) {
//   return requestClient.get('/vehiclecharging/charging_pile/chart/statusCount', { params });
// }




// src/api/genchuan/industry/energyCharging/carCharging/chargingPile/index.js
import { requestClient } from '#/api/request.js';

// ==================== 模拟数据 ====================
export const stationList = [
  { id: 20001, name: '城区商圈充电站' },
  { id: 20002, name: '科技园充电站' },
  { id: 20003, name: '高铁站充电站' },
  { id: 20004, name: '大学城充电站' },
  { id: 20005, name: '物流园充电站' },
];

const generateMockData = () => {
  const models = ['DC-60kW', 'DC-120kW', 'AC-7kW', 'AC-22kW', 'DC-150kW'];
  const manufacturers = ['特来电', '星星充电', '国网电动', '万马爱充', '科士达'];
  const chargeModes = ['直流', '交流', '交直流混合'];
  const statuses = ['未调试', '已调试', '已启用', '已停用'];

  const list = [];
  for (let i = 1; i <= 50; i++) {
    const id = 30000 + i;
    const station = stationList[i % stationList.length];
    const model = models[i % models.length];
    const power = parseFloat(model.match(/\d+/)[0]) || 60;
    const manufacturer = manufacturers[i % manufacturers.length];
    const chargeMode = chargeModes[i % chargeModes.length];
    let pileStatus = statuses[i % statuses.length];
    if (i % 4 === 0) pileStatus = '已启用';
    if (i % 7 === 0) pileStatus = '已调试';
    if (i % 9 === 0) pileStatus = '已停用';
    const faultFlag = i % 10 === 0 ? 1 : 0;
    const runTime = Math.floor(Math.random() * 2000);
    const createTime = `2026-03-${String(20 + (i % 10)).padStart(2, '0')} 10:30:00`;
    const qrcode = pileStatus !== '未调试'
      ? `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CP-${id}`
      : '';

    list.push({
      id,
      pileCode: `CP-${id}`,
      model,
      power,
      manufacturer,
      stationId: station.id,
      stationName: station.name,
      lotId: 40000 + i,
      lotCode: `CL-${id}`,
      chargeMode,
      pileStatus,
      faultFlag,
      runTime,
      qrcode,
      remark: faultFlag === 1 ? '设备故障，需检修' : '',
      creator: 'admin',
      createTime,
      updater: 'admin',
      updateTime: createTime,
    });
  }
  return list;
};

let mockList = generateMockData();

const filterList = (params) => {
  let filtered = [...mockList];
  if (params.pileCode) filtered = filtered.filter(item => item.pileCode.includes(params.pileCode));
  if (params.model) filtered = filtered.filter(item => item.model.includes(params.model));
  if (params.manufacturer) filtered = filtered.filter(item => item.manufacturer.includes(params.manufacturer));
  if (params.stationId) filtered = filtered.filter(item => item.stationId === params.stationId);
  if (params.chargeMode) filtered = filtered.filter(item => item.chargeMode === params.chargeMode);
  if (params.pileStatus) filtered = filtered.filter(item => item.pileStatus === params.pileStatus);
  if (params.faultFlag !== undefined) filtered = filtered.filter(item => item.faultFlag === params.faultFlag);
  return filtered;
};

// 1. 分页列表
export function getChargingPilePage(params) {
  const pageNo = params.pageNo || 1;
  const pageSize = params.pageSize || 10;
  const filtered = filterList(params);
  const start = (pageNo - 1) * pageSize;
  const pageList = filtered.slice(start, start + pageSize);
  return Promise.resolve({
    list: pageList,
    total: filtered.length,
    pageNum: pageNo,
    pageSize,
  });
}

// 2. 新增
export function createChargingPile(data) {
  if (mockList.some(item => item.pileCode === data.pileCode)) {
    return Promise.reject({ code: 500, msg: '设备编号已存在' });
  }
  const newId = Math.max(...mockList.map(i => i.id), 0) + 1;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const station = stationList.find(s => s.id === data.stationId);
  const newItem = {
    id: newId,
    ...data,
    stationName: station?.name || '',
    faultFlag: 0,
    runTime: 0,
    qrcode: '',
    creator: 'admin',
    createTime: now,
    updater: 'admin',
    updateTime: now,
  };
  mockList.unshift(newItem);
  return Promise.resolve({ code: 200, data: newItem, msg: '充电桩新增成功' });
}

// 3. 编辑
export function updateChargingPile(data) {
  const index = mockList.findIndex(item => item.id === data.id);
  if (index === -1) return Promise.reject({ code: 500, msg: '充电桩不存在' });
  if (data.pileCode && mockList.some(item => item.id !== data.id && item.pileCode === data.pileCode)) {
    return Promise.reject({ code: 500, msg: '设备编号已存在' });
  }
  const station = stationList.find(s => s.id === data.stationId);
  mockList[index] = {
    ...mockList[index],
    ...data,
    stationName: station?.name || mockList[index].stationName,
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  return Promise.resolve({ code: 200, data: true, msg: '充电桩编辑成功' });
}

// 4. 详情
export function getChargingPileDetail(id) {
  const item = mockList.find(item => item.id === parseInt(id));
  if (!item) return Promise.reject({ code: 500, msg: '充电桩不存在' });
  return Promise.resolve({ code: 200, data: item, msg: '成功' });
}

// 5. 调试（支持批量）
export function debugChargingPile(data) {
  const ids = data.id.toString().split(',').map(Number);
  let successCount = 0;
  for (const id of ids) {
    const index = mockList.findIndex(item => item.id === id);
    if (index !== -1 && mockList[index].pileStatus === '未调试') {
      mockList[index].pileStatus = '已调试';
      mockList[index].qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${mockList[index].pileCode}`;
      mockList[index].remark = data.debugResult || '调试通过';
      mockList[index].updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      successCount++;
    }
  }
  if (successCount === 0) return Promise.reject({ code: 500, msg: '没有符合条件的充电桩可调试' });
  return Promise.resolve({ code: 200, data: true, msg: `${successCount}个充电桩调试成功` });
}

// 6. 启用
export function enableChargingPile(data) {
  const index = mockList.findIndex(item => item.id === data.id);
  if (index === -1) return Promise.reject({ code: 500, msg: '充电桩不存在' });
  if (!['已调试', '已停用'].includes(mockList[index].pileStatus)) {
    return Promise.reject({ code: 500, msg: '充电桩状态不允许启用' });
  }
  mockList[index].pileStatus = '已启用';
  mockList[index].updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  return Promise.resolve({ code: 200, data: true, msg: '充电桩启用成功' });
}

// 7. 停用（支持批量）
export function disableChargingPile(data) {
  const ids = data.id.toString().split(',').map(Number);
  let successCount = 0;
  for (const id of ids) {
    const index = mockList.findIndex(item => item.id === id);
    if (index !== -1 && ['已调试', '已启用'].includes(mockList[index].pileStatus)) {
      mockList[index].pileStatus = '已停用';
      mockList[index].remark = data.stop_reason || '设备停用';
      mockList[index].updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      successCount++;
    }
  }
  if (successCount === 0) return Promise.reject({ code: 500, msg: '没有符合条件的充电桩可停用' });
  return Promise.resolve({ code: 200, data: true, msg: `${successCount}个充电桩停用成功` });
}

// 8. 重启
export function restartChargingPile(data) {
  const index = mockList.findIndex(item => item.id === data.id);
  if (index === -1) return Promise.reject({ code: 500, msg: '充电桩不存在' });
  mockList[index].runTime = 0;
  mockList[index].updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  return Promise.resolve({ code: 200, data: true, msg: '充电桩重启成功' });
}

// 9. 导出
export function exportChargingPile(params) {
  const filtered = filterList(params);
  const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/octet-stream' });
  return Promise.resolve(blob);
}

// 10. 图表数据
export function getChartData(params) {
  const { stationId } = params;
  let filtered = mockList;
  if (stationId) filtered = filtered.filter(item => item.stationId === stationId);

  // 运行时长趋势（近7天模拟）
  const runTimeTrend = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const time = `${date.getMonth() + 1}-${date.getDate()}`;
    const runTime = filtered.reduce((sum, item) => sum + (item.runTime || 0), 0);
    runTimeTrend.push({ time, runTime });
  }

  // 各类型数量统计
  const typeMap = new Map();
  filtered.forEach(item => {
    const key = item.model;
    if (!typeMap.has(key)) typeMap.set(key, { count: 0, statusCount: { running: 0, fault: 0, disabled: 0 } });
    const typeData = typeMap.get(key);
    typeData.count++;
    if (item.pileStatus === '已启用') typeData.statusCount.running++;
    if (item.faultFlag === 1) typeData.statusCount.fault++;
    if (item.pileStatus === '已停用') typeData.statusCount.disabled++;
  });
  const typeCount = Array.from(typeMap.entries()).map(([type, data]) => ({ type, ...data }));

  // 状态统计
  const statusCount = {
    total: filtered.length,
    running: filtered.filter(item => item.pileStatus === '已启用').length,
    fault: filtered.filter(item => item.faultFlag === 1).length,
    disabled: filtered.filter(item => item.pileStatus === '已停用').length,
  };

  return Promise.resolve({
    code: 200,
    data: { runTimeTrend, typeCount, statusCount },
    msg: '图表数据获取成功',
  });
}

// 11. 折线图钻取
export function getRunTimeTrend(params) {
  const { pileId, stationId, timeType, startTime, endTime } = params;
  let filtered = mockList;
  if (pileId) filtered = filtered.filter(item => item.id === pileId);
  if (stationId) filtered = filtered.filter(item => item.stationId === stationId);

  const result = filtered.map(item => ({
    time: startTime,
    runTime: item.runTime,
    pileCode: item.pileCode,
    pileName: item.model,
  }));
  return Promise.resolve({ code: 200, data: result, msg: '运行时长趋势数据获取成功' });
}

// 12. 柱状图钻取（各类型数量明细）
export function getTypeCount(params) {
  const { stationId } = params;
  let filtered = mockList;
  if (stationId) filtered = filtered.filter(item => item.stationId === stationId);

  const typeMap = new Map();
  filtered.forEach(item => {
    const key = item.model;
    if (!typeMap.has(key)) typeMap.set(key, { count: 0, statusCount: { running: 0, fault: 0, disabled: 0 } });
    const typeData = typeMap.get(key);
    typeData.count++;
    if (item.pileStatus === '已启用') typeData.statusCount.running++;
    if (item.faultFlag === 1) typeData.statusCount.fault++;
    if (item.pileStatus === '已停用') typeData.statusCount.disabled++;
  });
  const typeCount = Array.from(typeMap.entries()).map(([type, data]) => ({ type, ...data }));
  return Promise.resolve({ code: 200, data: typeCount, msg: '各类型充电桩数量统计数据获取成功' });
}

// 13. 卡片钻取（状态列表）
export function getStatusList(params) {
  const { status, stationId, pageNo = 1, pageSize = 10 } = params;
  let filtered = mockList;
  if (stationId) filtered = filtered.filter(item => item.stationId === stationId);
  if (status === '已启用') filtered = filtered.filter(item => item.pileStatus === '已启用');
  else if (status === '已停用') filtered = filtered.filter(item => item.pileStatus === '已停用');
  else if (status === 'fault') filtered = filtered.filter(item => item.faultFlag === 1);
  else filtered = filtered.filter(item => item.pileStatus === status);

  const start = (pageNo - 1) * pageSize;
  const pageList = filtered.slice(start, start + pageSize);
  return Promise.resolve({
    code: 200,
    data: {
      list: pageList.map(item => ({
        id: item.id,
        pileCode: item.pileCode,
        pileModel: item.model,
        stationName: item.stationName,
        runTime: item.runTime,
        createTime: item.createTime,
      })),
      total: filtered.length,
    },
    msg: '充电桩状态统计数据获取成功',
  });
}

// 14. 二维码预览
export function getQrcode(id) {
  const item = mockList.find(item => item.id === parseInt(id));
  if (item && item.qrcode) {
    return Promise.resolve({ code: 200, data: item.qrcode, msg: '二维码预览成功' });
  }
  return Promise.resolve({ code: 200, data: '', msg: '二维码不存在' });
}
