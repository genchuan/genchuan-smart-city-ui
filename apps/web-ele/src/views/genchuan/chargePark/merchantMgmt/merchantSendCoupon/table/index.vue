<script lang="ts" setup>
import type { MerchantSendCouponRow, RedemptionLog } from '../data';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElMessage,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';

import {
  buildExportRows,
  textObj,
  useCreateSchema,
  useGridColumns,
  useSearchSchema,
} from '../data';

const props = withDefaults(
  defineProps<{
    coupons?: MerchantSendCouponRow[];
    showStats?: boolean;
    toggleStats?: () => void;
  }>(),
  {
    coupons: () => [],
    showStats: false,
    toggleStats: () => {},
  },
);

const emit = defineEmits<{
  'update:coupons': [value: MerchantSendCouponRow[]];
}>();

const coupons = computed({
  get: () => props.coupons,
  set: (value: MerchantSendCouponRow[]) => {
    emit('update:coupons', value);
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

function getStatusTagType(status: MerchantSendCouponRow['status']) {
  switch (status) {
    case '已执行': {
      return 'success';
    }
    case '待执行': {
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

function formatRedemptions(logs: RedemptionLog[] = []) {
  if (!logs.length) {
    return '暂无核销记录';
  }

  return logs
    .map((item) => `${item.time} ${item.type} ${item.count} 张`)
    .join('\n');
}

const checkedIds = ref<number[]>([]);
const checkedRows = ref<MerchantSendCouponRow[]>([]);
const currentCouponProfile = ref<Record<string, string>>();
const currentMerchantProfile = ref<Record<string, string>>();
const currentRedemptions = ref<RedemptionLog[]>([]);
const couponDialogVisible = ref(false);
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MerchantSendCouponRow>();
const merchantDialogVisible = ref(false);
const redemptionDialogVisible = ref(false);

const detailFields = ref([
  { key: 'merchantName', label: '商户名称' },
  { key: 'couponName', label: '优惠券名称' },
  { key: 'sendCount', label: '发放数量' },
  { key: 'useCount', label: '已核销数量' },
  {
    key: 'status',
    label: '发券状态',
    type: 'tag',
    tagType: (value: string) =>
      getStatusTagType(value as MerchantSendCouponRow['status']),
  },
  { key: 'execTime', label: '执行时间' },
  { key: 'finishTime', label: '发券完成时间' },
  { key: 'redemptionSummary', label: '核销明细' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
  { key: 'remark', label: '备注' },
]);

const detailData = computed(() => {
  if (!detailObj.value) {
    return null;
  }

  return {
    ...detailObj.value,
    redemptionSummary: formatRedemptions(detailObj.value.redemptions),
  };
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 96,
  },
  layout: 'horizontal',
  schema: useCreateSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  width: 520,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const values = (await formApi.getValues()) as Record<string, any>;
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const id = Math.max(0, ...coupons.value.map((item) => item.id)) + 1;
    const [couponName, couponId] = String(values.couponName || '').split('|');
    const execTime = values.execTime || now;
    const executedImmediately =
      !values.execTime || dayjs(values.execTime).isBefore(dayjs());

    coupons.value = [
      {
        id,
        merchantId: id,
        merchantName: values.merchantName || '',
        couponId: Number(couponId || id + 100),
        couponName,
        sendCount: Number(values.sendCount || 0),
        execTime,
        finishTime: executedImmediately ? now : '-',
        useCount: 0,
        status: executedImmediately ? '已执行' : '待执行',
        remark: values.remark || '',
        creator: 'admin',
        createTime: now,
        updateTime: now,
        redemptions: [],
      },
      ...coupons.value,
    ];

    formDrawerApi.close();
    ElMessage.success(
      executedImmediately ? '发券任务已执行' : '发券任务已创建',
    );
    handleRefresh();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }

    formApi.resetForm();
  },
});

/** 匹配筛选条件 */
function matchCoupon(
  item: MerchantSendCouponRow,
  formValues: Record<string, any>,
) {
  const merchantMatch =
    !formValues.merchantName ||
    item.merchantName.includes(formValues.merchantName);
  const couponMatch =
    !formValues.couponName || item.couponName.includes(formValues.couponName);
  const statusMatch = !formValues.status || item.status === formValues.status;
  const execTime = formValues.execTime || [];
  const execTimeMatch =
    execTime.length !== 2 ||
    (item.execTime !== '-' &&
      dayjs(item.execTime).isAfter(dayjs(execTime[0]).subtract(1, 'second')) &&
      dayjs(item.execTime).isBefore(dayjs(execTime[1]).add(1, 'second')));

  return merchantMatch && couponMatch && statusMatch && execTimeMatch;
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
          const list = coupons.value.filter((item) =>
            matchCoupon(item, formValues),
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
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 重置筛选条件 */
async function resetSearch() {
  checkedIds.value = [];
  checkedRows.value = [];
  await gridApi.formApi.resetForm();
  gridApi.grid?.clearCheckboxRow?.();
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
  const list = coupons.value.filter((item) => matchCoupon(item, formValues));

  exportToExcel(buildExportRows(list), textObj.excelName, textObj.excelAllName);
}

/** 同步勾选记录 */
function handleRowCheckboxChange({
  records,
}: {
  records: MerchantSendCouponRow[];
}) {
  checkedIds.value = records.map((item) => item.id);
  checkedRows.value = records;
}

/** 批量更新发券记录 */
function updateCoupons(
  ids: number[],
  updater: (row: MerchantSendCouponRow) => MerchantSendCouponRow,
) {
  coupons.value = coupons.value.map((item) => {
    if (!ids.includes(item.id)) {
      return item;
    }

    return updater(item);
  });
}

/** 执行批量发券 */
function executeCoupons(ids: number[]) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  updateCoupons(ids, (item) => ({
    ...item,
    status: '已执行',
    finishTime: now,
    updateTime: now,
  }));
}

/** 执行批量发送 */
function handleSendAction() {
  const pendingRows = checkedRows.value.filter(
    (item) => item.status === '待执行',
  );

  if (pendingRows.length) {
    executeCoupons(pendingRows.map((item) => item.id));
    checkedIds.value = [];
    checkedRows.value = [];
    gridApi.grid?.clearCheckboxRow?.();
    ElMessage.success('已执行选中的待执行发券任务');
    handleRefresh();
    return;
  }

  if (checkedIds.value.length) {
    ElMessage.warning('当前选中任务不可执行，请重新选择待执行记录');
    return;
  }

  formDrawerApi.open();
}

/** 执行单条发券 */
function handleExecute(row: MerchantSendCouponRow) {
  executeCoupons([row.id]);
  ElMessage.success('发券任务已执行');
  handleRefresh();
}

/** 取消发券 */
function handleCancel(row: MerchantSendCouponRow) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  updateCoupons([row.id], (item) => ({
    ...item,
    status: '已取消',
    updateTime: now,
  }));

  ElMessage.success('发券任务已取消');
  handleRefresh();
}

/** 打开详情抽屉 */
function handleDetail(row: MerchantSendCouponRow) {
  detailObj.value = row;
  detailDrawerRef.value?.open();
}

/** 打开商户详情弹窗 */
function handleOpenMerchant(row: MerchantSendCouponRow) {
  currentMerchantProfile.value = {
    name: row.merchantName,
    contact: merchantProfileMap[row.merchantName]?.contact || '-',
    phone: merchantProfileMap[row.merchantName]?.phone || '-',
    type: merchantProfileMap[row.merchantName]?.type || '-',
  };
  merchantDialogVisible.value = true;
}

/** 打开优惠券弹窗 */
function handleOpenCoupon(row: MerchantSendCouponRow) {
  currentCouponProfile.value = {
    name: row.couponName,
    count: `${row.sendCount} 张`,
    used: `${row.useCount} 张`,
    status: row.status,
  };
  couponDialogVisible.value = true;
}

/** 打开核销记录弹窗 */
function handleOpenRedemption(row: MerchantSendCouponRow) {
  currentRedemptions.value = row.redemptions;
  redemptionDialogVisible.value = true;
}
</script>

<template>
  <div class="merchant-send-coupon-table">
    <div class="merchant-send-coupon-grid-wrap">
      <Grid table-title="商户发券列表">
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
                label: checkedIds.length ? '执行选中任务' : '发券',
                type: 'primary',
                icon: ACTION_ICON.AUDIT,
                onClick: handleSendAction,
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

        <template #couponName="{ row }">
          <ElButton type="primary" link @click="handleOpenCoupon(row)">
            {{ row.couponName }}
          </ElButton>
        </template>

        <template #useCount="{ row }">
          <ElButton type="primary" link @click="handleOpenRedemption(row)">
            {{ row.useCount }}
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
                label: '执行',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '待执行',
                onClick: handleExecute.bind(null, row),
              },
              {
                label: '取消',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.DELETE,
                ifShow: () => row.status === '待执行',
                popConfirm: {
                  title: `确认取消${row.couponName}发券任务吗？`,
                  confirm: handleCancel.bind(null, row),
                },
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <FormDrawer :title="textObj.addText">
      <Form class="mx-4" />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="detailFields"
      :title="detailObj ? `${detailObj.couponName}详情` : '发券详情'"
    />

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

    <ElDialog v-model="couponDialogVisible" title="优惠券详情" width="520px">
      <ElDescriptions v-if="currentCouponProfile" :column="1" border>
        <ElDescriptionsItem label="优惠券名称">
          {{ currentCouponProfile.name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="发放数量">
          {{ currentCouponProfile.count }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="已核销数量">
          {{ currentCouponProfile.used }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="当前状态">
          {{ currentCouponProfile.status }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <ElDialog v-model="redemptionDialogVisible" title="核销记录" width="720px">
      <ElTable :data="currentRedemptions" border>
        <ElTableColumn prop="time" label="时间" min-width="170" />
        <ElTableColumn prop="type" label="类型" min-width="120" />
        <ElTableColumn prop="count" label="核销数量" min-width="100" />
      </ElTable>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.merchant-send-coupon-table,
.merchant-send-coupon-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.merchant-send-coupon-table {
  display: flex;
  flex-direction: column;
}

.merchant-send-coupon-grid-wrap {
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
