<!-- 文件: DeviceAbnormal.vue -->
<template>
  <div class="device-abnormal-report">
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
            <span class="filter-label">设备类型：</span>
            <el-select
              v-model="filterForm.deviceType"
              placeholder="全部类型"
              style="width: 120px"
              size="small"
              clearable
              @change="handleDeviceTypeChange"
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
            <span class="filter-label">故障类型：</span>
            <el-select
              v-model="filterForm.faultType"
              placeholder="全部类型"
              style="width: 120px"
              size="small"
              clearable
              @change="handleFaultTypeChange"
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
            <span class="filter-label">设备编码：</span>
            <el-input
              v-model="deviceCode"
              placeholder="设备编码"
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
    <ReportSection title="设备异常明细">
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
import { computed, onMounted, ref, watch } from 'vue';
import { Download } from '@element-plus/icons-vue';
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
  getYesterdayDate
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const showFilterPanel = ref(false);
const filterForm = ref({
  dateRange: [getYesterdayDate(), getYesterdayDate()],
  deviceType: '',
  region: '',
  faultType: ''
});
const deviceCode = ref('');
const loading = ref(false);
const exporting = ref(false);
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

// 选项数据
const deviceTypeOptions = computed(() => filterOptions.value.deviceTypes || []);
const regionOptions = computed(() => filterOptions.value.regions || []);
const faultTypeOptions = computed(() => filterOptions.value.faultTypes || []);

// 表格列定义 - 修复render函数参数传递问题
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
    width: 120,
    render: (row) => ({
      text: row.deviceType,
      events: {
        click: () => handleDeviceTypeClick(row.deviceType)
      },
      props: {
        style: { cursor: 'pointer' }
      }
    })
  },
  {
    prop: 'regionName',
    label: '区域名称',
    width: 120,
    render: (row) => ({
      text: row.regionName,
      events: {
        click: () => handleRegionClick(row.regionName)
      },
      props: {
        style: { cursor: 'pointer' }
      }
    })
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
      events: {
        click: () => handleFaultTypeClick(row.faultType)
      },
      props: {
        style: { cursor: 'pointer', color: getFaultTypeColor(row.faultType) }
      }
    })
  },
  {
    prop: 'faultDescription',
    label: '故障描述',
    width: 200
  },
  {
    prop: 'disposalStatus',
    label: '处置状态',
    width: 100,
    render: (row) => ({
      text: row.disposalStatus,
      events: {
        click: () => handleStatusClick(row.disposalStatus)
      },
      props: {
        style: {
          cursor: 'pointer',
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
    width: 180,
    render: (row) => ({
      type: 'div',
      props: { class: 'action-buttons' },
      children: [
        {
          type: 'el-button',
          props: {
            type: 'primary',
            size: 'small',
            onClick: () => handleDetailClick(row)
          },
          text: '详情'
        },
        {
          type: 'el-button',
          props: {
            type: 'info',
            size: 'small',
            onClick: () => handleWorkOrderClick(row),
            disabled: !row.workOrderId || row.disposalStatus === '待处置'
          },
          text: '查看'
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
      deviceCode: deviceCode.value,
      deviceType: filterForm.value.deviceType,
      region: filterForm.value.region,
      faultType: filterForm.value.faultType,
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

// 重置筛选条件
const resetFilter = () => {
  filterForm.value = {
    dateRange: [getYesterdayDate(), getYesterdayDate()],
    deviceType: '',
    region: '',
    faultType: ''
  };
  deviceCode.value = '';
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
      deviceCode: deviceCode.value,
      deviceType: filterForm.value.deviceType,
      region: filterForm.value.region,
      faultType: filterForm.value.faultType
    };

    await exportDeviceAbnormalReport(params);

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
  currentFaultId.value = row.faultId;
  showDetailDrawer.value = true;
};

// 查看关联工单
const handleWorkOrderClick = (row) => {
  // 这里可以跳转到工单详情页
  ElMessage.info(`查看工单: ${row.workOrderId}`);
};

// 钻取筛选 - 设备类型
const handleDeviceTypeChange = (deviceType) => {
  filterForm.value.deviceType = deviceType;
  if (deviceType) {
    currentPage.value = 1;
    loadData();
  }
};

// 钻取筛选 - 行政区域
const handleRegionChange = (region) => {
  filterForm.value.region = region;
  if (region) {
    currentPage.value = 1;
    loadData();
  }
};

// 钻取筛选 - 故障类型
const handleFaultTypeChange = (faultType) => {
  filterForm.value.faultType = faultType;
  if (faultType) {
    currentPage.value = 1;
    loadData();
  }
};

// 表格内钻取点击事件
const handleDeviceTypeClick = (deviceType) => {
  ElMessage.info(`筛选设备类型: ${deviceType}`);
};

const handleRegionClick = (regionName) => {
  ElMessage.info(`筛选区域: ${regionName}`);
};

const handleFaultTypeClick = (faultType) => {
  ElMessage.info(`筛选故障类型: ${faultType}`);
};

const handleStatusClick = (status) => {
  ElMessage.info(`筛选处置状态: ${status}`);
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
</script>

<style scoped>
.device-abnormal-report {
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

.action-buttons {
  display: flex;
  gap: 8px;
}
</style>
