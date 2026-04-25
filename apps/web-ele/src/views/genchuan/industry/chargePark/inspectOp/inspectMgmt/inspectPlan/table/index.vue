<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createInspectPlan,
  exportInspectPlan,
  getInspectPlanDetail,
  getInspectPlanPage,
  updateInspectPlan,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectPlan';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import ImportExcelDialog from '../components/ImportExcelDialog.vue';
import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import {
  auditorOptions,
  detailFields,
  filterMockList,
  getPlanCycleLabel,
  getPlanCycleTagType,
  getPlanStatusLabel,
  getPlanStatusTagType,
  getPlanTypeLabel,
  getPlanTypeTagType,
  getProgressStatus,
  isPlanStatusLabel,
  normalizeInspectPlanRow,
  textObj,
  useEditFormSchema,
  useFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  chartFilter: {
    type: Object,
    default: null,
  },
});

const getTitle = computed(() =>
  formData.value?.id ? textObj.editText : textObj.addText,
);

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

const detailDrawerRef = ref(null);
const importExcelDialogRef = ref(null);
const statusConfirmDialogRef = ref(null);
const formData = ref({});
const checkedIds = ref([]);
const checkedRows = ref([]);
const filterType = ref('');
const filterScope = ref('');
const filterStatus = ref('');
const filterCycle = ref('');
const filterAuditUserId = ref('');
const filterTrendTime = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
  useStaticData: false,
});

const currentPageStats = computed(() => {
  const runningCount = dataObj.list.filter((item) =>
    isPlanStatusLabel(item.status, '进行中'),
  ).length;
  const finishedCount = dataObj.list.filter((item) =>
    isPlanStatusLabel(item.status, '已完成'),
  ).length;
  const pausedCount = dataObj.list.filter((item) =>
    isPlanStatusLabel(item.status, '已暂停'),
  ).length;

  return {
    runningCount,
    finishedCount,
    pausedCount,
  };
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
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
    if (!valid) return;

    const values = await formApi.getValues();
    try {
      if (formData.value?.id) {
        await updateInspectPlan({
          ...formData.value,
          ...values,
          id: formData.value.id,
        });
        ElMessage.success('编辑成功');
      } else {
        await createInspectPlan(values);
        ElMessage.success('新增成功');
      }
      formDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      ElMessage.error(formData.value?.id ? '编辑失败' : '新增失败');
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    formData.value = formDrawerApi.getData() || {};
    await formApi.resetForm();
    if (formData.value?.id) {
      await formApi.setValues(formData.value);
    }
  },
});

function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    type: filterType.value || dataObj.searchParams.type,
    cycle: filterCycle.value || dataObj.searchParams.cycle,
    scope: filterScope.value || dataObj.searchParams.scope,
    status: filterStatus.value || dataObj.searchParams.status,
    auditUserId: filterAuditUserId.value || dataObj.searchParams.auditUserId,
    trendTime: filterTrendTime.value,
  };
}

function getPagedMockData(params, page) {
  const filteredList = filterMockList(params);
  dataObj.useStaticData = true;
  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
}

async function getTableData({ page }) {
  dataObj.currentPage = page.currentPage;
  dataObj.pageSize = page.pageSize;
  const queryParams = buildQueryParams(page);

  try {
    const response = await getInspectPlanPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    dataObj.useStaticData = false;
    dataObj.total = pageResult.total || 0;
    dataObj.list = list.map((item) => normalizeInspectPlanRow(item));
  } catch (error) {
    console.error('获取巡检计划数据失败，使用静态数据:', error);
    getPagedMockData(queryParams, page);
  }

  return dataObj;
}

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useSearchFormSchema().map((item) => {
    delete item.rules;
    return { ...item };
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

function handleRowCheckboxChange({ records }) {
  checkedRows.value = records;
  checkedIds.value = records.map((item) => item.id);
}

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  try {
    const data = await exportInspectPlan(buildQueryParams(dataObj));
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

function handleImport() {
  importExcelDialogRef.value?.open();
}

async function handleCreate() {
  await formApi.setState({ schema: useFormSchema() });
  formDrawerApi.setData({}).open();
}

async function handleEdit(row) {
  await formApi.setState({ schema: useEditFormSchema() });
  formDrawerApi.setData(row).open();
}

function handleActivate(row) {
  statusConfirmDialogRef.value?.open('activate', row);
}

function handlePause(row) {
  statusConfirmDialogRef.value?.open('pause', row);
}

function handleEnable(row) {
  statusConfirmDialogRef.value?.open('enable', row);
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterTrendTime.value = '';
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getInspectPlanDetail(row.id);
    dataObj.detailObj = normalizeInspectPlanRow(response || row);
  } catch (error) {
    console.error('获取巡检计划详情失败，使用行数据:', error);
    dataObj.detailObj = row;
  }
  detailDrawerRef.value?.open();
}

function handleProgressDetail(row) {
  dataObj.detailObj = row;
  detailDrawerRef.value?.open();
}

function handleSearchShow() {
  drawerApi.open();
}

function handleFullShow() {
  screenfull.toggle();
}

function changeTotalShow() {
  dataObj.totalShow = !dataObj.totalShow;
}

function handleTypeClick(type) {
  filterType.value = filterType.value === type ? '' : type;
  gridApi.query();
}

function handleScopeClick(scope) {
  filterScope.value = filterScope.value === scope ? '' : scope;
  gridApi.query();
}

function handleStatusClick(status) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  filterTrendTime.value = '';
  gridApi.query();
}

function handleCycleClick(cycle) {
  filterCycle.value = filterCycle.value === cycle ? '' : cycle;
  gridApi.query();
}

function handleAuditorClick(auditUserId) {
  filterAuditUserId.value =
    Number(filterAuditUserId.value) === Number(auditUserId) ? '' : auditUserId;
  gridApi.query();
}

function getAuditorLabel(auditUserId) {
  return (
    auditorOptions.find((item) => item.value === Number(auditUserId))?.label ||
    auditUserId
  );
}

function cancelFilter(type) {
  const clearMap = {
    auditUserId: () => {
      filterAuditUserId.value = '';
    },
    scope: () => {
      filterScope.value = '';
    },
    status: () => {
      filterStatus.value = '';
    },
    trendTime: () => {
      filterTrendTime.value = '';
    },
    type: () => {
      filterType.value = '';
    },
    cycle: () => {
      filterCycle.value = '';
    },
  };

  clearMap[type]?.();
  gridApi.query();
}

watch(
  () => props.chartFilter,
  (filter) => {
    if (!filter) return;
    if (filter.type === 'status') {
      filterStatus.value = filter.value;
      filterTrendTime.value = '';
    }
    if (filter.type === 'type') {
      filterType.value = filter.value;
    }
    if (filter.type === 'trendTime') {
      filterTrendTime.value = filter.value;
    }
    if (filter.type === 'cycle') {
      filterCycle.value = filter.value;
    }
    gridApi.query();
  },
  { deep: true },
);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`${dataObj.detailObj.name || '巡检计划'}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="inspect-plan-filter-tags">
          <ElTag
            v-if="filterType"
            closable
            type="success"
            @close="cancelFilter('type')"
          >
            巡检类型：{{ getPlanTypeLabel(filterType) }}
          </ElTag>
          <ElTag
            v-if="filterScope"
            closable
            type="primary"
            @close="cancelFilter('scope')"
          >
            巡检范围：{{ filterScope }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            type="warning"
            @close="cancelFilter('status')"
          >
            计划状态：{{ getPlanStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterCycle"
            closable
            type="info"
            @close="cancelFilter('cycle')"
          >
            执行周期：{{ getPlanCycleLabel(filterCycle) }}
          </ElTag>
          <ElTag
            v-if="filterAuditUserId"
            closable
            type="info"
            @close="cancelFilter('auditUserId')"
          >
            审核人：{{ getAuditorLabel(filterAuditUserId) }}
          </ElTag>
          <ElTag
            v-if="filterTrendTime"
            closable
            type="danger"
            @close="cancelFilter('trendTime')"
          >
            趋势时间：{{ filterTrendTime }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导入" icon-name="Upload" @click="handleImport" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSearchShow"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <template #name="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleOpenDetail(row)"
        >
          {{ row.name }}
        </el-text>
      </template>

      <template #type="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getPlanTypeTagType(row.type)"
          @click="handleTypeClick(row.type)"
        >
          {{ getPlanTypeLabel(row.type) }}
        </ElTag>
      </template>

      <template #scope="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleScopeClick(row.scope)"
        >
          {{ row.scope }}
        </el-text>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getPlanStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getPlanStatusLabel(row.status) }}
        </ElTag>
      </template>

      <template #cycle="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getPlanCycleTagType(row.cycle)"
          @click="handleCycleClick(row.cycle)"
        >
          {{ getPlanCycleLabel(row.cycle) }}
        </ElTag>
      </template>

      <template #progress="{ row }">
        <el-progress
          style="cursor: pointer"
          :percentage="row.progress"
          :status="getProgressStatus(row.progress)"
          @click="handleProgressDetail(row)"
        >
        <span>{{ row.progressText }}</span>
        </el-progress>
      </template>

      <template #auditUserName="{ row }">
        <el-text
          v-if="row.auditUserId"
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleAuditorClick(row.auditUserId)"
        >
          {{ row.auditUserName }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isPlanStatusLabel(row.status, '待生效')"
            content="生效"
            icon-name="CircleCheckFilled"
            @click="handleActivate(row)"
          />
          <IconButton
            v-if="isPlanStatusLabel(row.status, '进行中')"
            content="暂停"
            icon-name="VideoPause"
            @click="handlePause(row)"
          />
          <IconButton
            v-if="isPlanStatusLabel(row.status, '已暂停')"
            content="启用"
            icon-name="SwitchButton"
            @click="handleEnable(row)"
          />
          <IconButton
            v-if="
              isPlanStatusLabel(row.status, '待生效') ||
              isPlanStatusLabel(row.status, '进行中')
            "
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon v-if="!dataObj.totalShow" class="tabel-tab-icon">
            <ArrowDown />
          </el-icon>
          <el-icon v-if="dataObj.totalShow" class="tabel-tab-icon">
            <ArrowUp />
          </el-icon>
          <span>
            本页统计：计划 {{ dataObj.list.length }} 条；进行中
            {{ currentPageStats.runningCount }} 条；已完成
            {{ currentPageStats.finishedCount }} 条；已暂停
            {{ currentPageStats.pausedCount }} 条
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>

    <ImportExcelDialog ref="importExcelDialogRef" @success="handleRefresh" />
    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @success="handleRefresh"
    />
  </div>
</template>

<style scoped>
.inspect-plan-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.inspect-plan-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
