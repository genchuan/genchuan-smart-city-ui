<script lang="ts" setup>
import type {
  CouponProfileInfo,
  MerchantProfileInfo,
  MerchantSelectOption,
  MerchantSendCouponRow,
  RedemptionLog,
} from '../data';

import type { MerchantInfoDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import type {
  MerchantSendCouponDetailVO,
  MerchantSendCouponPageReqVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantSendCoupon';

import { computed, nextTick, onMounted, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import {
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElLoading,
  ElMessage,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MerchantInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import { MerchantSendCouponApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantSendCoupon';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  buildCouponProfile,
  buildCouponProfileLookup,
  buildCouponSelectOptions,
  buildMerchantOptionsFromApi,
  buildMerchantProfile,
  buildMerchantProfileLookup,
  buildMerchantSendCouponQueryParams,
  buildMerchantSendCouponRowFromApi,
  couponOptions,
  formatApiTime,
  formatOperationLogs,
  formatRedemptions,
  getStatusTagType,
  maskPhone,
  merchantOptions,
  detailFields as merchantSendCouponDetailFields,
  textObj,
  useCreateSchema,
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

const checkedIds = ref<number[]>([]);
const checkedRows = ref<MerchantSendCouponRow[]>([]);
const couponDialogVisible = ref(false);
const couponProfileLookup = ref(buildCouponProfileLookup(couponOptions));
const currentCouponProfile = ref<CouponProfileInfo | null>(null);
const currentMerchantProfile = ref<MerchantProfileInfo | null>(null);
const currentRedemptions = ref<RedemptionLog[]>([]);
const detailCache = new Map<number, MerchantSendCouponDetailVO>();
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MerchantSendCouponRow>();
const merchantDetailCache = new Map<number, MerchantInfoDetailVO>();
const merchantDialogVisible = ref(false);
const merchantProfileLookup = ref(buildMerchantProfileLookup(merchantOptions));
const merchantSelectOptions = ref<MerchantSelectOption[]>(merchantOptions);
const queryExtraValues = ref<Record<string, any>>({});
const redemptionDialogVisible = ref(false);
const couponSelectOptions = buildCouponSelectOptions();
const searchParams = ref<Record<string, any>>({});

const detailData = computed<Record<string, any> | undefined>(() => {
  if (!detailObj.value) {
    return undefined;
  }

  return {
    ...detailObj.value,
    logSummary: formatOperationLogs(detailObj.value.logs),
    maskedMerchantPhone: maskPhone(detailObj.value.merchantPhone),
    redemptionSummary: formatRedemptions(detailObj.value.redemptions),
    sendCountDisplay: `${detailObj.value.sendCount} 张`,
    useCountDisplay: `${detailObj.value.useCount} 张`,
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
  schema: useCreateSchema(merchantSelectOptions.value, couponSelectOptions),
  showDefaultActions: false,
});

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
    console.error('[merchantSendCoupon] load merchant options failed:', error);
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

  formApi.setState(() => ({
    schema: useCreateSchema(merchantSelectOptions.value, couponSelectOptions),
  }));

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
    console.error('[merchantSendCoupon] load merchant detail failed:', error);
    return null;
  }
}

/** 获取发券详情 */
async function fetchMerchantSendCouponDetail(
  row: MerchantSendCouponRow,
  errorMessage = '加载发券详情失败',
) {
  const cachedDetail = detailCache.get(row.id);

  if (cachedDetail) {
    return {
      row: buildMerchantSendCouponRowFromApi(
        cachedDetail,
        row,
        merchantProfileLookup.value,
        couponProfileLookup.value,
      ),
      source: cachedDetail,
    };
  }

  const loadingInstance = ElLoading.service({
    target: '.merchant-send-coupon-table',
    text: '加载中...',
  });

  try {
    const data = await MerchantSendCouponApi.getMerchantSendCoupon(row.id);
    detailCache.set(row.id, data);

    return {
      row: buildMerchantSendCouponRowFromApi(
        data,
        row,
        merchantProfileLookup.value,
        couponProfileLookup.value,
      ),
      source: data,
    };
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[merchantSendCoupon] load detail failed:', error);
    return null;
  } finally {
    loadingInstance.close();
  }
}

/** 查询商户发券列表 */
async function queryMerchantSendCouponPage(
  { page }: any,
  formValues: Record<string, any> = {},
) {
  const params: MerchantSendCouponPageReqVO = {
    ...buildMerchantSendCouponQueryParams(
      {
        ...searchParams.value,
        ...formValues,
      },
      queryExtraValues.value,
    ),
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };
  const result = await MerchantSendCouponApi.getMerchantSendCouponPage(params);
  const list = Array.isArray(result?.list) ? result.list : [];

  return {
    list: list.map((item) =>
      buildMerchantSendCouponRowFromApi(
        item,
        {},
        merchantProfileLookup.value,
        couponProfileLookup.value,
      ),
    ),
    total: result?.total || 0,
  };
}

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  class: 'w-[520px]',
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const values = (await formApi.getValues()) as Record<string, any>;
    const merchantId = Number(values.merchantId ?? 0);
    const couponId = Number(values.couponId ?? 0);

    if (!merchantId) {
      ElMessage.warning('请选择商户名称');
      return;
    }

    if (!couponId) {
      ElMessage.warning('请选择优惠券');
      return;
    }

    const loadingInstance = ElLoading.service({
      target: '.merchant-send-coupon-table',
      text: '提交中...',
    });

    try {
      await MerchantSendCouponApi.sendMerchantCoupon({
        couponId,
        execTime: values.execTime || undefined,
        merchantId,
        remark: values.remark || '',
        sendCount: Number(values.sendCount || 0),
      });
      ElMessage.success(values.execTime ? '发券任务已创建' : '发券成功');
      await handleReloadPage();
      formDrawerApi.close();
    } catch (error) {
      ElMessage.error('发券失败');
      console.error('[merchantSendCoupon] send failed:', error);
    } finally {
      loadingInstance.close();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }

    await formApi.resetForm();
    await formApi.setValues({
      couponId: undefined,
      execTime: undefined,
      merchantId: undefined,
      remark: '',
      sendCount: undefined,
    });
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: queryMerchantSendCouponPage,
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
  showSearchForm: false,
});

/** 清空勾选 */
function clearCheckedRows() {
  checkedIds.value = [];
  checkedRows.value = [];
  gridApi.grid?.clearCheckboxRow?.();
}

/** 刷新表格 */
function handleRefresh() {
  queryExtraValues.value = {};
  return gridApi.query();
}

/** 联动刷新页面 */
async function handleReloadPage() {
  detailCache.clear();
  merchantDetailCache.clear();
  clearCheckedRows();
  await handleRefresh();
  await props.reloadStats?.();
}

/** 重置筛选条件 */
async function resetSearch() {
  searchParams.value = {};
  queryExtraValues.value = {};
  clearCheckedRows();
  await queryFormApi.resetForm();
  return gridApi.query();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  searchParams.value = {
    ...searchParams.value,
    ...values,
  };
  queryExtraValues.value = {};
  clearCheckedRows();
  await queryFormApi.setValues(searchParams.value);
  return gridApi.query();
}

/** 按发放数量筛选 */
async function handleFilterBySendCount(sendCount: number) {
  queryExtraValues.value = {
    sendCount:
      queryExtraValues.value.sendCount === sendCount ? undefined : sendCount,
  };
  clearCheckedRows();
  return gridApi.query();
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
    target: '.merchant-send-coupon-table',
    text: '导出中...',
  });

  try {
    await MerchantSendCouponApi.exportMerchantSendCoupon(
      buildMerchantSendCouponQueryParams(
        searchParams.value,
        queryExtraValues.value,
      ),
    );
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error('[merchantSendCoupon] export failed:', error);
  } finally {
    loadingInstance.close();
  }
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

/** 打开发券抽屉 */
function handleOpenSendDrawer() {
  formDrawerApi.setData(null).open();
}

/** 批量执行发券任务 */
async function handleSendAction() {
  if (checkedIds.value.length === 0) {
    handleOpenSendDrawer();
    return;
  }

  const pendingRows = checkedRows.value.filter(
    (item) => item.status === '待执行',
  );

  if (pendingRows.length !== checkedIds.value.length) {
    ElMessage.warning('仅支持执行待执行发券任务');
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.merchant-send-coupon-table',
    text: '执行中...',
  });

  try {
    await MerchantSendCouponApi.executeMerchantSendCoupon({
      ids: pendingRows.map((item) => item.id),
    });
    ElMessage.success('已执行选中的待执行发券任务');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('执行失败');
    console.error('[merchantSendCoupon] batch execute failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 执行单条发券 */
async function handleExecute(row: MerchantSendCouponRow) {
  const loadingInstance = ElLoading.service({
    target: '.merchant-send-coupon-table',
    text: '执行中...',
  });

  try {
    await MerchantSendCouponApi.executeMerchantSendCoupon({
      ids: [row.id],
    });
    ElMessage.success('发券任务已执行');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('执行失败');
    console.error('[merchantSendCoupon] execute failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 取消发券 */
async function handleCancel(row: MerchantSendCouponRow) {
  try {
    await confirm(`确认取消 ${row.couponName} 发券任务吗？`);
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.merchant-send-coupon-table',
    text: '取消中...',
  });

  try {
    await MerchantSendCouponApi.cancelMerchantSendCoupon({
      ids: [row.id],
    });
    ElMessage.success('发券任务已取消');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('取消失败');
    console.error('[merchantSendCoupon] cancel failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开详情抽屉 */
async function handleDetail(row: MerchantSendCouponRow) {
  const detail = await fetchMerchantSendCouponDetail(row);

  if (!detail) {
    return;
  }

  detailObj.value = detail.row;
  detailDrawerRef.value?.open();
}

/** 打开商户详情弹窗 */
async function handleOpenMerchant(row: MerchantSendCouponRow) {
  const loadingInstance = ElLoading.service({
    target: '.merchant-send-coupon-table',
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

/** 打开优惠券详情弹窗 */
async function handleOpenCoupon(row: MerchantSendCouponRow) {
  const detail = await fetchMerchantSendCouponDetail(row, '加载优惠券详情失败');

  if (!detail) {
    return;
  }

  currentCouponProfile.value = buildCouponProfile(
    detail.source.couponInfo || undefined,
    detail.row,
    couponProfileLookup.value,
  );
  couponDialogVisible.value = true;
}

/** 打开核销记录弹窗 */
async function handleOpenRedemption(row: MerchantSendCouponRow) {
  const detail = await fetchMerchantSendCouponDetail(row, '加载核销记录失败');

  if (!detail) {
    return;
  }

  currentRedemptions.value = detail.row.redemptions;
  redemptionDialogVisible.value = true;
}

/** 打开搜索抽屉 */
async function handleSerachShow() {
  drawerApi.open();
  await queryFormApi.setValues(searchParams.value);
}

/** 按发券状态筛选 */
function handleFilterStatus(status: MerchantSendCouponRow['status']) {
  queryExtraValues.value = {
    ...queryExtraValues.value,
    status: queryExtraValues.value.status === status ? undefined : status,
  };
  clearCheckedRows();
  gridApi.query();
}

/** 取消发放数量筛选 */
function handleCancelSendCountFilter() {
  queryExtraValues.value = {
    ...queryExtraValues.value,
    sendCount: undefined,
  };
  gridApi.query();
}

/** 取消发券状态筛选 */
function handleCancelStatusFilter() {
  queryExtraValues.value = {
    ...queryExtraValues.value,
    status: undefined,
  };
  gridApi.query();
}
</script>

<template>
  <div class="merchant-send-coupon-table">
    <div class="merchant-send-coupon-grid-wrap">
      <Grid>
        <template #table-title>
          <div
            class="tabel-tabs"
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              align-items: center;
            "
          >
            <ElTag
              v-if="queryExtraValues.sendCount"
              type="primary"
              closable
              style="height: 32px; margin: 4px 0; line-height: 32px"
              @close="handleCancelSendCountFilter"
            >
              发放数量：{{ queryExtraValues.sendCount }}
            </ElTag>
            <ElTag
              v-if="queryExtraValues.status"
              type="warning"
              closable
              style="height: 32px; margin: 4px 0; line-height: 32px"
              @close="handleCancelStatusFilter"
            >
              发券状态：{{ queryExtraValues.status }}
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
              :content="checkedIds.length > 0 ? '执行选中任务' : '发券'"
              icon-name="Check"
              @click="handleSendAction"
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

        <template #couponName="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleOpenCoupon(row)"
          >
            {{ row.couponName }}
          </el-text>
        </template>

        <template #sendCount="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleFilterBySendCount(row.sendCount)"
          >
            {{ row.sendCount }}
          </el-text>
        </template>

        <template #useCount="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleOpenRedemption(row)"
          >
            {{ row.useCount }}
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
              v-if="row.status === '待执行'"
              content="执行"
              icon-name="Check"
              @click="handleExecute(row)"
            />
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleDetail(row)"
            />
            <IconButton
              v-if="row.status === '待执行'"
              content="取消"
              icon-name="Close"
              @click="handleCancel(row)"
            />
          </div>
        </template>
      </Grid>
    </div>

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <FormDrawer :title="textObj.addText">
      <Form class="mx-4" />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="merchantSendCouponDetailFields"
      :title="detailObj ? `${detailObj.couponName}详情` : '发券详情'"
    />

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

    <ElDialog v-model="couponDialogVisible" title="优惠券详情" width="520px">
      <ElDescriptions v-if="currentCouponProfile" :column="1" border>
        <ElDescriptionsItem label="优惠券名称">
          {{ currentCouponProfile.name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="优惠券类型">
          {{ currentCouponProfile.type }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="优惠券规则">
          {{ currentCouponProfile.rule }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="有效期说明">
          {{ currentCouponProfile.validPeriod }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="优惠券状态">
          {{ currentCouponProfile.status }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注">
          {{ currentCouponProfile.remark }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <ElDialog v-model="redemptionDialogVisible" title="核销记录" width="860px">
      <ElTable :data="currentRedemptions" border>
        <ElTableColumn prop="time" label="时间" min-width="170" />
        <ElTableColumn prop="type" label="类型" min-width="120" />
        <ElTableColumn prop="count" label="核销数量" min-width="100" />
        <ElTableColumn prop="userName" label="用户名称" min-width="120" />
        <ElTableColumn prop="plateNo" label="车牌号" min-width="120" />
        <ElTableColumn prop="orderNo" label="订单号" min-width="180" />
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
