<script setup>
import { computed, nextTick, reactive, ref, shallowRef } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import dayjs from 'dayjs';
import { getAssetInfoPage } from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/assetInfo';
import { getAssetStockPage } from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/stockMgmt';
import { getBikeChargeMonitorPage } from '#/api/genchuan/industry/chargePark/inspectOp/deviceMonitor/bikeChargeMonitor';
import { getCarChargeMonitorPage } from '#/api/genchuan/industry/chargePark/inspectOp/deviceMonitor/carChargeMonitor';
import { getOilMonitorPage } from '#/api/genchuan/industry/chargePark/inspectOp/deviceMonitor/oilMonitor';
import { getShareChargeMonitorPage } from '#/api/genchuan/industry/chargePark/inspectOp/deviceMonitor/shareChargeMonitor';
import { getSpaceMonitorPage } from '#/api/genchuan/industry/chargePark/inspectOp/deviceMonitor/spaceMonitor';
import { getInspectReportPage } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectReport';
import { getInspectTaskPage } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectTask';
import { getInspectUserPage } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectUser';

import {
  getAssetInfoStatusOptionValue,
  normalizeAssetInfoRow,
} from '../../../assetMgmt/assetInfo/table/data';
import {
  getAssetStockStatusOptionValue,
  normalizeAssetStockRow,
} from '../../../assetMgmt/stockMgmt/table/data';
import {
  getMonitorStatusValueByLabel as getBikeMonitorStatusByLabel,
  normalizeBikeChargeMonitorRow,
} from '../../../deviceMonitor/bikeChargeMonitor/table/data';
import {
  getMonitorStatusValueByLabel as getCarMonitorStatusByLabel,
  normalizeCarChargeMonitorRow,
} from '../../../deviceMonitor/carChargeMonitor/table/data';
import {
  getProcessStatusOptionValue,
  normalizeOilMonitorRow,
} from '../../../deviceMonitor/oilMonitor/table/data';
import {
  getMonitorStatusValueByLabel as getShareMonitorStatusByLabel,
  normalizeShareChargeMonitorRow,
} from '../../../deviceMonitor/shareChargeMonitor/table/data';
import {
  getMonitorStatusValueByLabel as getSpaceMonitorStatusByLabel,
  normalizeSpaceMonitorRow,
} from '../../../deviceMonitor/spaceMonitor/table/data';
import {
  buildTrendReportTimeRange,
  filterInspectReportRows,
  normalizeInspectReportRow,
} from '../../../inspectMgmt/inspectReport/table/data';
import {
  getTaskStatusOptionValue,
  normalizeInspectTaskRow,
} from '../../../inspectMgmt/inspectTask/table/data';
import {
  getOnlineStatusOptionValue,
  normalizeInspectUserRow,
} from '../../../inspectMgmt/inspectUser/table/data';
import { getStationIdByName } from '../table/data';
import CycleReportDrillGridPane from './CycleReportDrillGridPane.vue';
import {
  useDrillAssetInfoColumns,
  useDrillAssetStockColumns,
  useDrillBikeChargeMonitorColumns,
  useDrillCarChargeMonitorColumns,
  useDrillInspectReportColumns,
  useDrillInspectTaskColumns,
  useDrillInspectUserColumns,
  useDrillOilMonitorColumns,
  useDrillShareChargeMonitorColumns,
  useDrillSpaceMonitorColumns,
} from './drillDetailColumns.js';
import { unwrapPageResult } from './drillDetailHelpers.js';

import './drillDrawerCommonTabs.scss';

const emit = defineEmits(['close']);

const ctx = shallowRef({
  title: '钻取明细',
  layout: 'single',
  tabs: [],
});

const activeTab = ref('');
const drawerSession = ref(0);

const drawerTitle = computed(() => ctx.value.title || '钻取明细');

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  footer: false,
  /** 与营销 DrillDownDetailDialog 一致：非 modal，无整块遮罩，不挡住主页面操作 */
  modal: false,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  placement: 'right',
  title: drawerTitle,
  showCancelButton: false,
  showConfirmButton: false,
  /** 宽度约 75vw；限制高度不超出视口，与主内容区协调 */
  class:
    'cycle-report-drill-detail-drawer-panel w-[75vw] max-h-[calc(100vh-8px)] min-h-0',
  /** 默认内容区为可滚动，改为 flex 列布局以便内部表格撑满剩余高度 */
  contentClass:
    '!flex !min-h-0 !max-h-[calc(100vh-56px-24px)] !flex-1 !flex-col !overflow-hidden !p-0',
  onCancel() {
    drawerApi.close();
  },
  onClosed() {
    emit('close');
  },
});

const sharedQuery = reactive({
  stationId: '',
  stationName: '',
  monitorStatusLabel: '',
  trendTime: '',
  taskStatus: '',
  processStatus: '',
  onlineStatus: '',
  assetStatus: '',
  stockStatus: '',
  reportTimeRange: undefined,
  stationNameTaskFilter: '',
});

function resetSharedQuery() {
  sharedQuery.stationId = '';
  sharedQuery.stationName = '';
  sharedQuery.monitorStatusLabel = '';
  sharedQuery.trendTime = '';
  sharedQuery.taskStatus = '';
  sharedQuery.processStatus = '';
  sharedQuery.onlineStatus = '';
  sharedQuery.assetStatus = '';
  sharedQuery.stockStatus = '';
  sharedQuery.reportTimeRange = undefined;
  sharedQuery.stationNameTaskFilter = '';
}

function deviceFetchFactory(kind, query, stationNameParam) {
  const map = {
    space: {
      getPage: getSpaceMonitorPage,
      normalize: normalizeSpaceMonitorRow,
      statusByLabel: getSpaceMonitorStatusByLabel,
    },
    car: {
      getPage: getCarChargeMonitorPage,
      normalize: normalizeCarChargeMonitorRow,
      statusByLabel: getCarMonitorStatusByLabel,
    },
    bike: {
      getPage: getBikeChargeMonitorPage,
      normalize: normalizeBikeChargeMonitorRow,
      statusByLabel: getBikeMonitorStatusByLabel,
    },
    share: {
      getPage: getShareChargeMonitorPage,
      normalize: normalizeShareChargeMonitorRow,
      statusByLabel: getShareMonitorStatusByLabel,
    },
  };
  const m = map[kind];
  return async (page) => {
    const hasMonitorLabel =
      query.monitorStatusLabel !== undefined &&
      query.monitorStatusLabel !== null &&
      query.monitorStatusLabel !== '';
    const monitorStatus = hasMonitorLabel
      ? m.statusByLabel(query.monitorStatusLabel)
      : undefined;
    const hasExplicitStationName =
      stationNameParam !== undefined &&
      stationNameParam !== null &&
      String(stationNameParam).trim() !== '';
    const stationNameForApi = hasExplicitStationName
      ? String(stationNameParam).trim()
      : query.stationName || undefined;
    const params = {
      pageNo: page.pageNo,
      pageSize: page.pageSize,
      stationId: query.stationId || undefined,
      stationName: stationNameForApi || undefined,
      monitorStatus: monitorStatus ?? undefined,
      createTime: query.trendTime || undefined,
    };
    try {
      const raw = await m.getPage(params);
      const { list, total } = unwrapPageResult(raw);
      return {
        list: list.map((row) => m.normalize(row)),
        total,
      };
    } catch (error) {
      console.error(error);
      return { list: [], total: 0 };
    }
  };
}

function buildDeviceTabs(query, stationNameForDevice) {
  return [
    {
      key: 'space',
      label: '车位状态监测',
      useColumns: useDrillSpaceMonitorColumns,
      fetchPage: deviceFetchFactory('space', query, stationNameForDevice),
    },
    {
      key: 'car',
      label: '汽车充电监测',
      useColumns: useDrillCarChargeMonitorColumns,
      fetchPage: deviceFetchFactory('car', query, stationNameForDevice),
    },
    {
      key: 'bike',
      label: '两轮充电监测',
      useColumns: useDrillBikeChargeMonitorColumns,
      fetchPage: deviceFetchFactory('bike', query, stationNameForDevice),
    },
    {
      key: 'share',
      label: '共享充电监测',
      useColumns: useDrillShareChargeMonitorColumns,
      fetchPage: deviceFetchFactory('share', query, stationNameForDevice),
    },
  ];
}

function open(payload = {}) {
  resetSharedQuery();
  drawerSession.value += 1;

  const source = payload.source || 'card';
  const titleParts = ['周期报表钻取'];

  if (
    payload.activeReportCycle !== undefined &&
    payload.activeReportCycle !== ''
  ) {
    titleParts.push(String(payload.activeReportCycle));
  }

  let tabs = [];
  let layout = 'single';

  switch (source) {
    case 'bar': {
      const stationName = payload.stationName || '';
      const barKey = payload.barChartKey || '';
      sharedQuery.stationId = getStationIdByName(stationName) || '';
      sharedQuery.stationName = stationName;
      titleParts.push(stationName);

      if (
        barKey === 'station-abnormalDeviceNum' ||
        String(barKey).includes('abnormalDevice')
      ) {
        layout = 'tabs';
        sharedQuery.monitorStatusLabel = '异常';
        titleParts.push('异常设备');
        tabs = buildDeviceTabs(sharedQuery, stationName);
      } else if (
        barKey === 'station-taskTypeNum' ||
        String(barKey).includes('taskType')
      ) {
        sharedQuery.stationNameTaskFilter = stationName;
        titleParts.push('巡检任务');
        tabs = [
          {
            key: 'task',
            label: '巡检任务',
            useColumns: useDrillInspectTaskColumns,
            fetchPage: async (page) => {
              try {
                const raw = await getInspectTaskPage({
                  pageNo: page.pageNo,
                  pageSize: page.pageSize,
                });
                let { list, total } = unwrapPageResult(raw);
                list = list.map((r) => normalizeInspectTaskRow(r));
                console.log(list);
                // if (sharedQuery.stationNameTaskFilter) {
                //   const sn = String(sharedQuery.stationNameTaskFilter);
                //   list = list.filter((row) =>
                //     String(row.planName || '').includes(sn),
                //   );
                // }
                return {
                  list,
                  total: sharedQuery.stationNameTaskFilter
                    ? list.length
                    : total,
                };
              } catch (error) {
                console.error(error);
                return { list: [], total: 0 };
              }
            },
          },
        ];
      } else if (
        barKey === 'station-oilOccupyNum' ||
        String(barKey).includes('oilOccupy')
      ) {
        titleParts.push('油车占位');
        tabs = [
          {
            key: 'oil',
            label: '油车占位监测',
            useColumns: useDrillOilMonitorColumns,
            fetchPage: async (page) => {
              try {
                const raw = await getOilMonitorPage({
                  pageNo: page.pageNo,
                  pageSize: page.pageSize,
                  stationName: sharedQuery.stationName || undefined,
                });
                const { list, total } = unwrapPageResult(raw);
                return {
                  list: list.map((r) => normalizeOilMonitorRow(r)),
                  total,
                };
              } catch (error) {
                console.error(error);
                return { list: [], total: 0 };
              }
            },
          },
        ];
      }

      break;
    }
    case 'card': {
      const key = payload.cardKey;
      switch (key) {
        case 'assetNormal': {
          sharedQuery.assetStatus = getAssetInfoStatusOptionValue('正常');
          titleParts.push('资产信息（正常）');
          tabs = [
            {
              key: 'asset',
              label: '资产信息',
              useColumns: useDrillAssetInfoColumns,
              fetchPage: async (page) => {
                try {
                  const raw = await getAssetInfoPage({
                    pageNo: page.pageNo,
                    pageSize: page.pageSize,
                    status: sharedQuery.assetStatus,
                  });
                  const { list, total } = unwrapPageResult(raw);
                  return {
                    list: list.map((r) => normalizeAssetInfoRow(r)),
                    total,
                  };
                } catch (error) {
                  console.error(error);
                  return { list: [], total: 0 };
                }
              },
            },
          ];

          break;
        }
        case 'deviceAbnormal':
        case 'deviceNormal': {
          layout = 'tabs';
          sharedQuery.monitorStatusLabel =
            key === 'deviceNormal' ? '正常' : '异常';
          titleParts.push(key === 'deviceNormal' ? '正常设备' : '异常设备');
          tabs = buildDeviceTabs(sharedQuery);

          break;
        }
        case 'inspectTask': {
          sharedQuery.taskStatus = getTaskStatusOptionValue('处理中');
          titleParts.push('巡检任务（待处理）');
          tabs = [
            {
              key: 'task',
              label: '巡检任务',
              useColumns: useDrillInspectTaskColumns,
              fetchPage: async (page) => {
                try {
                  const raw = await getInspectTaskPage({
                    pageNo: page.pageNo,
                    pageSize: page.pageSize,
                    status: sharedQuery.taskStatus,
                  });
                  const { list, total } = unwrapPageResult(raw);
                  return {
                    list: list.map((r) => normalizeInspectTaskRow(r)),
                    total,
                  };
                } catch (error) {
                  console.error(error);
                  return { list: [], total: 0 };
                }
              },
            },
          ];

          break;
        }
        case 'inspectUserOnline': {
          sharedQuery.onlineStatus = getOnlineStatusOptionValue('在线');
          titleParts.push('巡检人员（在线）');
          tabs = [
            {
              key: 'user',
              label: '巡检人员',
              useColumns: useDrillInspectUserColumns,
              fetchPage: async (page) => {
                try {
                  const raw = await getInspectUserPage({
                    pageNo: page.pageNo,
                    pageSize: page.pageSize,
                    onlineStatus: sharedQuery.onlineStatus,
                  });
                  const pageResult = raw?.list ? raw : raw?.data || raw;
                  const list = Array.isArray(pageResult?.list)
                    ? pageResult.list
                    : [];
                  const total = pageResult?.total ?? list.length;
                  return {
                    list: list.map((r) => normalizeInspectUserRow(r)),
                    total,
                  };
                } catch (error) {
                  console.error(error);
                  return { list: [], total: 0 };
                }
              },
            },
          ];

          break;
        }
        case 'oilHandleComplete': {
          sharedQuery.processStatus = getProcessStatusOptionValue('已关闭');
          titleParts.push('油车占位（已关闭）');
          tabs = [
            {
              key: 'oil',
              label: '油车占位监测',
              useColumns: useDrillOilMonitorColumns,
              fetchPage: async (page) => {
                try {
                  const raw = await getOilMonitorPage({
                    pageNo: page.pageNo,
                    pageSize: page.pageSize,
                    processStatus: sharedQuery.processStatus,
                  });
                  const { list, total } = unwrapPageResult(raw);
                  return {
                    list: list.map((r) => normalizeOilMonitorRow(r)),
                    total,
                  };
                } catch (error) {
                  console.error(error);
                  return { list: [], total: 0 };
                }
              },
            },
          ];

          break;
        }
        case 'oilWaitHandle': {
          sharedQuery.processStatus = getProcessStatusOptionValue('未处理');
          titleParts.push('油车占位（待处置）');
          tabs = [
            {
              key: 'oil',
              label: '油车占位监测',
              useColumns: useDrillOilMonitorColumns,
              fetchPage: async (page) => {
                try {
                  const raw = await getOilMonitorPage({
                    pageNo: page.pageNo,
                    pageSize: page.pageSize,
                    processStatus: sharedQuery.processStatus,
                  });
                  const { list, total } = unwrapPageResult(raw);
                  return {
                    list: list.map((r) => normalizeOilMonitorRow(r)),
                    total,
                  };
                } catch (error) {
                  console.error(error);
                  return { list: [], total: 0 };
                }
              },
            },
          ];

          break;
        }
        case 'stockWarn': {
          sharedQuery.stockStatus = getAssetStockStatusOptionValue('预警库存');
          titleParts.push('库存管理（预警）');
          tabs = [
            {
              key: 'stock',
              label: '库存管理',
              useColumns: useDrillAssetStockColumns,
              fetchPage: async (page) => {
                try {
                  const raw = await getAssetStockPage({
                    pageNo: page.pageNo,
                    pageSize: page.pageSize,
                    status: sharedQuery.stockStatus,
                  });
                  const { list, total } = unwrapPageResult(raw);
                  return {
                    list: list.map((r) => normalizeAssetStockRow(r)),
                    total,
                  };
                } catch (error) {
                  console.error(error);
                  return { list: [], total: 0 };
                }
              },
            },
          ];

          break;
        }
        case 'taskComplete': {
          sharedQuery.taskStatus = getTaskStatusOptionValue('已完成');
          titleParts.push('巡检任务（已完成）');
          tabs = [
            {
              key: 'task',
              label: '巡检任务',
              useColumns: useDrillInspectTaskColumns,
              fetchPage: async (page) => {
                try {
                  const raw = await getInspectTaskPage({
                    pageNo: page.pageNo,
                    pageSize: page.pageSize,
                    status: sharedQuery.taskStatus,
                  });
                  const { list, total } = unwrapPageResult(raw);
                  return {
                    list: list.map((r) => normalizeInspectTaskRow(r)),
                    total,
                  };
                } catch (error) {
                  console.error(error);
                  return { list: [], total: 0 };
                }
              },
            },
          ];

          break;
        }
        // No default
      }

      break;
    }
    case 'line': {
      const trendDate = payload.trendDate || '';
      const lineKey = payload.lineChartKey || '';
      sharedQuery.trendTime = trendDate;
      titleParts.push(trendDate);

      if (
        lineKey === 'date-deviceUpdateNum' ||
        String(lineKey).includes('deviceUpdate')
      ) {
        layout = 'tabs';
        sharedQuery.monitorStatusLabel = '';
        titleParts.push('设备监测');
        tabs = buildDeviceTabs(sharedQuery);
      } else if (
        lineKey === 'date-taskHandleTime' ||
        String(lineKey).includes('taskHandle')
      ) {
        titleParts.push('巡检任务');
        tabs = [
          {
            key: 'task',
            label: '巡检任务',
            useColumns: useDrillInspectTaskColumns,
            fetchPage: async (page) => {
              try {
                const raw = await getInspectTaskPage({
                  pageNo: page.pageNo,
                  pageSize: page.pageSize,
                  createTime: sharedQuery.trendTime,
                });
                const { list, total } = unwrapPageResult(raw);
                return {
                  list: list.map((r) => normalizeInspectTaskRow(r)),
                  total,
                };
              } catch (error) {
                console.error(error);
                return { list: [], total: 0 };
              }
            },
          },
        ];
      } else if (
        lineKey === 'date-reportNum' ||
        String(lineKey).includes('reportNum')
      ) {
        sharedQuery.reportTimeRange = buildTrendReportTimeRange(trendDate);
        titleParts.push('巡检上报');
        tabs = [
          {
            key: 'report',
            label: '巡检上报',
            useColumns: useDrillInspectReportColumns,
            fetchPage: async (page) => {
              console.log(11, sharedQuery.reportTimeRange);
              try {
                const raw = await getInspectReportPage({
                  pageNo: page.pageNo,
                  pageSize: page.pageSize,
                  reportTime: dayjs(sharedQuery.reportTimeRange?.[0]).format('YYYY-MM-DD'),
                });
                const pageResult = raw?.list ? raw : raw?.data || raw;
                let list = Array.isArray(pageResult?.list)
                  ? pageResult.list
                  : [];
                list = list.map((r) => normalizeInspectReportRow(r));
                if (sharedQuery.trendTime) {
                  list = filterInspectReportRows(list, {
                    trendTime: sharedQuery.trendTime,
                  });
                }
                const total = sharedQuery.trendTime
                  ? list.length
                  : (pageResult?.total ?? list.length);
                return { list, total };
              } catch (error) {
                console.error(error);
                return { list: [], total: 0 };
              }
            },
          },
        ];
      }

      break;
    }
    // No default
  }

  if (tabs.length === 0) {
    tabs = [
      {
        key: 'empty',
        label: '暂无数据',
        useColumns: () => [{ field: 'tip', title: '提示', minWidth: 200 }],
        fetchPage: async () => ({
          list: [{ id: '1', tip: '未匹配到钻取场景' }],
          total: 1,
        }),
      },
    ];
  }

  ctx.value = {
    title: titleParts.filter(Boolean).join(' · '),
    layout,
    tabs,
  };
  activeTab.value = tabs[0]?.key || '';

  drawerApi.open();
  nextTick(() => {
    drawerApi.setState?.({ title: ctx.value.title });
  });
}

function close() {
  drawerApi.close();
}

defineExpose({ open, close });
</script>

<template>
  <Drawer>
    <div
      class="cycle-report-drill-drawer-scope drawer-body-bounded drill-detail-drawer-scroll"
    >
      <div class="drill-detail-wrapper">
        <div class="drill-detail-drawer-body">
          <template v-if="ctx.layout === 'tabs' && ctx.tabs.length > 1">
            <el-tabs v-model="activeTab" type="card" class="common-tabs">
              <el-tab-pane
                v-for="tab in ctx.tabs"
                :key="`${drawerSession}-${tab.key}`"
                :label="tab.label"
                :name="tab.key"
                lazy
              >
                <div class="drill-tab-pane-grid">
                  <CycleReportDrillGridPane
                    :pane-key="`${drawerSession}-${tab.key}`"
                    :use-columns="tab.useColumns"
                    :fetch-page="tab.fetchPage"
                  />
                </div>
              </el-tab-pane>
            </el-tabs>
          </template>
          <template v-else>
            <div class="drill-tab-pane-grid drill-tab-pane-grid--single">
              <CycleReportDrillGridPane
                v-if="ctx.tabs[0]"
                :pane-key="`${drawerSession}-${ctx.tabs[0].key}`"
                :use-columns="ctx.tabs[0].useColumns"
                :fetch-page="ctx.tabs[0].fetchPage"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<style scoped>
.drawer-body-bounded {
  box-sizing: border-box;
  flex: 1;
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
}

.drill-detail-drawer-scroll {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.drill-detail-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  width: 100%;
}

.drill-detail-drawer-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 8px 12px 12px;
}

.drill-tab-pane-grid {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.drill-tab-pane-grid--single {
  flex: 1;
  min-height: 0;
}

.drill-tab-pane-grid :deep(.cycle-report-drill-grid-pane) {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.drill-tab-pane-grid :deep(.vxe-grid) {
  flex: 1;
  min-height: 0;
}

.drill-tab-pane-grid :deep(.vxe-table) {
  flex: 1;
  min-height: 0;
}
</style>
