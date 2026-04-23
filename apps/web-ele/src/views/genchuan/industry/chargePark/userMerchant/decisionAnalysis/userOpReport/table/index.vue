<script lang="ts" setup>
import type { UserOpReportRow } from '../data';

import type { UserOpReportDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/decisionAnalysis/userOpReport';

import { computed, ref } from 'vue';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElDrawer,
  ElInput,
  ElLoading,
  ElMessage,
  ElTag,
} from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { UserOpReportApi } from '#/api/genchuan/industry/chargePark/userMerchant/decisionAnalysis/userOpReport';
import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import {
  buildDetailStatsData,
  buildUserOpReportQueryParams,
  buildUserOpReportRowFromApi,
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

const detailCache = new Map<number, UserOpReportDetailVO>();
const detailDrawerVisible = ref(false);
const detailReport = ref<UserOpReportRow>();
const generateDialogVisible = ref(false);
const generateFilterPlaceholder =
  '例如：{"userType":"个人用户","statTime":"2026-04-01,2026-04-20"}';
const generateForm = ref({
  filterCondition: '',
  remark: '',
});

const detailStatsData = computed(() =>
  buildDetailStatsData(detailReport.value),
);

/** 获取状态标签颜色 */
function getStatusTagType(status: string) {
  return status === '已生成' ? 'success' : 'warning';
}

/** 获取报表详情 */
async function fetchUserOpReportDetail(
  row: UserOpReportRow,
  errorMessage = '加载报表详情失败',
) {
  const cachedDetail = detailCache.get(row.id);
  const loadingInstance = ElLoading.service({
    target: '.user-op-report-table',
    text: '加载中...',
  });

  try {
    const detail =
      cachedDetail || (await UserOpReportApi.getUserOpReport(row.id));

    if (!cachedDetail) {
      detailCache.set(row.id, detail);
    }

    const chartData = await UserOpReportApi.getUserOpReportChart({
      reportId: row.id,
    });

    return buildUserOpReportRowFromApi(detail, row, chartData);
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[userOpReport] load detail failed:', error);
    return null;
  } finally {
    loadingInstance.close();
  }
}

/** 查询报表列表 */
async function queryUserOpReportPage(
  { page }: { page: { currentPage: number; pageSize: number } },
  formValues: Record<string, any>,
) {
  const result = await UserOpReportApi.getUserOpReportPage({
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...buildUserOpReportQueryParams(formValues),
  });
  const list = Array.isArray(result?.list) ? result.list : [];

  return {
    list: list.map((item) => buildUserOpReportRowFromApi(item)),
    total: Number(result?.total || 0),
  };
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useSearchSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Form'], ['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: queryUserOpReportPage,
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
  await gridApi.formApi.resetForm();
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

/** 打开报表详情抽屉 */
async function handleOpenDetail(row: UserOpReportRow) {
  const detail = await fetchUserOpReportDetail(row);

  if (!detail) {
    return;
  }

  detailReport.value = detail;
  detailDrawerVisible.value = true;
}

/** 导出当前列表 */
async function handleExport() {
  const formValues = await gridApi.formApi.getValues();

  try {
    await UserOpReportApi.exportUserOpReport(
      buildUserOpReportQueryParams(formValues),
    );
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error('[userOpReport] export failed:', error);
  }
}

/** 导出单条报表 */
async function handleExportRow(row: UserOpReportRow) {
  try {
    await UserOpReportApi.exportUserOpReport({
      createTime: row.createTime,
      reportType: row.reportType,
      statTime: row.statTime,
      timeScale: row.timeScale,
    });
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error('[userOpReport] export row failed:', error);
  }
}

/** 确认生成自定义报表 */
async function handleConfirmGenerate() {
  if (!generateForm.value.filterCondition.trim()) {
    ElMessage.warning('请输入自定义筛选条件');
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.user-op-report-table',
    text: '生成中...',
  });

  try {
    await UserOpReportApi.generateUserOpReport({
      filterCondition: generateForm.value.filterCondition.trim(),
      remark: generateForm.value.remark.trim(),
    });
    generateDialogVisible.value = false;
    generateForm.value = {
      filterCondition: '',
      remark: '',
    };
    ElMessage.success('自定义报表已生成');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('生成失败');
    console.error('[userOpReport] generate failed:', error);
  } finally {
    loadingInstance.close();
  }
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
          <ElDescriptionsItem label="筛选条件">
            {{ detailReport.filterCondition || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="分析摘要">
            {{ detailReport.summary }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="同比环比分析">
            {{ detailReport.compareSummary }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="备注">
            {{ detailReport.remark || '-' }}
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
          :placeholder="generateFilterPlaceholder"
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
