<script lang="ts" setup>
import type { MerchantLinkRow, SyncLog } from '../data';

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
  maskApiKey,
  textObj,
  useCreateSchema,
  useEditSchema,
  useGridColumns,
  useSearchSchema,
} from '../data';

const props = withDefaults(
  defineProps<{
    links?: MerchantLinkRow[];
    showStats?: boolean;
    toggleStats?: () => void;
  }>(),
  {
    links: () => [],
    showStats: false,
    toggleStats: () => {},
  },
);

const emit = defineEmits<{
  'update:links': [value: MerchantLinkRow[]];
}>();

const links = computed({
  get: () => props.links,
  set: (value: MerchantLinkRow[]) => {
    emit('update:links', value);
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

function createSyncLog(content: string, result = '成功'): SyncLog {
  return {
    content,
    result,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
}

function getStatusTagType(status: MerchantLinkRow['status']) {
  return status === '已对接' ? 'success' : 'warning';
}

function formatSyncLogs(logs: SyncLog[] = []) {
  if (!logs.length) {
    return '暂无同步日志';
  }

  return logs
    .map((item) => `${item.time} ${item.result}：${item.content}`)
    .join('\n');
}

function isValidHttpUrl(url: string) {
  return /^https?:\/\//.test(url);
}

const currentMerchantProfile = ref<Record<string, string>>();
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MerchantLinkRow>();
const formData = ref<MerchantLinkRow>();
const formMode = ref<'create' | 'edit'>('create');
const merchantDialogVisible = ref(false);

const detailFields = ref([
  { key: 'merchantName', label: '商户名称' },
  {
    key: 'linkType',
    label: '对接类型',
    type: 'tag',
    tagType: () => 'primary',
  },
  { key: 'apiUrl', label: '接口地址' },
  { key: 'maskedApiKey', label: '对接密钥' },
  {
    key: 'status',
    label: '对接状态',
    type: 'tag',
    tagType: (value: string) =>
      getStatusTagType(value as MerchantLinkRow['status']),
  },
  { key: 'effectTime', label: '生效时间' },
  { key: 'lastSyncTime', label: '最后同步时间' },
  { key: 'syncLogSummary', label: '同步日志' },
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
    maskedApiKey: maskApiKey(detailObj.value.apiKey),
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

    const values = (await formApi.getValues()) as Record<string, string>;
    if (!isValidHttpUrl(values.apiUrl || '')) {
      ElMessage.warning('请输入正确的接口地址');
      return;
    }

    if (formMode.value === 'create') {
      const id = Math.max(0, ...links.value.map((item) => item.id)) + 1;
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

      links.value = [
        {
          id,
          merchantId: id,
          merchantName: values.merchantName || '',
          linkType: values.linkType || '',
          apiUrl: values.apiUrl || '',
          apiKey: values.apiKey || '',
          status: '未对接',
          effectTime: '-',
          lastSyncTime: '-',
          creator: 'admin',
          createTime: now,
          updateTime: now,
          remark: values.remark || '',
          syncLogs: [],
        },
        ...links.value,
      ];
      ElMessage.success('新增对接配置成功');
    } else {
      links.value = links.value.map((item) => {
        if (item.id !== formData.value?.id) {
          return item;
        }

        return {
          ...item,
          merchantName: values.merchantName || '',
          linkType: values.linkType || '',
          apiUrl: values.apiUrl || '',
          apiKey: values.apiKey || '',
          remark: values.remark || '',
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
      });
      ElMessage.success('对接配置已保存');
    }

    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }

    if (formMode.value === 'create') {
      formApi.resetForm();
      return;
    }

    if (formData.value) {
      await formApi.setValues({
        merchantName: formData.value.merchantName,
        linkType: formData.value.linkType,
        apiUrl: formData.value.apiUrl,
        apiKey: formData.value.apiKey,
        remark: formData.value.remark,
      });
    }
  },
});

/** 匹配筛选条件 */
function matchLink(item: MerchantLinkRow, formValues: Record<string, any>) {
  const merchantMatch =
    !formValues.merchantName ||
    item.merchantName.includes(formValues.merchantName);
  const linkTypeMatch =
    !formValues.linkType || item.linkType === formValues.linkType;
  const statusMatch = !formValues.status || item.status === formValues.status;
  const effectTime = formValues.effectTime || [];
  const effectTimeMatch =
    effectTime.length !== 2 ||
    (item.effectTime !== '-' &&
      dayjs(item.effectTime).isAfter(
        dayjs(effectTime[0]).subtract(1, 'second'),
      ) &&
      dayjs(item.effectTime).isBefore(dayjs(effectTime[1]).add(1, 'second')));

  return merchantMatch && linkTypeMatch && statusMatch && effectTimeMatch;
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
          const list = links.value.filter((item) =>
            matchLink(item, formValues),
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
  const list = links.value.filter((item) => matchLink(item, formValues));

  exportToExcel(buildExportRows(list), textObj.excelName, textObj.excelAllName);
}

/** 打开新增抽屉 */
function handleCreate() {
  formMode.value = 'create';
  formApi.setState(() => ({
    schema: useCreateSchema(),
  }));
  formDrawerApi.setData(null).open();
}

/** 打开编辑抽屉 */
function handleEdit(row: MerchantLinkRow) {
  formMode.value = 'edit';
  formData.value = row;
  formApi.setState(() => ({
    schema: useEditSchema(),
  }));
  formDrawerApi.setData(row).open();
}

/** 执行商户对接 */
function handleLink(row: MerchantLinkRow) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  links.value = links.value.map((item) => {
    if (item.id !== row.id) {
      return item;
    }

    return {
      ...item,
      status: '已对接',
      effectTime: now,
      lastSyncTime: now,
      updateTime: now,
      syncLogs: [
        createSyncLog('接口连通性测试通过并开启数据同步'),
        ...item.syncLogs,
      ],
    };
  });

  ElMessage.success('对接成功');
  handleRefresh();
}

/** 解除商户对接 */
function handleUnlink(row: MerchantLinkRow) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  links.value = links.value.map((item) => {
    if (item.id !== row.id) {
      return item;
    }

    return {
      ...item,
      status: '未对接',
      effectTime: '-',
      lastSyncTime: '-',
      updateTime: now,
      syncLogs: [createSyncLog('已断开对接并停止同步'), ...item.syncLogs],
    };
  });

  ElMessage.success('已断开对接');
  handleRefresh();
}

/** 打开详情抽屉 */
function handleDetail(row: MerchantLinkRow) {
  detailObj.value = row;
  detailDrawerRef.value?.open();
}

/** 打开商户详情弹窗 */
function handleOpenMerchant(row: MerchantLinkRow) {
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
                label: '查看',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.VIEW,
                onClick: handleDetail.bind(null, row),
              },
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
            ]"
          />
        </template>
      </Grid>
    </div>

    <FormDrawer :title="formData?.id ? textObj.editText : textObj.addText">
      <Form class="mx-4" />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="detailFields"
      :title="detailObj ? `${detailObj.merchantName}对接详情` : '商户对接详情'"
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
