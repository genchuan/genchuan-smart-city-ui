<template>
  <DetailDrawer :title="drillMode ? (currentSection?.title || '明细') : `周期报表详情 (ID: ${detailData?.id || ''})`">
    <!-- 下钻模式：只展示对应维度的过滤列表 -->
    <div v-if="drillMode" class="detail-container">
      <el-table :data="getPagedData(activeTab, currentSection?.dataKey)" size="small" border>
        <el-table-column v-for="col in (currentSection?.columns || [])" :key="col.prop" :prop="col.prop" :label="col.label" :formatter="col.formatter" />
      </el-table>
      <el-pagination
        v-if="getTotal(activeTab, currentSection?.dataKey) > 0"
        v-model:current-page="pageStates[activeTab].currentPage"
        v-model:page-size="pageStates[activeTab].pageSize"
        :total="getTotal(activeTab, currentSection?.dataKey)"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        small
        background
        style="margin-top: 12px; justify-content: flex-end;"
      />
    </div>
    <!-- 正常模式：完整详情（基础信息卡片 + 所有维度 Tab） -->
    <div v-else-if="detailData" class="detail-container">
      <!-- 卡片式信息区 -->
      <div class="detail-card">
        <div class="detail-card-row">
          <div class="detail-row-left">报表周期：</div>
          <div class="detail-row-right">{{ detailData.reportCycle || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">统计时段：</div>
          <div class="detail-row-right">{{ detailData.statTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">救援完成率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.rescueCompleteRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预约成功率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.reserveSuccessRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">投诉处理率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.complaintHandleRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">寻车定位成功率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.findCarSuccessRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">空位推送成功率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.spacePushSuccessRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">生效话术数：</div>
          <div class="detail-row-right">{{ detailData.effectiveWordingCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">救援总量：</div>
          <div class="detail-row-right">{{ detailData.rescueTotal ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预约总量：</div>
          <div class="detail-row-right">{{ detailData.reserveTotal ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">投诉总量：</div>
          <div class="detail-row-right">{{ detailData.complaintTotal ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">空位推送总量：</div>
          <div class="detail-row-right">{{ detailData.spacePushTotal ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">生成状态：</div>
          <div class="detail-row-right">{{ detailData.generateStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">报表生成时间：</div>
          <div class="detail-row-right">{{ formatTimestamp(detailData.generateTime) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">操作人：</div>
          <div class="detail-row-right">{{ detailData.operator || '-' }}</div>
        </div>

        <!-- 指标卡片区域：同比增长率、环比增长率、服务状态占比（样式与chart.vue中的stat-card一致） -->
        <div class="indicator-cards">
          <!-- 同比增长率卡片 -->
          <div class="indicator-card" :style="{ borderLeftColor: getGrowthColor(detailData.yearOnYearGrowthRate) }">
            <div class="card-header">
              <span class="card-title">同比增长率</span>
              <div class="card-indicator" :style="{ backgroundColor: getGrowthColor(detailData.yearOnYearGrowthRate) }"></div>
            </div>
            <div class="card-body">
              <div class="card-value" :style="{ color: getGrowthColor(detailData.yearOnYearGrowthRate) }">
                {{ formatPercent(detailData.yearOnYearGrowthRate) }}
              </div>
            </div>
          </div>

          <!-- 环比增长率卡片 -->
          <div class="indicator-card" :style="{ borderLeftColor: getGrowthColor(detailData.monthOnMonthGrowthRate) }">
            <div class="card-header">
              <span class="card-title">环比增长率</span>
              <div class="card-indicator" :style="{ backgroundColor: getGrowthColor(detailData.monthOnMonthGrowthRate) }"></div>
            </div>
            <div class="card-body">
              <div class="card-value" :style="{ color: getGrowthColor(detailData.monthOnMonthGrowthRate) }">
                {{ formatPercent(detailData.monthOnMonthGrowthRate) }}
              </div>
            </div>
          </div>

          <!-- 服务状态占比卡片（包含进度条） -->
          <div class="indicator-card" style="border-left-color: #409EFF">
            <div class="card-header">
              <span class="card-title">服务状态占比</span>
              <div class="card-indicator" style="background-color: #409EFF"></div>
            </div>
            <div class="card-body status-ratio-body">
              <div class="status-ratio-content">
                <div v-if="detailData.serviceStatusRatio" class="status-ratio-bars">
                  <div v-for="item in parseStatusRatio(detailData.serviceStatusRatio)" :key="item.name" class="ratio-bar-item">
                    <span class="ratio-label">{{ item.name }}</span>
                    <el-progress :percentage="item.value" :stroke-width="8" :show-text="false" />
                    <span class="ratio-percent">{{ item.value }}%</span>
                  </div>
                </div>
                <span v-else class="card-value">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 各维度明细 Tabs（一行标签，切换展示对应明细）-->
      <el-tabs v-model="activeTab" type="card" class="detail-tabs">
        <el-tab-pane v-for="s in detailSections" :key="s.name" :name="s.name" :label="`${s.title}（${getTotal(s.name, s.dataKey)}）`">
          <el-table :data="getPagedData(s.name, s.dataKey)" size="small" border>
            <el-table-column v-for="col in s.columns" :key="col.prop" :prop="col.prop" :label="col.label" :formatter="col.formatter" />
          </el-table>
          <el-pagination
            v-if="getTotal(s.name, s.dataKey) > 0"
            v-model:current-page="pageStates[s.name].currentPage"
            v-model:page-size="pageStates[s.name].pageSize"
            :total="getTotal(s.name, s.dataKey)"
            :page-sizes="[5, 10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            small
            background
            style="margin-top: 12px; justify-content: flex-end;"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-empty v-else-if="!drillMode" description="暂无数据" />
  </DetailDrawer>
</template>

<script setup>
import { computed, onMounted, reactive, ref, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/utils';
import { getSpacePushPage } from '#/api/genchuan/industry/chargePark/carService/carGuide/spacePush/index.js';

const props = defineProps({
  detailData: { type: Object, default: null },
});
const { detailData } = toRefs(props);

const activeTab = ref('rescue');
const drillMode = ref(false); // 下钻模式：只展示对应维度的过滤列表，隐藏其他 UI
const currentSection = computed(() => detailSections.find(s => s.name === activeTab.value));

// 6 个明细 section 配置
const detailSections = [
  { name: 'rescue', title: '救援明细', dataKey: 'rescueDetail', columns: [
    { prop: 'userId', label: '用户ID' },
    { prop: 'rescueType', label: '救援类型' },
    { prop: 'status', label: '状态' },
    { prop: 'createTime', label: '发起时间' },
  ]},
  { name: 'reserve', title: '预约明细', dataKey: 'reserveDetail', columns: [
    { prop: 'userId', label: '用户ID' },
    { prop: 'reserveType', label: '预约类型' },
    { prop: 'status', label: '状态' },
    { prop: 'createTime', label: '预约时间' },
  ]},
  { name: 'complaint', title: '投诉明细', dataKey: 'complaintDetail', columns: [
    { prop: 'userId', label: '用户ID' },
    { prop: 'complaintType', label: '投诉类型', formatter: (row) => {
      if (row.complaintType) return row.complaintType;
      if (row.merchantId != null) return '商户纠纷';
      if (row.orderId != null) return '订单申诉';
      return '用户建议';
    }},
    { prop: 'status', label: '处理状态' },
    { prop: 'createTime', label: '投诉时间' },
  ]},
  { name: 'findCar', title: '寻车明细', dataKey: 'findCarDetail', columns: [
    { prop: 'userId', label: '用户ID' },
    { prop: 'plateNo', label: '车牌号' },
    { prop: 'locationResult', label: '定位结果' },
    { prop: 'createTime', label: '查询时间' },
  ]},
  { name: 'spacePush', title: '空位推送明细', dataKey: 'spacePushDetail', columns: [
    { prop: 'userId', label: '用户ID' },
    { prop: 'stationName', label: '场站名称', formatter: (row) => getStationName(row) },
    { prop: 'pushResult', label: '推送结果' },
    { prop: 'createTime', label: '推送时间' },
  ]},
  { name: 'wording', title: '话术明细', dataKey: 'wordingDetail', columns: [
    { prop: 'name', label: '话术名称' },
    { prop: 'type', label: '话术类型' },
    { prop: 'status', label: '状态' },
    { prop: 'createTime', label: '生效时间' },
  ]},
];

// 每节独立分页状态
const pageStates = reactive({});
detailSections.forEach(s => {
  pageStates[s.name] = { currentPage: 1, pageSize: 10 };
});

// 类型过滤：图表点击柱子/饼图扇区时设置，只展示对应类型的记录
const typeFilter = ref(null); // { dimension, type }
const matchType = (name, row) => {
  if (!typeFilter.value || typeFilter.value.dimension !== name) return true;
  const t = typeFilter.value.type;
  switch (name) {
    case 'rescue': return row.rescueType === t;
    case 'reserve': return row.reserveType === t;
    case 'findCar': return row.locationResult === t;
    case 'spacePush': return row.pushResult === t;
    case 'wording': return row.type === t;
    case 'complaint': {
      let rowType = row.complaintType;
      if (!rowType) {
        if (row.merchantId != null) rowType = '商户纠纷';
        else if (row.orderId != null) rowType = '订单申诉';
        else rowType = '用户建议';
      }
      return rowType === t;
    }
    default: return true;
  }
};
const getRawData = (dataKey) => detailData.value?.detailData?.[dataKey] || [];
const getFilteredData = (name, dataKey) => getRawData(dataKey).filter(row => matchType(name, row));
const getTotal = (name, dataKey) => getFilteredData(name, dataKey).length;
const isFiltering = (name) => typeFilter.value && typeFilter.value.dimension === name;
const getPagedData = (name, dataKey) => {
  const all = getFilteredData(name, dataKey);
  const { currentPage, pageSize } = pageStates[name];
  const start = (currentPage - 1) * pageSize;
  return all.slice(start, start + pageSize);
};
const clearTypeFilter = () => {
  typeFilter.value = null;
};

// 场站 id→name 映射：从 /space-push/page 的响应里收集（该接口后端已注入 stationName）
// 失败时不阻塞主数据，仅退化为"场站{id}"格式
const stationNameMap = ref({});
const getStationName = (row) => {
  if (row.stationName) return row.stationName;
  const id = row.stationId;
  if (id == null) return '-';
  return stationNameMap.value[id] || stationNameMap.value[String(id)] || `场站${id}`;
};
onMounted(async () => {
  try {
    const res = await getSpacePushPage({ pageNo: 1, pageSize: 200 });
    const list = res?.list || [];
    const newMap = {};
    list.forEach(item => {
      if (item.stationId != null && item.stationName) {
        newMap[item.stationId] = item.stationName;
        newMap[String(item.stationId)] = item.stationName;
      }
    });
    stationNameMap.value = newMap;
    console.log('[空位推送 stationName 映射]', list.length, '条记录,', Object.keys(newMap).length / 2, '个场站');
  } catch (e) {
    console.warn('[加载场站名失败]', e);
  }
});

const formatPercent = (value) => {
  if (value === undefined || value === null) return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '-';
  return `${num.toFixed(1)}%`;
};

// 根据增长率正负返回颜色（正：绿色，负：红色，零/无：灰色）
const getGrowthColor = (value) => {
  if (value === undefined || value === null) return '#909399';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (num > 0) return '#67C23A';
  if (num < 0) return '#F56C6C';
  return '#909399';
};

// 解析服务状态占比字符串 "已完成:31%, 处理中:25%, 待认领:31%, 待派发:13%"
const parseStatusRatio = (str) => {
  if (!str) return [];
  const items = str.split(',').map(item => item.trim());
  return items.map(item => {
    const [name, val] = item.split(':');
    const percent = parseFloat(val);
    return { name: name.trim(), value: isNaN(percent) ? 0 : percent };
  });
};

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({
  open: (initialTab, filterType) => {
    if (initialTab) activeTab.value = initialTab;
    typeFilter.value = filterType ? { dimension: initialTab, type: filterType } : null;
    // 有 filterType 表示从图表/卡片下钻进来 → 进入下钻模式（只显示纯列表）
    drillMode.value = !!filterType;
    if (initialTab && pageStates[initialTab]) {
      pageStates[initialTab].currentPage = 1;
    }
    detailDrawerApi.open();
  },
  close: () => detailDrawerApi.close(),
});
</script>

<style scoped lang="scss">
.detail-container {
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}

.detail-card {
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 0 16px;
}

.detail-card-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  color: #303133;
  word-break: break-all;
}

/* 指标卡片区域 - 样式与 chart.vue 中的 stat-card 完全一致 */
.indicator-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.indicator-card {
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #f9fafb;
  transition: all 0.3s;
}

.indicator-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  font-size: 13px;
  color: #6e7e91;
  font-weight: 600;
}

.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.card-body {
  flex: 1;
  display: flex;
  align-items: center;
}

.card-value {
  font-size: 22px;
  font-weight: 700;
}

/* 服务状态占比卡片内部布局 */
.status-ratio-body {
  width: 100%;
  padding: 4px 0;
}

.status-ratio-content {
  width: 100%;
}

.status-ratio-bars {
  width: 100%;
}

.ratio-bar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ratio-label {
  width: 55px;
  font-size: 12px;
  color: #606266;
}

.ratio-percent {
  width: 36px;
  font-size: 12px;
  color: #606266;
  text-align: right;
}

:deep(.el-progress-bar__outer) {
  background-color: #edf2fc;
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
}

.detail-collapse {
  :deep(.el-collapse-item__header) {
    font-weight: 500;
    background-color: #f5f7fa;
  }
}
</style>
