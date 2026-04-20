<script lang="ts" setup>
import type { AuditLog, CreditChangeRecord, UserCreditRow } from '../data';

import { computed, ref } from 'vue';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElMessage,
  ElTag,
} from 'element-plus';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';

import {
  buildAuditLogs,
  buildExportRows,
  maskPhone,
  textObj,
  useGridColumns,
  useSearchSchema,
} from '../data';

const props = withDefaults(
  defineProps<{
    credits?: UserCreditRow[];
    showStats?: boolean;
    toggleStats?: () => void;
  }>(),
  {
    credits: () => [],
    showStats: false,
    toggleStats: () => {},
  },
);

const emit = defineEmits<{
  'update:credits': [value: UserCreditRow[]];
}>();

const credits = computed({
  get: () => props.credits,
  set: (value: UserCreditRow[]) => {
    emit('update:credits', value);
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

function appendAuditLog(row: UserCreditRow, log: AuditLog) {
  return {
    ...row,
    auditLogs: [...(row.auditLogs || []), log],
  };
}

function getCreditLevelTagType(level: UserCreditRow['creditLevel']) {
  switch (level) {
    case '优秀': {
      return 'success';
    }
    case '良好': {
      return 'primary';
    }
    case '中等': {
      return 'warning';
    }
    case '较差':
    case '极差': {
      return 'danger';
    }
    default: {
      return 'info';
    }
  }
}

function getCreditStatusTagType(status: UserCreditRow['creditStatus']) {
  return status === '正常信用' ? 'success' : 'danger';
}

function formatChangeRecords(records: CreditChangeRecord[] = []) {
  if (!records.length) {
    return '暂无评分明细';
  }

  return records
    .map(
      (item) =>
        `${item.changeTime} ${item.operator}：${item.beforeScore} -> ${item.afterScore}（${item.changeReason}）`,
    )
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
const detailObj = ref<UserCreditRow>();
const scoreFilter = ref<number | null>(null);
const userDialogVisible = ref(false);
const currentUser = ref<UserCreditRow>();

const detailFields = ref([
  { key: 'userName', label: '用户名称' },
  { key: 'maskedPhone', label: '联系手机号' },
  {
    key: 'userType',
    label: '用户类型',
    type: 'tag',
    tagType: () => 'primary',
  },
  { key: 'creditScore', label: '信用分' },
  {
    key: 'creditLevel',
    label: '信用等级',
    type: 'tag',
    tagType: (value: string) =>
      getCreditLevelTagType(value as UserCreditRow['creditLevel']),
  },
  {
    key: 'creditStatus',
    label: '记录状态',
    type: 'tag',
    tagType: (value: string) =>
      getCreditStatusTagType(value as UserCreditRow['creditStatus']),
  },
  { key: 'ruleCode', label: '评分规则编码' },
  { key: 'ruleDesc', label: '评分规则' },
  { key: 'updateTime', label: '更新时间' },
  { key: 'changeSummary', label: '评分明细' },
  { key: 'auditLogsSummary', label: '审计日志' },
  { key: 'remark', label: '备注' },
]);

const detailData = computed(() => {
  if (!detailObj.value) {
    return undefined;
  }

  return {
    ...detailObj.value,
    maskedPhone: maskPhone(detailObj.value.phone),
    changeSummary: formatChangeRecords(detailObj.value.changeRecords),
    auditLogsSummary: formatAuditLogs(detailObj.value.auditLogs),
  };
});

/** 匹配筛选条件 */
function matchCredit(item: UserCreditRow, formValues: Record<string, any>) {
  const userNameMatch =
    !formValues.userName || item.userName.includes(formValues.userName);
  const creditLevelMatch =
    !formValues.creditLevel || item.creditLevel === formValues.creditLevel;
  const scoreMatch =
    scoreFilter.value === null || item.creditScore === scoreFilter.value;
  const updateTime = formValues.updateTime || [];
  const updateTimeMatch =
    updateTime.length !== 2 ||
    (dayjs(item.updateTime).isAfter(
      dayjs(updateTime[0]).subtract(1, 'second'),
    ) &&
      dayjs(item.updateTime).isBefore(dayjs(updateTime[1]).add(1, 'second')));

  return userNameMatch && creditLevelMatch && scoreMatch && updateTimeMatch;
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
          const list = credits.value.filter((item) =>
            matchCredit(item, formValues),
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
  scoreFilter.value = null;
  await gridApi.formApi.resetForm();
  handleRefresh();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  scoreFilter.value = null;
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
  const list = credits.value.filter((item) => matchCredit(item, formValues));

  exportToExcel(buildExportRows(list), textObj.excelName, textObj.excelAllName);
}

/** 打开用户详情弹窗 */
function handleOpenUser(row: UserCreditRow) {
  currentUser.value = row;
  userDialogVisible.value = true;
}

/** 按信用分钻取列表 */
function handleFilterByScore(score: number) {
  scoreFilter.value = score;
  handleRefresh();
}

/** 按信用等级钻取列表 */
function handleFilterByLevel(level: UserCreditRow['creditLevel']) {
  void setSearchValues({ creditLevel: level });
}

/** 打开详情抽屉 */
function handleDetail(row: UserCreditRow) {
  detailObj.value = row.auditLogs?.length
    ? row
    : {
        ...row,
        auditLogs: buildAuditLogs(row),
      };
  detailDrawerRef.value?.open();
}

/** 发送低信用提醒 */
function handleRemind(row: UserCreditRow) {
  credits.value = credits.value.map((item) => {
    if (item.id !== row.id) {
      return item;
    }

    return appendAuditLog(
      {
        ...item,
        updater: '李主管',
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        auditSummary: '发送低信用提醒',
      },
      createAuditLog('李主管', '发送低信用提醒'),
    );
  });

  ElMessage.success(`已向 ${row.userName} 发送信用提醒`);
  handleRefresh();
}
</script>

<template>
  <div class="user-credit-table">
    <div class="user-credit-grid-wrap">
      <Grid table-title="用户信用列表">
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

        <template #userName="{ row }">
          <ElButton type="primary" link @click="handleOpenUser(row)">
            {{ row.userName }}
          </ElButton>
        </template>

        <template #creditScore="{ row }">
          <ElButton
            type="primary"
            link
            @click="handleFilterByScore(row.creditScore)"
          >
            {{ row.creditScore }}
          </ElButton>
        </template>

        <template #creditLevel="{ row }">
          <ElButton
            type="primary"
            link
            @click="handleFilterByLevel(row.creditLevel)"
          >
            <ElTag :type="getCreditLevelTagType(row.creditLevel)">
              {{ row.creditLevel }}
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
                label: '提醒',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.creditStatus === '低信用',
                onClick: handleRemind.bind(null, row),
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
      :title="detailObj ? `${detailObj.userName}信用详情` : '信用详情'"
    />

    <ElDialog v-model="userDialogVisible" title="用户详情" width="520px">
      <ElDescriptions v-if="currentUser" :column="1" border>
        <ElDescriptionsItem label="用户名称">
          {{ currentUser.userName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系手机号">
          {{ maskPhone(currentUser.phone) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="用户类型">
          {{ currentUser.userType }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="信用等级">
          {{ currentUser.creditLevel }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="信用分">
          {{ currentUser.creditScore }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="更新时间">
          {{ currentUser.updateTime }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.user-credit-table,
.user-credit-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.user-credit-table {
  display: flex;
  flex-direction: column;
}

.user-credit-grid-wrap {
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
