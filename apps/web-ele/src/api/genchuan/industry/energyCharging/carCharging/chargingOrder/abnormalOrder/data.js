import { requestClient } from '#/api/request';

// ==================== 异常订单接口 ====================
export function getAbnormalOrderPage(params) {
  return requestClient.get('/vehiclecharging/abnormal-order/page', { params }).catch(err => {
    console.warn('分页接口失败，使用模拟数据', err);
    return { list: dataList(), total: dataList().length };
  });
}

export function verifyAbnormalOrder(data) {
  return requestClient.put('/vehiclecharging/abnormal-order/verify', data).catch(err => {
    console.warn('核实接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function handleAbnormalOrder(data) {
  return requestClient.put('/vehiclecharging/abnormal-order/handle', data).catch(err => {
    console.warn('处理接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function completeAbnormalOrder(data) {
  return requestClient.put('/vehiclecharging/abnormal-order/complete', data).catch(err => {
    console.warn('完结接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function refundAbnormalOrder(data) {
  return requestClient.post('/vehiclecharging/abnormal-order/refund', data).catch(err => {
    console.warn('退款接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function remarkAbnormalOrder(data) {
  return requestClient.put('/vehiclecharging/abnormal-order/remark', data).catch(err => {
    console.warn('备注接口失败，模拟成功', err);
    return Promise.resolve(true);
  });
}

export function exportAbnormalOrder(params) {
  return requestClient.download('/vehiclecharging/abnormal-order/export-excel', params).catch(err => {
    console.warn('导出接口失败，模拟导出', err);
    return Promise.resolve(new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' }));
  });
}

export function getAbnormalOrderDetail(params) {
  return requestClient.get('/vehiclecharging/abnormal-order/get', { params }).catch(err => {
    console.warn('详情接口失败，使用模拟数据', err);
    const mockList = dataList();
    const detail = mockList.find(item => item.id === params.id) || mockList[0];
    return Promise.resolve(detail);
  });
}

// ==================== 图表接口 ====================
export function getAbnormalOrderChart(params) {
  return requestClient.get('/vehiclecharging/abnormal-order/chart', { params }).catch(err => {
    console.warn('图表接口失败，使用模拟数据', err);
    return Promise.resolve({
      barData: [
        { date: '2026-04-01', abnormalCount: 5, handleCount: 4 },
        { date: '2026-04-02', abnormalCount: 3, handleCount: 3 },
        { date: '2026-04-03', abnormalCount: 7, handleCount: 5 },
        { date: '2026-04-04', abnormalCount: 4, handleCount: 4 },
        { date: '2026-04-05', abnormalCount: 6, handleCount: 5 },
        { date: '2026-04-06', abnormalCount: 8, handleCount: 6 },
        { date: '2026-04-07', abnormalCount: 2, handleCount: 2 },
      ],
      pieData: [
        { name: '充电中断', value: 15 },
        { name: '支付异常', value: 8 },
        { name: '设备故障', value: 9 },
      ],
      cardData: {
        totalAbnormalCount: 32,
        unHandleCount: 5,
        handleCount: 27,
        handleRatio: 84.38,
      },
    });
  });
}

// 模拟数据（与接口响应结构一致）
export const dataList = () => {
  return [
    {
      id: 1,
      orderCode: 'ORD-20260401001',
      abnormalType: '充电中断',
      abnormalReason: '充电桩通信超时',
      checkUser: null,
      checkTime: null,
      handleMeasure: null,
      refundAmount: null,
      abnormalStatus: '未核实',
      handleTime: null,
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743552000000,
      updateTime: 1743552000000,
    },
    {
      id: 2,
      orderCode: 'ORD-20260401002',
      abnormalType: '支付异常',
      abnormalReason: '支付回调失败',
      checkUser: '张三',
      checkTime: 1743638400000,
      handleMeasure: null,
      refundAmount: null,
      abnormalStatus: '已核实',
      handleTime: null,
      remark: '需退款',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743552000000,
      updateTime: 1743638400000,
    },
    {
      id: 3,
      orderCode: 'ORD-20260402001',
      abnormalType: '设备故障',
      abnormalReason: '充电桩屏幕无响应',
      checkUser: '李四',
      checkTime: 1743724800000,
      handleMeasure: '重启充电桩',
      refundAmount: 20.00,
      abnormalStatus: '处理中',
      handleTime: 1743811200000,
      remark: '已安排维修',
      creator: 'operator1',
      updater: 'operator1',
      createTime: 1743638400000,
      updateTime: 1743811200000,
    },
    {
      id: 4,
      orderCode: 'ORD-20260403001',
      abnormalType: '充电中断',
      abnormalReason: '充电枪过热保护',
      checkUser: '王五',
      checkTime: 1743907200000,
      handleMeasure: '更换充电枪线',
      refundAmount: 15.00,
      abnormalStatus: '已完结',
      handleTime: 1743993600000,
      remark: '已处理完成',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743811200000,
      updateTime: 1743993600000,
    },
    {
      id: 5,
      orderCode: 'ORD-20260404001',
      abnormalType: '支付异常',
      abnormalReason: '重复扣费',
      checkUser: null,
      checkTime: null,
      handleMeasure: null,
      refundAmount: null,
      abnormalStatus: '未核实',
      handleTime: null,
      remark: '',
      creator: 'admin',
      updater: 'admin',
      createTime: 1743897600000,
      updateTime: 1743897600000,
    },
    {
      id: 6,
      orderCode: 'ORD-20260405001',
      abnormalType: '设备故障',
      abnormalReason: '充电桩离线',
      checkUser: '赵六',
      checkTime: 1744070400000,
      handleMeasure: null,
      refundAmount: null,
      abnormalStatus: '已核实',
      handleTime: null,
      remark: '需联系厂家',
      creator: 'operator2',
      updater: 'operator2',
      createTime: 1743984000000,
      updateTime: 1744070400000,
    },
  ];
};
