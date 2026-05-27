<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  auditCarInput,
  confirmCarInput,
  correctCarInput,
  createCarInput,
  exportCarInput,
  getCarInput,
  getCarInputPage,
} from '#/api/genchuan/industry/chargePark/vehiclePass/siteInput/carInput';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import SpaceDetailDialog from '../../../components/SpaceDetailDialog.vue';
import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';
import { formatTime } from '../../../utils/timeFormatter';
import {
  dataList,
  detailFields,
  getStationOptions,
  textObj,
  useAuditFormSchema,
  useCorrectFormSchema,
  useCreateFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

// 是否使用真实API（默认false使用模拟数据）
const USE_REAL_API = true;

const stationOptions = ref([]);

async function loadStationOptions() {
  try {
    stationOptions.value = await getStationOptions();
  } catch (error) {
    console.error('Failed to load station options:', error);
  }
}

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
const spaceDetailRef = ref(null);
const vehicleDetailRef = ref(null);

const [CreateForm, createFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: computed(() => {
    const schema = useCreateFormSchema();
    const stationField = schema.find((f) => f.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps.options = stationOptions.value;
    }
    const areaField = schema.find((f) => f.fieldName === 'areaId');
    if (areaField) {
      areaField.componentProps.options = stationOptions.value;
    }
    return schema;
  }),
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
    } catch {
      ElMessage.warning('请完善表单信息');
      return;
    }

    const values = createFormApi.form.values;

    if (USE_REAL_API) {
      const loadingInstance = ElLoading.service({ text: '新增中...' });
      try {
        await createCarInput({
          ...values,
          status: '待审核',
        });
        ElMessage.success('新增成功');
        handleRefresh();
        createFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('新增失败');
        console.error(error);
      } finally {
        loadingInstance.close();
      }
    } else {
      dataObj.apilist.push({
        ...values,
        id: Date.now().toString(),
        status: '待审核',
        inputTime: Date.now(),
        auditUserId: null,
        auditUserName: null,
        auditTime: null,
        auditComment: null,
        isCorrected: false,
        creator: 'admin',
        createTime: Date.now(),
        updater: 'admin',
        updateTime: Date.now(),
      });
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

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  try {
    let exportFormat = 'excel';
    try {
      await ElMessageBox.confirm(
        '请选择导出格式：\n• Excel格式支持完整数据和中文显示（推荐）\n• PDF格式中文显示可能不正确，仅供参考',
        '选择导出格式',
        {
          confirmButtonText: 'Excel (.xlsx) 推荐',
          cancelButtonText: 'PDF (.pdf)',
          type: 'info',
          distinguishCancelAndClose: true,
        },
      );
      exportFormat = 'excel';
    } catch (error) {
      if (error === 'cancel') {
        exportFormat = 'pdf';
        try {
          await ElMessageBox.confirm(
            '提示：PDF格式中文显示可能不正确，建议使用Excel格式。确定继续导出PDF吗？',
            '确认导出PDF',
            {
              confirmButtonText: '继续导出PDF',
              cancelButtonText: '返回选择Excel',
              type: 'warning',
            },
          );
        } catch {
          exportFormat = 'excel';
        }
      } else {
        return;
      }
    }

    const loadingInstance = ElLoading.service({
      text: '导出中...',
    });

    try {
      if (USE_REAL_API) {
        const res = await exportCarInput(dataObj.searchParams);
        const fileExtension = exportFormat === 'pdf' ? '.pdf' : '.xlsx';
        await downloadFileFromBlobPart({
          fileName: `车辆录入数据${fileExtension}`,
          source: res,
        });
        ElMessage.success({
          message: '导出成功！文件已开始下载',
          duration: 3000,
        });
      } else {
        exportToExcel(
          dataObj.list.length > 0 ? dataObj.list : dataObj.apilist,
          textObj.excelName,
          textObj.excelAllName,
        );
        ElMessage.success({
          message: '导出成功！',
          duration: 3000,
        });
      }
    } catch (error) {
      const errorMessage = error.message || '未知错误';
      ElMessage.error(`导出失败：${errorMessage}`);
      console.error(error);
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    console.error('导出操作失败:', error);
  }
}

function handleCreate() {
  createFormDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
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
  currentRow: null,
  filterLabels: {},
});

let isSearching = false;

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchParams;
  const labels = dataObj.filterLabels;

  if (obj.plateNo) {
    filters.push({ label: `车牌号码：${obj.plateNo}`, field: 'plateNo' });
  }
  if (obj.status) {
    const statusLabel = labels.status || obj.status;
    filters.push({ label: `审核状态：${statusLabel}`, field: 'status' });
  }
  if (obj.areaName) {
    filters.push({ label: `片区：${obj.areaName}`, field: 'areaName' });
  }
  if (obj.inputUserName) {
    filters.push({ label: `录入人：${obj.inputUserName}`, field: 'inputUserName' });
  }
  if (obj.auditUserName) {
    filters.push({ label: `审核人：${obj.auditUserName}`, field: 'auditUserName' });
  }
  if (obj.inputTime && Array.isArray(obj.inputTime)) {
    const timeLabel = `时间范围：${obj.inputTime[0]} ~ ${obj.inputTime[1]}`;
    filters.push({ label: timeLabel, field: 'inputTime' });
  }
  if (obj.createTimeRange && Array.isArray(obj.createTimeRange)) {
    const timeLabel = `时间范围：${obj.createTimeRange[0]} ~ ${obj.createTimeRange[1]}`;
    filters.push({ label: timeLabel, field: 'createTimeRange' });
  }

  return filters;
});

const handleClearField = (fieldName) => {
  const next = { ...dataObj.searchParams };
  delete next[fieldName];
  dataObj.searchParams = next;

  const nextLabels = { ...dataObj.filterLabels };
  delete nextLabels[fieldName];
  dataObj.filterLabels = nextLabels;

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

      const res = await getCarInputPage(params);
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
      case '已通过': {
        statusMatch = v.status === '已通过';
        break;
      }
      case '已驳回': {
        statusMatch = v.status === '已驳回';
        break;
      }
      case '待审核': {
        statusMatch = v.status === '待审核';
        break;
      }
    }

    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value) {
        if (key === 'inputTime' && Array.isArray(value)) {
          const itemTime = new Date(v.inputTime).toISOString().split('T')[0];
          const startTime = value[0].split(' ')[0];
          const endTime = value[1].split(' ')[0];
          searchMatch = searchMatch && itemTime >= startTime && itemTime <= endTime;
        } else {
          searchMatch =
            searchMatch && v[key]?.toString().includes(value.toString());
        }
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
  schema: computed(() => {
    const schema = useSearchFormSchema().map((v) => {
      delete v.rules;
      return { ...v };
    });

    const areaField = schema.find((f) => f.fieldName === 'areaId');
    if (areaField) {
      areaField.componentProps.options = stationOptions.value;
    }

    return schema;
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

function onSubmit(values) {
  dataObj.searchParams = values;

  // 保存标签信息
  const labels = {};
  const searchSchema = useSearchFormSchema();
  searchSchema.forEach((field) => {
    if (field.component === 'Select' && values[field.fieldName]) {
      const option = field.componentProps.options?.find(
        (opt) => opt.value === values[field.fieldName]
      );
      if (option) {
        labels[field.fieldName] = option.label;
      }
    }
  });

  dataObj.filterLabels = labels;
  isSearching = true;
  gridApi.query();
  drawerApi.close();
}

function handleResetFilters() {
  dataObj.searchParams = {};
  dataObj.filterLabels = {};
  dataObj.currentPage = 1;
  gridApi.query();
  ElMessage.success('已重置筛选条件');
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
      const data = await getCarInput(row.id);
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
  { label: '待审核' },
  { label: '已通过' },
  { label: '已驳回' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
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
    case '待审核': {
      count = dataObj.apilist.filter((v) => v.status === '待审核').length;
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
  loadStationOptions();
  window.addEventListener('filterByChart:carInput', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:carInput', handleFilterByChart);
});

// 审核表单
const [AuditForm, auditFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useAuditFormSchema(),
  showDefaultActions: false,
});

const [AuditFormDrawer, auditFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    auditFormDrawerApi.close();
  },
  async onConfirm() {
    if (USE_REAL_API) {
      try {
        const values = auditFormApi.form.values;
        await auditCarInput({
          id: dataObj.currentRow.id,
          ...values,
        });
        ElMessage.success('审核成功');
        handleRefresh();
        auditFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('审核失败');
        console.error(error);
      }
    } else {
      const values = auditFormApi.form.values;
      const index = dataObj.apilist.findIndex(
        (v) => v.id === dataObj.currentRow.id,
      );
      if (index !== -1) {
        dataObj.apilist[index].status =
          values.auditResult === '通过' ? '已通过' : '已驳回';
        dataObj.apilist[index].auditComment = values.auditComment;
      }
      handleRefresh();
      auditFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      auditFormApi.resetForm();
    }
  },
});

// 修正表单
const [CorrectForm, correctFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useCorrectFormSchema(),
  showDefaultActions: false,
});

const [CorrectFormDrawer, correctFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    correctFormDrawerApi.close();
  },
  async onConfirm() {
    if (USE_REAL_API) {
      try {
        const values = correctFormApi.form.values;
        await correctCarInput({
          id: dataObj.currentRow.id,
          ...values,
        });
        ElMessage.success('修正成功');
        handleRefresh();
        correctFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('修正失败');
        console.error(error);
      }
    } else {
      const values = correctFormApi.form.values;
      const index = dataObj.apilist.findIndex(
        (v) => v.id === dataObj.currentRow.id,
      );
      if (index !== -1) {
        Object.assign(dataObj.apilist[index], values);
        dataObj.apilist[index].status = '待审核';
      }
      handleRefresh();
      correctFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen && dataObj.currentRow) {
      correctFormApi.setValues({
        plateNo: dataObj.currentRow.plateNo,
        spaceId: dataObj.currentRow.spaceId,
        areaId: dataObj.currentRow.areaId,
        remark: dataObj.currentRow.remark,
      });
    }
  },
});

// 审核操作
const handleAudit = (row) => {
  dataObj.currentRow = row;
  auditFormDrawerApi
    .setData({
      title: '审核车辆录入',
    })
    .open();
};

// 确认操作
const handleConfirm = async (row) => {
  await confirm('确定确认该录入信息吗？');
  if (USE_REAL_API) {
    try {
      await confirmCarInput({ id: row.id });
      ElMessage.success('确认成功');
      handleRefresh();
    } catch (error) {
      ElMessage.error('确认失败');
      console.error(error);
    }
  } else {
    const index = dataObj.apilist.findIndex((v) => v.id === row.id);
    if (index !== -1) {
      dataObj.apilist[index].status = '已确认';
    }
    handleRefresh();
  }
};

// 修正操作
const handleCorrect = (row) => {
  dataObj.currentRow = row;
  correctFormDrawerApi
    .setData({
      title: '修正车辆录入',
    })
    .open();
};

// 打开车位详情弹窗
const handleOpenSpaceDetail = (row) => {
  if (!row.spaceId) {
    ElMessage.warning('车位信息不存在');
    return;
  }
  spaceDetailRef.value?.open(row.spaceId, row);
};

// 打开车辆详情弹窗
const handleOpenVehicleDetail = (row) => {
  if (!row.plateNo) {
    ElMessage.warning('车牌号不存在');
    return;
  }
  vehicleDetailRef.value?.open(row.plateNo);
};

// 按审核状态筛选
const handleFilterByStatus = (status) => {
  dataObj.searchParams = { ...dataObj.searchParams, status };
  isSearching = true;
  gridApi.query();
};

// 按片区筛选
const handleFilterByArea = (areaId, areaName) => {
  dataObj.searchParams = { ...dataObj.searchParams, areaId };
  dataObj.filterLabels = { ...dataObj.filterLabels, areaId: areaName };
  isSearching = true;
  gridApi.query();
};

// 按录入人筛选
const handleFilterByInputUser = (inputUserName) => {
  dataObj.searchParams = { ...dataObj.searchParams, inputUserName };
  isSearching = true;
  gridApi.query();
};

// 按审核人筛选
const handleFilterByAuditUser = (auditUserName) => {
  if (!auditUserName) {
    ElMessage.warning('审核人信息不存在');
    return;
  }
  dataObj.searchParams = { ...dataObj.searchParams, auditUserName };
  isSearching = true;
  gridApi.query();
};
</script>

<template>
  <div class="park-lot-table-new">
    <CreateFormDrawer :title="textObj.addText">
      <CreateForm />
    </CreateFormDrawer>
    <AuditFormDrawer title="审核车辆录入">
      <AuditForm />
    </AuditFormDrawer>
    <CorrectFormDrawer title="修正车辆录入">
      <CorrectForm />
    </CorrectFormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.plateNo || '车辆'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <SpaceDetailDialog ref="spaceDetailRef" />
    <VehicleDetailDialog ref="vehicleDetailRef" />
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
            <IconButton
              v-if="activeFilters.length > 0"
              content="重置"
              icon-name="RefreshLeft"
              @click="handleResetFilters"
            />
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
            content="筛选"
            icon-name="Filter"
            @click="handleSerachShow"
          />
          <IconButton
            content="重置"
            icon-name="Refresh"
            @click="handleResetFilters"
          />
          <IconButton
            content="导出"
            icon-name="Download"
            @click="handleExport"
          />
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
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
      <template #plateNo="{ row }">
        <el-text
          @click="handleOpenVehicleDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.plateNo }}
        </el-text>
      </template>
      <template #spaceId="{ row }">
        <el-text
          @click="handleOpenSpaceDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.spaceId }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="
            row.status === '已通过'
              ? 'success'
              : row.status === '待审核'
                ? 'warning'
                : 'danger'
          "
          style="cursor: pointer"
          @click="handleFilterByStatus(row.status)"
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #areaName="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleFilterByArea(row.areaId, row.areaName)"
        >
          {{ row.areaName }}
        </el-text>
      </template>
      <template #inputUserName="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleFilterByInputUser(row.inputUserName)"
        >
          {{ row.inputUserName }}
        </el-text>
      </template>
      <template #auditUserName="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleFilterByAuditUser(row.auditUserName)"
        >
          {{ row.auditUserName || '-' }}
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
            v-if="row.status === '待审核'"
            content="审核"
            icon-name="CircleCheck"
            @click="handleAudit(row)"
          />
          <IconButton
            v-if="row.status === '已通过'"
            content="确认"
            icon-name="Select"
            @click="handleConfirm(row)"
          />
          <IconButton
            v-if="row.status === '已驳回'"
            content="修正"
            icon-name="edit"
            @click="handleCorrect(row)"
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
            本页统计：入场记录数量: {{ dataObj.list.length }}; 已选择:
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
