<script setup>
import { ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage, ElTag } from 'element-plus';

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  reportCycle: {
    type: String,
    default: '',
  },
  statTime: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  title: props.title,
  width: 900,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    modalApi.close();
  },
});

const loading = ref(false);
const dataList = ref([]);

// 根据类型获取模拟数据
const getMockData = (type) => {
  const mockDataMap = {
    activity: [
      { id: 1, name: '积分兑换活动', type: '积分活动', status: '进行中', startTime: '2026-03-01', endTime: '2026-03-31' },
      { id: 2, name: '幸运大抽奖', type: '抽奖活动', status: '已结束', startTime: '2026-03-15', endTime: '2026-03-20' },
      { id: 3, name: '优惠券发放活动', type: '优惠券活动', status: '进行中', startTime: '2026-03-10', endTime: '2026-04-10' },
    ],
    joinUser: [
      { id: 1, userName: '张三', userId: 'U001', phone: '13800138001', joinTime: '2026-03-15 10:30:00', activityName: '积分兑换活动' },
      { id: 2, userName: '李四', userId: 'U002', phone: '13800138002', joinTime: '2026-03-16 14:20:00', activityName: '幸运大抽奖' },
      { id: 3, userName: '王五', userId: 'U003', phone: '13800138003', joinTime: '2026-03-17 09:15:00', activityName: '优惠券发放活动' },
    ],
    lottery: [
      { id: 1, userName: '张三', userId: 'U001', lotteryTime: '2026-03-15 10:35:00', activityName: '幸运大抽奖', prizeName: '积分100', result: '中奖' },
      { id: 2, userName: '李四', userId: 'U002', lotteryTime: '2026-03-16 14:25:00', activityName: '幸运大抽奖', prizeName: '谢谢参与', result: '未中奖' },
    ],
    winning: [
      { id: 1, userName: '张三', userId: 'U001', prizeName: '积分100', prizeValue: '100积分', winningTime: '2026-03-15 10:35:00', status: '已发放' },
      { id: 2, userName: '赵六', userId: 'U006', prizeName: '优惠券50元', prizeValue: '¥50', winningTime: '2026-03-18 16:45:00', status: '已使用' },
    ],
    couponSend: [
      { id: 1, couponName: '满100减10', userName: '张三', userId: 'U001', sendTime: '2026-03-15 10:40:00', status: '已领取' },
      { id: 2, couponName: '满200减30', userName: '李四', userId: 'U002', sendTime: '2026-03-16 14:30:00', status: '已使用' },
    ],
    couponVerify: [
      { id: 1, couponName: '满100减10', userName: '张三', userId: 'U001', verifyTime: '2026-03-20 11:20:00', orderNo: 'CO20260320001', amount: 100 },
      { id: 2, couponName: '满200减30', userName: '李四', userId: 'U002', verifyTime: '2026-03-21 15:30:00', orderNo: 'CO20260321002', amount: 230 },
    ],
    cardOrder: [
      { id: 1, orderNo: 'CO20260315001', userName: '张三', cardName: '充电月卡', amount: 299, payTime: '2026-03-15 10:45:00', status: '已完成' },
      { id: 2, orderNo: 'CO20260316002', userName: '李四', cardName: '停车季卡', amount: 599, payTime: '2026-03-16 14:35:00', status: '已完成' },
    ],
    revenue: [
      { id: 1, orderNo: 'CO20260315001', userName: '张三', amount: 299, payMethod: '微信支付', payTime: '2026-03-15 10:45:00' },
      { id: 2, orderNo: 'CO20260316002', userName: '李四', amount: 599, payMethod: '支付宝', payTime: '2026-03-16 14:35:00' },
      { id: 3, orderNo: 'CO20260317003', userName: '王五', amount: 199, payMethod: '余额支付', payTime: '2026-03-17 09:20:00' },
    ],
    exchange: [
      { id: 1, userName: '张三', productName: '充电优惠券', points: 100, exchangeTime: '2026-03-15 10:50:00', status: '已发放' },
      { id: 2, userName: '李四', productName: '停车优惠券', points: 200, exchangeTime: '2026-03-16 14:40:00', status: '已使用' },
    ],
    stock: [
      { id: 1, cardName: '充电月卡', currentStock: 500, totalStock: 1000, availableStock: 500, status: '正常' },
      { id: 2, cardName: '停车季卡', currentStock: 200, totalStock: 500, availableStock: 300, status: '正常' },
      { id: 3, cardName: '充电周卡', currentStock: 50, totalStock: 200, availableStock: 150, status: '预警' },
    ],
    warnStock: [
      { id: 1, cardName: '充电周卡', currentStock: 50, warnThreshold: 100, shortage: 50, status: '库存不足' },
      { id: 2, cardName: '停车日卡', currentStock: 20, warnThreshold: 50, shortage: 30, status: '库存不足' },
    ],
    operator: [
      { id: 1, account: 'admin', name: '管理员', department: '运营部', role: '超级管理员', lastLoginTime: '2026-04-01 08:30:00' },
    ],
  };
  return mockDataMap[type] || [];
};

// 根据类型获取表格列配置
const getColumns = (type) => {
  const columnsMap = {
    activity: [
      { field: 'name', title: '活动名称', minWidth: 150 },
      { field: 'type', title: '活动类型', minWidth: 100 },
      { field: 'status', title: '状态', minWidth: 80 },
      { field: 'startTime', title: '开始时间', minWidth: 120 },
      { field: 'endTime', title: '结束时间', minWidth: 120 },
    ],
    joinUser: [
      { field: 'userName', title: '用户姓名', minWidth: 100 },
      { field: 'userId', title: '用户ID', minWidth: 100 },
      { field: 'phone', title: '手机号', minWidth: 120 },
      { field: 'joinTime', title: '参与时间', minWidth: 150 },
      { field: 'activityName', title: '参与活动', minWidth: 150 },
    ],
    lottery: [
      { field: 'userName', title: '用户姓名', minWidth: 100 },
      { field: 'userId', title: '用户ID', minWidth: 100 },
      { field: 'lotteryTime', title: '抽奖时间', minWidth: 150 },
      { field: 'activityName', title: '活动名称', minWidth: 150 },
      { field: 'prizeName', title: '奖品', minWidth: 120 },
      { field: 'result', title: '结果', minWidth: 80 },
    ],
    winning: [
      { field: 'userName', title: '用户姓名', minWidth: 100 },
      { field: 'userId', title: '用户ID', minWidth: 100 },
      { field: 'prizeName', title: '奖品名称', minWidth: 120 },
      { field: 'prizeValue', title: '奖品价值', minWidth: 100 },
      { field: 'winningTime', title: '中奖时间', minWidth: 150 },
      { field: 'status', title: '状态', minWidth: 80 },
    ],
    couponSend: [
      { field: 'couponName', title: '优惠券名称', minWidth: 150 },
      { field: 'userName', title: '用户姓名', minWidth: 100 },
      { field: 'userId', title: '用户ID', minWidth: 100 },
      { field: 'sendTime', title: '发放时间', minWidth: 150 },
      { field: 'status', title: '状态', minWidth: 80 },
    ],
    couponVerify: [
      { field: 'couponName', title: '优惠券名称', minWidth: 150 },
      { field: 'userName', title: '用户姓名', minWidth: 100 },
      { field: 'userId', title: '用户ID', minWidth: 100 },
      { field: 'verifyTime', title: '核销时间', minWidth: 150 },
      { field: 'orderNo', title: '订单号', minWidth: 150 },
      { field: 'amount', title: '订单金额', minWidth: 100 },
    ],
    cardOrder: [
      { field: 'orderNo', title: '订单号', minWidth: 150 },
      { field: 'userName', title: '用户姓名', minWidth: 100 },
      { field: 'cardName', title: '卡种名称', minWidth: 120 },
      { field: 'amount', title: '金额', minWidth: 100 },
      { field: 'payTime', title: '支付时间', minWidth: 150 },
      { field: 'status', title: '状态', minWidth: 80 },
    ],
    revenue: [
      { field: 'orderNo', title: '订单号', minWidth: 150 },
      { field: 'userName', title: '用户姓名', minWidth: 100 },
      { field: 'amount', title: '金额', minWidth: 100 },
      { field: 'payMethod', title: '支付方式', minWidth: 100 },
      { field: 'payTime', title: '支付时间', minWidth: 150 },
    ],
    exchange: [
      { field: 'userName', title: '用户姓名', minWidth: 100 },
      { field: 'productName', title: '商品名称', minWidth: 150 },
      { field: 'points', title: '消耗积分', minWidth: 100 },
      { field: 'exchangeTime', title: '兑换时间', minWidth: 150 },
      { field: 'status', title: '状态', minWidth: 80 },
    ],
    stock: [
      { field: 'cardName', title: '卡种名称', minWidth: 150 },
      { field: 'currentStock', title: '当前库存', minWidth: 100 },
      { field: 'totalStock', title: '总库存', minWidth: 100 },
      { field: 'availableStock', title: '可用库存', minWidth: 100 },
      { field: 'status', title: '状态', minWidth: 80 },
    ],
    warnStock: [
      { field: 'cardName', title: '卡种名称', minWidth: 150 },
      { field: 'currentStock', title: '当前库存', minWidth: 100 },
      { field: 'warnThreshold', title: '预警阈值', minWidth: 100 },
      { field: 'shortage', title: '缺口', minWidth: 100 },
      { field: 'status', title: '状态', minWidth: 100 },
    ],
    operator: [
      { field: 'account', title: '账号', minWidth: 120 },
      { field: 'name', title: '姓名', minWidth: 100 },
      { field: 'department', title: '部门', minWidth: 120 },
      { field: 'role', title: '角色', minWidth: 120 },
      { field: 'lastLoginTime', title: '最后登录时间', minWidth: 150 },
    ],
  };
  return columnsMap[type] || [];
};

const columns = ref([]);

const open = async (type, reportCycle, statTime) => {
  loading.value = true;
  columns.value = getColumns(type);
  
  // 设置弹窗标题
  const titleMap = {
    activity: `${reportCycle} - 活动明细`,
    joinUser: `${reportCycle} - 参与用户明细`,
    lottery: `${reportCycle} - 积分抽奖明细`,
    winning: `${reportCycle} - 中奖明细`,
    couponSend: `${reportCycle} - 优惠券发放明细`,
    couponVerify: `${reportCycle} - 优惠券核销明细`,
    cardOrder: `${reportCycle} - 卡种订单明细`,
    revenue: `${reportCycle} - 营收明细`,
    exchange: `${reportCycle} - 积分兑换明细`,
    stock: `${reportCycle} - 卡种库存总览`,
    warnStock: `${reportCycle} - 预警卡种库存明细`,
    operator: '操作人员详情',
  };
  
  modalApi.setState({ title: titleMap[type] || '明细' });
  
  // 模拟加载数据
  setTimeout(() => {
    dataList.value = getMockData(type);
    loading.value = false;
  }, 500);
  
  modalApi.open();
};

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="drill-down-content">
      <div v-if="loading" class="loading-tip">
        加载中...
      </div>
      <div v-else-if="dataList.length === 0" class="empty-tip">
        暂无数据
      </div>
      <div v-else class="data-table">
        <table class="detail-table">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.field" :style="{ minWidth: col.minWidth + 'px' }">
                {{ col.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in dataList" :key="index">
              <td v-for="col in columns" :key="col.field">
                <span v-if="col.field === 'status'">
                  <ElTag :type="row.status === '正常' || row.status === '已完成' || row.status === '已发放' || row.status === '已使用' ? 'success' : row.status === '预警' || row.status === '库存不足' ? 'danger' : 'info'">
                    {{ row[col.field] }}
                  </ElTag>
                </span>
                <span v-else>{{ row[col.field] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.drill-down-content {
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
}

.loading-tip,
.empty-tip {
  text-align: center;
  padding: 40px;
  color: #909399;
}

.data-table {
  width: 100%;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.detail-table th,
.detail-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

.detail-table th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #606266;
}

.detail-table tr:hover {
  background-color: #f5f7fa;
}

.detail-table td {
  color: #606266;
}
</style>
