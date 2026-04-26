<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  approveResultHandle,
  batchHandleResultHandle,
  executeResultHandle,
  exportResultHandle,
  getResultHandle,
  getResultHandlePage,
  rejectResultHandle,
} from '#/api/genchuan/industry/chargePark/vehiclePass/inspectMgmt/resultHandle';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

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

// 监听下钻筛选参数变化
import { watch } from 'vue';
watch(
  () => props.drillDownFilter,
  (newFilter) => {
    if (newFilter?.filterKey) {
      // 根据下钻参数设置筛选条件
      if (
        newFilter.filterKey === '已完成' ||
        newFilter.filterKey === '待处置' ||
        newFilter.filterKey === '待审核'
      ) {
        activeName.value = newFilter.filterKey;
        dataObj.searchParams = { status: newFilter.filterKey };
      } else if (newFilter.filterKey === 'handleCompleteRate') {
        activeName.value = '已完成';
        dataObj.searchParams = { status: '已完成' };
      } else if (newFilter.filterKey === 'violationRectifyRate') {
        activeName.value = '已完成';
        dataObj.searchParams = { status: '已完成', rectifyStatus: '已整改' };
      }
      handleRefresh();
    }
  },
  { deep: true },
);

// 是否使用真实API
const USE_REAL_API = true;

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
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

// 驳回弹窗
const rejectDialogVisible = ref(false);
const rejectForm = reactive({
  id: null,
  rejectReason: '',
});

// 执行抽屉
const [ExecuteDrawer, executeDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    executeDrawerApi.close();
  },
  async onConfirm() {
    try {
      const values = executeFormApi.form.values;
      await executeFormApi.validate();

      if (USE_REAL_API) {
        await executeResultHandle({
          id: executeDrawerApi.sharedData.payload.id,
          rectifyStatus: values.rectifyStatus,
        });
        ElMessage.success('执行成功');
      }

      executeDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error('执行失败:', error);
    }
  },
});

const [ExecuteForm, executeFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'rectifyStatus',
      label: '整改状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择整改状态',
        options: [
          { label: '未整改', value: '未整改' },
          { label: '已整改', value: '已整改' },
        ],
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  if (USE_REAL_API) {
    try {
      await exportResultHandle(dataObj.searchParams);
      ElMessage.success('导出成功');
    } catch (error) {
      ElMessage.error('导出失败');
      console.error(error);
    }
  } else {
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

// 批量处置
async function handleBatchHandle() {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请选择要处置的数据');
    return;
  }

  await confirm('确定批量处置这些数据吗？');
  const loadingInstance = ElLoading.service({
    text: '批量处置中...',
  });

  try {
    if (USE_REAL_API) {
      await batchHandleResultHandle({
        ids: checkedIds.value,
        handleType: '执行',
      });
      ElMessage.success('批量处置成功');
    }
    checkedIds.value = [];
    handleRefresh();
  } catch (error) {
    ElMessage.error('批量处置失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

// 通过
async function handleApprove(row) {
  await confirm('确定通过该处置结果吗？');
  const loadingInstance = ElLoading.service({
    text: '审核中...',
  });

  try {
    if (USE_REAL_API) {
      await approveResultHandle({ id: row.id });
      ElMessage.success('审核通过');
    }
    handleRefresh();
  } catch (error) {
    ElMessage.error('审核失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

// 驳回
function handleReject(row) {
  rejectForm.id = row.id;
  rejectForm.rejectReason = '';
  rejectDialogVisible.value = true;
}

async function submitReject() {
  if (!rejectForm.rejectReason || rejectForm.rejectReason.length < 10) {
    ElMessage.warning('驳回理由不能少于10个字');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '驳回中...',
  });

  try {
    if (USE_REAL_API) {
      await rejectResultHandle({
        id: rejectForm.id,
        rejectReason: rejectForm.rejectReason,
      });
      ElMessage.success('驳回成功');
    }
    rejectDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error('驳回失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

// 执行
function handleExecute(row) {
  executeDrawerApi
    .setData({
      title: '执行处置',
      id: row.id,
    })
    .open();
  executeFormApi.resetForm();
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

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const getTableData = async (pageObj) => {
  const page = pageObj.page;

  if (USE_REAL_API) {
    try {
      const params = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        ...dataObj.searchParams,
      };

      const res = await getResultHandlePage(params);
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
      case '待审核': {
        statusMatch = v.status === '待审核';
        break;
      }
      case '待处置': {
        statusMatch = v.status === '待处置';
        break;
      }
      case '已完成': {
        statusMatch = v.status === '已完成';
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
  schema: useSearchFormSchema(),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

function onSubmit(values) {
  dataObj.searchParams = values;
  handleRefresh();
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
  if (USE_REAL_API) {
    try {
      const res = await getResultHandle(row.id);
      dataObj.detailObj = res;
    } catch (error) {
      console.error('获取详情失败:', error);
      dataObj.detailObj = row;
    }
  } else {
    dataObj.detailObj = row;
  }
  detailDrawerRef.value.open();
};

const tabsData = ref([
  { label: '全部' },
  { label: '待审核' },
  { label: '待处置' },
  { label: '已完成' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '待审核': {
      count = dataObj.apilist.filter((v) => v.status === '待审核').length;
      break;
    }
    case '待处置': {
      count = dataObj.apilist.filter((v) => v.status === '待处置').length;
      break;
    }
    case '已完成': {
      count = dataObj.apilist.filter((v) => v.status === '已完成').length;
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
  window.addEventListener('filterByChart', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart', handleFilterByChart);
});

// 根据状态显示操作按钮
const getActionButtons = (row) => {
  const buttons = [];

  switch (row.status) {
    case '待审核':
      buttons.push(
        { label: '通过', handler: handleApprove, color: '#67C23A' },
        { label: '驳回', handler: handleReject, color: '#F56C6C' },
        { label: '查看', handler: handleOpenDetail, color: '#409EFF' },
      );
      break;
    case '待处置':
      buttons.push(
        { label: '执行', handler: handleExecute, color: '#409EFF' },
        { label: '查看', handler: handleOpenDetail, color: '#409EFF' },
      );
      break;
    case '已完成':
      buttons.push({
        label: '查看',
        handler: handleOpenDetail,
        color: '#409EFF',
      });
      break;
    default:
      buttons.push({
        label: '查看',
        handler: handleOpenDetail,
        color: '#409EFF',
      });
  }

  return buttons;
};
</script>

<template>
  <div class="park-lot-table-new">
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`处置详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <ExecuteDrawer title="执行处置">
      <ExecuteForm />
    </ExecuteDrawer>

    <!-- 驳回弹窗 -->
    <el-dialog v-model="rejectDialogVisible" title="驳回处置" width="500px">
      <el-form label-width="100px">
        <el-form-item label="驳回理由" required>
          <el-input
            v-model="rejectForm.rejectReason"
            type="textarea"
            :rows="4"
            placeholder="请输入驳回理由（不少于10个字）"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReject">确认</el-button>
      </template>
    </el-dialog>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
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
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量处置"
            icon-name="Check"
            color="#67C23A"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchHandle"
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
      <template #taskId="{ row }">
        <el-text class="common-align" type="primary">
          {{ row.taskId }}
        </el-text>
      </template>
      <template #violationType="{ row }">
        <el-tag
          :type="
            row.violationType === '违规通行'
              ? 'danger'
              : row.violationType === '欠费逃费'
                ? 'warning'
                : 'info'
          "
        >
          {{ row.violationType }}
        </el-tag>
      </template>
      <template #handleMethod="{ row }">
        <el-tag type="info">
          {{ row.handleMethod }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="
            row.status === '待审核'
              ? 'warning'
              : row.status === '待处置'
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
      <template #handleUserName="{ row }">
        <el-text class="common-align">
          {{ row.handleUserName }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-for="btn in getActionButtons(row)"
            :key="btn.label"
            :content="btn.label"
            :icon-name="
              btn.label === '通过'
                ? 'Check'
                : btn.label === '驳回'
                  ? 'Close'
                  : btn.label === '执行'
                    ? 'Setting'
                    : 'View'
            "
            :color="btn.color"
            @click="btn.handler(row)"
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
            本页统计：处置记录数量: {{ dataObj.list.length }}; 已选择:
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
