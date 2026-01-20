<template>
  <div class="escape-data-report">
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
                size="medium"
              />
            </div>

            <div class="filter-group">
              <el-select
                v-model="filterForm.region"
                placeholder="区域"
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
                v-model="filterForm.parkingId"
                placeholder="车场"
                style="width: 150px"
                size="medium"
                clearable
              >
                <el-option
                  v-for="item in parkingOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

            <div class="filter-group">
              <el-select
                v-model="filterForm.escapeLevel"
                placeholder="逃费等级"
                style="width: 120px"
                size="medium"
                clearable
              >
                <el-option
                  v-for="item in levelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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

            <div class="filter-group">
              <el-select
                v-model="filterForm.traceStatus"
                placeholder="追缴状态"
                style="width: 120px"
                size="medium"
                clearable
              >
                <el-option
                  v-for="item in traceStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
          <div class="stat-label">逃费总金额</div>
          <div class="stat-value">{{ formatCurrency(summaryData.totalEscapeAmount || 0) }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color: #1890ff;">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">逃费订单数</div>
          <div class="stat-value">{{ summaryData.totalCount || 0 }}笔</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color: #52c41a;">
          <el-icon><SuccessFilled /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">追缴成功率</div>
          <div class="stat-value">{{ summaryData.recoveryRate || 0 }}%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color: #fa8c16;">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">待追缴数</div>
          <div class="stat-value">{{ summaryData.pendingCount || 0 }}笔</div>
        </div>
      </div>
    </div>

    <!-- 图表分析 -->
    <div class="chart-section">
      <!-- 逃费趋势 -->
      <ReportSection
        title="近30天逃费订单趋势"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="trendOptions" height="350px" />
      </ReportSection>

      <!-- 逃费等级与追缴状态 -->
      <div class="chart-row">
        <ReportSection
          title="逃费等级占比"
          :with-background="true"
          :with-padding="true"
        >
          <ChartContainer :options="levelChart" height="300px" />
        </ReportSection>
        <ReportSection
          title="追缴状态占比"
          :with-background="true"
          :with-padding="true"
        >
          <ChartContainer :options="statusChart" height="300px" />
        </ReportSection>
      </div>

      <!-- 区域对比 -->
      <ReportSection
        title="各区域逃费金额对比"
        :with-background="true"
        :with-padding="true"
      >
        <ChartContainer :options="regionChart" height="350px" />
      </ReportSection>
    </div>

    <!-- 逃费数据列表 -->
    <ReportSection title="逃费数据明细" :with-background="true" :with-padding="true">
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
      title="逃费详情"
      size="50%"
      destroy-on-close
    >
      <EscapeDetail :escape-id="currentEscapeId" v-if="showDetailDrawer" />
    </el-drawer>

    <!-- 追缴弹窗 -->
    <el-dialog
      v-model="showTraceDialog"
      title="发起追缴"
      width="500px"
      destroy-on-close
    >
      <div v-if="currentEscape" class="trace-dialog">
        <el-form label-width="100px">
          <el-form-item label="逃费车牌">
            <span class="trace-info">{{ currentEscape.carNumber }}</span>
          </el-form-item>
          <el-form-item label="逃费金额">
            <span class="trace-info">{{ formatCurrency(currentEscape.escapeAmount) }}</span>
          </el-form-item>
          <el-form-item label="追缴方式" required>
            <el-select v-model="traceMethod" placeholder="请选择追缴方式" style="width: 100%">
              <el-option
                v-for="item in traceMethodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input
              v-model="traceRemark"
              type="textarea"
              :rows="3"
              placeholder="请输入追缴备注信息"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showTraceDialog = false">取消</el-button>
          <el-button type="primary" @click="handleTraceSubmit">确认发起</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Download, Refresh, Money, Document, SuccessFilled, Clock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import {
  exportEscapeDataReport,
  getEscapeDataReport,
  getEscapeFilterOptions,
  submitTraceAction,
  getEscapeStatistics
} from '#/api/reports/park/escapeDataApi';
import ChartContainer from '#/views/report/park/component/ChartContainer.vue';
import DataTable from '#/views/report/park/component/DataTable.vue';
import ReportSection from '#/views/report/park/component/ReportSection.vue';
import ReportToolbar from '#/views/report/park/component/ReportToolbar.vue';
import EscapeDetail from './EscapeDetail.vue';
import {
  formatCurrency,
  getYesterdayDate,
  getLastMonth
} from '#/views/report/park/component/ReportUtils';

// 响应式数据
const filterForm = ref({
  dateRange: [getLastMonth() + '-01', getYesterdayDate()],
  region: '',
  parkingId: '',
  escapeLevel: '',
  traceStatus: '',
  minAmount: '',
  maxAmount: ''
});
const carNumber = ref('');
const loading = ref(false);
const exporting = ref(false);
const toggleStats = ref(true);
const tableData = ref([]);
const filterOptions = ref({
  regions: [],
  parkingList: [],
  escapeLevels: [],
  traceStatuses: [],
  traceMethods: []
});
const showDetailDrawer = ref(false);
const showTraceDialog = ref(false);
const currentEscape = ref(null);
const currentEscapeId = ref('');
const traceMethod = ref('sms');
const traceRemark = ref('');

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

// 统计数据
const trendData = ref([]);
const levelDistribution = ref([]);
const statusDistribution = ref([]);
const regionAmountComparison = ref([]);
const summaryData = ref({});

// 选项数据 - 添加默认值处理
const regionOptions = computed(() => {
  if (filterOptions.value && filterOptions.value.regions) {
    return filterOptions.value.regions;
  }
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

const parkingOptions = computed(() => {
  if (filterOptions.value && filterOptions.value.parkingList) {
    return filterOptions.value.parkingList;
  }
  return [
    { value: '', label: '全部停车场' },
    { value: 'park001', label: '漳州万达广场停车场' },
    { value: 'park002', label: '芗城政府路侧停车场' },
    { value: 'park003', label: '龙文区体育中心停车场' },
    { value: 'park004', label: '龙海区商业城停车场' },
    { value: 'park005', label: '漳浦县汽车站停车场' },
    { value: 'park006', label: '云霄县中心停车场' },
    { value: 'park007', label: '诏安县人民广场停车场' },
    { value: 'park008', label: '东山县旅游中心停车场' },
    { value: 'park009', label: '南靖县土楼停车场' },
    { value: 'park010', label: '平和县商贸城停车场' }
  ];
});

const levelOptions = computed(() => {
  if (filterOptions.value && filterOptions.value.escapeLevels) {
    return filterOptions.value.escapeLevels;
  }
  return [
    { value: '', label: '全部等级' },
    { value: 'level1', label: '一级逃费' },
    { value: 'level2', label: '二级逃费' },
    { value: 'level3', label: '三级逃费' },
    { value: 'level4', label: '四级逃费' }
  ];
});

const traceStatusOptions = computed(() => {
  if (filterOptions.value && filterOptions.value.traceStatuses) {
    return filterOptions.value.traceStatuses;
  }
  return [
    { value: '', label: '全部状态' },
    { value: 'pending', label: '待追缴' },
    { value: 'processing', label: '追缴中' },
    { value: 'completed', label: '已追缴' },
    { value: 'failed', label: '追缴失败' },
    { value: 'exempted', label: '已豁免' }
  ];
});

const traceMethodOptions = computed(() => {
  if (filterOptions.value && filterOptions.value.traceMethods) {
    return filterOptions.value.traceMethods;
  }
  return [
    { value: 'sms', label: '短信通知' },
    { value: 'phone', label: '电话追缴' },
    { value: 'letter', label: '书面通知' },
    { value: 'legal', label: '法律途径' },
    { value: 'system', label: '系统自动' }
  ];
});

// 表格列定义
const tableColumns = computed(() => [
  {
    prop: 'escapeId',
    label: '逃费ID',
    width: 140,
    render: (row) => ({
      text: row.escapeId,
      events: {
        click: () => handleDetailClick(row)
      },
      props: {
        style: { color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }
      }
    })
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
    prop: 'escapeTime',
    label: '逃费时间',
    width: 160
  },
  {
    prop: 'escapeAmount',
    label: '逃费金额',
    width: 120,
    type: 'currency'
  },
  {
    prop: 'escapeLevel',
    label: '逃费等级',
    width: 120,
    render: (row) => ({
      text: row.escapeLevel,
      props: {
        style: {
          color: getEscapeLevelColor(row.escapeLevel),
          fontWeight: 'bold'
        }
      }
    })
  },
  {
    prop: 'traceStatus',
    label: '追缴状态',
    width: 120,
    render: (row) => ({
      text: row.traceStatus,
      props: {
        style: {
          color: getTraceStatusColor(row.traceStatus)
        }
      }
    })
  },
  {
    prop: 'lastTraceTime',
    label: '上次追缴时间',
    width: 160
  },
  {
    prop: 'actions',
    label: '操作',
    width: 150,
    render: (row) => ({
      type: 'div',
      props: { class: 'action-buttons' },
      children: [
        {
          type: 'el-button',
          props: {
            type: 'primary',
            size: 'medium',
            onClick: () => handleDetailClick(row)
          },
          text: '详情'
        },
        {
          type: 'el-button',
          props: {
            type: 'warning',
            size: 'medium',
            onClick: () => handleTraceClick(row),
            disabled: row.traceStatus === '已追缴' || row.traceStatus === '已豁免'
          },
          text: '追缴'
        }
      ]
    })
  }
]);

// 图表配置 - 添加容错处理
const trendOptions = computed(() => {
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
      text: '近30天逃费订单趋势',
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
        name: '逃费订单数'
      },
      {
        type: 'value',
        name: '逃费金额(元)',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '逃费订单数',
        type: 'line',
        data: counts,
        smooth: true,
        itemStyle: {
          color: '#f5222d'
        }
      },
      {
        name: '逃费金额',
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

const levelChart = computed(() => ({
  title: {
    text: '逃费等级占比',
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
      name: '逃费等级',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '50%'],
      data: levelDistribution.value.length > 0
        ? levelDistribution.value
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
    text: '追缴状态占比',
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
      name: '追缴状态',
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

const regionChart = computed(() => {
  const data = regionAmountComparison.value && regionAmountComparison.value.length > 0
    ? regionAmountComparison.value
    : [{ name: '暂无数据', value: 0 }];

  return {
    title: {
      text: '各区域逃费金额对比',
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
      data: data.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '逃费金额(元)'
    },
    series: [
      {
        name: '逃费金额',
        type: 'bar',
        data: data.map(item => item.value),
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
  };
});

// 初始化
onMounted(async () => {
  await loadFilterOptions();
  loadData();
});

// 加载筛选选项
const loadFilterOptions = async () => {
  try {
    const options = await getEscapeFilterOptions();
    filterOptions.value = options || {};
  } catch (error) {
    console.error('加载筛选选项失败:', error);
    // 设置默认选项
    filterOptions.value = {
      regions: regionOptions.value,
      parkingList: parkingOptions.value,
      escapeLevels: levelOptions.value,
      traceStatuses: traceStatusOptions.value,
      traceMethods: traceMethodOptions.value
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
      carNumber: carNumber.value,
      region: filterForm.value.region,
      parkingId: filterForm.value.parkingId,
      escapeLevel: filterForm.value.escapeLevel,
      traceStatus: filterForm.value.traceStatus,
      page: currentPage.value,
      pageSize: pageSize.value
    };

    const response = await getEscapeDataReport(params);
    const stats = await getEscapeStatistics({
      startDate: filterForm.value.dateRange?.[0] || getLastMonth() + '-01',
      endDate: filterForm.value.dateRange?.[1] || getYesterdayDate()
    });

    // 更新数据
    tableData.value = response.data || [];
    totalCount.value = response.total || 0;
    trendData.value = response.trendData || [];
    levelDistribution.value = response.escapeLevelDistribution || [];
    statusDistribution.value = response.traceStatusDistribution || [];
    regionAmountComparison.value = response.regionAmountComparison || [];
    summaryData.value = stats.summary || {};

    // 如果没有数据，显示提示
    if (tableData.value.length === 0) {
      ElMessage.info('暂无逃费数据');
    }
  } catch (error) {
    console.error('加载逃费数据失败:', error);
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
    region: '',
    parkingId: '',
    escapeLevel: '',
    traceStatus: '',
    minAmount: '',
    maxAmount: ''
  };
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
      carNumber: carNumber.value,
      region: filterForm.value.region,
      parkingId: filterForm.value.parkingId,
      escapeLevel: filterForm.value.escapeLevel
    };

    await exportEscapeDataReport(params);
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
  currentEscapeId.value = row.escapeId;
  showDetailDrawer.value = true;
};

// 发起追缴
const handleTraceClick = (row) => {
  currentEscape.value = row;
  traceMethod.value = 'sms';
  traceRemark.value = '';
  showTraceDialog.value = true;
};

// 提交追缴
const handleTraceSubmit = async () => {
  try {
    if (!currentEscape.value) return;

    const params = {
      escapeId: currentEscape.value.escapeId,
      traceMethod: traceMethod.value,
      remark: traceRemark.value
    };

    const result = await submitTraceAction(params);

    ElMessage.success(result.message);
    showTraceDialog.value = false;
    loadData();
  } catch (error) {
    console.error('追缴操作失败:', error);
    ElMessage.error(error.message || '追缴操作失败');
  }
};

// 工具函数
const getEscapeLevelColor = (level) => {
  const colors = {
    '一级逃费': '#f5222d',
    '二级逃费': '#fa8c16',
    '三级逃费': '#1890ff',
    '四级逃费': '#52c41a'
  };
  return colors[level] || '#8c8c8c';
};

const getTraceStatusColor = (status) => {
  const colors = {
    '待追缴': '#f5222d',
    '追缴中': '#fa8c16',
    '已追缴': '#52c41a',
    '追缴失败': '#8c8c8c',
    '已豁免': '#722ed1'
  };
  return colors[status] || '#8c8c8c';
};
</script>

<style scoped>
.escape-data-report {
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

  .amount-range :deep(.el-input) {
    width: 80px !important;
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

  .amount-range {
    display: flex;
    gap: 8px;
  }

  .statistics-cards {
    grid-template-columns: 1fr;
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.trace-dialog {
  padding: 10px;
}

.trace-info {
  font-weight: 500;
  color: #303133;
}
</style>
