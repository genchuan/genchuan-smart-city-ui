<template>
  <div class="charge-abnormal-report">
    <!-- 工具栏 -->
    <ReportToolbar>
      <template #left>
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
                size="medium"
              />
            </div>

            <div class="filter-group">
              <el-select
                v-model="filterForm.region"
                placeholder="全部区域"
                style="width: 120px"
                size="medium"
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
                v-model="filterForm.abnormalType"
                placeholder="全部类型"
                style="width: 140px"
                size="medium"
                clearable
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
              <el-select
                v-model="filterForm.disposalStatus"
                placeholder="全部状态"
                style="width: 120px"
                size="medium"
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
              <el-input
                v-model="orderNo"
                placeholder="订单编号"
                size="medium"
                clearable
                style="width: 140px"
                @keyup.enter="handleSearch"
              />
            </div>

            <div class="filter-group">
              <el-input
                v-model="carNumber"
                placeholder="车牌号码"
                size="medium"
                clearable
                style="width: 140px"
                @keyup.enter="handleSearch"
              />
            </div>

            <div class="filter-group amount-range">
              <el-input
                v-model="filterForm.minAmount"
                placeholder="最小金额"
                size="medium"
                style="width: 100px"
              />
              <span class="range-separator">-</span>
              <el-input
                v-model="filterForm.maxAmount"
                placeholder="最大金额"
                size="medium"
                style="width: 100px"
              />
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
          size="medium"
        >
          导出Excel
        </el-button>
        <el-button
          type="info"
          :icon="Refresh"
          @click="refreshData"
          size="medium"
        >
          刷新
        </el-button>
      </template>
    </ReportToolbar>

    <!-- 统计卡片 -->
    <div v-if="toggleStats" class="statistics-cards">
      <div class="stat-card">
        <div class="stat-icon" style="color: #f5222d;">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">异常总金额</div>
          <div class="stat-value">{{ formatCurrency(summaryData.totalAbnormalAmount || 0) }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color: #1890ff;">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">异常订单数</div>
          <div class="stat-value">{{ summaryData.totalCount || 0 }}笔</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color: #52c41a;">
          <el-icon><SuccessFilled /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">处置完成率</div>
          <div class="stat-value">{{ summaryData.completionRate || 0 }}%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color: #fa8c16;">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">纠错成功率</div>
          <div class="stat-value">{{ summaryData.correctionSuccessRate || 0 }}%</div>
        </div>
      </div>
    </div>

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

      <!-- 区域对比 -->
      <div class="chart-row">
        <ReportSection
          title="各区域收费异常数对比"
          :with-background="true"
          :with-padding="true"
        >
          <ChartContainer :options="regionChart" height="350px" />
        </ReportSection>
        <ReportSection
          title="原因分类统计"
          :with-background="true"
          :with-padding="true"
        >
          <div class="reason-stats">
            <div class="reason-item" v-for="reason in reasonStats" :key="reason.name">
              <div class="reason-name">{{ reason.name }}</div>
              <div class="reason-count">{{ reason.count }}笔</div>
              <el-progress
                :percentage="reason.percentage"
                :stroke-width="8"
                :color="getReasonColor(reason.name)"
              />
            </div>
          </div>
        </ReportSection>
      </div>
    </div>

    <!-- 收费异常列表 -->
    <ReportSection title="收费异常明细" :with-background="true" :with-padding="true">
      <DataTable
        :data="tableData"
        :columns="tableColumns"
        :mobile-columns="mobileColumns"
        show-pagination
        :total="totalCount"
        :page-sizes="[10, 20, 50, 100]"
        :hide-on-single-page="false"
        :current-page-prop="currentPage"
        :page-size-prop="pageSize"
        @page-change="handlePageChange"
        :remote="true"
        responsive
        column-mode="responsive"
        :empty-text="tableData.length === 0 ? '暂无收费异常数据' : ''"
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
import { computed, onMounted, ref, onUnmounted } from 'vue';
import { Download, Refresh, Money, Document, SuccessFilled, Clock } from '@element-plus/icons-vue';
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
  formatCurrency,
  getYesterdayDate,
  getLastMonth
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const filterForm = ref({
  dateRange: [getLastMonth() + '-01', getYesterdayDate()],
  region: '',
  abnormalType: '',
  disposalStatus: '',
  severityLevel: '',
  minAmount: '',
  maxAmount: ''
});
const orderNo = ref('');
const carNumber = ref('');
const loading = ref(false);
const exporting = ref(false);
const toggleStats = ref(true);
const tableData = ref([]);
const filterOptions = ref({
  regions: [],
  abnormalTypes: [],
  disposalStatuses: []
});
const showDetailDrawer = ref(false);
const currentAbnormalId = ref('');

// 响应式布局变量
const mobileLayout = ref(false);
const screenWidth = ref(window.innerWidth);

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
const reasonStats = ref([]);

// 选项数据 - 添加默认值处理
const regionOptions = computed(() => {
  if (filterOptions.value && filterOptions.value.regions) {
    return filterOptions.value.regions;
  }
  // 返回默认选项，当API没有返回时
  return [
    { value: '', label: '全部区域' },
    { value: 'xiangcheng', label: '芗城区' },
    { value: 'longwen', label: '龙文区' },
    { value: 'longhai', label: '龙海区' },
    { value: 'zhangpu', label: '漳浦县' },
    { value: 'yunxiao', label: '云霄县' },
    { value: 'zhaoan', label: '诏安县' },
    { value: 'dongshan', label: '东山县' },
    { value: 'nanjing', label: '南靖县' },
    { value: 'pinghe', label: '平和县' },
    { value: 'huaan', label: '华安县' }
  ];
});

const abnormalTypeOptions = computed(() => {
  if (filterOptions.value && filterOptions.value.abnormalTypes) {
    return filterOptions.value.abnormalTypes;
  }
  return [
    { value: '', label: '全部类型' },
    { value: 'overcharge', label: '多收费' },
    { value: 'undercharge', label: '少收费' },
    { value: 'duplicate', label: '重复收费' },
    { value: 'system', label: '系统错误' },
    { value: 'manual', label: '人工操作错误' },
    { value: 'timeout', label: '超时计费' }
  ];
});

const disposalStatusOptions = computed(() => {
  if (filterOptions.value && filterOptions.value.disposalStatuses) {
    return filterOptions.value.disposalStatuses;
  }
  return [
    { value: '', label: '全部状态' },
    { value: 'pending', label: '待处理' },
    { value: 'processing', label: '处理中' },
    { value: 'resolved', label: '已处理' },
    { value: 'closed', label: '已关闭' },
    { value: 'rejected', label: '已驳回' }
  ];
});

// 移动端列规则
const mobileColumns = computed(() => {
  return ['abnormalId', 'carNumber', 'parkingName', 'abnormalType', 'abnormalAmount', 'disposalStatus', 'actions'];
});

// 表格列定义 - 响应式
const tableColumns = computed(() => {
  const columns = [
    {
      prop: 'abnormalId',
      label: '异常ID',
      width: mobileLayout.value ? '100px' : '140px',
      minWidth: '100px',
      render: (row) => ({
        text: row.abnormalId,
        events: {
          click: () => handleDetailClick(row)
        },
        props: {
          style: { color: '#1890ff', cursor: 'pointer' },
          class: 'ellipsis-text'
        }
      }),
      showTooltip: true,
      hideOnMobile: false,
      alwaysShow: true
    },
    {
      prop: 'orderNo',
      label: '订单编号',
      width: mobileLayout.value ? '120px' : '140px',
      minWidth: '120px',
      showTooltip: true,
      hideOnMobile: screenWidth.value < 640
    },
    {
      prop: 'carNumber',
      label: '车牌',
      width: mobileLayout.value ? '90px' : '120px',
      minWidth: '90px',
      hideOnMobile: false,
      alwaysShow: true
    },
    {
      prop: 'parkingName',
      label: '车场名称',
      width: mobileLayout.value ? '120px' : '180px',
      minWidth: '120px',
      showTooltip: true,
      hideOnMobile: false
    },
    {
      prop: 'abnormalTime',
      label: '异常时间',
      width: mobileLayout.value ? '120px' : '160px',
      minWidth: '120px',
      type: 'datetime',
      hideOnMobile: screenWidth.value < 768
    },
    {
      prop: 'abnormalType',
      label: '异常类型',
      width: mobileLayout.value ? '100px' : '120px',
      minWidth: '100px',
      render: (row) => ({
        text: row.abnormalType,
        props: {
          style: {
            color: getAbnormalTypeColor(row.abnormalType)
          }
        }
      }),
      hideOnMobile: false
    },
    {
      prop: 'abnormalReason',
      label: '异常原因',
      width: mobileLayout.value ? '120px' : '200px',
      minWidth: '120px',
      showTooltip: true,
      hideOnMobile: screenWidth.value < 768
    },
    {
      prop: 'abnormalAmount',
      label: '异常金额',
      width: mobileLayout.value ? '100px' : '120px',
      minWidth: '100px',
      type: 'currency',
      align: 'right',
      hideOnMobile: false
    },
    {
      prop: 'disposalStatus',
      label: '处置状态',
      width: mobileLayout.value ? '90px' : '100px',
      minWidth: '90px',
      render: (row) => ({
        text: row.disposalStatus,
        props: {
          style: {
            color: getDisposalStatusColor(row.disposalStatus)
          }
        }
      }),
      hideOnMobile: false
    },
    {
      prop: 'disposalResult',
      label: '处理结果',
      width: mobileLayout.value ? '100px' : '120px',
      minWidth: '100px',
      hideOnMobile: screenWidth.value < 576
    },
    {
      prop: 'actions',
      label: '操作',
      width: mobileLayout.value ? '100px' : '120px',
      minWidth: '100px',
      fixed: mobileLayout.value ? 'right' : false,
      render: (row) => ({
        type: 'div',
        props: { class: 'action-buttons' },
        children: [
          {
            type: 'el-button',
            props: {
              type: 'primary',
              size: mobileLayout.value ? 'small' : 'default',
              onClick: () => handleDetailClick(row)
            },
            text: '详情'
          }
        ]
      }),
      hideOnMobile: false,
      alwaysShow: true
    }
  ];

  return columns;
});

// 图表配置
const trendOptions = computed(() => {
  // 确保trendData有数据
  const dates = trendData.value && trendData.value.length > 0
    ? trendData.value.map(item => item.date ? item.date.substr(5) : '')
    : [];

  const counts = trendData.value && trendData.value.length > 0
    ? trendData.value.map(item => item.count || 0)
    : [];

  const amounts = trendData.value && trendData.value.length > 0
    ? trendData.value.map(item => item.amount || 0)
    : [];

  return {
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
      data: dates,
      axisLabel: {
        interval: 0,
        rotate: 45
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '异常数量'
      },
      {
        type: 'value',
        name: '异常金额(元)',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '异常总数',
        type: 'line',
        data: counts,
        smooth: true,
        itemStyle: {
          color: '#f5222d'
        }
      },
      {
        name: '异常金额',
        type: 'line',
        yAxisIndex: 1,
        data: amounts,
        smooth: true,
        itemStyle: {
          color: '#1890ff'
        }
      }
    ]
  };
});

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
      data: abnormalTypeDistribution.value.length > 0
        ? abnormalTypeDistribution.value
        : [{ name: '暂无数据', value: 1 }],
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
      data: statusDistribution.value.length > 0
        ? statusDistribution.value
        : [{ name: '暂无数据', value: 1 }],
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

// 监听屏幕宽度变化
const handleResize = () => {
  screenWidth.value = window.innerWidth;
  mobileLayout.value = screenWidth.value < 768;
};

// 初始化
onMounted(async () => {
  handleResize();
  window.addEventListener('resize', handleResize);

  await loadFilterOptions();
  loadData();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 加载筛选选项
const loadFilterOptions = async () => {
  try {
    const options = await getChargeAbnormalFilterOptions();
    filterOptions.value = options || {};
  } catch (error) {
    console.error('加载筛选选项失败:', error);
    // 设置默认选项
    filterOptions.value = {
      regions: regionOptions.value,
      abnormalTypes: abnormalTypeOptions.value,
      disposalStatuses: disposalStatusOptions.value
    };
    ElMessage.warning('使用默认筛选选项');
  }
};

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;

    const params = {
      startDate: filterForm.value.dateRange?.[0] || getLastMonth() + '-01',
      endDate: filterForm.value.dateRange?.[1] || getYesterdayDate(),
      orderNo: orderNo.value,
      carNumber: carNumber.value,
      region: filterForm.value.region,
      abnormalType: filterForm.value.abnormalType,
      disposalStatus: filterForm.value.disposalStatus,
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

    // 计算原因分类统计
    calculateReasonStats();

    // 如果没有数据，显示提示
    if (tableData.value.length === 0) {
      ElMessage.info('暂无收费异常数据');
    }
  } catch (error) {
    console.error('加载收费异常数据失败:', error);
    ElMessage.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 计算原因分类统计
const calculateReasonStats = () => {
  if (!tableData.value || tableData.value.length === 0) {
    reasonStats.value = [];
    return;
  }

  const reasonMap = {};
  tableData.value.forEach(item => {
    if (item.abnormalReason) {
      if (!reasonMap[item.abnormalReason]) {
        reasonMap[item.abnormalReason] = 0;
      }
      reasonMap[item.abnormalReason]++;
    }
  });

  const total = tableData.value.length;
  reasonStats.value = Object.entries(reasonMap).map(([name, count]) => ({
    name,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  })).slice(0, 6); // 显示前6个原因
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
    region: '',
    abnormalType: '',
    disposalStatus: '',
    severityLevel: '',
    minAmount: '',
    maxAmount: ''
  };
  orderNo.value = '';
  carNumber.value = '';
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
      abnormalType: filterForm.value.abnormalType,
      disposalStatus: filterForm.value.disposalStatus
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

const getSeverityLevelColor = (level) => {
  const colors = {
    '高': '#f5222d',
    '中': '#fa8c16',
    '低': '#1890ff'
  };
  return colors[level] || '#8c8c8c';
};

const getReasonColor = (reason) => {
  const colorMap = {
    '系统计费规则错误': '#f5222d',
    '人工录入信息错误': '#fa8c16',
    '设备识别错误导致时间计算错误': '#1890ff',
    '网络延迟导致重复计费': '#52c41a',
    '优惠券使用异常未生效': '#722ed1',
    '支付系统接口异常': '#13c2c2',
    '车牌识别错误导致匹配错误': '#eb2f96',
    '节假日收费标准未正确应用': '#fa8c16'
  };
  return colorMap[reason] || '#8c8c8c';
};
</script>

<style scoped>
.charge-abnormal-report {
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

.range-separator {
  padding: 0 4px;
  color: #909399;
}

/* 金额范围组样式 */
.amount-range {
  display: flex;
  align-items: center;
  gap: 4px;
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

/* 原因统计 */
.reason-stats {
  padding: 16px;
}

.reason-item {
  margin-bottom: 16px;
}

.reason-item:last-child {
  margin-bottom: 0;
}

.reason-name {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
  color: #303133;
}

.reason-count {
  font-weight: 500;
  color: #1890ff;
}

/* 响应式调整 */
@media (max-width: 767px) {
  .filter-row {
    flex-direction: column;
    gap: 8px;
  }

  .filter-group {
    width: 100%;
  }

  .filter-group :deep(.el-date-editor),
  .filter-group :deep(.el-select),
  .filter-group :deep(.el-input) {
    width: 100% !important;
  }

  .amount-range {
    flex-direction: column;
    gap: 8px;
  }

  .amount-range :deep(.el-input) {
    width: 100% !important;
  }

  .range-separator {
    display: none;
  }

  .statistics-cards {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-icon {
    font-size: 24px;
    margin-right: 12px;
  }

  .stat-value {
    font-size: 20px;
  }

  .chart-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .chart-section {
    margin-bottom: 8px;
  }

  .reason-stats {
    padding: 12px;
  }

  .reason-item {
    margin-bottom: 12px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }

  .action-buttons :deep(.el-button) {
    width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .chart-row {
    grid-template-columns: 1fr;
    gap: 12px;
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

@media (min-width: 1024px) and (max-width: 1439px) {
  .filter-group :deep(.el-date-editor) {
    width: 200px !important;
  }

  .filter-group :deep(.el-select),
  .filter-group :deep(.el-input) {
    width: 140px !important;
  }
}

/* 文字省略 */
.ellipsis-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* 操作按钮容器 */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

/* 移动端隐藏类 */
.mobile-hidden {
  display: none;
}

@media (min-width: 768px) {
  .mobile-hidden {
    display: table-cell;
  }
}
</style>
