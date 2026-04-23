<script lang="ts" setup>
import type {
  MerchantProfileInfo,
  MerchantRechargeRow,
  MerchantSelectOption,
} from '../data';

import type { MerchantInfoDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import type {
  MerchantRechargeDetailVO,
  MerchantRechargePageReqVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantRecharge';

import { computed, nextTick, onMounted, ref } from 'vue';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElLoading,
  ElMessage,
  ElOption,
  ElSelect,
  ElTag,
} from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { MerchantInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import { MerchantRechargeApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantRecharge';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

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

/** 获取状态标签色 */
function getStatusTagType(status: MerchantRechargeRow['status']) {
  switch (status) {
    case '已取消': {
      return 'danger';
    }
    case '已支付': {
      return 'primary';
    }
    case '已生效': {
      return 'success';
    }
    case '待支付': {
      return 'warning';
    }
    default: {
      return 'info';
    }
  }
}

/** 加载商户下拉 */
async function loadMerchantOptions() {
  try {
    const result = await MerchantInfoApi.getMerchantInfoPage({
      pageNo: 1,
      pageSize: 9999,
    });
    const list = Array.isArray(result?.list) ? result.list : [];

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

  await gridApi.formApi.updateSchema([
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

/** 获取充值详情 */
async function fetchMerchantRechargeDetail(
  row: MerchantRechargeRow,
  errorMessage = '加载充值详情失败',
) {
  const cachedDetail = detailCache.get(row.id);

  if (cachedDetail) {
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
    const data = await MerchantRechargeApi.getMerchantRecharge(row.id);
    detailCache.set(row.id, data);

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
async function queryMerchantRechargePage(
  { page }: any,
  formValues: Record<string, any>,
) {
  const params: MerchantRechargePageReqVO = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...buildMerchantRechargeQueryParams(formValues),
  };
  const result = await MerchantRechargeApi.getMerchantRechargePage(params);
  const list = Array.isArray(result?.list) ? result.list : [];

  return {
    list: list.map((item) =>
      buildMerchantRechargeRowFromApi(item, {}, merchantProfileLookup.value),
    ),
    total: result?.total || 0,
  };
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useSearchSchema(merchantSelectOptions.value),
  },
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Form'], ['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    height: 'auto',
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
      refresh: true,
      search: true,
    },
  },
});

/** 刷新表格 */
function handleRefresh() {
  return gridApi.query();
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
  await gridApi.formApi.resetForm();
  await handleRefresh();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  await gridApi.formApi.setValues(values);
  await handleRefresh();
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
    const formValues = await gridApi.formApi.getValues();

    await MerchantRechargeApi.exportMerchantRecharge(
      buildMerchantRechargeQueryParams(formValues),
    );
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
    ElMessage.success('充值已确认生效');
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
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ amount: String(row.amount) })"
          >
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
