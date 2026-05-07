<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  correctEnterRecord,
  createEnterRecord,
  exportEnterRecord,
  getEnterRecord,
  getEnterRecordPage,
  updateEnterRecord,
} from '#/api/genchuan/industry/chargePark/vehiclePass/enterMgmt/enterRecord';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import SpaceDetailDialog from '../../../components/SpaceDetailDialog.vue';
import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';
import {
  dataList,
  detailFields,
  plateColorTypeMap,
  recordTypeMap,
  statusTypeMap,
  textObj,
  useCorrectFormSchema,
  useCreateFormSchema,
  useGridColumns,
  useSearchFormSchema,
  useUpdateFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

// 是否使用真实API（默认false使用模拟数据）
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
const vehicleDetailRef = ref(null);
const spaceDetailRef = ref(null);
const formData = ref();

// 查询表单
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
  schema: useSearchFormSchema(),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 新增表单
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

// 编辑表单
const [UpdateForm, updateFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useUpdateFormSchema(),
  showDefaultActions: false,
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

// 新增Drawer
const [CreateFormDrawer, createFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    createFormDrawerApi.close();
  },
  onConfirm() {
    const obj = createFormApi.form.values;
    handleCreateSubmit(obj);
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      createFormApi.resetForm();
    }
  },
});

// 编辑Drawer
const [UpdateFormDrawer, updateFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    updateFormDrawerApi.close();
  },
  onConfirm() {
    const obj = updateFormApi.form.values;
    handleUpdateSubmit(obj);
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = updateFormDrawerApi.getData();
      if (formData.value?.id) {
        await updateFormApi.setValues(formData.value);
      }
    }
  },
});

// 修正Drawer
const [CorrectFormDrawer, correctFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    correctFormDrawerApi.close();
  },
  onConfirm() {
    const obj = correctFormApi.form.values;
    handleCorrectSubmit(obj);
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = correctFormDrawerApi.getData();
      if (formData.value?.id) {
        await correctFormApi.setValues(formData.value);
      }
    }
  },
});

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  if (USE_REAL_API) {
    try {
      await exportEnterRecord(dataObj.searchParams);
      ElMessage.success('导出成功');
    } catch (error) {
      ElMessage.error('导出失败');
      console.error(error);
    }
  } else {
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

function handleCreate() {
  createFormDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

async function handleCreateSubmit(data) {
  if (USE_REAL_API) {
    const loadingInstance = ElLoading.service({
      text: '正在补录...',
    });
    try {
      await createEnterRecord(data);
      ElMessage.success('补录成功');
      handleRefresh();
      createFormDrawerApi.close();
    } catch (error) {
      ElMessage.error('补录失败');
      console.error(error);
    } finally {
      loadingInstance.close();
    }
  } else {
    dataObj.apilist.push(data);
    handleRefresh();
    createFormDrawerApi.close();
  }
}

function handleEdit(row) {
  updateFormDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleUpdateSubmit(data) {
  if (USE_REAL_API) {
    const loadingInstance = ElLoading.service({
      text: '正在更新...',
    });
    try {
      await updateEnterRecord({
        ...data,
        id: formData.value?.id,
      });
      ElMessage.success('更新成功');
      handleRefresh();
      updateFormDrawerApi.close();
    } catch (error) {
      ElMessage.error('更新失败');
      console.error(error);
    } finally {
      loadingInstance.close();
    }
  } else {
    dataObj.apilist.forEach((v, i) => {
      if (v.id === formData.value?.id) {
        dataObj.apilist[i] = data;
      }
    });
    handleRefresh();
    updateFormDrawerApi.close();
  }
}

function handleCorrect(row) {
  correctFormDrawerApi
    .setData({
      title: '修正入场记录',
      ...row,
    })
    .open();
}

async function handleCorrectSubmit(data) {
  if (USE_REAL_API) {
    const loadingInstance = ElLoading.service({
      text: '正在修正...',
    });
    try {
      await correctEnterRecord({
        ...data,
        id: formData.value?.id,
        isCorrected: true,
      });
      ElMessage.success('修正成功');
      handleRefresh();
      correctFormDrawerApi.close();
    } catch (error) {
      ElMessage.error('修正失败');
      console.error(error);
    } finally {
      loadingInstance.close();
    }
  } else {
    dataObj.apilist.forEach((v, i) => {
      if (v.id === formData.value?.id) {
        dataObj.apilist[i] = { ...v, ...data, isCorrected: true };
      }
    });
    handleRefresh();
    correctFormDrawerApi.close();
  }
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

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const getTableData = async (pageObj) => {
  const page = pageObj.page;

  // 使用真实API
  if (USE_REAL_API) {
    try {
      const params = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        ...dataObj.searchParams,
      };

      const res = await getEnterRecordPage(params);
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
      case '异常记录': {
        statusMatch = v.status === '异常记录';
        break;
      }
      case '正常记录': {
        statusMatch = v.status === '正常记录';
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
    const loadingInstance = ElLoading.service({
      text: '加载详情中...',
    });
    try {
      const res = await getEnterRecord(row.id);
      dataObj.detailObj = res || row;
      detailDrawerRef.value?.open();
    } catch (error) {
      ElMessage.error('获取详情失败');
      console.error(error);
      // 失败时使用行数据
      dataObj.detailObj = row;
      detailDrawerRef.value?.open();
    } finally {
      loadingInstance.close();
    }
  } else {
    dataObj.detailObj = row;
    detailDrawerRef.value?.open();
  }
};

const tabsData = ref([
  { label: '全部' },
  { label: '正常记录' },
  { label: '异常记录' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '异常记录': {
      count = dataObj.apilist.filter((v) => v.status === '异常记录').length;
      break;
    }
    case '正常记录': {
      count = dataObj.apilist.filter((v) => v.status === '正常记录').length;
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

// 车牌点击 - 查看车辆详情
const handlePlateNoClick = (row) => {
  if (!row.plateNo) {
    ElMessage.warning('该记录无车牌信息');
    return;
  }
  vehicleDetailRef.value?.open(row.plateNo);
};

// 车牌颜色点击 - 筛选同颜色车牌
const handlePlateColorClick = (row) => {
  if (!row.plateColor) return;
  dataObj.searchParams = {
    ...dataObj.searchParams,
    plateColor: row.plateColor,
  };
  handleRefresh();
  ElMessage.success(`已筛选车牌颜色: ${row.plateColor}`);
};

// 车位点击 - 跳转车位详情
const handleSpaceNoClick = (row) => {
  spaceDetailRef.value?.open(row.spaceNo, row);
};

// 状态点击 - 筛选同状态记录
const handleStatusClick = (row) => {
  dataObj.searchParams = { ...dataObj.searchParams, status: row.status };
  handleRefresh();
  ElMessage.success(`已筛选状态: ${row.status}`);
};

// 场站点击 - 筛选同场站记录
const handleStationClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    stationName: row.stationName,
  };
  handleRefresh();
  ElMessage.success(`已筛选场站: ${row.stationName}`);
};

// 根据状态判断按钮显示
const shouldShowEdit = (status) => {
  return status === '正常记录';
};

const shouldShowCorrect = (status) => {
  return status === '异常记录';
};

// 处理图表卡片点击筛选
const handleFilterByChart = (event) => {
  const filterParams = event.detail;
  dataObj.searchParams = { ...dataObj.searchParams, ...filterParams };
  handleRefresh();
  ElMessage.success('已应用图表筛选');
};

onMounted(() => {
  window.addEventListener('filterByChart:enterRecord', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:enterRecord', handleFilterByChart);
});
</script>

<template>
  <div class="park-lot-table-new">
    <CreateFormDrawer :title="textObj.addText">
      <CreateForm />
    </CreateFormDrawer>
    <UpdateFormDrawer :title="textObj.editText">
      <UpdateForm />
    </UpdateFormDrawer>
    <CorrectFormDrawer title="修正入场记录">
      <CorrectForm />
    </CorrectFormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.plateNo}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <VehicleDetailDialog ref="vehicleDetailRef" />
    <SpaceDetailDialog ref="spaceDetailRef" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
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
            content="筛选"
            icon-name="Filter"
            @click="handleSerachShow"
          />
          <IconButton
            content="导出"
            icon-name="Download"
            @click="handleExport"
          />
          <IconButton content="补录" icon-name="Plus" @click="handleCreate" />
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
          style="cursor: pointer"
        >
          {{ row.id }}
        </el-text>
      </template>
      <template #plateNo="{ row }">
        <el-text
          @click="handlePlateNoClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.plateNo }}
        </el-text>
      </template>
      <template #plateColor="{ row }">
        <el-tag
          :type="plateColorTypeMap[row.plateColor] || 'info'"
          @click="handlePlateColorClick(row)"
          style="cursor: pointer"
        >
          {{ row.plateColor }}
        </el-tag>
      </template>
      <template #spaceNo="{ row }">
        <el-text
          @click="handleSpaceNoClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.spaceNo }}
        </el-text>
      </template>
      <template #recordType="{ row }">
        <el-tag :type="recordTypeMap[row.recordType] || 'info'">
          {{ row.recordType }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="statusTypeMap[row.status] || 'info'"
          @click="handleStatusClick(row)"
          style="cursor: pointer"
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #stationName="{ row }">
        <el-text
          @click="handleStationClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.stationName }}
        </el-text>
      </template>
      <template #isCorrected="{ row }">
        <el-tag :type="row.isCorrected ? 'success' : 'info'">
          {{ row.isCorrected ? '已修正' : '未修正' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            v-if="shouldShowEdit(row.status)"
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-if="shouldShowCorrect(row.status)"
            content="修正"
            icon-name="Edit"
            @click="handleCorrect(row)"
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
