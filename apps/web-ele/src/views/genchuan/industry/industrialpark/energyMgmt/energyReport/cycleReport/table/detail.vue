<!-- detail.vue - 能耗明细抽屉组件 -->
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

import {
  getEnergyCollectDetail,
  getAreaMonitorDetail,
  getStrategyDetailPage,
  getEnergyAlarmDetail,
  getDeviceControlDetail
} from '#/api/genchuan/industry/industrialpark/energyMgmt/energyReport/cycleReport/index.js';

const props = defineProps({
  detailData: { type: Object, default: null },
});
const { detailData } = toRefs(props);

const activeTab = ref('totalEnergy');
const drillMode = ref(false);
const currentSection = computed(() =>
  detailSections.find((s) => s.name === activeTab.value),
);

// 能耗明细配置
const detailSections = [
  {
    name: 'totalEnergy',
    title: '能耗明细',
    dataKey: 'energyCollectList',
    columns: [
      { prop: 'collectTime', label: '采集时间' },
      { prop: 'energyValue', label: '能耗值(kWh)' },
      { prop: 'deviceName', label: '设备名称' },
      { prop: 'areaName', label: '区域名称' },
    ],
    api: getEnergyCollectDetail
  },
  {
    name: 'unitEnergy',
    title: '单位能耗明细',
    dataKey: 'areaMonitorList',
    columns: [
      { prop: 'areaName', label: '区域名称' },
      { prop: 'unitEnergy', label: '单位能耗(kWh/㎡)' },
      { prop: 'areaArea', label: '面积(㎡)' },
      { prop: 'totalEnergy', label: '总能耗(kWh)' },
    ],
    api: getAreaMonitorDetail
  },
  {
    name: 'saveEnergy',
    title: '节能明细',
    dataKey: 'strategyList',
    columns: [
      { prop: 'strategyName', label: '策略名称' },
      { prop: 'saveEnergy', label: '节能量(kWh)' },
      { prop: 'executeTime', label: '执行时间' },
      { prop: 'deviceName', label: '设备名称' },
    ],
    api: getStrategyDetailPage
  },
  {
    name: 'alarm',
    title: '预警明细',
    dataKey: 'alarmList',
    columns: [
      { prop: 'alarmType', label: '预警类型' },
      { prop: 'alarmContent', label: '预警内容' },
      { prop: 'createTime', label: '预警时间' },
      { prop: 'handleStatus', label: '处理状态' },
    ],
    api: getEnergyAlarmDetail
  },
  {
    name: 'controlDevice',
    title: '管控设备明细',
    dataKey: 'deviceControlList',
    columns: [
      { prop: 'deviceName', label: '设备名称' },
      { prop: 'deviceType', label: '设备类型' },
      { prop: 'status', label: '管控状态' },
      { prop: 'bindTime', label: '绑定时间' },
    ],
    api: getDeviceControlDetail
  },
];

// 分页状态
const pageStates = reactive({});
detailSections.forEach((s) => {
  pageStates[s.name] = { currentPage: 1, pageSize: 10, total: 0, list: [] };
});

const typeFilter = ref(null);

const getRawData = async (section) => {
  if (!detailData.value?.id) return [];
  try {
    const res = await section.api({
      reportId: detailData.value.id,
      pageNo: pageStates[section.name].currentPage,
      pageSize: pageStates[section.name].pageSize,
      ...(typeFilter.value ? { filterType: typeFilter.value.type } : {})
    });
    const data = res.data || res;
    pageStates[section.name].list = data.list || [];
    pageStates[section.name].total = data.total || 0;
    return pageStates[section.name].list;
  } catch {
    return [];
  }
};

const getFilteredData = (name, section) => pageStates[name]?.list || [];
const getTotal = (name) => pageStates[name]?.total || 0;
const getPagedData = (name, section) => pageStates[name]?.list || [];

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  class: 'w-[75vw]',
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({
  open: async (initialTab, filterType) => {
    if (initialTab) activeTab.value = initialTab;
    typeFilter.value = filterType
      ? { dimension: initialTab, type: filterType }
      : null;
    drillMode.value = !!initialTab;
    if (initialTab && pageStates[initialTab]) {
      pageStates[initialTab].currentPage = 1;
      const section = detailSections.find(s => s.name === initialTab);
      if (section) await getRawData(section);
    }
    detailDrawerApi.open();
  },
  close: () => detailDrawerApi.close(),
});

// 监听标签切换，加载数据
const onTabChange = async (tabName) => {
  const section = detailSections.find(s => s.name === tabName);
  if (section) {
    await getRawData(section);
  }
};
</script>

<template>
  <DetailDrawer
    :title="
      drillMode
        ? currentSection?.title || '明细'
        : `能耗周期报表详情 (ID: ${detailData?.id || ''})`
    "
  >
    <div v-if="drillMode" class="detail-container">
      <ElTable
        :data="getPagedData(activeTab, currentSection)"
        size="small"
        border
      >
        <ElTableColumn
          v-for="col in currentSection?.columns || []"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
        />
      </ElTable>
      <ElPagination
        v-if="getTotal(activeTab) > 0"
        v-model:current-page="pageStates[activeTab].currentPage"
        v-model:page-size="pageStates[activeTab].pageSize"
        :total="getTotal(activeTab)"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        small
        background
        style="justify-content: flex-end; margin-top: 12px"
        @current-change="() => getRawData(currentSection)"
        @size-change="() => getRawData(currentSection)"
      />
    </div>
    <div v-else-if="detailData" class="detail-container">
      <ElTabs v-model="activeTab" type="card" class="detail-tabs" @tab-change="onTabChange">
        <ElTabPane
          v-for="s in detailSections"
          :key="s.name"
          :name="s.name"
          :label="`${s.title}（${getTotal(s.name)}）`"
        >
          <ElTable :data="getPagedData(s.name, s)" size="small" border>
            <ElTableColumn
              v-for="col in s.columns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
            />
          </ElTable>
          <ElPagination
            v-if="getTotal(s.name) > 0"
            v-model:current-page="pageStates[s.name].currentPage"
            v-model:page-size="pageStates[s.name].pageSize"
            :total="getTotal(s.name)"
            :page-sizes="[5, 10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            small
            background
            style="justify-content: flex-end; margin-top: 12px"
            @current-change="() => getRawData(s)"
            @size-change="() => getRawData(s)"
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
</style>
