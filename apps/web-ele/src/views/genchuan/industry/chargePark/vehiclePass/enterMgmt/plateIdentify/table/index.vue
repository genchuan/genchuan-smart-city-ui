<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getStationInfoPage } from '#/api/genchuan/industry/chargePark/stationResource/stationMgmt/stationInfo';
import {
  confirmPlateIdentify,
  correctPlateIdentify,
  createPlateIdentify,
  exportPlateIdentify,
  getPlateIdentify,
  getPlateIdentifyPage,
} from '#/api/genchuan/industry/chargePark/vehiclePass/enterMgmt/plateIdentify';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';
import { formatTime } from '../../../utils/timeFormatter';
import ImagePreviewDialog from '../../plateIdentify/components/ImagePreviewDialog.vue';
import {
  dataList,
  detailFields,
  getStationOptions,
  plateColorTypeMap,
  statusTypeMap,
  textObj,
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
    const options = await getStationOptions();
    console.log('车牌识别-加载场站选项:', options);
    stationOptions.value = options;
  } catch (error) {
    console.error('Failed to load station options:', error);
  }
}

const getTitle = computed(() => {
  return formData.value?.id ? '修正车牌识别' : textObj.addText;
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
const imagePreviewRef = ref(null);
const vehicleDetailRef = ref(null);
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
  schema: computed(() => {
    const schema = useSearchFormSchema();
    const stationField = schema.find((f) => f.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps.options = stationOptions.value;
    }
    return schema;
  }),
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
  schema: computed(() => {
    const schema = useCreateFormSchema();
    const stationField = schema.find((f) => f.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps.options = stationOptions.value;
    }
    return schema;
  }),
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
  schema: computed(() => {
    const schema = useCorrectFormSchema();
    const stationField = schema.find((f) => f.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps.options = stationOptions.value;
    }
    return schema;
  }),
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
  const loadingInstance = ElLoading.service({
    text: '导出中...',
  });
  try {
    if (USE_REAL_API) {
      const res = await exportPlateIdentify(dataObj.searchParams);
      downloadFileFromBlobPart({ fileName: '车牌识别.xlsx', source: res });
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
      title: textObj.addText,
    })
    .open();
}

async function handleCreateSubmit(data) {
  if (USE_REAL_API) {
    const loadingInstance = ElLoading.service({
      text: '正在创建...',
    });
    try {
      await createPlateIdentify(data);
      ElMessage.success('创建成功');
      handleRefresh();
      createFormDrawerApi.close();
    } catch (error) {
      ElMessage.error('创建失败');
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
  correctFormDrawerApi
    .setData({
      title: '修正车牌识别',
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
      await correctPlateIdentify({
        ...data,
        id: formData.value?.id,
        status: '识别成功',
        isCorrected: 1,
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
        dataObj.apilist[i] = {
          ...v,
          ...data,
          status: '识别成功',
          isCorrected: 1,
        };
      }
    });
    handleRefresh();
    correctFormDrawerApi.close();
  }
}

async function handleConfirm(row) {
  if (USE_REAL_API) {
    const loadingInstance = ElLoading.service({
      text: '正在确认...',
    });
    try {
      await confirmPlateIdentify({ id: row.id });
      ElMessage.success('确认成功');
      handleRefresh();
    } catch (error) {
      ElMessage.error('确认失败');
      console.error(error);
    } finally {
      loadingInstance.close();
    }
  } else {
    ElMessage.success('确认成功');
    handleRefresh();
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

let isSearching = false;

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

      const res = await getPlateIdentifyPage(params);
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
      case '识别失败': {
        statusMatch = v.status === '识别失败';
        break;
      }
      case '识别成功': {
        statusMatch = v.status === '识别成功';
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

function onSubmit(values) {
  // 如果选择了场站，需要同时保存场站ID和场站名称
  if (values.stationId) {
    const station = stationOptions.value.find(s => s.value === values.stationId);
    if (station) {
      values.stationName = station.label;
    }
  }
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
  if (USE_REAL_API) {
    const loadingInstance = ElLoading.service({
      text: '加载详情中...',
    });
    try {
      const res = await getPlateIdentify(row.id);
      dataObj.detailObj = res;
      detailDrawerRef.value.open();
    } catch (error) {
      ElMessage.error('获取详情失败');
      console.error(error);
    } finally {
      loadingInstance.close();
    }
  } else {
    dataObj.detailObj = row;
    detailDrawerRef.value.open();
  }
};

const tabsData = ref([
  { label: '全部' },
  { label: '识别成功' },
  { label: '识别失败' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '识别失败': {
      count = dataObj.apilist.filter((v) => v.status === '识别失败').length;
      break;
    }
    case '识别成功': {
      count = dataObj.apilist.filter((v) => v.status === '识别成功').length;
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
};

// 状态点击 - 筛选同状态记录
const handleStatusClick = (row) => {
  dataObj.searchParams = { ...dataObj.searchParams, status: row.status };
  handleRefresh();
};

// 场站点击 - 筛选同场站记录
const handleStationClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    stationId: row.stationId,
    stationName: row.stationName,
  };
  handleRefresh();
};

// 修正标记点击 - 筛选同修正状态记录
const handleCorrectedClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    isCorrected: row.isCorrected,
  };
  handleRefresh();
};

// 清除单个筛选条件
const handleClearFilter = (key) => {
  if (key === 'createTimeRange') {
    delete dataObj.searchParams.createTimeRange;
  } else if (key === 'stationName') {
    // 清除场站时，同时清除 stationId 和 stationName
    delete dataObj.searchParams.stationName;
    delete dataObj.searchParams.stationId;
  } else if (key === 'stationId') {
    // 清除场站时，同时清除 stationId 和 stationName
    delete dataObj.searchParams.stationName;
    delete dataObj.searchParams.stationId;
  } else {
    delete dataObj.searchParams[key];
  }
  handleRefresh();
};

// 图片预览
const handleImagePreview = (row) => {
  if (!row.imageUrl) {
    ElMessage.warning('暂无图片');
    return;
  }
  imagePreviewRef.value?.open(
    row.imageUrl,
    `${row.plateNo || '未识别'} - 抓拍图片`,
  );
};

// 根据状态判断按钮显示
const shouldShowConfirm = (status) => {
  return status === '识别成功';
};

const shouldShowCorrect = (status) => {
  return status === '识别失败';
};

// 获取置信度颜色
const getConfidenceColor = (confidence) => {
  if (confidence >= 90) return 'success';
  if (confidence >= 70) return 'warning';
  return 'danger';
};

// 处理图表卡片点击筛选
const handleFilterByChart = (event) => {
  const filterParams = event.detail;
  // 叠加筛选条件，保留现有筛选
  dataObj.searchParams = { ...dataObj.searchParams, ...filterParams };
  isSearching = true;
  handleRefresh();
  ElMessage.success('已应用图表筛选');
};

onMounted(() => {
  loadStationOptions();
  window.addEventListener('filterByChart:plateIdentify', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener(
    'filterByChart:plateIdentify',
    handleFilterByChart,
  );
});
</script>

<template>
  <div class="park-lot-table-new">
    <CreateFormDrawer :title="textObj.addText">
      <CreateForm />
    </CreateFormDrawer>
    <CorrectFormDrawer :title="getTitle">
      <CorrectForm />
    </CorrectFormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.plateNo}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <ImagePreviewDialog ref="imagePreviewRef" />
    <VehicleDetailDialog ref="vehicleDetailRef" />
    <Drawer title="搜索">
      <SearchForm class="query-form" />
    </Drawer>
    <Grid>
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
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

          <!-- 筛选条件标签 -->
          <el-tag
            v-if="dataObj.searchParams.plateNo"
            type="primary"
            closable
            @close="handleClearFilter('plateNo')"
          >
            车牌号：{{ dataObj.searchParams.plateNo }}
          </el-tag>
          <el-tag
            v-if="dataObj.searchParams.plateColor"
            type="primary"
            closable
            @close="handleClearFilter('plateColor')"
          >
            车牌颜色：{{ dataObj.searchParams.plateColor }}
          </el-tag>
          <el-tag
            v-if="dataObj.searchParams.status"
            type="primary"
            closable
            @close="handleClearFilter('status')"
          >
            识别状态：{{ dataObj.searchParams.status }}
          </el-tag>
          <el-tag
            v-if="dataObj.searchParams.stationName"
            type="primary"
            closable
            @close="handleClearFilter('stationName')"
          >
            场站：{{ dataObj.searchParams.stationName }}
          </el-tag>
          <el-tag
            v-if="dataObj.searchParams.isCorrected !== undefined"
            type="primary"
            closable
            @close="handleClearFilter('isCorrected')"
          >
            修正标记：{{
              dataObj.searchParams.isCorrected === 2 ? '已确认' : dataObj.searchParams.isCorrected === 1 ? '已修正' : '未修正'
            }}
          </el-tag>
          <el-tag
            v-if="
              dataObj.searchParams.createTimeRange &&
              dataObj.searchParams.createTimeRange.length === 2
            "
            type="info"
            closable
            @close="handleClearFilter('createTimeRange')"
          >
            时间范围：{{ dataObj.searchParams.createTimeRange[0] }} 至
            {{ dataObj.searchParams.createTimeRange[1] }}
          </el-tag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="筛选"
            icon-name="Search"
            @click="handleSerachShow"
          />
          <IconButton
            content="导出"
            icon-name="Download"
            @click="handleExport"
          />
          <IconButton
            content="手动录入"
            icon-name="Plus"
            @click="handleCreate"
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
          style="cursor: pointer"
        >
          {{ row.id }}
        </el-text>
      </template>
      <template #plateNo="{ row }">
        <el-text
          v-if="row.plateNo"
          @click="handlePlateNoClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.plateNo }}
        </el-text>
        <el-text v-else type="info">未识别</el-text>
      </template>
      <template #plateColor="{ row }">
        <el-tag
          v-if="row.plateColor"
          :type="plateColorTypeMap[row.plateColor] || 'info'"
          @click="handlePlateColorClick(row)"
          style="cursor: pointer"
        >
          {{ row.plateColor }}
        </el-tag>
        <el-text v-else type="info">-</el-text>
      </template>
      <template #confidence="{ row }">
        <el-tag :type="getConfidenceColor(row.confidence)">
          {{ row.confidence }}%
        </el-tag>
      </template>
      <template #imageUrl="{ row }">
        <el-button
          v-if="row.imageUrl"
          link
          type="primary"
          @click="handleImagePreview(row)"
        >
          查看图片
        </el-button>
        <el-text v-else type="info">无图片</el-text>
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
      <template #updater="{ row }">
        <el-text>{{ row.updater || '-' }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>
          {{ row.updateTime ? formatTime(row.updateTime) : '-' }}
        </el-text>
      </template>
      <template #correctionMark="{ row }">
        <el-tag
          :type="row.isCorrected === 2 ? 'success' : row.isCorrected === 1 ? 'warning' : 'info'"
        >
          {{ row.isCorrected === 2 ? '已确认' : row.isCorrected === 1 ? '已修正' : '未修正' }}
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
            v-if="shouldShowConfirm(row.status)"
            content="确认"
            icon-name="CircleCheck"
            @click="handleConfirm(row)"
          />
          <IconButton
            v-if="shouldShowCorrect(row.status)"
            content="修正"
            icon-name="Edit"
            @click="handleEdit(row)"
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
