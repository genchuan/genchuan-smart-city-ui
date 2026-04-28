<script lang="ts" setup>
import type {
  MerchantLinkRow,
  MerchantProfileInfo,
  MerchantSelectOption,
} from '../data';

import type { MerchantInfoDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import type {
  MerchantLinkDetailVO,
  MerchantLinkPageReqVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantLink';

import { computed, nextTick, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElLoading,
  ElMessage,
  ElTag,
} from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { MerchantInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
import { MerchantLinkApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantLink';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';

import {
  buildExportRows,
  buildMerchantLinkQueryParams,
  buildMerchantLinkRowFromApi,
  buildMerchantOptionsFromApi,
  buildMerchantProfile,
  buildMerchantProfileLookup,
  formatApiTime,
  formatSyncLogs,
  maskApiKey,
  maskPhone,
  detailFields as merchantLinkDetailFields,
  merchantOptions,
  textObj,
  useCreateSchema,
  useEditSchema,
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
const detailCache = new Map<number, MerchantLinkDetailVO>();
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MerchantLinkRow>();
const formData = ref<MerchantLinkRow>();
const formMode = ref<'create' | 'edit'>('create');
const formSource = ref<MerchantLinkDetailVO>();
const merchantDetailCache = new Map<number, MerchantInfoDetailVO>();
const merchantDialogVisible = ref(false);
const merchantProfileLookup = ref(buildMerchantProfileLookup(merchantOptions));
const merchantSelectOptions = ref<MerchantSelectOption[]>(merchantOptions);

const detailData = computed(() => {
  if (!detailObj.value) {
    return null;
  }

  return {
    ...detailObj.value,
    maskedApiKey: maskApiKey(detailObj.value.apiKey),
    maskedMerchantPhone: maskPhone(detailObj.value.merchantPhone),
    syncLogSummary: formatSyncLogs(detailObj.value.syncLogs),
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
  schema: useCreateSchema(merchantSelectOptions.value),
  showDefaultActions: false,
});

/** 校验接口地址 */
function isValidHttpUrl(url: string) {
  return /^https?:\/\//.test(url);
}

/** 获取状态标签色 */
function getStatusTagType(status: MerchantLinkRow['status']) {
  return status === '已对接' ? 'success' : 'warning';
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
    console.error('[merchantLink] load merchant options failed:', error);
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
    console.error('[merchantLink] load merchant detail failed:', error);
    return null;
  }
}

/** 获取对接详情 */
async function fetchMerchantLinkDetail(
  row: MerchantLinkRow,
  errorMessage = '加载对接详情失败',
) {
  const cachedDetail = detailCache.get(row.id);

  if (cachedDetail) {
    return {
      row: buildMerchantLinkRowFromApi(
        cachedDetail,
        row,
        merchantProfileLookup.value,
      ),
      source: cachedDetail,
    };
  }

  const loadingInstance = ElLoading.service({
    target: '.merchant-link-table',
    text: '加载中...',
  });

  try {
    const data = await MerchantLinkApi.getMerchantLink(row.id);
    detailCache.set(row.id, data);

    return {
      row: buildMerchantLinkRowFromApi(data, row, merchantProfileLookup.value),
      source: data,
    };
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[merchantLink] load detail failed:', error);
    return null;
  } finally {
    loadingInstance.close();
  }
}

/** 查询商户对接列表 */
async function queryMerchantLinkPage(
  { page }: any,
  formValues: Record<string, any>,
) {
  const params: MerchantLinkPageReqVO = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...buildMerchantLinkQueryParams(formValues),
  };
  const result = await MerchantLinkApi.getMerchantLinkPage(params);
  const list = Array.isArray(result?.list) ? result.list : [];

  return {
    list: list.map((item) =>
      buildMerchantLinkRowFromApi(item, {}, merchantProfileLookup.value),
    ),
    total: result?.total || 0,
  };
}

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
    const merchantId = Number(values.merchantId ?? 0);

    if (!merchantId) {
      ElMessage.warning('请选择商户名称');
      return;
    }

    if (!isValidHttpUrl(values.apiUrl || '')) {
      ElMessage.warning('请输入正确的接口地址');
      return;
    }

    const loadingInstance = ElLoading.service({
      target: '.merchant-link-table',
      text: formMode.value === 'create' ? '保存中...' : '更新中...',
    });

    try {
      if (formMode.value === 'create') {
        await MerchantLinkApi.createMerchantLink({
          apiKey: values.apiKey || '',
          apiUrl: values.apiUrl || '',
          linkType: values.linkType || '',
          merchantId,
          remark: values.remark || '',
          status: '未对接',
        });
        ElMessage.success('新增成功');
      } else if (formData.value) {
        await MerchantLinkApi.updateMerchantLink({
          apiKey: values.apiKey || '',
          apiUrl: values.apiUrl || '',
          effectTime:
            formSource.value?.effectTime === null ||
            formSource.value?.effectTime === undefined
              ? undefined
              : String(formSource.value.effectTime),
          id: formData.value.id,
          linkType: values.linkType || '',
          merchantId,
          remark: values.remark || '',
          reserve1: formSource.value?.reserve1,
          reserve2: formSource.value?.reserve2,
          status: formSource.value?.status || formData.value.status,
        });
        ElMessage.success('编辑成功');
      }

      await handleReloadPage();
      formDrawerApi.close();
    } catch (error) {
      ElMessage.error(formMode.value === 'create' ? '新增失败' : '编辑失败');
      console.error('[merchantLink] save failed:', error);
    } finally {
      loadingInstance.close();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      formData.value = undefined;
      formSource.value = undefined;
      return;
    }

    if (formMode.value === 'create') {
      await formApi.resetForm();
      await formApi.setValues({
        apiKey: '',
        apiUrl: '',
        linkType: undefined,
        merchantId: undefined,
        remark: '',
      });
      return;
    }

    if (formData.value) {
      await formApi.setValues({
        apiKey: formSource.value?.apiKey || formData.value.apiKey || '',
        apiUrl: formData.value.apiUrl,
        linkType: formData.value.linkType,
        merchantId: formData.value.merchantId,
        remark: formData.value.remark,
      });
    }
  },
});

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
        query: queryMerchantLinkPage,
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
    target: '.merchant-link-table',
    text: '导出中...',
  });

  try {
    const formValues = await gridApi.formApi.getValues();
    const result = await MerchantLinkApi.getMerchantLinkPage({
      pageNo: 1,
      pageSize: 9999,
      ...buildMerchantLinkQueryParams(formValues),
    });
    const list = Array.isArray(result?.list) ? result.list : [];

    exportToExcel(
      buildExportRows(
        list.map((item) =>
          buildMerchantLinkRowFromApi(item, {}, merchantProfileLookup.value),
        ),
      ),
      textObj.excelName,
      textObj.excelAllName,
    );
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error('[merchantLink] export failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开新增抽屉 */
function handleCreate() {
  formMode.value = 'create';
  formData.value = undefined;
  formSource.value = undefined;
  formApi.setState(() => ({
    schema: useCreateSchema(merchantSelectOptions.value),
  }));
  formDrawerApi.setData(null).open();
}

/** 打开编辑抽屉 */
async function handleEdit(row: MerchantLinkRow) {
  const detail = await fetchMerchantLinkDetail(row);

  if (!detail) {
    return;
  }

  formMode.value = 'edit';
  formData.value = detail.row;
  formSource.value = detail.source;
  formApi.setState(() => ({
    schema: useEditSchema(merchantSelectOptions.value),
  }));
  formDrawerApi.setData(detail.row).open();
}

/** 执行商户对接 */
async function handleLink(row: MerchantLinkRow) {
  const loadingInstance = ElLoading.service({
    target: '.merchant-link-table',
    text: '对接中...',
  });

  try {
    await MerchantLinkApi.linkMerchant({
      ids: [row.id],
    });
    ElMessage.success('对接成功');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('对接失败');
    console.error('[merchantLink] link failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 断开商户对接 */
async function handleUnlink(row: MerchantLinkRow) {
  const loadingInstance = ElLoading.service({
    target: '.merchant-link-table',
    text: '断开中...',
  });

  try {
    await MerchantLinkApi.unlinkMerchant({
      ids: [row.id],
    });
    ElMessage.success('已断开对接');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('断开失败');
    console.error('[merchantLink] unlink failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开详情抽屉 */
async function handleDetail(row: MerchantLinkRow) {
  const detail = await fetchMerchantLinkDetail(row);

  if (!detail) {
    return;
  }

  detailObj.value = detail.row;
  detailDrawerRef.value?.open();
}

/** 打开商户详情弹窗 */
async function handleOpenMerchant(row: MerchantLinkRow) {
  const loadingInstance = ElLoading.service({
    target: '.merchant-link-table',
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
  <div class="merchant-link-table">
    <div class="merchant-link-grid-wrap">
      <Grid table-title="商户对接列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                onClick: handleCreate,
              },
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

        <template #linkType="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ linkType: row.linkType })"
          >
            {{ row.linkType }}
          </ElButton>
        </template>

        <template #apiKey="{ row }">
          {{ maskApiKey(row.apiKey) }}
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
                label: '对接',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '未对接',
                onClick: handleLink.bind(null, row),
              },
              {
                label: '断开',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.DELETE,
                ifShow: () => row.status === '已对接',
                popConfirm: {
                  title: `确认断开${row.merchantName}的对接吗？`,
                  confirm: handleUnlink.bind(null, row),
                },
              },
              {
                label: '编辑',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.EDIT,
                onClick: handleEdit.bind(null, row),
              },
              {
                label: '查看',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.VIEW,
                onClick: handleDetail.bind(null, row),
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <FormDrawer
      :title="formMode === 'edit' ? textObj.editText : textObj.addText"
    >
      <Form class="mx-4" />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="merchantLinkDetailFields"
      :title="detailObj ? `${detailObj.merchantName}对接详情` : '商户对接详情'"
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
  </div>
</template>

<style scoped lang="scss">
.merchant-link-table,
.merchant-link-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.merchant-link-table {
  display: flex;
  flex-direction: column;
}

.merchant-link-grid-wrap {
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
