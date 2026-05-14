<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { nextTick, reactive } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { UserCreditApi } from '#/api/genchuan/industry/chargePark/userMerchant/creditMgmt/userCredit';
import { UserOpReportApi } from '#/api/genchuan/industry/chargePark/userMerchant/decisionAnalysis/userOpReport';
import { getUserPage as getMemberUserPage } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import { UserInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userInfo';

type DrillInfo = {
  drillName?: string;
  drillType: string;
  drillValue?: number | string;
};

const emit = defineEmits(['close']);

const drillInfo = reactive<DrillInfo>({
  drillName: '',
  drillType: '',
  drillValue: '',
});

const dataObj = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

const titleMap: Record<string, string> = {
  avgCreditScore: '平均信用分明细',
  reportStatus: '报表状态明细',
  reportTimeScale: '时间尺度明细',
  reportType: '报表类型明细',
  statTime: '统计时间明细',
  totalMemberCount: '会员用户明细',
  totalUserCount: '用户总数明细',
  userGrowthRate: '用户增长明细',
  userOpTrend: '用户趋势明细',
  userTypeDistribution: '用户类型明细',
};

const reportDrillTypes = new Set([
  'reportStatus',
  'reportTimeScale',
  'reportType',
  'statTime',
]);

const reportColumns: VxeTableGridOptions['columns'] = [
  { type: 'seq', title: '序号', width: 60 },
  { field: 'reportType', title: '报表类型', minWidth: 120 },
  { field: 'timeScale', title: '时间尺度', minWidth: 100 },
  { field: 'statTime', title: '统计时间', minWidth: 220 },
  { field: 'createTime', title: '生成时间', minWidth: 170 },
  {
    field: 'status',
    title: '报表状态',
    minWidth: 100,
    slots: { default: 'status' },
  },
  { field: 'creator', title: '创建者', minWidth: 100 },
  { field: 'filterCondition', title: '筛选条件', minWidth: 220 },
];

const userColumns: VxeTableGridOptions['columns'] = [
  { type: 'seq', title: '序号', width: 60 },
  { field: 'nickname', title: '用户昵称', minWidth: 140 },
  { field: 'phone', title: '手机号', minWidth: 140 },
  { field: 'userType', title: '用户类型', minWidth: 120 },
  {
    field: 'status',
    title: '用户状态',
    minWidth: 100,
    slots: { default: 'status' },
  },
  { field: 'registerTime', title: '注册时间', minWidth: 170 },
  { field: 'loginTime', title: '最后登录时间', minWidth: 170 },
  { field: 'walletBalance', title: '钱包余额', minWidth: 110 },
  { field: 'carCount', title: '绑定车辆数', minWidth: 110 },
];

const memberColumns: VxeTableGridOptions['columns'] = [
  { type: 'seq', title: '序号', width: 60 },
  { field: 'nickname', title: '会员昵称', minWidth: 140 },
  { field: 'mobile', title: '手机号', minWidth: 140 },
  { field: 'levelName', title: '会员等级', minWidth: 120 },
  { field: 'point', title: '当前积分', minWidth: 100 },
  { field: 'totalPoint', title: '累计积分', minWidth: 100 },
  {
    field: 'status',
    title: '状态',
    minWidth: 100,
    slots: { default: 'status' },
  },
  { field: 'createTime', title: '注册时间', minWidth: 170 },
];

const creditColumns: VxeTableGridOptions['columns'] = [
  { type: 'seq', title: '序号', width: 60 },
  { field: 'userName', title: '用户名称', minWidth: 140 },
  { field: 'phone', title: '手机号', minWidth: 140 },
  { field: 'userType', title: '用户类型', minWidth: 120 },
  { field: 'creditScore', title: '信用分', minWidth: 100 },
  { field: 'creditLevel', title: '信用等级', minWidth: 120 },
  { field: 'ruleDesc', title: '触发规则', minWidth: 180 },
  { field: 'updateTime', title: '更新时间', minWidth: 170 },
];

function getDrawerTitle() {
  const title = titleMap[drillInfo.drillType] || '钻取明细';
  return drillInfo.drillName ? `${title} - ${drillInfo.drillName}` : title;
}

function getGridColumns() {
  if (drillInfo.drillType === 'totalMemberCount') {
    return memberColumns;
  }
  if (drillInfo.drillType === 'avgCreditScore') {
    return creditColumns;
  }
  if (reportDrillTypes.has(drillInfo.drillType)) {
    return reportColumns;
  }
  return userColumns;
}

function buildReportParams(page: { currentPage: number; pageSize: number }) {
  const params: Record<string, any> = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };

  if (drillInfo.drillType === 'reportType') {
    params.reportCycle = drillInfo.drillValue;
  }
  if (drillInfo.drillType === 'reportTimeScale') {
    params.timeScale = drillInfo.drillValue;
  }
  if (drillInfo.drillType === 'reportStatus') {
    params.reportStatus = drillInfo.drillValue;
  }
  if (drillInfo.drillType === 'statTime') {
    params.statTime = drillInfo.drillValue;
  }

  return params;
}

function buildUserParams(page: { currentPage: number; pageSize: number }) {
  const params: Record<string, any> = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };

  if (drillInfo.drillType === 'userTypeDistribution') {
    params.userType = drillInfo.drillName || drillInfo.drillValue;
  }
  if (drillInfo.drillType === 'userOpTrend' && drillInfo.drillName) {
    params.registerTime = `${drillInfo.drillName} 00:00:00,${drillInfo.drillName} 23:59:59`;
  }

  return params;
}

async function getDrillDownData({
  page,
}: {
  page: { currentPage: number; pageSize: number };
}) {
  if (drillInfo.drillType === 'totalMemberCount') {
    return await getMemberUserPage({
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    });
  }

  if (drillInfo.drillType === 'avgCreditScore') {
    return await UserCreditApi.getUserCreditPage({
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    });
  }

  if (reportDrillTypes.has(drillInfo.drillType)) {
    return await UserOpReportApi.getUserOpReportPage(buildReportParams(page));
  }

  return await UserInfoApi.getUserInfoPage(buildUserParams(page));
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getGridColumns(),
    height: 'auto',
    keepSource: true,
    layouts: [['Top', 'Table', 'Bottom', 'Pager']],
    pagerConfig: dataObj,
    proxyConfig: {
      ajax: {
        query: getDrillDownData,
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: false,
  },
  showSearchForm: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  class: 'w-[72vw]',
  footer: false,
  mask: false,
  modal: false,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  onCancel() {
    close();
  },
});

async function open(info: DrillInfo) {
  drillInfo.drillType = info.drillType || '';
  drillInfo.drillValue = info.drillValue ?? '';
  drillInfo.drillName = info.drillName || String(info.drillValue || '');

  drawerApi.setState({
    title: getDrawerTitle(),
  });

  await nextTick();
  gridApi.setGridOptions({ columns: getGridColumns() });
  drawerApi.open();
  await nextTick();
  await gridApi.reload();
}

function close() {
  drawerApi.close();
  emit('close');
}

defineExpose({
  close,
  open,
});
</script>

<template>
  <Drawer>
    <div class="user-op-drill-dialog">
      <Grid>
        <template #status="{ row }">
          <ElTag
            :type="
              ['正常', '已生成', 1, '1', true].includes(row.status)
                ? 'success'
                : 'warning'
            "
          >
            {{ row.status }}
          </ElTag>
        </template>
      </Grid>
    </div>
  </Drawer>
</template>

<style scoped lang="scss">
:deep(.vxe-pager--wrapper) {
  justify-content: center;
}

:deep(.vxe-grid--pager-wrapper .vxe-pager) {
  position: relative;
  height: 65px;
  margin-top: 0;
}

:deep(.user-merchant-table-grid .vxe-grid--toolbar-wrapper) {
  margin-top: 0;
}

:deep(.user-merchant-table-grid .vxe-toolbar) {
  display: flex;
  align-items: center;
}

:deep(.user-merchant-table-grid .vxe-buttons--wrapper) {
  flex: 1;
  min-width: 0;
  padding-top: 0;
}

:deep(.user-merchant-table-grid .tabel-tabs) {
  flex-wrap: nowrap !important;
  gap: 8px;
  max-width: 100%;
  min-height: 32px;
  overflow: auto hidden;
  white-space: nowrap;
}

:deep(.user-merchant-table-grid .tabel-tabs .el-tag) {
  flex-shrink: 0;
}

:deep(.user-merchant-table-grid .vxe-tools--wrapper),
:deep(.user-merchant-table-grid .vxe-tools--operate) {
  position: static !important;
  flex-shrink: 0;
}

:deep(.park-chart-box) {
  height: 300px;
}

:deep(.park-chart-box .chart-box-left) {
  height: 100%;
}

:deep(.park-chart-box .stat-card) {
  flex: 1 1 0;
  min-height: 0;
}

:deep(.park-chart-box .map-wrapper),
:deep(.park-chart-box .park-type-chart),
:deep(.park-chart-box .simple-bar-chart) {
  height: 100%;
}

:deep(.rule-chart-box),
:deep(.rule-chart-box .chart-box-left),
:deep(.rule-chart-box .charts-wrapper),
:deep(.rule-chart-box .chart-area) {
  height: 300px;
}

.user-op-drill-dialog {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

:deep(.vxe-grid) {
  height: 100% !important;
}

:deep(.vxe-grid--layout-body-wrapper),
:deep(.vxe-grid--layout-body-content-wrapper),
:deep(.vxe-grid--table-container),
:deep(.vxe-grid--table-wrapper) {
  min-height: 0;
}
</style>
