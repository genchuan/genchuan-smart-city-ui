<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import * as echarts from 'echarts';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import { dataList, textObj, useFormSchema, useGridColumns } from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});
const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

// 图表相关ref
const cardStats = reactive({
  actualAmount: 0,
  discountAmount: 0,
  parkingDuration: 0,
});
const pieChartRef = ref();
const lineChartRef = ref();
let pieChartInstance = null;
let lineChartInstance = null;

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});
const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
  // 刷新统计数据
  calculateStatistics();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑角色 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.name]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 计算统计数据
function calculateStatistics() {
  let totalAmount = 0;
  let totalDiscount = 0;
  let totalDuration = 0;
  let count = 0;

  dataObj.apilist.forEach((item) => {
    totalAmount += item.pay_amount || 0;
    totalDiscount += item.discount_amount || 0;
    totalDuration += item.parking_duration || 0;
    count++;
  });

  cardStats.actualAmount = totalAmount - totalDiscount;
  cardStats.discountAmount = totalDiscount;
  cardStats.parkingDuration = count > 0 ? Math.round(totalDuration / count) : 0;
}

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  dataObj.total = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      if (activeName.value === '全部') {
        return true;
      }
      return v.status === activeName.value;
    }).length;
  dataObj.list = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      if (activeName.value === '全部') {
        return true;
      }
      return v.pay_status === activeName.value;
    })
    .slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
  return dataObj;
};

const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: useFormSchema().map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit() {
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

const activeName = ref('全部');
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerApi.open();
};
const tabsData = ref([
  { label: '全部' },
  { label: '成功' },
  { label: '失败' },
  { label: '处理中' },
  { label: '已退款' },
]);
const createLabel = (item) => {
  let text = `(${dataObj.apilist.filter((v) => v.pay_status === item.label).length})`;
  if (item.label === '全部') {
    text = `(${dataObj.apilist.length})`;
  }
  return item.label + text;
};
const handleClick = () => {
  gridApi.query();
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 初始化图表
function initCharts() {
  // 初始化圆环图（支付方式占比）
  if (pieChartRef.value) {
    pieChartInstance = echarts.init(pieChartRef.value);

    // 模拟支付方式数据
    const paymentData = [
      { name: '微信支付', value: 45 },
      { name: '支付宝', value: 35 },
      { name: '银行卡', value: 15 },
      { name: '现金', value: 5 },
    ];

    const pieOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: paymentData.map((item) => item.name),
      },
      series: [
        {
          name: '支付方式',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: paymentData,
        },
      ],
      color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
    };

    pieChartInstance.setOption(pieOption);
  }

  // 初始化折线图（近7日扫码缴费趋势）
  if (lineChartRef.value) {
    lineChartInstance = echarts.init(lineChartRef.value);

    // 模拟近7日数据
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }

    const lineData = [120, 200, 150, 80, 70, 110, 130];

    const lineOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
      },
      yAxis: {
        type: 'value',
        name: '缴费金额(元)',
      },
      series: [
        {
          name: '扫码缴费',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 4,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(84, 112, 198, 0.5)',
              },
              {
                offset: 1,
                color: 'rgba(84, 112, 198, 0.1)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: lineData,
        },
      ],
      color: ['#5470c6'],
    };

    lineChartInstance.setOption(lineOption);
  }
}

// 处理窗口大小变化
function handleResize() {
  if (pieChartInstance) {
    pieChartInstance.resize();
  }
  if (lineChartInstance) {
    lineChartInstance.resize();
  }
}

onMounted(() => {
  // 初始化统计数据
  calculateStatistics();

  // 初始化图表
  setTimeout(() => {
    initCharts();
  }, 100);

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('resize', handleResize);

  // 销毁图表实例
  if (pieChartInstance) {
    pieChartInstance.dispose();
    pieChartInstance = null;
  }
  if (lineChartInstance) {
    lineChartInstance.dispose();
    lineChartInstance = null;
  }
});
</script>

<template>
  <div class="park-lot-table-container">
    <div class="main-content">
      <FormDrawer :title="getTitle">
        <Form />
      </FormDrawer>
      <DetailDrawer :title="`${dataObj.detailObj.name}关联表`">
        <div class="detail-card">
          <div class="detail-card-row">
            <div class="detail-row-left">主键ID:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.payment_id }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">缴费编号:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.payment_no }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">关联订单ID:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.order_id }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">订单类型:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.order_type }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">用户ID:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.user_id }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">缴费金额:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.pay_amount }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">支付方式:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.pay_way }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">支付时间:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.pay_time }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">支付状态:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.pay_status }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">是否退款:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.refund_flag }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">退款ID:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.refund_id }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">第三方支付流水号:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.transaction_id }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">创建时间:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.create_time }}
            </div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">备注:</div>
            <div class="detail-row-right">
              {{ dataObj.detailObj.remark }}
            </div>
          </div>
        </div>
      </DetailDrawer>
      <Drawer title="搜索">
        <QueryForm class="query-form" />
      </Drawer>

      <!-- 表格区域 -->
      <div class="table-section">
        <Grid>
          <!-- 三级状态 -->
          <template #table-title>
            <div class="tabel-tabs">
              <div v-if="props.secondShow">
                <el-tabs
                  v-model="activeName"
                  class="demo-tabs"
                  @tab-change="handleClick"
                >
                  <el-tab-pane
                    v-for="item in tabsData"
                    :key="item.label"
                    :label="createLabel(item)"
                    :name="item.label"
                  />
                </el-tabs>
              </div>
            </div>
          </template>
          <template #toolbar-tools>
            <div class="common-toolbar-tools">
              <IconButton
                content="新增"
                icon-name="Plus"
                @click="handleCreate"
              />
              <IconButton
                content="导出"
                icon-name="download"
                @click="handleExport"
              />
              <IconButton
                content="批量删除"
                icon-name="delete"
                :disabled="isEmpty(checkedIds)"
                @click="handleDeleteBatch"
              />
              <IconButton
                content="搜索"
                icon-name="search"
                @click="handleSerachShow"
              />
              <IconButton
                content="全屏"
                icon-name="FullScreen"
                @click="handleFullShow"
              />
            </div>
          </template>
          <template #parkName="{ row }">
            <el-text
              @click="handleOpenDetail(row)"
              class="common-align"
              type="primary"
            >
              {{ row.name }}
            </el-text>
          </template>
          <template #actions="{ row }">
            <div class="table-toolbar-tools">
              <IconButton
                content="详情"
                icon-name="Document"
                @click="handleOpenDetail(row)"
              />
              <IconButton
                content="编辑"
                icon-name="edit"
                @click="handleEdit(row)"
              />
              <IconButton
                content="删除"
                icon-name="delete"
                @click="handleDelete(row)"
              />
            </div>
          </template>
          <template #bottom>
            <div class="common-total" @click="changeTotalShow">
              <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
                <ArrowDown />
              </el-icon>
              <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
                <ArrowUp />
              </el-icon>
              <span> 本页统计：订单数10;成功订单6 </span>
            </div>
            <div class="common-total-bottom" v-if="dataObj.totalShow">
              <span> 全部统计：{{ textObj.total }} </span>
            </div>
          </template>
        </Grid>
      </div>

      <!-- 图表统计区域 -->
      <div class="chart-section">
        <div class="chart-title">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据统计</span>
        </div>

        <!-- 统计数据卡片 -->
        <div class="stats-cards">
          <el-card class="stat-card">
            <div class="stat-card-content">
              <div class="stat-card-icon" style="background-color: #409eff">
                <el-icon><Money /></el-icon>
              </div>
              <div class="stat-card-info">
                <div class="stat-card-title">实付金额</div>
                <div class="stat-card-value">
                  ¥{{ cardStats.actualAmount.toFixed(2) }}
                </div>
                <div class="stat-card-subtitle">今日 +12.5%</div>
              </div>
            </div>
          </el-card>

          <el-card class="stat-card">
            <div class="stat-card-content">
              <div class="stat-card-icon" style="background-color: #67c23a">
                <el-icon><Discount /></el-icon>
              </div>
              <div class="stat-card-info">
                <div class="stat-card-title">优惠金额</div>
                <div class="stat-card-value">
                  ¥{{ cardStats.discountAmount.toFixed(2) }}
                </div>
                <div class="stat-card-subtitle">累计优惠</div>
              </div>
            </div>
          </el-card>

          <el-card class="stat-card">
            <div class="stat-card-content">
              <div class="stat-card-icon" style="background-color: #e6a23c">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="stat-card-info">
                <div class="stat-card-title">平均停车时长</div>
                <div class="stat-card-value">
                  {{ cardStats.parkingDuration }}分钟
                </div>
                <div class="stat-card-subtitle">日均时长</div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 图表区域 -->
        <div class="chart-cards">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-card-header">
                <el-icon><PieChart /></el-icon>
                <span>支付方式占比</span>
              </div>
            </template>
            <div ref="pieChartRef" class="chart-container"></div>
          </el-card>

          <el-card class="chart-card">
            <template #header>
              <div class="chart-card-header">
                <el-icon><TrendCharts /></el-icon>
                <span>近7日扫码缴费趋势</span>
              </div>
            </template>
            <div ref="lineChartRef" class="chart-container"></div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 1200px) {
  .chart-cards {
    grid-template-columns: 1fr;
  }

  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 8px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .chart-card {
    min-width: 100%;
  }

  .chart-section {
    padding: 12px;
  }
}

.park-lot-table-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh; /* 占据整个视口高度 */
  overflow: hidden; /* 隐藏外层滚动条 */
}

/* 主要内容区域，设置滚动 */
.main-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow: hidden auto; /* 隐藏水平滚动条 */ /* 垂直滚动条 */
  background-color: #f0f2f5;
}

/* 美化滚动条 */
.main-content::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.main-content::-webkit-scrollbar-track {
  background: #f1f1f1; /* 滚动条轨道背景 */
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb {
  background: #c1c1c1; /* 滚动条滑块 */
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8; /* 鼠标悬停时滚动条滑块 */
}

.table-section {
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 10%);
}

.chart-section {
  min-height: 500px;
  padding: 20px;
  margin-bottom: 20px; /* 为底部留出空间 */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 10%);
}

.chart-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.chart-title .el-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #409eff;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  transform: translateY(-5px);
}

.stat-card-content {
  display: flex;
  align-items: center;
}

.stat-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-right: 16px;
  border-radius: 12px;
}

.stat-card-icon .el-icon {
  font-size: 28px;
  color: white;
}

.stat-card-info {
  flex: 1;
}

.stat-card-title {
  margin-bottom: 4px;
  font-size: 14px;
  color: #909399;
}

.stat-card-value {
  margin-bottom: 4px;
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.stat-card-subtitle {
  font-size: 12px;
  color: #67c23a;
}

.chart-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}

.chart-card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #303133;
}

.chart-card-header .el-icon {
  margin-right: 8px;
  color: #409eff;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.detail-card {
  max-height: 600px;
  padding: 16px;
  overflow-y: auto;
}

.detail-card-row {
  display: flex;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row-left {
  width: 160px;
  font-weight: 500;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  color: #303133;
}

.common-toolbar-tools {
  display: flex;
  gap: 8px;
  align-items: center;
}

.table-toolbar-tools {
  display: flex;
  gap: 8px;
}

.common-total {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-top: 10px;
  cursor: pointer;
  background: #f5f7fa;
  border-radius: 4px;
}

.common-total-bottom {
  padding: 12px;
  background: #f5f7fa;
  border-top: 1px solid #dcdfe6;
}

.tabel-tab-icon {
  margin-right: 8px;
}

.common-align {
  cursor: pointer;
}

/* 调整表格和图表的最小高度，确保内容足够滚动 */
:deep(.vben-grid-wrapper) {
  min-height: 400px;
}

/* 主容器，设置固定高度和滚动条 */
</style>
