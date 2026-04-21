<script lang="ts" setup>
import type { AuditLog, CreditConfigRow } from '../data';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElMessage, ElTag } from 'element-plus';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  buildAuditLogs,
  classifyConfigType,
  textObj,
  useCreateSchema,
  useEditSchema,
  useGridColumns,
  useSearchSchema,
} from '../data';

const props = withDefaults(
  defineProps<{
    configs?: CreditConfigRow[];
    showStats?: boolean;
    toggleStats?: () => void;
  }>(),
  {
    configs: () => [],
    showStats: false,
    toggleStats: () => {},
  },
);

const emit = defineEmits<{
  'update:configs': [value: CreditConfigRow[]];
}>();

const configs = computed({
  get: () => props.configs,
  set: (value: CreditConfigRow[]) => {
    emit('update:configs', value);
  },
});

function createAuditLog(
  operator: string,
  content: string,
  remark = '',
): AuditLog {
  return {
    content,
    operator,
    remark,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
}

function appendAuditLog(row: CreditConfigRow, log: AuditLog) {
  return {
    ...row,
    auditLogs: [...(row.auditLogs || []), log],
  };
}

function getStatusTagType(status: CreditConfigRow['status']) {
  return status === '已生效' ? 'success' : 'warning';
}

function formatApplyRecords(records: CreditConfigRow['applyRecords'] = []) {
  if (!records.length) {
    return '暂无评分应用记录';
  }

  return records
    .map((item) => `${item.time} ${item.applyTarget}：${item.applyResult}`)
    .join('\n');
}

function formatAuditLogs(logs?: AuditLog[]) {
  if (!logs?.length) {
    return '暂无审计日志';
  }

  return logs
    .map((item) => {
      const remark = item.remark ? `（${item.remark}）` : '';
      return `${item.time} ${item.operator}：${item.content}${remark}`;
    })
    .join('\n');
}

const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<CreditConfigRow>();
const formData = ref<CreditConfigRow>();
const formMode = ref<'create' | 'edit'>('create');

const detailFields = ref([
  { key: 'configType', label: '配置类型' },
  { key: 'ruleDesc', label: '加减分规则' },
  { key: 'levelThreshold', label: '等级阈值' },
  {
    key: 'status',
    label: '配置状态',
    type: 'tag',
    tagType: (value: string) =>
      getStatusTagType(value as CreditConfigRow['status']),
  },
  { key: 'effectTime', label: '生效时间' },
  { key: 'applySummary', label: '评分应用记录' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updater', label: '最后更新人' },
  { key: 'updateTime', label: '最后更新时间' },
  { key: 'auditLogsSummary', label: '审计日志' },
  { key: 'remark', label: '备注' },
]);

const detailData = computed(() => {
  if (!detailObj.value) {
    return undefined;
  }

  return {
    ...detailObj.value,
    applySummary: formatApplyRecords(detailObj.value.applyRecords),
    auditLogsSummary: formatAuditLogs(detailObj.value.auditLogs),
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
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const values = (await formApi.getValues()) as Record<string, string>;

    if (formMode.value === 'create') {
      const duplicateRule = configs.value.some(
        (item) => item.ruleDesc === values.ruleDesc,
      );
      if (duplicateRule) {
        ElMessage.warning('该信用规则已存在');
        return;
      }

      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const id = Math.max(0, ...configs.value.map((item) => item.id)) + 1;

      configs.value = [
        {
          id,
          configType: classifyConfigType(values.ruleDesc || ''),
          ruleDesc: values.ruleDesc || '',
          levelThreshold: values.levelThreshold || '',
          status: '未生效',
          effectTime: '-',
          remark: values.remark || '',
          creator: 'admin',
          createTime: now,
          updater: 'admin',
          updateTime: now,
          accuracy: 0.9,
          applyRecords: [],
          auditLogs: [createAuditLog('admin', '创建信用配置')],
          auditSummary: '创建信用配置',
        },
        ...configs.value,
      ];
      ElMessage.success('新增成功');
    } else {
      configs.value = configs.value.map((item) => {
        if (item.id !== formData.value?.id) {
          return item;
        }

        return appendAuditLog(
          {
            ...item,
            configType: classifyConfigType(values.ruleDesc || ''),
            ruleDesc: values.ruleDesc || '',
            levelThreshold: values.levelThreshold || '',
            remark: values.remark || '',
            updater: '李主管',
            updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            auditSummary: '编辑信用配置',
          },
          createAuditLog('李主管', '编辑信用配置'),
        );
      });
      ElMessage.success('编辑成功');
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
      await formApi.setValues({
        remark: '',
      });
      return;
    }

    if (formData.value) {
      await formApi.setValues({
        ruleDesc: formData.value.ruleDesc,
        levelThreshold: formData.value.levelThreshold,
        remark: formData.value.remark,
      });
    }
  },
});

/** 匹配筛选条件 */
function matchConfig(item: CreditConfigRow, formValues: Record<string, any>) {
  const ruleDescMatch =
    !formValues.ruleDesc || item.ruleDesc.includes(formValues.ruleDesc);
  const levelThresholdMatch =
    !formValues.levelThreshold ||
    item.levelThreshold.includes(formValues.levelThreshold);
  const statusMatch = !formValues.status || item.status === formValues.status;
  const effectTime = formValues.effectTime || [];
  const effectTimeMatch =
    effectTime.length !== 2 ||
    (item.effectTime !== '-' &&
      dayjs(item.effectTime).isAfter(
        dayjs(effectTime[0]).subtract(1, 'second'),
      ) &&
      dayjs(item.effectTime).isBefore(dayjs(effectTime[1]).add(1, 'second')));

  return ruleDescMatch && levelThresholdMatch && statusMatch && effectTimeMatch;
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
        query: async (
          { page }: { page: { currentPage: number; pageSize: number } },
          formValues: Record<string, any>,
        ) => {
          const list = configs.value.filter((item) =>
            matchConfig(item, formValues),
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

/** 打开新增抽屉 */
function handleCreate() {
  formMode.value = 'create';
  formApi.setState(() => ({
    schema: useCreateSchema(),
  }));
  formDrawerApi.setData(null).open();
}

/** 打开编辑抽屉 */
function handleEdit(row: CreditConfigRow) {
  formMode.value = 'edit';
  formData.value = row;
  formApi.setState(() => ({
    schema: useEditSchema(),
  }));
  formDrawerApi.setData(row).open();
}

/** 打开详情抽屉 */
function handleDetail(row: CreditConfigRow) {
  detailObj.value = row.auditLogs?.length
    ? row
    : {
        ...row,
        auditLogs: buildAuditLogs(row),
      };
  detailDrawerRef.value?.open();
}

/** 启用信用配置 */
function handleEnable(row: CreditConfigRow) {
  configs.value = configs.value.map((item) => {
    if (item.id !== row.id) {
      return item;
    }

    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    return appendAuditLog(
      {
        ...item,
        status: '已生效',
        effectTime: now,
        updater: '李主管',
        updateTime: now,
        auditSummary: '启用信用配置',
      },
      createAuditLog('李主管', '启用信用配置'),
    );
  });

  ElMessage.success('信用配置已生效');
  handleRefresh();
}

/** 禁用信用配置 */
function handleDisable(row: CreditConfigRow) {
  configs.value = configs.value.map((item) => {
    if (item.id !== row.id) {
      return item;
    }

    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    return appendAuditLog(
      {
        ...item,
        status: '未生效',
        updater: '李主管',
        updateTime: now,
        auditSummary: '禁用信用配置',
      },
      createAuditLog('李主管', '禁用信用配置'),
    );
  });

  ElMessage.success('信用配置已禁用');
  handleRefresh();
}
</script>

<template>
  <div class="credit-config-table">
    <div class="credit-config-grid-wrap">
      <Grid table-title="信用配置列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增配置',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                onClick: handleCreate,
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

        <template #ruleDesc="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ ruleDesc: row.ruleDesc })"
          >
            {{ row.ruleDesc }}
          </ElButton>
        </template>

        <template #levelThreshold="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ levelThreshold: row.levelThreshold })"
          >
            {{ row.levelThreshold }}
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
                label: '编辑',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.EDIT,
                onClick: handleEdit.bind(null, row),
              },
              {
                label: '生效',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '未生效',
                onClick: handleEnable.bind(null, row),
              },
              {
                label: '禁用',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.DELETE,
                ifShow: () => row.status === '已生效',
                popConfirm: {
                  title: `确认禁用当前信用配置吗？`,
                  confirm: handleDisable.bind(null, row),
                },
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
      :fields="detailFields"
      :title="detailObj ? `${detailObj.configType}详情` : '信用配置详情'"
    />
  </div>
</template>

<style scoped lang="scss">
.credit-config-table,
.credit-config-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.credit-config-table {
  display: flex;
  flex-direction: column;
}

.credit-config-grid-wrap {
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
