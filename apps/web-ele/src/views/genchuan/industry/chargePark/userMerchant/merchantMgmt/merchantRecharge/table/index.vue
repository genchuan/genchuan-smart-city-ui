<script lang="ts" setup>
import type {
  MerchantProfileInfo,
  MerchantRechargeRow,
  MerchantSelectOption,
} from '../data';

import type {
  MerchantInfoDetailVO,
  MerchantInfoVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import type {
  MerchantRechargeDetailVO,
  MerchantRechargePageReqVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantRecharge';
import type { ActiveFilterTag } from '#/views/genchuan/industry/chargePark/userMerchant/utils/filterTags';

import { computed, nextTick, onMounted, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import {
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElLoading,
  ElMessage,
  ElOption,
  ElSelect,
  ElTag,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MerchantInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import { MerchantRechargeApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantRecharge';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { buildActiveFilterTags } from '#/views/genchuan/industry/chargePark/userMerchant/utils/filterTags';

import {
  buildMerchantOptionsFromApi,
  buildMerchantProfile,
  buildMerchantProfileLookup,
  buildMerchantRechargeQueryParams,
  buildMerchantRechargeRowFromApi,
  formatApiTime,
  formatLogs,
  maskPhone,
  merchantOptions,
  detailFields as merchantRechargeDetailFields,
  payChannelOptions,
  useGridColumns,
  useSearchSchema,
} from '../data';

const props = withDefaults(
  defineProps<{
    reloadStats?: () => Promise<void> | void;
    showStats?: boolean;
    toggleStats?: () => void;
  }>(),
  {
    reloadStats: async () => {},
    showStats: false,
    toggleStats: () => {},
  },
);

const currentMerchantProfile = ref<MerchantProfileInfo | null>(null);
const detailCache = new Map<number, MerchantRechargeDetailVO>();
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MerchantRechargeRow>();
const merchantDetailCache = new Map<number, MerchantInfoDetailVO>();
const merchantDialogVisible = ref(false);
const merchantProfileLookup = ref(buildMerchantProfileLookup(merchantOptions));
const merchantSelectOptions = ref<MerchantSelectOption[]>(merchantOptions);
const payChannel = ref('微信');
const payDialogVisible = ref(false);
const payRowId = ref<null | number>(null);
const filterAmount = ref('');
const filterPayChannel = ref('');
const filterStatus = ref('');
const searchParams = ref<Record<string, any>>({});
const MERCHANT_OPTIONS_PAGE_SIZE = 200;

function getMerchantOptionLabel(value: any) {
  const merchantId = Number(value);
  return (
    merchantSelectOptions.value.find((item) => item.value === merchantId)
      ?.label || String(value)
  );
}

const quickFilterConfigs = {
  amount: {
    label: '充值金额',
    type: 'primary',
  },
  payChannel: {
    label: '支付渠道',
    type: 'success',
  },
  status: {
    label: '充值状态',
    type: 'warning',
  },
} as const;

const searchFilterConfigs = {
  amount: {
    label: '充值金额',
    type: 'primary',
  },
  merchantId: {
    formatter: getMerchantOptionLabel,
    label: '商户名称',
    type: 'info',
  },
  payChannel: {
    label: '支付渠道',
    type: 'success',
  },
  payTime: {
    formatter: (value: any[]) => value.join(' 至 '),
    label: '支付时间',
    type: 'danger',
  },
  status: {
    label: '充值状态',
    type: 'warning',
  },
} as const;

const detailData = computed(() => {
  if (!detailObj.value) {
    return null;
  }

  return {
    ...detailObj.value,
    amountDisplay: `${detailObj.value.amount.toFixed(2)} 元`,
    logSummary: formatLogs(detailObj.value.logs),
    maskedMerchantPhone: maskPhone(detailObj.value.merchantPhone),
  };
});

const activeFilterTags = computed<ActiveFilterTag[]>(() =>
  buildActiveFilterTags([
    {
      configs: quickFilterConfigs,
      source: 'quick',
      values: {
        amount: filterAmount.value,
        payChannel: filterPayChannel.value,
        status: filterStatus.value,
      },
    },
    {
      configs: searchFilterConfigs,
      source: 'search',
      values: searchParams.value,
    },
  ]),
);

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  async onOpenChange() {},
});

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      clearable: true,
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onQuerySubmit,
  layout: 'horizontal',
  schema: useSearchSchema(merchantSelectOptions.value).map((item) => ({
    ...item,
    rules: undefined,
  })),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

/** 搜索表单提交 */
async function onQuerySubmit(values: Record<string, any>) {
  searchParams.value = { ...values };
  await handleRefresh();
  drawerApi.close();
}

/** 获取状态标签色 */
function getStatusTagType(status: MerchantRechargeRow['status']) {
  switch (status) {
    case '已取消': {
      return 'danger';
    }
    case '已支付': {
      return 'primary';
    }
    case '待支付': {
      return 'warning';
    }
    default: {
      return 'info';
    }
  }
}

function canConfirmRecharge(row: MerchantRechargeRow) {
  return row.status === '已支付' && row.confirmTime === '-';
}

/** 加载商户下拉 */
async function loadMerchantOptions() {
  try {
    const list: MerchantInfoVO[] = [];
    let pageNo = 1;
    let total = 0;

    do {
      const result = await MerchantInfoApi.getMerchantInfoPage({
        pageNo,
        pageSize: MERCHANT_OPTIONS_PAGE_SIZE,
      });
      const currentList = Array.isArray(result?.list) ? result.list : [];

      list.push(...currentList);
      total = Number(result?.total || 0);
      pageNo += 1;

      if (currentList.length === 0) {
        break;
      }
    } while (list.length < total);

    merchantSelectOptions.value = buildMerchantOptionsFromApi(list);
    merchantProfileLookup.value = buildMerchantProfileLookup(
      merchantSelectOptions.value,
    );
  } catch (error) {
    console.error('[merchantRecharge] load merchant options failed:', error);
    merchantProfileLookup.value = buildMerchantProfileLookup(
      merchantSelectOptions.value,
    );
  }

  await queryFormApi.updateSchema([
    {
      fieldName: 'merchantId',
      componentProps: {
        options: merchantSelectOptions.value,
      },
    },
  ]);

  await handleRefresh();
}

/** 获取商户详情 */
async function fetchMerchantProfile(
  merchantId: number,
  errorMessage = '加载商户详情失败',
) {
  const cachedDetail = merchantDetailCache.get(merchantId);

  if (cachedDetail) {
    return cachedDetail;
  }

  try {
    const data = await MerchantInfoApi.getMerchantInfo(merchantId);
    merchantDetailCache.set(merchantId, data);
    return data;
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[merchantRecharge] load merchant detail failed:', error);
    return null;
  }
}

/** 补齐商户信息索引 */
async function ensureMerchantProfiles(merchantIds: number[]) {
  const uniqueIds = [...new Set(merchantIds.filter((id) => id > 0))].filter(
    (id) => !merchantProfileLookup.value[id],
  );

  if (uniqueIds.length === 0) {
    return;
  }

  const details = await Promise.all(
    uniqueIds.map((id) => fetchMerchantProfile(id, '加载商户信息失败')),
  );
  const patchedOptions = details
    .filter((item): item is MerchantInfoDetailVO => Boolean(item?.id))
    .map((item) => ({
      address: item.address || '',
      contact: item.contact || '',
      label: item.name || '',
      merchantType: item.merchantType || '',
      phone: item.phone || '',
      registerTime: formatApiTime(item.registerTime),
      remark: item.remark || '',
      status: item.status || '-',
      value: Number(item.id ?? 0),
    }));

  if (patchedOptions.length === 0) {
    return;
  }

  merchantSelectOptions.value = buildMerchantOptionsFromApi([
    ...merchantSelectOptions.value.map((item) => ({
      address: item.address || '',
      contact: item.contact || '',
      id: item.value,
      merchantType: item.merchantType || '',
      name: item.label,
      phone: item.phone || '',
      registerTime: item.registerTime || '',
      remark: item.remark || '',
      status: item.status || '-',
    })),
    ...patchedOptions.map((item) => ({
      address: item.address || '',
      contact: item.contact || '',
      id: item.value,
      merchantType: item.merchantType || '',
      name: item.label,
      phone: item.phone || '',
      registerTime: item.registerTime || '',
      remark: item.remark || '',
      status: item.status || '-',
    })),
  ]);
  merchantProfileLookup.value = buildMerchantProfileLookup(
    merchantSelectOptions.value,
  );
}

/** 获取充值详情 */
async function fetchMerchantRechargeDetail(
  row: MerchantRechargeRow,
  errorMessage = '加载充值详情失败',
) {
  const cachedDetail = detailCache.get(row.id);

  if (cachedDetail) {
    await ensureMerchantProfiles([
      Number(cachedDetail.merchantId ?? row.merchantId ?? 0),
    ]);
    return {
      row: buildMerchantRechargeRowFromApi(
        cachedDetail,
        row,
        merchantProfileLookup.value,
      ),
      source: cachedDetail,
    };
  }

  const loadingInstance = ElLoading.service({
    target: '.merchant-recharge-table',
    text: '加载中...',
  });

  try {
    const data: MerchantRechargeDetailVO = row;
    detailCache.set(row.id, data);
    await ensureMerchantProfiles([Number(data.merchantId ?? row.merchantId)]);

    return {
      row: buildMerchantRechargeRowFromApi(
        data,
        row,
        merchantProfileLookup.value,
      ),
      source: data,
    };
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[merchantRecharge] load detail failed:', error);
    return null;
  } finally {
    loadingInstance.close();
  }
}

/** 查询商户充值列表 */
async function queryMerchantRechargePage({ page }: any) {
  const queryValues = {
    ...searchParams.value,
  };

  if (filterAmount.value) {
    queryValues.amount = filterAmount.value;
  }

  if (filterPayChannel.value) {
    queryValues.payChannel = filterPayChannel.value;
  }

  if (filterStatus.value) {
    queryValues.status = filterStatus.value;
  }

  const params: MerchantRechargePageReqVO = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...buildMerchantRechargeQueryParams(queryValues),
  };
  const result = await MerchantRechargeApi.getMerchantRechargePage(params);
  const list = Array.isArray(result?.list) ? result.list : [];
  await ensureMerchantProfiles(list.map((item) => Number(item.merchantId)));

  return {
    list: list.map((item) =>
      buildMerchantRechargeRowFromApi(item, {}, merchantProfileLookup.value),
    ),
    total: result?.total || 0,
  };
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: queryMerchantRechargePage,
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
  },
  showSearchForm: false,
});

/** 刷新表格 - 同时清除所有快捷筛选 */
function handleRefresh() {
  filterAmount.value = '';
  filterPayChannel.value = '';
  filterStatus.value = '';
  return gridApi.reload();
}

/** 联动刷新页面 */
async function handleReloadPage() {
  detailCache.clear();
  merchantDetailCache.clear();
  await handleRefresh();
  await props.reloadStats?.();
}

/** 重置筛选条件 */
async function resetSearch() {
  searchParams.value = {};
  filterAmount.value = '';
  filterPayChannel.value = '';
  filterStatus.value = '';
  await queryFormApi.resetForm();
  return gridApi.reload();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  searchParams.value = {
    ...searchParams.value,
    ...values,
  };
  filterAmount.value = '';
  filterPayChannel.value = '';
  filterStatus.value = '';
  void syncQueryFormValues();
  return gridApi.reload();
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

onMounted(async () => {
  await nextTick();
  await loadMerchantOptions();
});

/** 导出当前列表 */
async function handleExport() {
  const loadingInstance = ElLoading.service({
    target: '.merchant-recharge-table',
    text: '导出中...',
  });

  try {
    const exportValues = {
      ...searchParams.value,
    };

    if (filterAmount.value) {
      exportValues.amount = filterAmount.value;
    }

    if (filterPayChannel.value) {
      exportValues.payChannel = filterPayChannel.value;
    }

    if (filterStatus.value) {
      exportValues.status = filterStatus.value;
    }

    const data = await MerchantRechargeApi.exportMerchantRecharge(
      buildMerchantRechargeQueryParams(exportValues),
    );
    downloadFileFromBlobPart({ fileName: '商户充值.xls', source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error('[merchantRecharge] export failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开支付弹窗 */
function handleOpenPay(row: MerchantRechargeRow) {
  payRowId.value = row.id;
  payChannel.value =
    row.payChannel && row.payChannel !== '-' ? row.payChannel : '微信';
  payDialogVisible.value = true;
}

/** 确认支付 */
async function handleConfirmPay() {
  if (!payRowId.value) {
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.merchant-recharge-table',
    text: '支付中...',
  });

  try {
    await MerchantRechargeApi.payMerchantRecharge({
      ids: [payRowId.value],
      payChannel: payChannel.value,
    });
    payDialogVisible.value = false;
    payRowId.value = null;
    ElMessage.success('充值已支付');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('支付失败');
    console.error('[merchantRecharge] pay failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 确认到账 */
async function handleConfirm(row: MerchantRechargeRow) {
  const loadingInstance = ElLoading.service({
    target: '.merchant-recharge-table',
    text: '确认中...',
  });

  try {
    await MerchantRechargeApi.confirmMerchantRecharge({
      ids: [row.id],
    });
    ElMessage.success('充值已确认');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('确认失败');
    console.error('[merchantRecharge] confirm failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 取消充值 */
async function handleCancel(row: MerchantRechargeRow) {
  try {
    await confirm(`确认取消订单 ${row.orderNo} 吗？`);
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.merchant-recharge-table',
    text: '取消中...',
  });

  try {
    await MerchantRechargeApi.cancelMerchantRecharge({
      ids: [row.id],
    });
    ElMessage.success('充值已取消');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('取消失败');
    console.error('[merchantRecharge] cancel failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开详情抽屉 */
async function handleDetail(row: MerchantRechargeRow) {
  const detail = await fetchMerchantRechargeDetail(row);

  if (!detail) {
    return;
  }

  detailObj.value = detail.row;
  detailDrawerRef.value?.open();
}

/** 打开商户详情弹窗 */
async function handleOpenMerchant(row: MerchantRechargeRow) {
  const loadingInstance = ElLoading.service({
    target: '.merchant-recharge-table',
    text: '加载中...',
  });

  try {
    const detail = await fetchMerchantProfile(row.merchantId);
    currentMerchantProfile.value = buildMerchantProfile(
      detail || undefined,
      row,
      merchantProfileLookup.value,
    );
  } finally {
    loadingInstance.close();
  }

  merchantDialogVisible.value = true;
}

/** 打开搜索抽屉 */
async function handleSerachShow() {
  drawerApi.open();
  await syncQueryFormValues();
}

async function syncQueryFormValues() {
  try {
    await queryFormApi.resetForm();
    await queryFormApi.setValues(searchParams.value);
  } catch (error) {
    console.warn('[merchantRecharge] sync query form failed:', error);
  }
}

/** 按充值金额筛选 */
function handleFilterAmount(amount: number) {
  const amountText = String(amount);
  filterAmount.value = filterAmount.value === amountText ? '' : amountText;
  gridApi.reload();
}

/** 按支付渠道筛选 */
function handleFilterPayChannel(nextPayChannel: string) {
  filterPayChannel.value =
    filterPayChannel.value === nextPayChannel ? '' : nextPayChannel;
  gridApi.reload();
}

/** 按充值状态筛选 */
function handleFilterStatus(status: MerchantRechargeRow['status']) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.reload();
}

/** 取消充值金额筛选 */
function handleCancelAmountFilter() {
  filterAmount.value = '';
  gridApi.reload();
}

/** 取消支付渠道筛选 */
function handleCancelPayChannelFilter() {
  filterPayChannel.value = '';
  gridApi.reload();
}

/** 取消充值状态筛选 */
function handleCancelStatusFilter() {
  filterStatus.value = '';
  gridApi.reload();
}

/** 移除筛选标签 */
async function handleRemoveFilterTag(tag: ActiveFilterTag) {
  if (tag.source === 'quick') {
    switch (tag.key) {
      case 'amount': {
        handleCancelAmountFilter();
        break;
      }
      case 'payChannel': {
        handleCancelPayChannelFilter();
        break;
      }
      case 'status': {
        handleCancelStatusFilter();
        break;
      }
    }
    return;
  }

  const nextValues = { ...searchParams.value };
  delete nextValues[tag.key];
  searchParams.value = nextValues;
  void syncQueryFormValues();
  await handleRefresh();
}
</script>

<template>
  <div class="park-lot-table-new user-merchant-table-grid">
    <Grid>
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; align-items: center"
        >
          <ElTag
            v-for="tag in activeFilterTags"
            :key="`${tag.source}-${tag.key}`"
            :type="tag.type"
            closable
            style="height: 32px; margin: 4px 0; line-height: 32px"
            @close="handleRemoveFilterTag(tag)"
          >
            {{ tag.label }}：{{ tag.value }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="() => screenfull.toggle()"
          />
        </div>
      </template>

      <template #merchantName="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleOpenMerchant(row)"
        >
          {{ row.merchantName }}
        </el-text>
      </template>

      <template #amount="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleFilterAmount(row.amount)"
        >
          {{ row.amount.toFixed(2) }}
        </el-text>
      </template>

      <template #payChannel="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleFilterPayChannel(row.payChannel)"
        >
          {{ row.payChannel }}
        </el-text>
      </template>

      <template #status="{ row }">
        <ElTag
          :type="getStatusTagType(row.status)"
          style="cursor: pointer"
          @click="handleFilterStatus(row.status)"
        >
          {{ row.status }}
        </ElTag>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleDetail(row)"
          />
          <IconButton
            v-if="row.status === '待支付'"
            content="支付"
            icon-name="Check"
            @click="handleOpenPay(row)"
          />
          <IconButton
            v-if="canConfirmRecharge(row)"
            content="确认"
            icon-name="Check"
            @click="handleConfirm(row)"
          />
          <IconButton
            v-if="row.status === '待支付'"
            content="取消"
            icon-name="Close"
            @click="handleCancel(row)"
          />
        </div>
      </template>
    </Grid>

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="merchantRechargeDetailFields"
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
        <ElDescriptionsItem label="商户类型">
          {{ currentMerchantProfile.merchantType }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系人">
          {{ currentMerchantProfile.contact }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系电话">
          {{ maskPhone(currentMerchantProfile.phone) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户地址">
          {{ currentMerchantProfile.address }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户状态">
          {{ currentMerchantProfile.status }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="注册时间">
          {{ formatApiTime(currentMerchantProfile.registerTime) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注">
          {{ currentMerchantProfile.remark }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss"></style>
