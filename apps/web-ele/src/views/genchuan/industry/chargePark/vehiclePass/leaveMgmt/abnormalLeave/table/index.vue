<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportAbnormalLeave,
  getAbnormalLeavePage,
  getAbnormalLeave,
  checkAbnormalLeave,
  ignoreAbnormalLeave,
  updateAbnormalLeaveProgress,
  batchHandleAbnormalLeave,
} from '#/api/genchuan/industry/chargePark/vehiclePass/leaveMgmt/abnormalLeave';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import IconButton from '#/components/common/IconButton.vue';
import { downloadFileFromBlobPart } from '@vben/utils';
import { exportToExcel } from '#/utils/excel.js';
import { formatTime } from '../../../utils/timeFormatter';
import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';

import {
  dataList,
  detailFields,
  textObj,
  useSearchFormSchema,
  useCheckFormSchema,
  useUpdateProgressFormSchema,
  useBatchHandleFormSchema,
  useGridColumns,
  statusTypeMap,
  abnormalTypeMap,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

// 是否使用真实API（默认false使用模拟数据）
const USE_REAL_API = true;

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

// 核查表单
const [CheckForm, checkFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useCheckFormSchema(),
  showDefaultActions: false,
});

const [CheckFormDrawer, checkFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    checkFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      await checkFormApi.validate();
    } catch (error) {
      ElMessage.warning('请完善表单信息');
      return;
    }

    if (USE_REAL_API) {
      try {
        await checkAbnormalLeave({
          id: formData.value?.id,
        });
        ElMessage.success('核查成功');
        handleRefresh();
        checkFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('核查失败');
        console.error(error);
      }
    } else {
      ElMessage.success('核查成功');
      handleRefresh();
      checkFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = checkFormDrawerApi.getData();
      checkFormApi.resetForm();
    }
  },
});

// 更新进度表单
const [UpdateProgressForm, updateProgressFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useUpdateProgressFormSchema(),
  showDefaultActions: false,
});

const [UpdateProgressFormDrawer, updateProgressFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    updateProgressFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      await updateProgressFormApi.validate();
    } catch (error) {
      ElMessage.warning('请完善表单信息');
      return;
    }

    const obj = updateProgressFormApi.form.values;

    if (USE_REAL_API) {
      try {
        await updateAbnormalLeaveProgress({
          id: formData.value?.id,
          handleProgress: obj.handleProgress,
        });
        ElMessage.success('更新进度成功');
        handleRefresh();
        updateProgressFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('更新进度失败');
        console.error(error);
      }
    } else {
      ElMessage.success('更新进度成功');
      handleRefresh();
      updateProgressFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = updateProgressFormDrawerApi.getData();
      await updateProgressFormApi.setValues({
        handleProgress: formData.value?.handleProgress || '',
      });
    }
  },
});

// 批量处置表单
const [BatchHandleForm, batchHandleFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useBatchHandleFormSchema(),
  showDefaultActions: false,
});

const [BatchHandleFormDrawer, batchHandleFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    batchHandleFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      await batchHandleFormApi.validate();
    } catch (error) {
      ElMessage.warning('请完善表单信息');
      return;
    }

    const obj = batchHandleFormApi.form.values;

    if (USE_REAL_API) {
      try {
        await batchHandleAbnormalLeave({
          ids: checkedIds.value,
          handleType: obj.handleType,
        });
        ElMessage.success('批量处置成功');
        checkedIds.value = [];
        handleRefresh();
        batchHandleFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('批量处置失败');
        console.error(error);
      }
    } else {
      ElMessage.success('批量处置成功');
      checkedIds.value = [];
      handleRefresh();
      batchHandleFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      batchHandleFormApi.resetForm();
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
      const res = await exportAbnormalLeave(dataObj.searchParams);
      downloadFileFromBlobPart({ fileName: '异常离场.xlsx', source: res });
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

// 核查操作
function handleCheck(row) {
  formData.value = row;
  checkFormDrawerApi
    .setData({
      title: textObj.checkText,
      ...row,
    })
    .open();
}

// 忽略操作
async function handleIgnore(row) {
  try {
    const { value: ignoreReason } = await ElMessageBox.prompt(
      '请输入忽略理由（至少10个字符）',
      '忽略异常',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputValidator: (value) => {
          if (!value || value.length < 10) {
            return '忽略理由至少需要10个字符';
          }
          return true;
        },
        inputErrorMessage: '忽略理由至少需要10个字符',
      },
    );

    if (USE_REAL_API) {
      try {
        await ignoreAbnormalLeave({
          id: row.id,
          ignoreReason,
        });
        ElMessage.success('忽略成功');
        handleRefresh();
      } catch (error) {
        ElMessage.error('忽略失败');
        console.error(error);
      }
    } else {
      ElMessage.success('忽略成功');
      handleRefresh();
    }
  } catch {
    // 用户取消操作
  }
}

// 更新进度操作
function handleUpdateProgress(row) {
  formData.value = row;
  updateProgressFormDrawerApi
    .setData({
      title: textObj.updateProgressText,
      ...row,
    })
    .open();
}

// 批量处置操作
function handleBatchHandle() {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择要处置的数据');
    return;
  }

  // 检查选中的数据是否都是未处理状态
  const selectedRows = dataObj.list.filter((item) =>
    checkedIds.value.includes(item.id),
  );
  const hasNonPending = selectedRows.some((item) => item.status !== '未处理');

  if (hasNonPending) {
    ElMessage.warning('只能批量处置未处理状态的数据');
    return;
  }

  batchHandleFormDrawerApi
    .setData({
      title: textObj.batchHandleText,
    })
    .open();
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

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchParams;

  if (obj.plateNo) {
    filters.push({ label: `车牌号码：${obj.plateNo}`, field: 'plateNo' });
  }
  if (obj.abnormalType) {
    filters.push({
      label: `异常类型：${obj.abnormalType}`,
      field: 'abnormalType',
    });
  }
  if (obj.status) {
    filters.push({ label: `状态：${obj.status}`, field: 'status' });
  }
  if (obj.stationName) {
    filters.push({ label: `场站：${obj.stationName}`, field: 'stationName' });
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

      const res = await getAbnormalLeavePage(params);
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
      case '未处理': {
        statusMatch = v.status === '未处理';
        break;
      }
      case '处理中': {
        statusMatch = v.status === '处理中';
        break;
      }
      case '已关闭': {
        statusMatch = v.status === '已关闭';
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
      const data = await getAbnormalLeave(row.id);
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
  { label: '未处理' },
  { label: '处理中' },
  { label: '已关闭' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '未处理': {
      count = dataObj.apilist.filter((v) => v.status === '未处理').length;
      break;
    }
    case '处理中': {
      count = dataObj.apilist.filter((v) => v.status === '处理中').length;
      break;
    }
    case '已关闭': {
      count = dataObj.apilist.filter((v) => v.status === '已关闭').length;
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
  window.addEventListener('filterByChart:abnormalLeave', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener(
    'filterByChart:abnormalLeave',
    handleFilterByChart,
  );
});

// 车辆详情弹窗
const vehicleDetailDialogRef = ref(null);
const handlePlateClick = (row) => {
  vehicleDetailDialogRef.value?.open(row.plateNo);
};

// 字段点击筛选
const handleFieldFilter = (field, value) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    [field]: value,
  };
  handleRefresh();
};
</script>

<template>
  <div class="park-lot-table-new">
    <CheckFormDrawer :title="textObj.checkText">
      <CheckForm />
    </CheckFormDrawer>
    <UpdateProgressFormDrawer :title="textObj.updateProgressText">
      <UpdateProgressForm />
    </UpdateProgressFormDrawer>
    <BatchHandleFormDrawer :title="textObj.batchHandleText">
      <BatchHandleForm />
    </BatchHandleFormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.plateNo}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <VehicleDetailDialog ref="vehicleDetailDialogRef" />
    <Drawer title="搜索">
      <SearchForm class="query-form" />
    </Drawer>
    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
          <div
            v-if="activeFilters.length"
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
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量处置"
            icon-name="Operation"
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
      <template #plateNo="{ row }">
        <el-text
          @click="handlePlateClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.plateNo }}
        </el-text>
      </template>
      <template #abnormalType="{ row }">
        <el-tag
          :type="abnormalTypeMap[row.abnormalType]"
          @click="handleFieldFilter('abnormalType', row.abnormalType)"
          style="cursor: pointer"
        >
          {{ row.abnormalType }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="statusTypeMap[row.status]"
          @click="handleFieldFilter('status', row.status)"
          style="cursor: pointer"
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #stationName="{ row }">
        <el-text
          @click="handleFieldFilter('stationName', row.stationName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.stationName }}
        </el-text>
      </template>
      <template #handleUserName="{ row }">
        <el-text
          v-if="row.handleUserName"
          @click="handleFieldFilter('handleUserId', row.handleUserId)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.handleUserName }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #updater="{ row }">
        <el-text>{{ row.updater || '-' }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{
          row.updateTime ? formatTime(row.updateTime) : '-'
        }}</el-text>
      </template>
      <template #correctionMark="{ row }">
        <el-tag :type="row.isCorrected ? 'success' : 'info'">
          {{ row.isCorrected ? '已修正' : '未修正' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="row.status === '未处理'"
            content="核查"
            icon-name="Search"
            @click="handleCheck(row)"
          />
          <IconButton
            v-if="row.status === '未处理'"
            content="忽略"
            icon-name="CircleClose"
            color="#909399"
            @click="handleIgnore(row)"
          />
          <IconButton
            v-if="row.status === '处理中'"
            content="更新进度"
            icon-name="Edit"
            @click="handleUpdateProgress(row)"
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
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span>
            本页统计：异常离场数量: {{ dataObj.list.length }}; 已选择:
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
