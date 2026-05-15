<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  archiveInspectTask,
  batchDispatchInspectTask,
  claimInspectTask,
  dispatchInspectTask,
  exportInspectTask,
  getInspectTask,
  getInspectTaskPage,
  transferInspectTask,
  updateInspectTaskProgress,
} from '#/api/genchuan/industry/chargePark/vehiclePass/inspectMgmt/inspectTask';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import { formatTime } from '../../../utils/timeFormatter';
import {
  dataList,
  detailFields,
  textObj,
  useGridColumns,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  drillDownFilter: {
    type: Object,
    default: null,
  },
});

// 是否使用真实API
const USE_REAL_API = true;

const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

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
const formData = ref();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useSearchFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  const loadingInstance = ElLoading.service({
    text: '导出中...',
  });
  try {
    if (USE_REAL_API) {
      const res = await exportInspectTask(dataObj.searchParams);
      downloadFileFromBlobPart({ fileName: '稽查任务.xlsx', source: res });
    } else {
      exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
    }
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.plateNo]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.plateNo]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
  searchParams: {},
});

let isSearching = false;

// 监听下钻筛选参数变化
const { drillDownFilter } = props;
if (drillDownFilter) {
  const { filterKey, taskType, date } = drillDownFilter;

  // 根据下钻类型设置筛选条件
  if (filterKey === 'waitHandleTaskCount') {
    dataObj.searchParams.status = '待派发,待认领,处理中';
  } else if (filterKey === 'finishedTaskCount') {
    dataObj.searchParams.status = '已完成';
  } else if (filterKey === 'taskType' && taskType) {
    dataObj.searchParams.taskType = taskType;
  } else if (filterKey === 'taskHandleTrend' && date) {
    dataObj.searchParams.dispatchTime = [date, date];
  }
}

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchParams;

  if (obj.plateNo) {
    filters.push({ label: `车牌号码：${obj.plateNo}`, field: 'plateNo' });
  }
  if (obj.taskType) {
    filters.push({ label: `任务类型：${obj.taskType}`, field: 'taskType' });
  }
  if (obj.status) {
    filters.push({ label: `任务状态：${obj.status}`, field: 'status' });
  }
  if (
    obj.dispatchTime &&
    Array.isArray(obj.dispatchTime) &&
    obj.dispatchTime.length === 2
  ) {
    filters.push({
      label: `派发时间：${obj.dispatchTime[0]} 至 ${obj.dispatchTime[1]}`,
      field: 'dispatchTime',
    });
  }

  return filters;
});

const handleClearField = (fieldName) => {
  const next = { ...dataObj.searchParams };
  delete next[fieldName];
  dataObj.searchParams = next;
  dataObj.currentPage = 1;
  gridApi.query();
};

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const getTableData = async (pageObj) => {
  const page = pageObj.page;

  // 使用真实API
  if (USE_REAL_API) {
    try {
      const params = {
        pageNo: isSearching ? 1 : page.currentPage,
        pageSize: page.pageSize,
        ...dataObj.searchParams,
      };

      if (isSearching) {
        isSearching = false;
        dataObj.currentPage = 1;
      } else {
        dataObj.currentPage = page.currentPage;
      }

      const res = await getInspectTaskPage(params);
      dataObj.total = res.total || 0;
      dataObj.list = res.list || [];
      return dataObj;
    } catch (error) {
      ElMessage.error('获取数据失败');
      console.error(error);
      return dataObj;
    }
  }

  // 使用模拟数据
  const filteredList = dataObj.apilist.filter((v) => {
    let statusMatch = true;
    switch (activeName.value) {
      case '处理中': {
        statusMatch = v.status === '处理中';
        break;
      }
      case '已完成': {
        statusMatch = v.status === '已完成';
        break;
      }
      case '待派发': {
        statusMatch = v.status === '待派发';
        break;
      }
      case '待认领': {
        statusMatch = v.status === '待认领';
        break;
      }
    }

    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value) {
        searchMatch =
          typeof value === 'string'
            ? searchMatch && v[key]?.toString().includes(value)
            : searchMatch && v[key] === value;
      }
    });

    return statusMatch && searchMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const [SearchForm] = useVbenForm({
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
  schema: useSearchFormSchema().map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

function onSubmit(values) {
  dataObj.searchParams = values;
  isSearching = true;
  gridApi.query();
  drawerApi.close();
}

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

const activeName = ref('全部');

const handleOpenDetail = async (row) => {
  try {
    const loadingInstance = ElLoading.service({ text: '加载详情中...' });
    try {
      const data = await getInspectTask(row.id);
      dataObj.detailObj = data;
      detailDrawerRef.value.open();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    console.error('获取详情失败:', error);
    ElMessage.error('获取详情失败');
    // 失败时使用行数据兜底
    dataObj.detailObj = row;
    detailDrawerRef.value.open();
  }
};

const tabsData = ref([
  { label: '全部' },
  { label: '待派发' },
  { label: '待认领' },
  { label: '处理中' },
  { label: '已完成' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '处理中': {
      count = dataObj.apilist.filter((v) => v.status === '处理中').length;
      break;
    }
    case '已完成': {
      count = dataObj.apilist.filter((v) => v.status === '已完成').length;
      break;
    }
    case '待派发': {
      count = dataObj.apilist.filter((v) => v.status === '待派发').length;
      break;
    }
    case '待认领': {
      count = dataObj.apilist.filter((v) => v.status === '待认领').length;
      break;
    }
  }

  return `${item.label}(${count})`;
};

const handleClick = () => {
  gridApi.query();
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// 处理图表卡片点击筛选
const handleFilterByChart = (event) => {
  const filterParams = event.detail;
  dataObj.searchParams = { ...dataObj.searchParams, ...filterParams };
  handleRefresh();
  ElMessage.success('已应用图表筛选');
};

onMounted(() => {
  window.addEventListener('filterByChart:inspectTask', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:inspectTask', handleFilterByChart);
});

// 派发任务
const handleDispatch = async (row) => {
  const [DispatchDrawer, dispatchDrawerApi] = useVbenDrawer({
    appendToMain: true,
    modal: false,
    title: '派发任务',
    onCancel() {
      dispatchDrawerApi.close();
    },
    async onConfirm() {
      const values = dispatchFormApi.form.values;
      try {
        await dispatchInspectTask({
          id: row.id,
          executeUserId: values.executeUserId,
        });
        ElMessage.success('派发成功');
        handleRefresh();
        dispatchDrawerApi.close();
      } catch (error) {
        ElMessage.error('派发失败');
        console.error(error);
      }
    },
  });

  const [DispatchForm, dispatchFormApi] = useVbenForm({
    schema: [
      {
        fieldName: 'executeUserId',
        label: '执行人',
        component: 'Select',
        componentProps: {
          placeholder: '请选择执行人',
          options: [],
        },
        rules: 'required',
      },
    ],
  });

  dispatchDrawerApi.open();
};

// 批量派发
const handleBatchDispatch = async () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请选择要派发的任务');
    return;
  }

  const [BatchDispatchDrawer, batchDispatchDrawerApi] = useVbenDrawer({
    appendToMain: true,
    modal: false,
    title: '批量派发',
    onCancel() {
      batchDispatchDrawerApi.close();
    },
    async onConfirm() {
      const values = batchDispatchFormApi.form.values;
      try {
        await batchDispatchInspectTask({
          ids: checkedIds.value,
          executeUserId: values.executeUserId,
        });
        ElMessage.success('批量派发成功');
        checkedIds.value = [];
        handleRefresh();
        batchDispatchDrawerApi.close();
      } catch (error) {
        ElMessage.error('批量派发失败');
        console.error(error);
      }
    },
  });

  const [BatchDispatchForm, batchDispatchFormApi] = useVbenForm({
    schema: [
      {
        fieldName: 'executeUserId',
        label: '执行人',
        component: 'Select',
        componentProps: {
          placeholder: '请选择执行人',
          options: [],
        },
        rules: 'required',
      },
    ],
  });

  batchDispatchDrawerApi.open();
};

// 认领任务
const handleClaim = async (row) => {
  await confirm('确定认领该任务吗？');
  try {
    await claimInspectTask({ id: row.id });
    ElMessage.success('认领成功');
    handleRefresh();
  } catch (error) {
    ElMessage.error('认领失败');
    console.error(error);
  }
};

// 更新进度
const handleUpdateProgress = async (row) => {
  const [ProgressDrawer, progressDrawerApi] = useVbenDrawer({
    appendToMain: true,
    modal: false,
    title: '更新进度',
    onCancel() {
      progressDrawerApi.close();
    },
    async onConfirm() {
      const values = progressFormApi.form.values;
      try {
        await updateInspectTaskProgress({
          id: row.id,
          taskProgress: values.taskProgress,
          remark: values.remark,
        });
        ElMessage.success('更新成功');
        handleRefresh();
        progressDrawerApi.close();
      } catch (error) {
        ElMessage.error('更新失败');
        console.error(error);
      }
    },
  });

  const [ProgressForm, progressFormApi] = useVbenForm({
    schema: [
      {
        fieldName: 'taskProgress',
        label: '任务进度',
        component: 'Textarea',
        componentProps: {
          placeholder: '请输入任务进度',
          rows: 3,
        },
        rules: 'required',
      },
      {
        fieldName: 'remark',
        label: '备注',
        component: 'Textarea',
        componentProps: {
          placeholder: '请输入备注',
          rows: 3,
        },
      },
    ],
  });

  progressDrawerApi.open();
};

// 转派任务
const handleTransfer = async (row) => {
  const [TransferDrawer, transferDrawerApi] = useVbenDrawer({
    appendToMain: true,
    modal: false,
    title: '转派任务',
    onCancel() {
      transferDrawerApi.close();
    },
    async onConfirm() {
      const values = transferFormApi.form.values;
      try {
        await transferInspectTask({
          id: row.id,
          targetUserId: values.targetUserId,
          transferReason: values.transferReason,
        });
        ElMessage.success('转派成功');
        handleRefresh();
        transferDrawerApi.close();
      } catch (error) {
        ElMessage.error('转派失败');
        console.error(error);
      }
    },
  });

  const [TransferForm, transferFormApi] = useVbenForm({
    schema: [
      {
        fieldName: 'targetUserId',
        label: '目标执行人',
        component: 'Select',
        componentProps: {
          placeholder: '请选择目标执行人',
          options: [],
        },
        rules: 'required',
      },
      {
        fieldName: 'transferReason',
        label: '转派理由',
        component: 'Textarea',
        componentProps: {
          placeholder: '请输入转派理由',
          rows: 3,
        },
        rules: 'required',
      },
    ],
  });

  transferDrawerApi.open();
};

// 归档任务
const handleArchive = async (row) => {
  await confirm('确定归档该任务吗？');
  try {
    await archiveInspectTask({ id: row.id });
    ElMessage.success('归档成功');
    handleRefresh();
  } catch (error) {
    ElMessage.error('归档失败');
    console.error(error);
  }
};

// 获取操作按钮
const getActionButtons = (row) => {
  const buttons = [];

  switch (row.status) {
    case '处理中': {
      buttons.push(
        {
          content: '更新进度',
          iconName: 'Edit',
          onClick: () => handleUpdateProgress(row),
        },
        {
          content: '转派',
          iconName: 'Switch',
          onClick: () => handleTransfer(row),
        },
        {
          content: '查看',
          iconName: 'View',
          onClick: () => handleOpenDetail(row),
        },
      );
      break;
    }
    case '已完成': {
      buttons.push(
        {
          content: '查看',
          iconName: 'View',
          onClick: () => handleOpenDetail(row),
        },
        {
          content: '归档',
          iconName: 'FolderOpened',
          onClick: () => handleArchive(row),
        },
      );
      break;
    }
    case '待派发': {
      buttons.push(
        {
          content: '派发',
          iconName: 'Send',
          onClick: () => handleDispatch(row),
        },
        {
          content: '查看',
          iconName: 'View',
          onClick: () => handleOpenDetail(row),
        },
      );
      break;
    }
    case '待认领': {
      buttons.push(
        { content: '认领', iconName: 'Check', onClick: () => handleClaim(row) },
        {
          content: '查看',
          iconName: 'View',
          onClick: () => handleOpenDetail(row),
        },
      );
      break;
    }
    default: {
      buttons.push({
        content: '查看',
        iconName: 'View',
        onClick: () => handleOpenDetail(row),
      });
    }
  }

  return buttons;
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`稽查任务 ${dataObj.detailObj.id} 详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <Drawer title="搜索">
      <SearchForm class="query-form" />
    </Drawer>
    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
          <div
            v-if="activeFilters.length > 0"
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              align-items: center;
              margin-bottom: 12px;
            "
          >
            <el-tag
              v-for="filter in activeFilters"
              :key="filter.field"
              type="primary"
              closable
              @close="handleClearField(filter.field)"
            >
              {{ filter.label }}
            </el-tag>
          </div>
          <div v-if="props.secondShow">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="批量派发"
            icon-name="Send"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchDispatch"
          />
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
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #id="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.id }}
        </el-text>
      </template>
      <template #taskType="{ row }">
        <el-text class="common-align">
          {{ row.taskType }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="
            row.status === '待派发'
              ? 'info'
              : row.status === '待认领'
                ? 'warning'
                : row.status === '处理中'
                  ? 'primary'
                  : row.status === '已完成'
                    ? 'success'
                    : 'info'
          "
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #areaName="{ row }">
        <el-text class="common-align" type="primary">
          {{ row.areaName }}
        </el-text>
      </template>
      <template #executeUserName="{ row }">
        <el-text class="common-align" type="primary">
          {{ row.executeUserName || '-' }}
        </el-text>
      </template>
      <template #updater="{ row }">
        <span>{{ row.updater || '-' }}</span>
      </template>
      <template #updateTime="{ row }">
        <span>{{ formatTime(row.updateTime) }}</span>
      </template>
      <template #correctionMark="{ row }">
        <el-tag v-if="row.isCorrected" type="success">已修正</el-tag>
        <el-tag v-else type="info">未修正</el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-for="(btn, index) in getActionButtons(row)"
            :key="index"
            :content="btn.content"
            :icon-name="btn.iconName"
            :color="btn.color"
            @click="btn.onClick"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span>
            本页统计：稽查任务数量: {{ dataObj.list.length }}; 已选择:
            {{ checkedIds.length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
