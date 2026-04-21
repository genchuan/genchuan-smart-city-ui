<script lang="ts" setup>
import type { MerchantRechargeRow, RechargeLog } from '../data';

import { computed, ref } from 'vue';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElMessage,
  ElSelect,
  ElOption,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';

import {
  buildExportRows,
  payChannelOptions,
  textObj,
  useGridColumns,
  useSearchSchema,
} from '../data';

const props = withDefaults(
  defineProps<{
    recharges?: MerchantRechargeRow[];
    showStats?: boolean;
    toggleStats?: () => void;
  }>(),
  {
    recharges: () => [],
    showStats: false,
    toggleStats: () => {},
  },
);

const emit = defineEmits<{
  'update:recharges': [value: MerchantRechargeRow[]];
}>();

const recharges = computed({
  get: () => props.recharges,
  set: (value: MerchantRechargeRow[]) => {
    emit('update:recharges', value);
  },
});

const merchantProfileMap: Record<string, Record<string, string>> = {
  泉州丰泽充停商户: {
    contact: '王五',
    phone: '13712345678',
    type: '充停一体商户',
  },
  泉州鲤城停车商户: {
    contact: '赵六',
    phone: '13612345679',
    type: '停车商户',
  },
  泉州洛江充电商户: {
    contact: '陈七',
    phone: '13512345670',
    type: '充电商户',
  },
  丰泽万达联合商户: {
    contact: '林八',
    phone: '13412345671',
    type: '充停一体商户',
  },
  晋江机场停车商户: {
    contact: '周九',
    phone: '13312345672',
    type: '停车商户',
  },
};

function createLog(content: string, operator = 'admin'): RechargeLog {
  return {
    content,
    operator,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
}

function getStatusTagType(status: MerchantRechargeRow['status']) {
  switch (status) {
    case '已生效': {
      return 'success';
    }
    case '已支付': {
      return 'primary';
    }
    case '待支付': {
      return 'warning';
    }
    case '已取消': {
      return 'danger';
    }
    default: {
      return 'info';
    }
  }
}

function formatLogs(logs: RechargeLog[] = []) {
  if (!logs.length) {
    return '暂无操作日志';
  }

  return logs
    .map((item) => `${item.time} ${item.operator}：${item.content}`)
    .join('\n');
}

const currentMerchantProfile = ref<Record<string, string>>();
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MerchantRechargeRow>();
const payChannel = ref('微信');
const payDialogVisible = ref(false);
const payRowId = ref<number | null>(null);
const merchantDialogVisible = ref(false);

const detailFields = ref([
  { key: 'merchantName', label: '商户名称' },
  { key: 'amountDisplay', label: '充值金额' },
  { key: 'payChannel', label: '支付渠道' },
  {
    key: 'status',
    label: '充值状态',
    type: 'tag',
    tagType: (value: string) =>
      getStatusTagType(value as MerchantRechargeRow['status']),
  },
  { key: 'orderNo', label: '充值订单号' },
  { key: 'createTime', label: '申请时间' },
  { key: 'payTime', label: '支付时间' },
  { key: 'confirmTime', label: '确认时间' },
  { key: 'logSummary', label: '操作日志' },
  { key: 'remark', label: '备注' },
]);

const detailData = computed(() => {
  if (!detailObj.value) {
    return null;
  }

  return {
    ...detailObj.value,
    amountDisplay: `${detailObj.value.amount.toFixed(2)} 元`,
    logSummary: formatLogs(detailObj.value.logs),
  };
});

/** 匹配筛选条件 */
function matchRecharge(
  item: MerchantRechargeRow,
  formValues: Record<string, any>,
) {
  const merchantMatch =
    !formValues.merchantName ||
    item.merchantName.includes(formValues.merchantName);
  const payChannelMatch =
    !formValues.payChannel || item.payChannel === formValues.payChannel;
  const statusMatch = !formValues.status || item.status === formValues.status;
  const payTime = formValues.payTime || [];
  const payTimeMatch =
    payTime.length !== 2 ||
    (item.payTime !== '-' &&
      dayjs(item.payTime).isAfter(dayjs(payTime[0]).subtract(1, 'second')) &&
      dayjs(item.payTime).isBefore(dayjs(payTime[1]).add(1, 'second')));

  return merchantMatch && payChannelMatch && statusMatch && payTimeMatch;
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useSearchSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Form'], ['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    height: '100%',
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const list = recharges.value.filter((item) =>
            matchRecharge(item, formValues),
          );

          return {
            list: list.slice(
              (page.currentPage - 1) * page.pageSize,
              page.currentPage * page.pageSize,
            ),
            total: list.length,
          };
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 重置筛选条件 */
async function resetSearch() {
  await gridApi.formApi.resetForm();
  handleRefresh();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  await gridApi.formApi.resetForm();
  await gridApi.formApi.setValues(values);
  handleRefresh();
}

/** 重新计算表格布局 */
async function recalculateLayout() {
  await gridApi.grid?.recalculate?.(true);
  await gridApi.grid?.refreshScroll?.();
}

defineExpose({
  recalculateLayout,
  resetSearch,
  setSearchValues,
});

/** 导出当前列表 */
async function handleExport() {
  const formValues = await gridApi.formApi.getValues();
  const list = recharges.value.filter((item) =>
    matchRecharge(item, formValues),
  );

  exportToExcel(buildExportRows(list), textObj.excelName, textObj.excelAllName);
}

/** 更新充值记录状态 */
function updateRecharge(
  row: MerchantRechargeRow,
  updater: (item: MerchantRechargeRow) => MerchantRechargeRow,
) {
  recharges.value = recharges.value.map((item) => {
    if (item.id !== row.id) {
      return item;
    }

    return updater(item);
  });
}

/** 打开充值弹窗 */
function handleOpenPay(row: MerchantRechargeRow) {
  payRowId.value = row.id;
  payChannel.value = '微信';
  payDialogVisible.value = true;
}

/** 确认充值 */
function handleConfirmPay() {
  const current = recharges.value.find((item) => item.id === payRowId.value);
  if (!current) {
    return;
  }

  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  updateRecharge(current, (item) => ({
    ...item,
    payChannel: payChannel.value,
    payTime: now,
    status: '已支付',
    updateTime: now,
    logs: [createLog(`完成支付，渠道：${payChannel.value}`), ...item.logs],
  }));

  payDialogVisible.value = false;
  ElMessage.success('充值已支付');
  handleRefresh();
}

/** 确认到账 */
function handleConfirm(row: MerchantRechargeRow) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  updateRecharge(row, (item) => ({
    ...item,
    status: '已生效',
    confirmTime: now,
    updateTime: now,
    logs: [createLog('管理员确认到账并生效', '李主管'), ...item.logs],
  }));

  ElMessage.success('充值已确认生效');
  handleRefresh();
}

/** 取消充值 */
function handleCancel(row: MerchantRechargeRow) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  updateRecharge(row, (item) => ({
    ...item,
    status: '已取消',
    updateTime: now,
    logs: [createLog('取消充值申请', '王客服'), ...item.logs],
  }));

  ElMessage.success('充值已取消');
  handleRefresh();
}

/** 打开详情抽屉 */
function handleDetail(row: MerchantRechargeRow) {
  detailObj.value = row;
  detailDrawerRef.value?.open();
}

/** 打开商户详情弹窗 */
function handleOpenMerchant(row: MerchantRechargeRow) {
  currentMerchantProfile.value = {
    name: row.merchantName,
    contact: merchantProfileMap[row.merchantName]?.contact || '-',
    phone: merchantProfileMap[row.merchantName]?.phone || '-',
    type: merchantProfileMap[row.merchantName]?.type || '-',
  };
  merchantDialogVisible.value = true;
}
</script>

<template>
  <div class="merchant-recharge-table">
    <div class="merchant-recharge-grid-wrap">
      <Grid table-title="商户充值列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '导出',
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                onClick: handleExport,
              },
              {
                label: props.showStats ? '隐藏统计' : '显示统计',
                type: 'primary',
                icon: props.showStats
                  ? 'lucide:chevron-up'
                  : 'lucide:chevron-down',
                onClick: props.toggleStats,
              },
            ]"
          />
        </template>

        <template #merchantName="{ row }">
          <ElButton type="primary" link @click="handleOpenMerchant(row)">
            {{ row.merchantName }}
          </ElButton>
        </template>

        <template #amount="{ row }">
          <ElButton type="primary" link @click="handleDetail(row)">
            {{ row.amount.toFixed(2) }}
          </ElButton>
        </template>

        <template #payChannel="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ payChannel: row.payChannel })"
          >
            {{ row.payChannel }}
          </ElButton>
        </template>

        <template #status="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ status: row.status })"
          >
            <ElTag :type="getStatusTagType(row.status)">
              {{ row.status }}
            </ElTag>
          </ElButton>
        </template>

        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: '查看',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.VIEW,
                onClick: handleDetail.bind(null, row),
              },
              {
                label: '支付',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '待支付',
                onClick: handleOpenPay.bind(null, row),
              },
              {
                label: '确认',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '已支付',
                onClick: handleConfirm.bind(null, row),
              },
              {
                label: '取消',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.DELETE,
                ifShow: () => row.status === '待支付',
                popConfirm: {
                  title: `确认取消订单 ${row.orderNo} 吗？`,
                  confirm: handleCancel.bind(null, row),
                },
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="detailFields"
      :title="detailObj ? `${detailObj.orderNo}详情` : '充值详情'"
    />

    <ElDialog v-model="payDialogVisible" title="充值支付" width="420px">
      <ElSelect
        v-model="payChannel"
        class="w-full"
        placeholder="请选择支付渠道"
      >
        <ElOption
          v-for="item in payChannelOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </ElSelect>
      <template #footer>
        <ElButton @click="payDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleConfirmPay">确认</ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="merchantDialogVisible" title="商户详情" width="520px">
      <ElDescriptions v-if="currentMerchantProfile" :column="1" border>
        <ElDescriptionsItem label="商户名称">
          {{ currentMerchantProfile.name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系人">
          {{ currentMerchantProfile.contact }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系手机号">
          {{ currentMerchantProfile.phone }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户类型">
          {{ currentMerchantProfile.type }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.merchant-recharge-table,
.merchant-recharge-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.merchant-recharge-table {
  display: flex;
  flex-direction: column;
}

.merchant-recharge-grid-wrap {
  flex: 1;
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
