<script setup>
import { computed, onMounted, reactive, ref, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  ElEmpty,
  ElPagination,
  ElTable,
  ElTableColumn,
  ElTabPane,
  ElTabs,
} from 'element-plus';

import { getSpacePushPage } from '#/api/genchuan/industry/chargePark/carService/carGuide/spacePush/index.js';

const props = defineProps({
  detailData: { type: Object, default: null },
});
const { detailData } = toRefs(props);

const activeTab = ref('rescue');
const drillMode = ref(false); // 下钻模式：只展示对应维度的过滤列表，隐藏其他 UI
const currentSection = computed(() =>
  detailSections.find((s) => s.name === activeTab.value),
);

// 6 个明细 section 配置
const detailSections = [
  {
    name: 'rescue',
    title: '救援明细',
    dataKey: 'rescueDetail',
    columns: [
      { prop: 'userId', label: '用户ID' },
      { prop: 'rescueType', label: '救援类型' },
      { prop: 'status', label: '状态' },
      { prop: 'createTime', label: '发起时间' },
    ],
  },
  {
    name: 'reserve',
    title: '预约明细',
    dataKey: 'reserveDetail',
    columns: [
      { prop: 'userId', label: '用户ID' },
      { prop: 'reserveType', label: '预约类型' },
      { prop: 'status', label: '状态' },
      { prop: 'createTime', label: '预约时间' },
    ],
  },
  {
    name: 'complaint',
    title: '投诉明细',
    dataKey: 'complaintDetail',
    columns: [
      { prop: 'userId', label: '用户ID' },
      {
        prop: 'complaintType',
        label: '投诉类型',
        formatter: (row) => {
          if (row.complaintType) return row.complaintType;
          if (row.merchantId !== null) return '商户纠纷';
          if (row.orderId !== null) return '订单申诉';
          return '用户建议';
        },
      },
      { prop: 'status', label: '处理状态' },
      { prop: 'createTime', label: '投诉时间' },
    ],
  },
  {
    name: 'findCar',
    title: '寻车明细',
    dataKey: 'findCarDetail',
    columns: [
      { prop: 'userId', label: '用户ID' },
      { prop: 'plateNo', label: '车牌号' },
      { prop: 'locationResult', label: '定位结果' },
      { prop: 'createTime', label: '查询时间' },
    ],
  },
  {
    name: 'spacePush',
    title: '空位推送明细',
    dataKey: 'spacePushDetail',
    columns: [
      { prop: 'userId', label: '用户ID' },
      {
        prop: 'stationName',
        label: '场站名称',
        formatter: (row) => getStationName(row),
      },
      { prop: 'pushResult', label: '推送结果' },
      { prop: 'createTime', label: '推送时间' },
    ],
  },
  {
    name: 'wording',
    title: '话术明细',
    dataKey: 'wordingDetail',
    columns: [
      { prop: 'name', label: '话术名称' },
      { prop: 'type', label: '话术类型' },
      { prop: 'status', label: '状态' },
      { prop: 'createTime', label: '生效时间' },
    ],
  },
  {
    name: 'chargeParkMap',
    title: '充停地图查询',
    dataKey: 'chargeParkMapDetail',
    columns: [
      { prop: 'userId', label: '用户ID' },
      { prop: 'queryLocationName', label: '查询位置' },
      { prop: 'resultCount', label: '结果数' },
      { prop: 'queryTime', label: '查询时间' },
    ],
  },
  {
    name: 'nearStation',
    title: '周边场站查询',
    dataKey: 'nearStationDetail',
    columns: [
      { prop: 'userId', label: '用户ID' },
      { prop: 'queryLocationName', label: '查询位置' },
      { prop: 'stationCount', label: '场站数' },
      { prop: 'emptyStationCount', label: '空闲数' },
      { prop: 'queryTime', label: '查询时间' },
    ],
  },
  {
    name: 'pathPlan',
    title: '路径规划',
    dataKey: 'pathPlanDetail',
    columns: [
      { prop: 'userId', label: '用户ID' },
      { prop: 'startLocationName', label: '起点' },
      { prop: 'endLocationName', label: '终点' },
      { prop: 'pathLength', label: '距离(米)' },
      { prop: 'planTime', label: '规划时间' },
    ],
  },
];

// 每节独立分页状态
const pageStates = reactive({});
detailSections.forEach((s) => {
  pageStates[s.name] = { currentPage: 1, pageSize: 10 };
});

// 类型过滤：图表点击柱子/饼图扇区时设置，只展示对应类型的记录
const typeFilter = ref(null); // { dimension, type }
const matchType = (name, row) => {
  if (!typeFilter.value || typeFilter.value.dimension !== name) return true;
  const t = typeFilter.value.type;
  switch (name) {
    case 'complaint': {
      // 纠纷调解状态过滤:row.status 是 disputeMediate 的状态(已完成/调解中等)
      if (row.merchantId !== null && row.status === t) return true;
      let rowType = row.complaintType;
      if (!rowType) {
        if (row.merchantId !== null) rowType = '商户纠纷';
        else if (row.orderId === null) {
          rowType = '用户建议';
        } else {
          rowType = '订单申诉';
        }
      }
      return rowType === t;
    }
    case 'findCar': {
      return row.locationResult === t;
    }
    case 'rescue': {
      return row.rescueType === t;
    }
    case 'reserve': {
      return row.reserveType === t;
    }
    case 'spacePush': {
      return row.pushResult === t;
    }
    case 'wording': {
      return row.type === t;
    }
    default: {
      return true;
    }
  }
};
const getRawData = (dataKey) => detailData.value?.detailData?.[dataKey] || [];
const getFilteredData = (name, dataKey) =>
  getRawData(dataKey).filter((row) => matchType(name, row));
const getTotal = (name, dataKey) => getFilteredData(name, dataKey).length;
const getPagedData = (name, dataKey) => {
  const all = getFilteredData(name, dataKey);
  const { currentPage, pageSize } = pageStates[name];
  const start = (currentPage - 1) * pageSize;
  return all.slice(start, start + pageSize);
};

// 场站 id→name 映射：从 /space-push/page 的响应里收集（该接口后端已注入 stationName）
// 失败时不阻塞主数据，仅退化为"场站{id}"格式
const stationNameMap = ref({});
const getStationName = (row) => {
  if (row.stationName) return row.stationName;
  const id = row.stationId;
  if (id === null || id === undefined) return '-';
  return (
    stationNameMap.value[id] || stationNameMap.value[String(id)] || `场站${id}`
  );
};
onMounted(async () => {
  try {
    const res = await getSpacePushPage({ pageNo: 1, pageSize: 200 });
    const list = res?.list || [];
    const newMap = {};
    list.forEach((item) => {
      if (
        item.stationId !== null &&
        item.stationId !== undefined &&
        item.stationName
      ) {
        newMap[item.stationId] = item.stationName;
        newMap[String(item.stationId)] = item.stationName;
      }
    });
    stationNameMap.value = newMap;
  } catch (error) {
    console.warn('[加载场站名失败]', error);
  }
});
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  class: 'w-[75vw]',
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({
  open: (initialTab, filterType) => {
    if (initialTab) activeTab.value = initialTab;
    typeFilter.value = filterType
      ? { dimension: initialTab, type: filterType }
      : null;
    // 传了 initialTab(维度) 进入下钻模式：只展示该维度的列表（卡片/图表点击）
    // 不传 initialTab(列表行 查看) 进入正常模式：展示完整详情
    drillMode.value = !!initialTab;
    if (initialTab && pageStates[initialTab]) {
      pageStates[initialTab].currentPage = 1;
    }
    detailDrawerApi.open();
  },
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer
    :title="
      drillMode
        ? currentSection?.title || '明细'
        : `周期报表详情 (ID: ${detailData?.id || ''})`
    "
  >
    <!-- 下钻模式：只展示对应维度的过滤列表 -->
    <div v-if="drillMode" class="detail-container">
      <ElTable
        :data="getPagedData(activeTab, currentSection?.dataKey)"
        size="small"
        border
      >
        <ElTableColumn
          v-for="col in currentSection?.columns || []"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
        />
      </ElTable>
      <ElPagination
        v-if="getTotal(activeTab, currentSection?.dataKey) > 0"
        v-model:current-page="pageStates[activeTab].currentPage"
        v-model:page-size="pageStates[activeTab].pageSize"
        :total="getTotal(activeTab, currentSection?.dataKey)"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        small
        background
        style="justify-content: flex-end; margin-top: 12px"
      />
    </div>
    <!-- 正常模式：完整详情（仅展示各维度明细 Tab） -->
    <div v-else-if="detailData" class="detail-container">
      <!-- 各维度明细 Tabs（一行标签，切换展示对应明细）-->
      <ElTabs v-model="activeTab" type="card" class="detail-tabs">
        <ElTabPane
          v-for="s in detailSections"
          :key="s.name"
          :name="s.name"
          :label="`${s.title}（${getTotal(s.name, s.dataKey)}）`"
        >
          <ElTable :data="getPagedData(s.name, s.dataKey)" size="small" border>
            <ElTableColumn
              v-for="col in s.columns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              :formatter="col.formatter"
            />
          </ElTable>
          <ElPagination
            v-if="getTotal(s.name, s.dataKey) > 0"
            v-model:current-page="pageStates[s.name].currentPage"
            v-model:page-size="pageStates[s.name].pageSize"
            :total="getTotal(s.name, s.dataKey)"
            :page-sizes="[5, 10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            small
            background
            style="justify-content: flex-end; margin-top: 12px"
          />
        </ElTabPane>
      </ElTabs>
    </div>
    <ElEmpty v-else-if="!drillMode" description="暂无数据" />
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-container {
  max-height: 80vh;
  padding: 20px;
  overflow-y: auto;

  :deep(.el-table th.el-table__cell > .cell),
  :deep(.el-table td.el-table__cell > .cell) {
    text-align: center;
  }
}

.detail-card {
  padding: 0 16px;
  margin-bottom: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
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
  flex-shrink: 0;
  width: 120px;
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
  background: #f9fafb;
  border-left: 4px solid #4a90e2;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s;
}

.indicator-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #6e7e91;
}

.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex: 1;
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
  gap: 8px;
  align-items: center;
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
