<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTime } from '../../../utils/timeFormatter';
import {
  exportGateOpen,
  getGateOpenPage,
  getGateOpen,
  createGateOpen,
  approveGateOpen,
  rejectGateOpen,
  executeGateOpen,
  reapplyGateOpen,
} from '#/api/genchuan/industry/chargePark/vehiclePass/specialPass/gateOpen';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import IconButton from '#/components/common/IconButton.vue';
import { downloadFileFromBlobPart } from '@vben/utils';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  textObj,
  useSearchFormSchema,
  useCreateFormSchema,
  useReapplyFormSchema,
  useGridColumns,
  statusTypeMap,
  openReasonMap,
  taskProgressMap,
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

// 新增申请表单
const [CreateForm, createFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useCreateFormSchema(),
  showDefaultActions: false,
});

const [CreateFormDrawer, createFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    createFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      await createFormApi.validate();
    } catch (error) {
      ElMessage.warning('请完善表单信息');
      return;
    }

    const obj = createFormApi.form.values;

    if (USE_REAL_API) {
      try {
        await createGateOpen(obj);
        ElMessage.success('申请成功');
        handleRefresh();
        createFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('申请失败');
        console.error(error);
      }
    } else {
      dataObj.apilist.push(obj);
      handleRefresh();
      createFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      createFormApi.resetForm();
    }
  },
});

// 重新申请表单
const [ReapplyForm, reapplyFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useReapplyFormSchema(),
  showDefaultActions: false,
});

const [ReapplyFormDrawer, reapplyFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    reapplyFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      await reapplyFormApi.validate();
    } catch (error) {
      ElMessage.warning('请完善表单信息');
      return;
    }

    const obj = reapplyFormApi.form.values;

    if (USE_REAL_API) {
      try {
        await reapplyGateOpen({
          id: formData.value?.id,
          openReason: obj.openReason,
          remark: obj.remark,
        });
        ElMessage.success('重新申请成功');
        handleRefresh();
        reapplyFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('重新申请失败');
        console.error(error);
      }
    } else {
      ElMessage.success('重新申请成功');
      handleRefresh();
      reapplyFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = reapplyFormDrawerApi.getData();
      await reapplyFormApi.setValues({
        openReason: formData.value?.openReason || '',
        remark: formData.value?.remark || '',
      });
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
      // 过滤掉 API 不需要的字段
      const { applyUserName, auditUserName, ...apiParams } = dataObj.searchParams;
      const res = await exportGateOpen(apiParams);
      downloadFileFromBlobPart({ fileName: '开闸申请.xlsx', source: res });
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
  createFormDrawerApi
    .setData({
      title: textObj.createText,
    })
    .open();
}

// 审批通过操作
async function handleApprove(row) {
  try {
    await ElMessageBox.confirm('确认审批通过该开闸申请？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });

    if (USE_REAL_API) {
      try {
        await approveGateOpen({ id: row.id });
        ElMessage.success('审批通过');
        handleRefresh();
      } catch (error) {
        ElMessage.error('审批失败');
        console.error(error);
      }
    } else {
      ElMessage.success('审批通过');
      handleRefresh();
    }
  } catch {
    // 用户取消操作
  }
}

// 驳回操作
async function handleReject(row) {
  try {
    const { value: rejectReason } = await ElMessageBox.prompt(
      '请输入驳回理由（至少10个字符）',
      '驳回申请',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputValidator: (value) => {
          if (!value || value.length < 10) {
            return '驳回理由至少需要10个字符';
          }
          return true;
        },
        inputErrorMessage: '驳回理由至少需要10个字符',
      },
    );

    if (USE_REAL_API) {
      try {
        await rejectGateOpen({
          id: row.id,
          rejectReason,
        });
        ElMessage.success('驳回成功');
        handleRefresh();
      } catch (error) {
        ElMessage.error('驳回失败');
        console.error(error);
      }
    } else {
      ElMessage.success('驳回成功');
      handleRefresh();
    }
  } catch {
    // 用户取消操作
  }
}

// 执行开闸操作
async function handleExecute(row) {
  try {
    await ElMessageBox.confirm('确认执行开闸操作？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });

    if (USE_REAL_API) {
      try {
        await executeGateOpen({ id: row.id });
        ElMessage.success('开闸执行成功');
        handleRefresh();
      } catch (error) {
        ElMessage.error('开闸执行失败');
        console.error(error);
      }
    } else {
      ElMessage.success('开闸执行成功');
      handleRefresh();
    }
  } catch {
    // 用户取消操作
  }
}

// 重新申请操作
function handleReapply(row) {
  formData.value = row;
  reapplyFormDrawerApi
    .setData({
      title: textObj.reapplyText,
      ...row,
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

// 用户名映射缓存
const userNameMap = ref({
  applyUserId: '',
  auditUserId: '',
  executorId: '',
});

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchParams;

  if (obj.stationName) {
    filters.push({ label: `片区：${obj.stationName}`, field: 'stationName' });
  }
  if (obj.status) {
    filters.push({ label: `状态：${obj.status}`, field: 'status' });
  }
  if (obj.openReason) {
    filters.push({ label: `任务类型：${obj.openReason}`, field: 'openReason' });
  }
  if (obj.applyTime && Array.isArray(obj.applyTime) && obj.applyTime.length > 0) {
    const dateRange = obj.applyTime.length === 2
      ? `${obj.applyTime[0]} 至 ${obj.applyTime[1]}`
      : obj.applyTime[0];
    filters.push({ label: `派发时间：${dateRange}`, field: 'applyTime' });
  }
  if (obj.auditStatus) {
    filters.push({ label: `审批状态：${obj.auditStatus}`, field: 'auditStatus' });
  }
  if (obj.applyUserId !== undefined && obj.applyUserId !== null && obj.applyUserId !== '') {
    const label = userNameMap.value.applyUserId || obj.applyUserId;
    filters.push({ label: `申请人：${label}`, field: 'applyUserId' });
  }
  if (obj.auditUserId !== undefined && obj.auditUserId !== null && obj.auditUserId !== '') {
    const label = userNameMap.value.auditUserId || obj.auditUserId;
    filters.push({ label: `审批人：${label}`, field: 'auditUserId' });
  }
  if (obj.executorId !== undefined && obj.executorId !== null && obj.executorId !== '') {
    const label = userNameMap.value.executorId || obj.executorId;
    filters.push({ label: `执行人：${label}`, field: 'executorId' });
  }

  return filters;
});

const handleClearField = (fieldName) => {
  delete dataObj.searchParams[fieldName];
  dataObj.currentPage = 1;

  // 清除对应的用户名映射
  if (fieldName === 'applyUserId') {
    userNameMap.value.applyUserId = '';
  } else if (fieldName === 'auditUserId') {
    userNameMap.value.auditUserId = '';
  } else if (fieldName === 'executorId') {
    userNameMap.value.executorId = '';
  }

  isSearching = true;
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
      // 过滤掉 API 不需要的字段
      const { applyUserName, auditUserName, ...apiParams } = dataObj.searchParams;

      const params = {
        pageNo: isSearching ? 1 : page.currentPage,
        pageSize: page.pageSize,
        ...apiParams,
      };

      if (isSearching) {
        isSearching = false;
        dataObj.currentPage = 1;
      } else {
        dataObj.currentPage = page.currentPage;
      }

      const res = await getGateOpenPage(params);
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
      case '待审批': {
        statusMatch = v.status === '待审批';
        break;
      }
      case '已通过': {
        statusMatch = v.status === '已通过';
        break;
      }
      case '已驳回': {
        statusMatch = v.status === '已驳回';
        break;
      }
      case '已执行': {
        statusMatch = v.status === '已执行';
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
  Object.assign(dataObj.searchParams, values);
  // 清除用户名映射，因为搜索表单提交时没有用户名
  userNameMap.value.applyUserId = '';
  userNameMap.value.auditUserId = '';
  userNameMap.value.executorId = '';
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
      const data = await getGateOpen(row.id);
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
  { label: '待审批' },
  { label: '已通过' },
  { label: '已驳回' },
  { label: '已执行' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '待审批': {
      count = dataObj.apilist.filter((v) => v.status === '待审批').length;
      break;
    }
    case '已通过': {
      count = dataObj.apilist.filter((v) => v.status === '已通过').length;
      break;
    }
    case '已驳回': {
      count = dataObj.apilist.filter((v) => v.status === '已驳回').length;
      break;
    }
    case '已执行': {
      count = dataObj.apilist.filter((v) => v.status === '已执行').length;
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
  window.addEventListener('filterByChart:gateOpen', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:gateOpen', handleFilterByChart);
});

// 字段点击筛选
const handleFieldFilter = (field, value, userName = '') => {
  Object.assign(dataObj.searchParams, {
    [field]: value,
  });

  // 更新用户名映射
  if (field === 'applyUserId' && userName) {
    userNameMap.value.applyUserId = userName;
  } else if (field === 'auditUserId' && userName) {
    userNameMap.value.auditUserId = userName;
  } else if (field === 'executorId' && userName) {
    userNameMap.value.executorId = userName;
  }

  dataObj.currentPage = 1;
  isSearching = true;
  handleRefresh();
};
</script>

<template>
  <div class="park-lot-table-new">
    <CreateFormDrawer :title="textObj.createText">
      <CreateForm />
    </CreateFormDrawer>
    <ReapplyFormDrawer :title="textObj.reapplyText">
      <ReapplyForm />
    </ReapplyFormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`申请详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <Drawer title="搜索">
      <SearchForm class="query-form" />
    </Drawer>
    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
          <div v-if="activeFilters.length" style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px;">
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
            content="新增申请"
            icon-name="Plus"
            @click="handleCreate"
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
      <template #openReason="{ row }">
        <el-tag
          :type="openReasonMap[row.openReason]"
          @click="handleFieldFilter('openReason', row.openReason)"
          style="cursor: pointer"
        >
          {{ row.openReason }}
        </el-tag>
      </template>
      <template #applyUserName="{ row }">
        <el-text
          @click="handleFieldFilter('applyUserId', row.applyUserId, row.applyUserName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.applyUserName }}
        </el-text>
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
      <template #updater="{ row }">
        <span>{{ row.updater || '-' }}</span>
      </template>
      <template #executorName="{ row }">
        <el-text
          @click="handleFieldFilter('executorId', row.executorId, row.executorName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.executorName }}
        </el-text>
      </template>
      <template #taskProgress="{ row }">
        <el-tag
          :type="taskProgressMap[row.taskProgress]"
        >
          {{ row.taskProgress }}
        </el-tag>
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
            v-if="row.status === '待审批'"
            content="通过"
            icon-name="CircleCheck"
            @click="handleApprove(row)"
          />
          <IconButton
            v-if="row.status === '待审批'"
            content="驳回"
            icon-name="CircleClose"
            color="#F56C6C"
            @click="handleReject(row)"
          />
          <IconButton
            v-if="row.status === '已通过'"
            content="执行"
            icon-name="VideoPlay"
            @click="handleExecute(row)"
          />
          <IconButton
            v-if="row.status === '已驳回'"
            content="重新申请"
            icon-name="RefreshRight"
            @click="handleReapply(row)"
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
            本页统计：开闸申请数量: {{ dataObj.list.length }}; 已选择:
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
