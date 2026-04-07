import { requestClient } from '#/api/request';

/**
 * 分页查询异常订单列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getAbnormalOrderPage(params) {
  return requestClient.get('/vehiclecharging/abnormal-order/page', { params });
}

/**
 * 核实接口（批量）
 * @param {Object} data - { ids, verifyResult, verifyRemark }
 * @returns {Promise}
 */
export function verifyAbnormalOrder(data) {
  return requestClient.put('/vehiclecharging/abnormal-order/verify', data);
}

/**
 * 处理接口（批量）
 * @param {Object} data - { ids, handleMeasure }
 * @returns {Promise}
 */
export function handleAbnormalOrder(data) {
  return requestClient.put('/vehiclecharging/abnormal-order/handle', data);
}

/**
 * 完结接口（批量）
 * @param {Object} data - { ids, completeRemark }
 * @returns {Promise}
 */
export function completeAbnormalOrder(data) {
  return requestClient.put('/vehiclecharging/abnormal-order/complete', data);
}

/**
 * 备注接口
 * @param {Object} data - { id, remark }
 * @returns {Promise}
 */
export function remarkAbnormalOrder(data) {
  return requestClient.put('/vehiclecharging/abnormal-order/remark', data);
}

/**
 * 退款接口
 * @param {Object} data - { id, refundAmount, refundReason }
 * @returns {Promise}
 */
export function refundAbnormalOrder(data) {
  return requestClient.post('/vehiclecharging/abnormal-order/refund', data);
}

/**
 * 导出接口
 * @param {Object} params - 筛选参数
 * @returns {Promise}
 */
export function exportAbnormalOrder(params) {
  return requestClient.download('/vehiclecharging/abnormal-order/export-excel', params);
}

/**
 * 获取异常订单图表数据
 * @param {Object} params - { timeRange, startTime, endTime }
 * @returns {Promise}
 */
export function getAbnormalOrderChart(params) {
  return requestClient.get('/vehiclecharging/abnormal-order/chart', { params });
}

// ==================== 模拟数据（与接口响应结构一致） ====================
export const dataList = () => {
  return [
    {
      id: 1,
      abnormalCode: 'ABN-20260328001',
      orderId: 1001,
      orderCode: 'ORD-20260328001',
      plateNo: '闽C12345',
      stationName: '城东充电站',
      abnormalType: '充电中断',
      abnormalTime: '1743141600000', // 时间戳
      abnormalStatus: '未核实',
      verifyUser: null,
      verifyTime: null,
      verifyResult: null,
      handleUser: null,
      handleTime: null,
      completeTime: null,
      remark: '充电过程中突然中断',
      createTime: '1743141600000',
      updateTime: '1743141600000',
      refundAmount: null,
      abnormalReason: '充电桩通信故障',
      checkUser: null,
      checkTime: null,
      handleMeasure: null,
      creator: '系统',
      updater: '系统',
    },
    {
      id: 2,
      abnormalCode: 'ABN-20260328002',
      orderId: 1002,
      orderCode: 'ORD-20260328002',
      plateNo: '闽D67890',
      stationName: '城南充电站',
      abnormalType: '支付异常',
      abnormalTime: '1743145200000',
      abnormalStatus: '已核实',
      verifyUser: '张三',
      verifyTime: '1743148800000',
      verifyResult: '异常',
      handleUser: null,
      handleTime: null,
      completeTime: null,
      remark: '用户支付成功但订单未生成',
      createTime: '1743145200000',
      updateTime: '1743148800000',
      refundAmount: null,
      abnormalReason: '支付回调失败',
      checkUser: '张三',
      checkTime: '1743148800000',
      handleMeasure: null,
      creator: '系统',
      updater: '张三',
    },
    {
      id: 3,
      abnormalCode: 'ABN-20260328003',
      orderId: 1003,
      orderCode: 'ORD-20260328003',
      plateNo: '闽E13579',
      stationName: '城西充电站',
      abnormalType: '设备故障',
      abnormalTime: '1743148800000',
      abnormalStatus: '处理中',
      verifyUser: '李四',
      verifyTime: '1743152400000',
      verifyResult: '异常',
      handleUser: '王五',
      handleTime: '1743156000000',
      handleMeasure: '重启充电桩，恢复运行',
      completeTime: null,
      remark: '充电桩屏幕无响应',
      createTime: '1743148800000',
      updateTime: '1743156000000',
      refundAmount: null,
      abnormalReason: '充电桩主板故障',
      checkUser: '李四',
      checkTime: '1743152400000',
      creator: '系统',
      updater: '王五',
    },
    {
      id: 4,
      abnormalCode: 'ABN-20260328004',
      orderId: 1004,
      orderCode: 'ORD-20260328004',
      plateNo: '闽F24680',
      stationName: '城北充电站',
      abnormalType: '充电中断',
      abnormalTime: '1743152400000',
      abnormalStatus: '已完结',
      verifyUser: '赵六',
      verifyTime: '1743156000000',
      verifyResult: '异常',
      handleUser: '孙七',
      handleTime: '1743159600000',
      handleMeasure: '更换充电枪线',
      completeTime: '1743163200000',
      remark: '充电枪过热保护',
      createTime: '1743152400000',
      updateTime: '1743163200000',
      refundAmount: 15.00,
      abnormalReason: '充电枪温度过高',
      checkUser: '赵六',
      checkTime: '1743156000000',
      creator: '系统',
      updater: '孙七',
    },
    {
      id: 5,
      abnormalCode: 'ABN-20260329001',
      orderId: 1005,
      orderCode: 'ORD-20260329001',
      plateNo: '闽G11223',
      stationName: '开发区充电站',
      abnormalType: '支付异常',
      abnormalTime: '1743235200000',
      abnormalStatus: '未核实',
      verifyUser: null,
      verifyTime: null,
      verifyResult: null,
      handleUser: null,
      handleTime: null,
      completeTime: null,
      remark: '重复扣费',
      createTime: '1743235200000',
      updateTime: '1743235200000',
      refundAmount: null,
      abnormalReason: '支付系统重复请求',
      checkUser: null,
      checkTime: null,
      handleMeasure: null,
      creator: '系统',
      updater: '系统',
    },
    {
      id: 6,
      abnormalCode: 'ABN-20260329002',
      orderId: 1006,
      orderCode: 'ORD-20260329002',
      plateNo: '闽H33445',
      stationName: '旅游区充电站',
      abnormalType: '设备故障',
      abnormalTime: '1743238800000',
      abnormalStatus: '已核实',
      verifyUser: '周八',
      verifyTime: '1743242400000',
      verifyResult: '正常',
      handleUser: null,
      handleTime: null,
      completeTime: null,
      remark: '用户误报，实际充电正常',
      createTime: '1743238800000',
      updateTime: '1743242400000',
      refundAmount: null,
      abnormalReason: '用户操作不当',
      checkUser: '周八',
      checkTime: '1743242400000',
      handleMeasure: null,
      creator: '系统',
      updater: '周八',
    },
  ];
};
