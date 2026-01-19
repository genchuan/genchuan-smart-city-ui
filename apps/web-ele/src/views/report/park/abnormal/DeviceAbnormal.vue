<template>
  <div class="device-abnormal-report">
    <!-- 工具栏 -->
    <ReportToolbar>
      <template #left>
        <!-- 筛选条件 - 同一行布局 -->
        <div class="filter-container">
          <div class="filter-row">
            <div class="filter-group">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 240px"
                size=medium
              />
            </div>

            <div class="filter-group">
              <el-select
                v-model="filterForm.deviceType"
                placeholder="设备类型"
                style="width: 140px"
                size=medium
                clearable
              >
                <el-option
                  v-for="item in deviceTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

            <div class="filter-group">
              <el-select
                v-model="filterForm.region"
                placeholder="区域"
                style="width: 120px"
                size=medium
                clearable
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
              <el-select
                v-model="filterForm.faultType"
                placeholder="故障类型"
                style="width: 120px"
                size=medium
                clearable
              >
                <el-option
                  v-for="item in faultTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

            <div class="filter-group">
              <el-input
                v-model="deviceCode"
                placeholder="设备编码"
                size=medium
                clearable
                style="width: 140px"
                @keyup.enter="handleSearch"
              />
            </div>

            <div class="filter-group">
              <el-select
                v-model="filterForm.disposalStatus"
                placeholder="处置状态"
                style="width: 120px"
                size=medium
                clearable
              >
                <el-option
                  v-for="item in disposalStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

            <div class="filter-group">
              <el-select
                v-model="filterForm.impactLevel"
                placeholder="影响等级"
                style="width: 120px"
                size=medium
                clearable
              >
                <el-option label="高" value="high" />
                <el-option label="中" value="medium" />
                <el-option label="低" value="low" />
              </el-select>
            </div>
          </div>
        </div>
      </template>

      <template #right>
        <el-button
          type="primary"
          :icon="Download"
          @click="handleExport"
          :loading="exporting"
          size=medium
        >
          导出Excel
        </el-button>
        <el-button
          type="info"
          :icon="Refresh"
          @click="refreshData"
          size=medium
        >
          刷新
        </el-button>
      </template>
    </ReportToolbar>

    <!-- 统计卡片 -->
    <div v-if="toggleStats" class="statistics-cards">
      <div class="stat-card">
        <div class="stat-icon" style="color: #f5222d;">
          <el-icon><Warning /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ summaryData.totalCount || 0 }}次</div>
          <div class="stat-label">故障总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color: #1890ff;">
          <el-icon><Tools /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ summaryData.resolveRate || 0 }}%</div>
          <div class="stat-label">解决率</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color: #52c41a;">
          <el-icon><SuccessFilled /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ summaryData.avgResolveTime || 0 }}小时</div>
          <div class="stat-label">平均解决时间</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color: #fa8c16;">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatCurrency(summaryData.totalEstimatedCost || 0) }}</div>
          <div class="stat-label">预估维修成本</div>
        </div>
      </div>
    </div>

    <!-- 图表分析 -->
    <div class="chart-section">
      <!-- 故障趋势 -->
      <ReportSection
        title="近30天故障发生趋势"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="trendOptions" height="350px" />
      </ReportSection>

      <!-- 故障类型与处置状态 -->
      <div class="chart-row">
        <ReportSection
          title="故障类型占比"
          :with-background="true"
          :with-padding="true"
        >
          <ChartContainer :options="faultTypeChart" height="300px" />
        </ReportSection>
        <ReportSection
          title="处置状态占比"
          :with-background="true"
          :with-padding="true"
        >
          <ChartContainer :options="statusChart" height="300px" />
        </ReportSection>
      </div>

      <!-- 区域与设备类型对比 -->
      <div class="chart-row">
        <ReportSection
          title="各区域故障设备数对比"
          :with-background="true"
          :with-padding="true"
        >
          <ChartContainer :options="regionChart" height="350px" />
        </ReportSection>
        <ReportSection
          title="各设备类型故障次数对比"
          :with-background="true"
          :with-padding="true"
        >
          <ChartContainer :options="deviceTypeChart" height="350px" />
        </ReportSection>
      </div>
    </div>

    <!-- 设备异常列表 -->
    <ReportSection title="设备异常明细" :with-background="true" :with-padding="true">
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
      title="故障详情"
      size="50%"
      destroy-on-close
    >
      <DeviceDetail :fault-id="currentFaultId" v-if="showDetailDrawer" />
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Download, Refresh, Warning, Tools, SuccessFilled, Clock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import {
  exportDeviceAbnormalReport,
  getDeviceAbnormalReport,
  getDeviceAbnormalFilterOptions
} from '#/api/reports/park/deviceAbnormalApi';
import ChartContainer from '#/views/report/park/component/ChartContainer.vue';
import DataTable from '#/views/report/park/component/DataTable.vue';
import ReportSection from '#/views/report/park/component/ReportSection.vue';
import ReportToolbar from '#/views/report/park/component/ReportToolbar.vue';
import DeviceDetail from './DeviceDetail.vue';
import {
  formatCurrency,
  getYesterdayDate,
  getLastMonth
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const filterForm = ref({
  dateRange: [getLastMonth() + '-01', getYesterdayDate()],
  deviceType: '',
  region: '',
  faultType: '',
  disposalStatus: '',
  impactLevel: ''
});
const deviceCode = ref('');
const loading = ref(false);
const exporting = ref(false);
const toggleStats = ref(true);
const tableData = ref([]);
const filterOptions = ref({});
const showDetailDrawer = ref(false);
const currentFaultId = ref('');

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

// 统计数据
const trendData = ref([]);
const faultTypeDistribution = ref([]);
const statusDistribution = ref([]);
const regionFaultComparison = ref([]);
const deviceTypeFaultComparison = ref([]);
const summaryData = ref({});

// 选项数据
const deviceTypeOptions = computed(() => filterOptions.value.deviceTypes || []);
const regionOptions = computed(() => filterOptions.value.regions || []);
const faultTypeOptions = computed(() => filterOptions.value.faultTypes || []);
const disposalStatusOptions = computed(() => filterOptions.value.disposalStatuses || []);

// 表格列定义
const tableColumns = computed(() => [
  {
    prop: 'faultId',
    label: '故障ID',
    width: 140,
    render: (row) => ({
      text: row.faultId,
      events: {
        click: () => handleDetailClick(row)
      },
      props: {
        style: { color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }
      }
    })
  },
  {
    prop: 'deviceCode',
    label: '设备编码',
    width: 120
  },
  {
    prop: 'deviceType',
    label: '设备类型',
    width: 120
  },
  {
    prop: 'regionName',
    label: '区域名称',
    width: 120
  },
  {
    prop: 'faultTime',
    label: '故障时间',
    width: 160
  },
  {
    prop: 'faultType',
    label: '故障类型',
    width: 120,
    render: (row) => ({
      text: row.faultType,
      props: {
        style: { color: getFaultTypeColor(row.faultType) }
      }
    })
  },
  {
    prop: 'faultDescription',
    label: '故障描述',
    width: 200
  },
  {
    prop: 'impactLevel',
    label: '影响等级',
    width: 100,
    render: (row) => ({
      text: row.impactLevel,
      props: {
        style: {
          color: getImpactLevelColor(row.impactLevel),
          fontWeight: row.impactLevel === '高' ? 'bold' : 'normal'
        }
      }
    })
  },
  {
    prop: 'disposalStatus',
    label: '处置状态',
    width: 100,
    render: (row) => ({
      text: row.disposalStatus,
      props: {
        style: {
          color: getDisposalStatusColor(row.disposalStatus)
        }
      }
    })
  },
  {
    prop: 'disposalTime',
    label: '处置时间',
    width: 160
  },
  {
    prop: 'operator',
    label: '处理人',
    width: 100
  },
  {
    prop: 'actions',
    label: '操作',
    width: 120,
    render: (row) => ({
      type: 'div',
      props: { class: 'action-buttons' },
      children: [
        {
          type: 'el-button',
          props: {
            type: 'primary',
            size: medium,
            onClick: () => handleDetailClick(row)
          },
          text: '详情'
        }
      ]
    })
  }
]);

// 图表配置
const trendOptions = computed(() => ({
  title: {
    text: '近30天故障发生趋势',
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
    name: '故障数量'
  },
  series: [
    {
      name: '故障总数',
      type: 'line',
      data: trendData.value.map(item => item.count),
      smooth: true,
      itemStyle: {
        color: '#f5222d'
      }
    },
    {
      name: '已解决',
      type: 'line',
      data: trendData.value.map(item => item.resolved),
      smooth: true,
      itemStyle: {
        color: '#52c41a'
      }
    }
  ]
}));

const faultTypeChart = computed(() => ({
  title: {
    text: '故障类型占比',
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
      name: '故障类型',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '50%'],
      data: faultTypeDistribution.value,
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
    text: '各区域故障设备数对比',
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
    data: regionFaultComparison.value.map(item => item.name),
    axisLabel: {
      interval: 0,
      rotate: 45
    }
  },
  yAxis: {
    type: 'value',
    name: '故障数量'
  },
  series: [
    {
      name: '故障数量',
      type: 'bar',
      data: regionFaultComparison.value.map(item => item.value),
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

const deviceTypeChart = computed(() => ({
  title: {
    text: '各设备类型故障次数对比',
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
    data: deviceTypeFaultComparison.value.map(item => item.name),
    axisLabel: {
      interval: 0,
      rotate: 45
    }
  },
  yAxis: {
    type: 'value',
    name: '故障次数'
  },
  series: [
    {
      name: '故障次数',
      type: 'bar',
      data: deviceTypeFaultComparison.value.map(item => item.value),
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
    const options = await getDeviceAbnormalFilterOptions();
    filterOptions.value = options;
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
      deviceCode: deviceCode.value,
      deviceType: filterForm.value.deviceType,
      region: filterForm.value.region,
      faultType: filterForm.value.faultType,
      disposalStatus: filterForm.value.disposalStatus,
      page: currentPage.value,
      pageSize: pageSize.value
    };

    const response = await getDeviceAbnormalReport(params);

    // 更新数据
    tableData.value = response.data || [];
    totalCount.value = response.total || 0;
    trendData.value = response.trendData || [];
    faultTypeDistribution.value = response.faultTypeDistribution || [];
    statusDistribution.value = response.disposalStatusDistribution || [];
    regionFaultComparison.value = response.regionFaultComparison || [];
    deviceTypeFaultComparison.value = response.deviceTypeFaultComparison || [];
    summaryData.value = response.summary || {};
  } catch (error) {
    console.error('加载设备异常数据失败:', error);
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

// 刷新数据
const refreshData = () => {
  loadData();
};

// 重置筛选条件
const resetFilter = () => {
  filterForm.value = {
    dateRange: [getLastMonth() + '-01', getYesterdayDate()],
    deviceType: '',
    region: '',
    faultType: '',
    disposalStatus: '',
    impactLevel: ''
  };
  deviceCode.value = '';
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
      deviceCode: deviceCode.value,
      deviceType: filterForm.value.deviceType,
      region: filterForm.value.region,
      faultType: filterForm.value.faultType,
      disposalStatus: filterForm.value.disposalStatus
    };

    await exportDeviceAbnormalReport(params);
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
  currentFaultId.value = row.faultId;
  showDetailDrawer.value = true;
};

// 工具函数
const getFaultTypeColor = (faultType) => {
  const colors = {
    '硬件故障': '#f5222d',
    '软件故障': '#1890ff',
    '网络故障': '#722ed1',
    '电源故障': '#fa8c16',
    '环境故障': '#52c41a',
    '维护故障': '#8c8c8c'
  };
  return colors[faultType] || '#8c8c8c';
};

const getDisposalStatusColor = (status) => {
  const colors = {
    '待处置': '#f5222d',
    '处置中': '#fa8c16',
    '已处理': '#52c41a',
    '处置失败': '#8c8c8c',
    '已关闭': '#722ed1'
  };
  return colors[status] || '#8c8c8c';
};

const getImpactLevelColor = (level) => {
  const colors = {
    '高': '#f5222d',
    '中': '#fa8c16',
    '低': '#1890ff'
  };
  return colors[level] || '#8c8c8c';
};
</script>

<style scoped>
.device-abnormal-report {
  position: relative;
  min-height: 600px;
  padding: 12px;
}

/* 筛选容器 */
.filter-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 统计卡片 */
.statistics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin: 12px 0;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 32px;
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.stat-label {
  margin-top: 6px;
  font-size: 14px;
  color: #909399;
}

/* 图表区域 */
.chart-section {
  margin-bottom: 12px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

@media (max-width: 1200px) {
  .filter-row {
    gap: 6px;
  }

  .filter-group :deep(.el-date-editor) {
    width: 200px !important;
  }

  .filter-group :deep(.el-select),
  .filter-group :deep(.el-input) {
    width: 120px !important;
  }
}

@media (max-width: 992px) {
  .chart-row {
    grid-template-columns: 1fr;
  }

  .filter-row {
    gap: 8px;
  }

  .filter-group {
    flex: 1 1 calc(50% - 8px);
  }

  .statistics-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-group {
    width: 100%;
  }

  .filter-group :deep(.el-date-editor),
  .filter-group :deep(.el-select),
  .filter-group :deep(.el-input) {
    width: 100% !important;
  }

  .statistics-cards {
    grid-template-columns: 1fr;
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style>
