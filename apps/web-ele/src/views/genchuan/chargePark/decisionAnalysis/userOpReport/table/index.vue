<script lang="ts" setup>
import type { UserOpReportRow } from '../data';

import { computed, ref } from 'vue';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElDrawer,
  ElInput,
  ElMessage,
  ElTag,
} from 'element-plus';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';
import { exportToExcel } from '#/utils/excel.js';

import {
  buildDetailExportRows,
  buildDetailStatsData,
  useGridColumns,
  useSearchSchema,
} from '../data';

const props = withDefaults(
  defineProps<{
    reports?: UserOpReportRow[];
    showStats?: boolean;
    toggleStats?: () => void;
  }>(),
  {
    reports: () => [],
    showStats: false,
    toggleStats: () => {},
  },
);

const emit = defineEmits<{
  'update:reports': [value: UserOpReportRow[]];
}>();

const reports = computed({
  get: () => props.reports,
  set: (value: UserOpReportRow[]) => {
    emit('update:reports', value);
  },
});

const checkedIds = ref<number[]>([]);
const detailDrawerVisible = ref(false);
const detailReport = ref<UserOpReportRow>();
const generateDialogVisible = ref(false);
const generateForm = ref({
  filterCondition: '',
  remark: '',
});

function getStatusTagType(status: string) {
  return status === '已生成' ? 'success' : 'warning';
}

function buildCustomReport() {
  const latest = reports.value[0];
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const id = Math.max(0, ...reports.value.map((item) => item.id)) + 1;
  const baseUserCount = latest?.coreIndex.totalUserCount || 1200;
  const baseMemberCount = latest?.coreIndex.totalMemberCount || 760;

  return {
    id,
    reportType: '自定义报表',
    timeScale: '自定义',
    statTime: `${dayjs().subtract(30, 'day').format('YYYY-MM-DD')} 00:00:00 ~ ${dayjs().format('YYYY-MM-DD')} 23:59:59`,
    createTime: now,
    filterCondition: generateForm.value.filterCondition,
    creator: 'admin',
    remark: generateForm.value.remark || '按筛选条件生成的自定义报表',
    status: '已生成',
    summary: '根据当前筛选条件生成自定义报表，用户趋势保持稳定增长。',
    compareSummary:
      '较上一统计周期，自定义报表覆盖范围内用户增长约 3.5%，会员转化同步提升。',
    coreIndex: {
      totalUserCount: baseUserCount + 18,
      totalMemberCount: baseMemberCount + 12,
      avgCreditScore: latest?.coreIndex.avgCreditScore || 92,
      userGrowthRate: 0.035,
    },
    userOpTrend: [
      {
        date: '第1周',
        userCount: baseUserCount - 30,
        memberCount: baseMemberCount - 20,
      },
      {
        date: '第2周',
        userCount: baseUserCount - 12,
        memberCount: baseMemberCount - 8,
      },
      {
        date: '第3周',
        userCount: baseUserCount + 4,
        memberCount: baseMemberCount + 2,
      },
      {
        date: '第4周',
        userCount: baseUserCount + 18,
        memberCount: baseMemberCount + 12,
      },
    ],
    userTypeDistribution: [
      { type: '个人用户', count: Math.round((baseUserCount + 18) * 0.8) },
      { type: '小程序用户', count: Math.round((baseUserCount + 18) * 0.15) },
      { type: '平台用户', count: Math.round((baseUserCount + 18) * 0.05) },
    ],
  } as UserOpReportRow;
}

const detailStatsData = computed(() =>
  buildDetailStatsData(detailReport.value),
);

/** 匹配筛选条件 */
function matchReport(item: UserOpReportRow, formValues: Record<string, any>) {
  const reportTypeMatch =
    !formValues.reportType || item.reportType === formValues.reportType;
  const timeScaleMatch =
    !formValues.timeScale || item.timeScale === formValues.timeScale;
  const statTime = formValues.statTime || [];

  if (statTime.length !== 2) {
    return reportTypeMatch && timeScaleMatch;
  }

  const statStart = item.statTime.split('~')[0]?.trim();
  if (!statStart) {
    return false;
  }

  const statTimeMatch =
    dayjs(statStart).isAfter(dayjs(statTime[0]).subtract(1, 'second')) &&
    dayjs(statStart).isBefore(dayjs(statTime[1]).add(1, 'second'));

  return reportTypeMatch && timeScaleMatch && statTimeMatch;
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
          const list = reports.value.filter((item) =>
            matchReport(item, formValues),
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

/** 同步勾选记录 */
function handleRowCheckboxChange({ records }: { records: UserOpReportRow[] }) {
  checkedIds.value = records.map((item) => item.id);
}

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 重置筛选条件 */
async function resetSearch() {
  checkedIds.value = [];
  await gridApi.formApi.resetForm();
  handleRefresh();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  checkedIds.value = [];
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

/** 打开报表详情抽屉 */
function handleOpenDetail(row: UserOpReportRow) {
  detailReport.value = row;
  detailDrawerVisible.value = true;
}

/** 导出单条报表 */
function handleExportRow(row: UserOpReportRow) {
  exportToExcel(
    buildDetailExportRows([row]),
    `${row.reportType}详情`,
    `${row.reportType}-${dayjs().format('YYYYMMDDHHmmss')}.xlsx`,
  );
}

/** 导出勾选报表 */
function handleExportSelected() {
  if (!checkedIds.value.length) {
    ElMessage.warning('请先勾选要导出的报表');
    return;
  }

  const selectedReports = reports.value.filter((item) =>
    checkedIds.value.includes(item.id),
  );

  exportToExcel(
    buildDetailExportRows(selectedReports),
    '用户运营报表',
    '用户运营报表导出.xlsx',
  );
}

/** 确认生成自定义报表 */
function handleConfirmGenerate() {
  if (!generateForm.value.filterCondition.trim()) {
    ElMessage.warning('请输入自定义筛选条件');
    return;
  }

  reports.value = [buildCustomReport(), ...reports.value];
  generateDialogVisible.value = false;
  generateForm.value = {
    filterCondition: '',
    remark: '',
  };
  ElMessage.success('自定义报表已生成');
  handleRefresh();
}
</script>

<template>
  <div class="user-op-report-table">
    <div class="user-op-report-grid-wrap">
      <Grid table-title="用户运营报表列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '生成自定义报表',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                onClick: () => (generateDialogVisible = true),
              },
              {
                label: '导出',
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                onClick: handleExportSelected,
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

        <template #reportType="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ reportType: row.reportType })"
          >
            {{ row.reportType }}
          </ElButton>
        </template>

        <template #filterCondition="{ row }">
          <span>{{ row.filterCondition || '-' }}</span>
        </template>

        <template #status="{ row }">
          <ElTag :type="getStatusTagType(row.status)">
            {{ row.status }}
          </ElTag>
        </template>

        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: '查看',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.VIEW,
                onClick: handleOpenDetail.bind(null, row),
              },
              {
                label: '导出',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.DOWNLOAD,
                onClick: handleExportRow.bind(null, row),
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <ElDrawer
      v-model="detailDrawerVisible"
      :title="detailReport ? `${detailReport.reportType}详情` : '报表详情'"
      direction="rtl"
      size="56%"
    >
      <div v-if="detailReport" class="report-detail-body">
        <ElDescriptions :column="1" border>
          <ElDescriptionsItem label="报表类型">
            {{ detailReport.reportType }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="时间尺度">
            {{ detailReport.timeScale }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="统计时间">
            {{ detailReport.statTime }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="生成时间">
            {{ detailReport.createTime }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="数据范围">
            {{ detailReport.filterCondition || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="分析摘要">
            {{ detailReport.summary }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="同比环比分析">
            {{ detailReport.compareSummary }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="备注">
            {{ detailReport.remark }}
          </ElDescriptionsItem>
        </ElDescriptions>

        <div class="report-detail-stats">
          <StatsVisualization :data="detailStatsData" />
        </div>
      </div>

      <template #footer>
        <div class="report-detail-footer">
          <ElButton @click="detailDrawerVisible = false">关闭</ElButton>
          <ElButton
            v-if="detailReport"
            type="primary"
            @click="handleExportRow(detailReport)"
          >
            导出
          </ElButton>
        </div>
      </template>
    </ElDrawer>

    <ElDialog
      v-model="generateDialogVisible"
      title="生成自定义报表"
      width="560px"
    >
      <div class="generate-form">
        <div class="generate-label">
          筛选条件
          <span class="generate-required">*</span>
        </div>
        <ElInput
          v-model="generateForm.filterCondition"
          :rows="4"
          maxlength="500"
          placeholder='例如：{"userType":"个人用户","statTime":"2026-04-01,2026-04-20"}'
          show-word-limit
          type="textarea"
        />
        <div class="generate-label">备注</div>
        <ElInput
          v-model="generateForm.remark"
          maxlength="100"
          placeholder="请输入报表备注"
        />
      </div>
      <template #footer>
        <ElButton @click="generateDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleConfirmGenerate">
          生成
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.user-op-report-table,
.user-op-report-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.user-op-report-table {
  display: flex;
  flex-direction: column;
}

.user-op-report-grid-wrap {
  flex: 1;
}

.report-detail-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  padding-right: 12px;
  overflow: auto;
}

.report-detail-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.report-detail-stats {
  flex-shrink: 0;
}

.generate-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.generate-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.generate-required {
  color: var(--el-color-danger);
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
