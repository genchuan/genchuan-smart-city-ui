<!-- 文件: ChargeAbnormal.vue -->
<template>
  <div class="charge-abnormal-report">
    <!-- 工具栏 -->
    <ReportToolbar>
      <template #left>
        <!-- 筛选条件 - 直接显示在工具栏 -->
        <div class="filter-row">
          <div class="filter-group">
            <span class="filter-label">时间范围：</span>
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 240px"
              size="small"
            />
          </div>

          <div class="filter-group">
            <span class="filter-label">区域：</span>
            <el-select
              v-model="filterForm.region"
              placeholder="全部区域"
              style="width: 120px"
              size="small"
              clearable
              @change="handleRegionChange"
            >
              <el-option
                v-for="item in regionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="filter-group">
            <span class="filter-label">类型：</span>
            <el-select
              v-model="filterForm.abnormalType"
              placeholder="全部类型"
              style="width: 120px"
              size="small"
              clearable
              @change="handleAbnormalTypeChange"
            >
              <el-option
                v-for="item in abnormalTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="filter-group">
            <span class="filter-label">订单号：</span>
            <el-input
              v-model="orderNo"
              placeholder="订单编号"
              size="small"
              clearable
              style="width: 140px"
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            />
          </div>

          <div class="filter-group">
            <span class="filter-label">车牌号：</span>
            <el-input
              v-model="carNumber"
              placeholder="车牌号码"
              size="small"
              clearable
              style="width: 140px"
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            />
          </div>

          <el-button type="primary" size="small" @click="handleSearch">
            查询
          </el-button>
          <el-button size="small" @click="resetFilter">
            重置
          </el-button>
        </div>
      </template>

      <template #right>
        <el-button
          type="primary"
          :icon="Download"
          @click="handleExport"
          :loading="exporting"
          size="small"
        >
          导出Excel
        </el-button>
      </template>
    </ReportToolbar>

    <!-- 图表分析 -->
    <div class="chart-section">
      <!-- 异常趋势 -->
      <ReportSection
        title="近30天收费异常趋势"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="trendOptions" height="350px" />
      </ReportSection>

      <!-- 异常类型与处置状态 -->
      <div class="chart-row">
        <ReportSection
          title="异常类型占比"
          :with-background="true"
          :with-padding="true"
        >
          <ChartContainer :options="abnormalTypeChart" height="300px" />
        </ReportSection>
        <ReportSection
          title="处置状态占比"
          :with-background="true"
          :with-padding="true"
        >
          <ChartContainer :options="statusChart" height="300px" />
        </ReportSection>
      </div>

      <!-- 区域对比与统计数据卡片 -->
      <div class="chart-row">
        <ReportSection
          title="各区域收费异常数对比"
          :with-background="true"
          :with-padding="true"
        >
          <ChartContainer :options="regionChart" height="350px" />
        </ReportSection>

        <ReportSection
          title="异常处置统计"
          :with-background="true"
          :with-padding="true"
        >
          <div class="statistics-cards">
            <div class="stat-card">
              <div class="stat-label">异常处置完成率</div>
              <div class="stat-value">{{ completionRate }}%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">纠错成功率</div>
              <div class="stat-value">{{ correctionSuccessRate }}%</div>
            </div>
          </div>
        </ReportSection>
      </div>
    </div>

    <!-- 收费异常列表 -->
    <ReportSection title="收费异常明细">
      <DataTable
        :data="tableData"
        :columns="tableColumns"
        show-pagination
        :total="totalCount"
        :page-sizes="[10, 20, 50, 100]"
        :hide-on-single-page="false"
        :current-page-prop="currentPage"
        :page-size-prop="pageSize"
        @page-change="handlePageChange"
        :remote="true"
      />
    </ReportSection>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="showDetailDrawer"
      title="收费异常详情"
      size="50%"
      destroy-on-close
    >
      <ChargeDetail :abnormal-id="currentAbnormalId" v-if="showDetailDrawer" />
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { Download } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import {
  exportChargeAbnormalReport,
  getChargeAbnormalReport,
  getChargeAbnormalFilterOptions
} from '#/api/reports/park/chargeAbnormalApi';
import ChartContainer from '#/views/report/park/component/ChartContainer.vue';
import DataTable from '#/views/report/park/component/DataTable.vue';
import ReportSection from '#/views/report/park/component/ReportSection.vue';
import ReportToolbar from '#/views/report/park/component/ReportToolbar.vue';
import ChargeDetail from './ChargeDetail.vue';
import {
  getYesterdayDate
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const showFilterPanel = ref(false);
const filterForm = ref({
  dateRange: [getYesterdayDate(), getYesterdayDate()],
  region: '',
  abnormalType: ''
});
const orderNo = ref('');
const carNumber = ref('');
const loading = ref(false);
const exporting = ref(false);
const tableData = ref([]);
const filterOptions = ref({});
const showDetailDrawer = ref(false);
const currentAbnormalId = ref('');

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

// 统计数据
const trendData = ref([]);
const abnormalTypeDistribution = ref([]);
const statusDistribution = ref([]);
const regionComparison = ref([]);
const summaryData = ref({});

// 选项数据
const regionOptions = computed(() => filterOptions.value.regions || []);
const abnormalTypeOptions = computed(() => filterOptions.value.abnormalTypes || []);

// 计算属性
const completionRate = computed(() => summaryData.value.completionRate || 0);
const correctionSuccessRate = computed(() => summaryData.value.correctionSuccessRate || 0);

// 表格列定义 - 完全匹配需求文档14.4.3(3)
const tableColumns = computed(() => [
  {
    prop: 'abnormalId',
    label: '异常ID',
    width: 140,
    render: {
      text: (row) => row.abnormalId,
      events: {
        click: (row) => handleDetailClick(row)
      },
      props: (row) => ({
        style: { color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }
      })
    }
  },
  {
    prop: 'orderNo',
    label: '订单编号',
    width: 140,
    render: {
      text: (row) => row.orderNo,
      events: {
        click: (row) => handleOrderClick(row.orderNo)
      },
      props: (row) => ({
        style: { color: '#1890ff', cursor: 'pointer' }
      })
    }
  },
  {
    prop: 'carNumber',
    label: '车牌号码',
    width: 120
  },
  {
    prop: 'parkingName',
    label: '车场名称',
    width: 180
  },
  {
    prop: 'abnormalTime',
    label: '异常时间',
    width: 160
  },
  {
    prop: 'abnormalType',
    label: '异常类型',
    width: 120,
    render: {
      text: (row) => row.abnormalType,
      events: {
        click: (row) => handleAbnormalTypeClick(row.abnormalType)
      },
      props: (row) => ({
        style: {
          cursor: 'pointer',
          color: getAbnormalTypeColor(row.abnormalType)
        }
      })
    }
  },
  {
    prop: 'abnormalReason',
    label: '异常原因',
    width: 200
  },
  {
    prop: 'disposalStatus',
    label: '处置状态',
    width: 100,
    render: {
      text: (row) => row.disposalStatus,
      events: {
        click: (row) => handleStatusClick(row.disposalStatus)
      },
      props: (row) => ({
        style: {
          cursor: 'pointer',
          color: getDisposalStatusColor(row.disposalStatus)
        }
      })
    }
  },
  {
    prop: 'disposalResult',
    label: '处理结果',
    width: 120
  },
  {
    prop: 'actions',
    label: '操作',
    width: 180,
    render: {
      type: 'div',
      props: (row) => ({ class: 'action-buttons' }),
      text: (row) => '',
      children: [
        {
          type: 'el-button',
          props: (row) => ({
            type: 'primary',
            size: 'small',
            onClick: () => handleDetailClick(row)
          }),
          text: '详情'
        },
        {
          type: 'el-button',
          props: (row) => ({
            type: 'info',
            size: 'small',
            onClick: () => handleOrderClick(row.orderNo)
          }),
          text: '查看'
        }
      ]
    }
  }
]);

// 图表配置
const trendOptions = computed(() => ({
  title: {
    text: '近30天收费异常趋势',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: trendData.value.map(item => item.date.substr(5)),
    axisLabel: {
      interval: 0,
      rotate: 45
    }
  },
  yAxis: {
    type: 'value',
    name: '异常数量'
  },
  series: [
    {
      name: '异常总数',
      type: 'line',
      data: trendData.value.map(item => item.count),
      smooth: true,
      itemStyle: {
        color: '#f5222d'
      }
    }
  ]
}));

const abnormalTypeChart = computed(() => ({
  title: {
    text: '异常类型占比',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle'
  },
  series: [
    {
      name: '异常类型',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '50%'],
      data: abnormalTypeDistribution.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}));

const statusChart = computed(() => ({
  title: {
    text: '处置状态占比',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle'
  },
  series: [
    {
      name: '处置状态',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '50%'],
      data: statusDistribution.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}));

const regionChart = computed(() => ({
  title: {
    text: '各区域收费异常数对比',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: regionComparison.value.map(item => item.name),
    axisLabel: {
      interval: 0,
      rotate: 45
    }
  },
  yAxis: {
    type: 'value',
    name: '异常数量'
  },
  series: [
    {
      name: '异常数量',
      type: 'bar',
      data: regionComparison.value.map(item => item.value),
      barWidth: '60%',
      label: {
        show: true,
        position: 'top'
      },
      itemStyle: {
        color: function(params) {
          const colorList = ['#f5222d', '#fa8c16', '#1890ff', '#52c41a', '#722ed1'];
          return colorList[params.dataIndex % colorList.length];
        }
      }
    }
  ]
}));

// 初始化
onMounted(async () => {
  await loadFilterOptions();
  loadData();
});

// 加载筛选选项
const loadFilterOptions = async () => {
  try {
    const options = await getChargeAbnormalFilterOptions();
    filterOptions.value = options;
    // 设置默认日期范围
    filterForm.value.dateRange = [getYesterdayDate(), getYesterdayDate()];
  } catch (error) {
    console.error('加载筛选选项失败:', error);
    ElMessage.error('加载筛选选项失败');
  }
};

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;

    const params = {
      startDate: filterForm.value.dateRange[0],
      endDate: filterForm.value.dateRange[1],
      orderNo: orderNo.value,
      carNumber: carNumber.value,
      region: filterForm.value.region,
      abnormalType: filterForm.value.abnormalType,
      page: currentPage.value,
      pageSize: pageSize.value
    };

    const response = await getChargeAbnormalReport(params);

    // 更新数据
    tableData.value = response.data || [];
    totalCount.value = response.total || 0;
    trendData.value = response.trendData || [];
    abnormalTypeDistribution.value = response.abnormalTypeDistribution || [];
    statusDistribution.value = response.disposalStatusDistribution || [];
    regionComparison.value = response.regionAbnormalComparison || [];
    summaryData.value = response.summary || {};
  } catch (error) {
    console.error('加载收费异常数据失败:', error);
    ElMessage.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 查询处理
const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};

// 重置筛选条件
const resetFilter = () => {
  filterForm.value = {
    dateRange: [getYesterdayDate(), getYesterdayDate()],
    region: '',
    abnormalType: ''
  };
  orderNo.value = '';
  carNumber.value = '';
  currentPage.value = 1;
  loadData();
};

// 应用筛选
const applyFilter = () => {
  showFilterPanel.value = false;
  currentPage.value = 1;
  loadData();
};

// 导出数据
const handleExport = async () => {
  try {
    exporting.value = true;

    const params = {
      startDate: filterForm.value.dateRange[0],
      endDate: filterForm.value.dateRange[1],
      orderNo: orderNo.value,
      carNumber: carNumber.value,
      region: filterForm.value.region,
      abnormalType: filterForm.value.abnormalType
    };

    await exportChargeAbnormalReport(params);

    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    exporting.value = false;
  }
};

// 分页变化处理
const handlePageChange = (pagination) => {
  currentPage.value = pagination.page;
  pageSize.value = pagination.pageSize;
  loadData();
};

// 查看详情
const handleDetailClick = (row) => {
  currentAbnormalId.value = row.abnormalId;
  showDetailDrawer.value = true;
};

// 查看关联订单
const handleOrderClick = (orderNo) => {
  ElMessage.info(`查看订单: ${orderNo}`);
};

// 钻取筛选 - 行政区域
const handleRegionChange = (region) => {
  filterForm.value.region = region;
  if (region) {
    currentPage.value = 1;
    loadData();
  }
};

// 钻取筛选 - 异常类型
const handleAbnormalTypeChange = (abnormalType) => {
  filterForm.value.abnormalType = abnormalType;
  if (abnormalType) {
    currentPage.value = 1;
    loadData();
  }
};

// 表格内钻取点击事件
const handleAbnormalTypeClick = (abnormalType) => {
  ElMessage.info(`筛选异常类型: ${abnormalType}`);
};

const handleStatusClick = (status) => {
  ElMessage.info(`筛选处置状态: ${status}`);
};

// 工具函数
const getAbnormalTypeColor = (abnormalType) => {
  const colors = {
    '多收费': '#f5222d',
    '少收费': '#1890ff',
    '重复收费': '#fa8c16',
    '系统错误': '#722ed1',
    '人工操作错误': '#52c41a',
    '超时计费': '#13c2c2'
  };
  return colors[abnormalType] || '#8c8c8c';
};

const getDisposalStatusColor = (status) => {
  const colors = {
    '待处理': '#f5222d',
    '处理中': '#fa8c16',
    '已处理': '#52c41a',
    '已关闭': '#8c8c8c',
    '已驳回': '#722ed1'
  };
  return colors[status] || '#8c8c8c';
};
</script>

<style scoped>
.charge-abnormal-report {
  position: relative;
  min-height: 600px;
  padding: 12px;
}

/* 筛选行样式 */
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-label {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

.chart-section {
  margin-bottom: 12px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

@media (max-width: 992px) {
  .chart-row {
    grid-template-columns: 1fr;
  }

  .filter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .filter-group {
    width: 100%;
  }
}

.statistics-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.stat-card {
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #1890ff;
}

.stat-card:nth-child(2) {
  border-left-color: #52c41a;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style>
