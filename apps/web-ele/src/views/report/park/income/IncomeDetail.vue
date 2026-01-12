<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { Download, Refresh, ZoomIn } from '@element-plus/icons-vue';
import { ElMessage, ElImage } from 'element-plus';

// API (需要创建对应的API文件)
import {
  exportIncomeDetailReport,
  getIncomeDetailReport,
} from '#/api/reports/park/incomeDetailApi';
import DataTable from '#/views/report/park/component/DataTable.vue';
import LoadingOverlay from '#/views/report/park/component/LoadingOverlay.vue';
import ReportSection from '#/views/report/park/component/ReportSection.vue';
import ReportToolbar from '#/views/report/park/component/ReportToolbar.vue';
import {
  formatCurrency,
  getYesterdayDate,
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const dateRange = ref([getYesterdayDate(), getYesterdayDate()]);
const orderNo = ref('');
const plateNumber = ref('');
const region = ref('');
const parkingId = ref('');
const paymentType = ref('');
const loading = ref(false);
const exporting = ref(false);
const totalAmount = ref(0);
const tableData = ref([]);
const showReceiptDialog = ref(false);
const currentReceipt = ref('');

// 表格列定义
const tableColumns = computed(() => [
  { prop: 'orderNo', label: '订单号', width: 180 },
  { prop: 'plateNumber', label: '车牌号码', width: 120 },
  { prop: 'parkDuration', label: '停车时长', width: 120 },
  { prop: 'basicAmount', label: '基础费用', width: 120, type: 'currency' },
  { prop: 'discountAmount', label: '优惠金额', width: 120, type: 'currency' },
  { prop: 'paidAmount', label: '实付金额', width: 120, type: 'currency' },
  { prop: 'paymentType', label: '支付方式', width: 120 },
  { prop: 'paymentTime', label: '支付时间', width: 160 },
  { prop: 'parkingName', label: '停车场', width: 180 },
  { prop: 'regionName', label: '行政区划', width: 120 },
  {
    prop: 'receipt',
    label: '支付凭证',
    width: 120,
    render: {
      type: 'el-button',
      props: {
        type: 'primary',
        size: 'small',
        icon: ZoomIn,
      },
      events: {
        click: (row) => showReceipt(row.receiptUrl),
      },
      text: '查看',
    },
  },
  { prop: 'remark', label: '备注', width: 200 },
]);

// 初始化
onMounted(() => {
  loadData();
});

// 监听筛选条件变化
watch(
  [dateRange, orderNo, plateNumber, region, parkingId, paymentType],
  () => {
    loadData();
  },
  { deep: true },
);

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;

    const params = {
      startDate: dateRange.value[0],
      endDate: dateRange.value[1],
      orderNo: orderNo.value,
      plateNumber: plateNumber.value,
      region: region.value,
      parkingId: parkingId.value,
      paymentType: paymentType.value,
      page: 1,
      pageSize: 50,
    };

    const response = await getIncomeDetailReport(params);

    // 更新数据
    tableData.value = response.data || [];
    totalAmount.value = response.totalAmount || 0;
  } catch (error) {
    console.error('加载收入明细数据失败:', error);
    ElMessage.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 刷新数据
const refreshData = () => {
  loadData();
};

// 导出数据
const handleExport = async () => {
  try {
    exporting.value = true;

    const params = {
      startDate: dateRange.value[0],
      endDate: dateRange.value[1],
      orderNo: orderNo.value,
      plateNumber: plateNumber.value,
      region: region.value,
      parkingId: parkingId.value,
      paymentType: paymentType.value,
    };

    await exportIncomeDetailReport(params);

    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    exporting.value = false;
  }
};

// 查看支付凭证
const showReceipt = (url) => {
  if (!url) {
    ElMessage.warning('暂无支付凭证');
    return;
  }
  currentReceipt.value = url;
  showReceiptDialog.value = true;
};

// 获取支付方式列表
const paymentTypes = ref([
  { value: '', label: '全部方式' },
  { value: 'wechat', label: '微信支付' },
  { value: 'alipay', label: '支付宝' },
  { value: 'cash', label: '现金支付' },
  { value: 'card', label: '刷卡支付' },
  { value: 'member', label: '会员支付' },
]);

// 获取停车场列表（模拟）
const parkingList = ref([
  { value: '', label: '全部停车场' },
  { value: 'park001', label: '漳州万达广场停车场' },
  { value: 'park002', label: '芗城政府路侧停车场' },
  { value: 'park003', label: '龙文区体育中心停车场' },
  { value: 'park004', label: '龙海区商业城停车场' },
]);
</script>

<template>
  <div class="income-detail-report">
    <!-- 工具栏 -->
    <ReportToolbar>
      <template #left>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          size="medium"
          style="width: 280px"
        />
        <el-input
          v-model="orderNo"
          placeholder="订单号"
          size="medium"
          clearable
          style="width: 180px; margin-left: 12px"
        />
        <el-input
          v-model="plateNumber"
          placeholder="车牌号码"
          size="medium"
          clearable
          style="width: 120px; margin-left: 12px"
        />
        <el-select
          v-model="region"
          placeholder="行政区划"
          size="medium"
          clearable
          style="width: 120px; margin-left: 12px"
        >
          <el-option label="全部区域" value="" />
          <el-option label="芗城区" value="xiangcheng" />
          <el-option label="龙文区" value="longwen" />
          <el-option label="龙海区" value="longhai" />
        </el-select>
        <el-select
          v-model="parkingId"
          placeholder="停车场"
          size="medium"
          clearable
          style="width: 220px; margin-left: 12px"
        >
          <el-option
            v-for="parking in parkingList"
            :key="parking.value"
            :label="parking.label"
            :value="parking.value"
          />
        </el-select>
        <el-select
          v-model="paymentType"
          placeholder="支付方式"
          size="medium"
          clearable
          style="width: 120px; margin-left: 12px"
        >
          <el-option
            v-for="type in paymentTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </template>

      <template #right>
        <el-button
          type="primary"
          :icon="Download"
          @click="handleExport"
          :loading="exporting"
        >
          导出Excel
        </el-button>
        <el-button :icon="Refresh" @click="refreshData"> 刷新 </el-button>
      </template>
    </ReportToolbar>

    <!-- 汇总信息 -->
    <ReportSection title="收入明细" :with-background="true" :with-padding="true">
      <div class="summary-info">
        <div class="summary-item">
          <span class="label">统计期间：</span>
          <span class="value">{{ dateRange[0] }} 至 {{ dateRange[1] }}</span>
        </div>
        <div class="summary-item">
          <span class="label">总记录数：</span>
          <span class="value">{{ tableData.length }} 笔</span>
        </div>
        <div class="summary-item">
          <span class="label">总收入金额：</span>
          <span class="value highlight">{{ formatCurrency(totalAmount) }}</span>
        </div>
      </div>
    </ReportSection>

    <!-- 收入明细表格 -->
    <ReportSection>
      <DataTable
        :data="tableData"
        :columns="tableColumns"
        show-pagination
        :total="tableData.length"
        :page-sizes="[10, 20, 50, 100]"
        remote
        @page-change="loadData"
      />
    </ReportSection>

    <!-- 支付凭证弹窗 -->
    <el-dialog
      v-model="showReceiptDialog"
      title="支付凭证"
      width="600px"
      destroy-on-close
    >
      <el-image
        :src="currentReceipt"
        :preview-src-list="[currentReceipt]"
        fit="contain"
        style="width: 100%; height: 400px"
      >
        <template #error>
          <div class="image-error">
            <el-icon :size="50"><ZoomIn /></el-icon>
            <div>无法加载支付凭证</div>
          </div>
        </template>
      </el-image>
      <template #footer>
        <el-button @click="showReceiptDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 加载状态 -->
    <LoadingOverlay v-if="loading" />
  </div>
</template>

<style scoped>
.income-detail-report {
  position: relative;
  min-height: 600px;
  padding: 12px;
}

.summary-info {
  display: flex;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}

.summary-item {
  display: flex;
  flex-direction: column;
}

.summary-item .label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.summary-item .value {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.summary-item .value.highlight {
  font-size: 18px;
  color: #f56c6c;
  font-weight: 600;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}
</style>
