<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { nextTick, reactive } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import dayjs from 'dayjs';
import { ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { UserCreditApi } from '#/api/genchuan/industry/chargePark/userMerchant/creditMgmt/userCredit';
import { UserOpReportApi } from '#/api/genchuan/industry/chargePark/userMerchant/decisionAnalysis/userOpReport';
import { GroupInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/groupClient/groupInfo';
import { getUserPage as getMemberUserPage } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import { MerchantInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import { MerchantLinkApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantLink';
import { MerchantRechargeApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantRecharge';
import { MerchantSendCouponApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantSendCoupon';
import { PlateAuthApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/plateAuth';
import { UserCarApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';
import { UserInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userInfo';

type DrillInfo = {
  drillName?: string;
  drillType: string;
  drillValue?: number | string;
  reportCycle?: string;
  reportId?: number | string;
};

const emit = defineEmits(['close']);

const drillInfo = reactive<DrillInfo>({
  drillName: '',
  drillType: '',
  drillValue: '',
  reportCycle: '',
  reportId: '',
});

const dataObj = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

type GridColumn = NonNullable<VxeTableGridOptions['columns']>[number];

const dateTimeFieldNames = new Set([
  'applyTime',
  'auditTime',
  'bindTime',
  'createTime',
  'effectTime',
  'execTime',
  'lastSyncTime',
  'loginTime',
  'payTime',
  'registerTime',
  'updateTime',
]);

function normalizeDateTimeValue(value: number | string) {
  if (typeof value === 'number') {
    const timestampText = String(Math.trunc(value));
    return timestampText.length === 10 ? value * 1000 : value;
  }

  if (/^\d{10,13}$/.test(value)) {
    const timestamp = Number(value);
    return value.length === 10 ? timestamp * 1000 : timestamp;
  }

  return value;
}

function formatDateTimeValue(value?: null | number | string) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const parsed = dayjs(normalizeDateTimeValue(value));
  return parsed.isValid()
    ? parsed.format('YYYY-MM-DD HH:mm:ss')
    : String(value);
}

function isDateTimeColumn(column: GridColumn) {
  const field = (column as { field?: unknown }).field;
  return typeof field === 'string' && dateTimeFieldNames.has(field);
}

function withDateTimeFormat(columns: VxeTableGridOptions['columns']) {
  return (columns || []).map((column) => {
    if (!isDateTimeColumn(column)) {
      return column;
    }

    return {
      ...column,
      formatter: ({ cellValue }: { cellValue?: null | number | string }) =>
        formatDateTimeValue(cellValue),
    };
  });
}

const titleMap: Record<string, string> = {
  avgCreditScore: '平均信用分明细',
  bindCarCount: '绑定车辆明细',
  carType: '车辆类型明细',
  creditLevel: '信用等级明细',
  groupType: '集团类型明细',
  linkMerchantCount: '对接商户明细',
  memberLevel: '会员等级明细',
  merchantType: '商户类型明细',
  newGroupCount: '新增集团明细',
  newMemberCount: '新增会员明细',
  newMerchantCount: '新增商户明细',
  newUserCount: '新增用户明细',
  plateAuth: '车牌认证趋势明细',
  plateAuthCount: '车牌认证明细',
  rechargeAmount: '充值金额明细',
  rechargeAmountTrend: '充值金额趋势明细',
  reportStatus: '报表状态明细',
  reportTimeScale: '时间尺度明细',
  reportType: '报表类型明细',
  sendCoupon: '发券量趋势明细',
  sendCouponCount: '发券明细',
  statTime: '统计时间明细',
  totalMemberCount: '会员用户明细',
  totalUserCount: '用户总数明细',
  userGrowth: '用户增长趋势明细',
  userGrowthRate: '用户增长明细',
  userOpTrend: '用户趋势明细',
  userType: '用户类型明细',
  userTypeDistribution: '用户类型明细',
};

const reportDrillTypes = new Set([
  'reportStatus',
  'reportTimeScale',
  'reportType',
  'statTime',
]);

const userCarDrillTypes = new Set(['bindCarCount', 'carType']);
const plateAuthDrillTypes = new Set(['plateAuth', 'plateAuthCount']);
const merchantDrillTypes = new Set(['merchantType', 'newMerchantCount']);
const merchantLinkDrillTypes = new Set(['linkMerchantCount']);
const merchantRechargeDrillTypes = new Set([
  'rechargeAmount',
  'rechargeAmountTrend',
]);
const merchantSendCouponDrillTypes = new Set(['sendCoupon', 'sendCouponCount']);
const groupDrillTypes = new Set(['groupType', 'newGroupCount']);
const memberDrillTypes = new Set([
  'memberLevel',
  'newMemberCount',
  'totalMemberCount',
]);
const creditDrillTypes = new Set(['avgCreditScore', 'creditLevel']);

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

const userCarColumns: VxeTableGridOptions['columns'] = [
  { type: 'seq', title: '序号', width: 60 },
  { field: 'plateNo', title: '车牌号码', minWidth: 120 },
  { field: 'nickname', title: '所属用户', minWidth: 140 },
  { field: 'phone', title: '手机号', minWidth: 140 },
  { field: 'carType', title: '车辆类型', minWidth: 120 },
  { field: 'plateColor', title: '车牌颜色', minWidth: 100 },
  {
    field: 'status',
    title: '绑定状态',
    minWidth: 100,
    slots: { default: 'status' },
  },
  { field: 'bindTime', title: '绑定时间', minWidth: 170 },
];

const plateAuthColumns: VxeTableGridOptions['columns'] = [
  { type: 'seq', title: '序号', width: 60 },
  { field: 'plateNo', title: '车牌号码', minWidth: 120 },
  {
    field: 'status',
    title: '认证状态',
    minWidth: 100,
    slots: { default: 'status' },
  },
  { field: 'applyTime', title: '申请时间', minWidth: 170 },
  { field: 'auditTime', title: '审核时间', minWidth: 170 },
  { field: 'auditRemark', title: '审核备注', minWidth: 180 },
];

const merchantColumns: VxeTableGridOptions['columns'] = [
  { type: 'seq', title: '序号', width: 60 },
  { field: 'name', title: '商户名称', minWidth: 160 },
  { field: 'merchantType', title: '商户类型', minWidth: 120 },
  { field: 'contact', title: '联系人', minWidth: 120 },
  { field: 'phone', title: '手机号', minWidth: 140 },
  {
    field: 'status',
    title: '商户状态',
    minWidth: 100,
    slots: { default: 'status' },
  },
  { field: 'registerTime', title: '注册时间', minWidth: 170 },
];

const merchantLinkColumns: VxeTableGridOptions['columns'] = [
  { type: 'seq', title: '序号', width: 60 },
  { field: 'merchantId', title: '商户ID', minWidth: 100 },
  { field: 'linkType', title: '对接类型', minWidth: 120 },
  { field: 'apiUrl', title: '接口地址', minWidth: 220 },
  {
    field: 'status',
    title: '对接状态',
    minWidth: 100,
    slots: { default: 'status' },
  },
  { field: 'effectTime', title: '生效时间', minWidth: 170 },
  { field: 'lastSyncTime', title: '最后同步时间', minWidth: 170 },
];

const merchantRechargeColumns: VxeTableGridOptions['columns'] = [
  { type: 'seq', title: '序号', width: 60 },
  { field: 'orderNo', title: '充值单号', minWidth: 160 },
  { field: 'merchantId', title: '商户ID', minWidth: 100 },
  { field: 'amount', title: '充值金额', minWidth: 120 },
  { field: 'payChannel', title: '支付渠道', minWidth: 120 },
  {
    field: 'status',
    title: '支付状态',
    minWidth: 100,
    slots: { default: 'status' },
  },
  { field: 'payTime', title: '支付时间', minWidth: 170 },
];

const merchantSendCouponColumns: VxeTableGridOptions['columns'] = [
  { type: 'seq', title: '序号', width: 60 },
  { field: 'couponName', title: '优惠券', minWidth: 160 },
  { field: 'merchantId', title: '商户ID', minWidth: 100 },
  { field: 'sendCount', title: '发券量', minWidth: 100 },
  { field: 'useCount', title: '使用量', minWidth: 100 },
  {
    field: 'status',
    title: '执行状态',
    minWidth: 100,
    slots: { default: 'status' },
  },
  { field: 'execTime', title: '执行时间', minWidth: 170 },
];

const groupColumns: VxeTableGridOptions['columns'] = [
  { type: 'seq', title: '序号', width: 60 },
  { field: 'name', title: '集团名称', minWidth: 160 },
  { field: 'groupType', title: '集团类型', minWidth: 120 },
  { field: 'contact', title: '联系人', minWidth: 120 },
  { field: 'phone', title: '手机号', minWidth: 140 },
  {
    field: 'status',
    title: '集团状态',
    minWidth: 100,
    slots: { default: 'status' },
  },
  { field: 'registerTime', title: '注册时间', minWidth: 170 },
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
  const subTitle = drillInfo.drillName || drillInfo.reportCycle;
  return subTitle ? `${title} - ${subTitle}` : title;
}

function getBaseGridColumns() {
  if (memberDrillTypes.has(drillInfo.drillType)) {
    return memberColumns;
  }
  if (creditDrillTypes.has(drillInfo.drillType)) {
    return creditColumns;
  }
  if (userCarDrillTypes.has(drillInfo.drillType)) {
    return userCarColumns;
  }
  if (plateAuthDrillTypes.has(drillInfo.drillType)) {
    return plateAuthColumns;
  }
  if (merchantDrillTypes.has(drillInfo.drillType)) {
    return merchantColumns;
  }
  if (merchantLinkDrillTypes.has(drillInfo.drillType)) {
    return merchantLinkColumns;
  }
  if (merchantRechargeDrillTypes.has(drillInfo.drillType)) {
    return merchantRechargeColumns;
  }
  if (merchantSendCouponDrillTypes.has(drillInfo.drillType)) {
    return merchantSendCouponColumns;
  }
  if (groupDrillTypes.has(drillInfo.drillType)) {
    return groupColumns;
  }
  if (reportDrillTypes.has(drillInfo.drillType)) {
    return reportColumns;
  }
  return userColumns;
}

function getGridColumns() {
  return withDateTimeFormat(getBaseGridColumns());
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

function buildDayRange(value?: number | string) {
  if (!value) {
    return undefined;
  }

  return [`${value} 00:00:00`, `${value} 23:59:59`];
}

function hasDateValue(value?: number | string) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value);
}

function buildUserParams(page: { currentPage: number; pageSize: number }) {
  const params: Record<string, any> = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };

  if (
    drillInfo.drillType === 'userType' ||
    drillInfo.drillType === 'userTypeDistribution'
  ) {
    params.userType = drillInfo.drillName || drillInfo.drillValue;
  }
  if (
    (drillInfo.drillType === 'userGrowth' ||
      drillInfo.drillType === 'userOpTrend') &&
    hasDateValue(drillInfo.drillValue)
  ) {
    params.registerTime = buildDayRange(drillInfo.drillValue);
  }

  return params;
}

function buildTypedParams(
  page: { currentPage: number; pageSize: number },
  fieldName: string,
  dateFieldName?: string,
) {
  const params: Record<string, any> = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };

  if (fieldName) {
    params[fieldName] = drillInfo.drillValue || drillInfo.drillName;
  }
  if (dateFieldName && hasDateValue(drillInfo.drillValue)) {
    params[dateFieldName] = buildDayRange(drillInfo.drillValue);
  }

  return params;
}

async function getDrillDownData({
  page,
}: {
  page: { currentPage: number; pageSize: number };
}) {
  if (memberDrillTypes.has(drillInfo.drillType)) {
    const params: Record<string, any> = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    if (drillInfo.drillType === 'memberLevel') {
      params.levelName = drillInfo.drillValue || drillInfo.drillName;
    }
    return await getMemberUserPage({
      ...params,
    });
  }

  if (creditDrillTypes.has(drillInfo.drillType)) {
    return await UserCreditApi.getUserCreditPage(
      drillInfo.drillType === 'creditLevel'
        ? buildTypedParams(page, 'creditLevel')
        : {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          },
    );
  }

  if (userCarDrillTypes.has(drillInfo.drillType)) {
    return await UserCarApi.getUserCarPage(
      drillInfo.drillType === 'carType'
        ? buildTypedParams(page, 'carType')
        : {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          },
    );
  }

  if (plateAuthDrillTypes.has(drillInfo.drillType)) {
    return await PlateAuthApi.getPlateAuthPage(
      drillInfo.drillType === 'plateAuth' && hasDateValue(drillInfo.drillValue)
        ? buildTypedParams(page, '', 'applyTime')
        : {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          },
    );
  }

  if (merchantDrillTypes.has(drillInfo.drillType)) {
    return await MerchantInfoApi.getMerchantInfoPage(
      drillInfo.drillType === 'merchantType'
        ? buildTypedParams(page, 'merchantType')
        : {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          },
    );
  }

  if (merchantLinkDrillTypes.has(drillInfo.drillType)) {
    return await MerchantLinkApi.getMerchantLinkPage({
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    });
  }

  if (merchantRechargeDrillTypes.has(drillInfo.drillType)) {
    return await MerchantRechargeApi.getMerchantRechargePage(
      drillInfo.drillType === 'rechargeAmountTrend' &&
        hasDateValue(drillInfo.drillValue)
        ? buildTypedParams(page, '', 'payTime')
        : {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          },
    );
  }

  if (merchantSendCouponDrillTypes.has(drillInfo.drillType)) {
    return await MerchantSendCouponApi.getMerchantSendCouponPage(
      drillInfo.drillType === 'sendCoupon' && hasDateValue(drillInfo.drillValue)
        ? buildTypedParams(page, '', 'execTime')
        : {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          },
    );
  }

  if (groupDrillTypes.has(drillInfo.drillType)) {
    return await GroupInfoApi.getGroupInfoPage(
      drillInfo.drillType === 'groupType'
        ? buildTypedParams(page, 'groupType')
        : {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          },
    );
  }

  if (reportDrillTypes.has(drillInfo.drillType)) {
    return await UserOpReportApi.getUserOpReportPage({
      ...buildReportParams(page),
      tenantId: 1,
    });
  }

  return await UserInfoApi.getUserInfoPage(buildUserParams(page));
}

const [Grid, gridApi] = useVbenVxeGrid({
  class: 'user-op-drill-grid',
  gridOptions: {
    columns: getGridColumns(),
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
  drillInfo.reportCycle = info.reportCycle || '';
  drillInfo.reportId = info.reportId || '';

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
.user-op-drill-dialog {
  width: 100%;
  min-height: 0;
  max-height: calc(100vh - 120px);
  overflow: auto;
}

:deep(.user-op-drill-grid) {
  width: 100%;
  height: auto !important;
}

:deep(.user-op-drill-grid .vxe-grid) {
  width: 100%;
  height: auto !important;
}

:deep(.user-op-drill-grid .vxe-grid--layout-body-wrapper),
:deep(.user-op-drill-grid .vxe-grid--layout-body-content-wrapper) {
  flex-grow: 0;
  width: 100%;
}

:deep(.user-op-drill-grid .vxe-grid--layout-body-content-wrapper) {
  overflow: visible;
}

:deep(.user-op-drill-grid .vxe-grid--table-container) {
  flex-grow: 0;
  width: 100%;
}

:deep(.user-op-drill-grid .vxe-grid--table-wrapper) {
  flex-grow: 1;
  width: 100%;
  max-height: none;
}

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

:deep(.user-op-drill-grid .vxe-grid--layout-body-wrapper),
:deep(.user-op-drill-grid .vxe-grid--layout-body-content-wrapper),
:deep(.user-op-drill-grid .vxe-grid--table-container),
:deep(.user-op-drill-grid .vxe-grid--table-wrapper) {
  min-height: 0;
}
</style>
