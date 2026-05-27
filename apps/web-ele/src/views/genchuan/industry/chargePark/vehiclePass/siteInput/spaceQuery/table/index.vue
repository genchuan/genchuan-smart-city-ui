<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTime } from '../../../utils/timeFormatter';
import {
  getSpaceQueryPage,
  getSpaceQueryLocation,
  getSpaceQuery,
  exportSpaceQuery,
} from '#/api/genchuan/industry/chargePark/vehiclePass/siteInput/spaceQuery';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import IconButton from '#/components/common/IconButton.vue';
import { exportToExcel } from '#/utils/excel.js';
import SpaceLocationMap from '../components/SpaceLocationMap.vue';
import SpaceDetailDialog from '../../../components/SpaceDetailDialog.vue';

import {
  dataList,
  detailFields,
  getStationOptions,
  textObj,
  useSearchFormSchema,
  useGridColumns,
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
const spaceDetailRef = ref(null);
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
  schema: computed(() => {
    const schema = useSearchFormSchema();
    const stationField = schema.find((f) => f.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps.options = stationOptions.value;
    }
    return schema;
  }),
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
      const res = await exportSpaceQuery(dataObj.searchParams);
      await downloadFileFromBlobPart({
        fileName: `${textObj.excelName || '泊位查询数据'}`,
        source: res,
      });
      ElMessage.success({
        message: '导出成功！文件已开始下载',
        duration: 3000,
      });
    } else {
      exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
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
  filterLabels: {}, // 存储筛选条件的标签
});

let isSearching = false;

const areaMap = {
  1: '芗城区',
  2: '龙文区',
  3: '龙海区',
};

const userMap = {
  2: '张三',
  3: '李四',
};

const spaceStatusMap = {
  '空闲': '空闲',
  '占用': '占用',
};

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchParams;
  const labels = dataObj.filterLabels;

  if (obj.spaceNo) {
    filters.push({ label: `泊位编号：${obj.spaceNo}`, field: 'spaceNo' });
  }
  if (obj.areaId) {
    const areaName = labels.areaId || areaMap[obj.areaId] || obj.areaId;
    filters.push({ label: `场站：${areaName}`, field: 'areaId' });
  }
  if (obj.queryUserId) {
    const userName = labels.queryUserId || userMap[obj.queryUserId] || obj.queryUserId;
    filters.push({ label: `查询人：${userName}`, field: 'queryUserId' });
  }
  if (obj.spaceStatus) {
    filters.push({ label: `泊位状态：${obj.spaceStatus}`, field: 'spaceStatus' });
  }
  if (obj.queryTime && Array.isArray(obj.queryTime) && obj.queryTime.length === 2) {
    filters.push({
      label: `查询时间：${obj.queryTime[0]} 至 ${obj.queryTime[1]}`,
      field: 'queryTime',
    });
  }
  if (obj.querySuccess !== undefined && obj.querySuccess !== null) {
    const statusLabel = labels.querySuccess || (obj.querySuccess ? '成功' : '失败');
    filters.push({
      label: `查询状态：${statusLabel}`,
      field: 'querySuccess',
    });
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

const handleResetFilters = () => {
  dataObj.searchParams = {};
  dataObj.filterLabels = {};
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

      const res = await getSpaceQueryPage(params);
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

    return searchMatch;
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
  // 保存原始值用于过滤
  dataObj.searchParams = values;

  // 保存标签信息
  const labels = {};

  // 从表单选项中获取标签
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

const handleOpenDetail = (row) => {
  handleView(row);
};

const tabsData = ref([{ label: '全部' }]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
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

// 定义事件处理函数引用，用于后续移除监听
let handleFilterByStatus;
let handleOpenSpaceDetail;
let handleFilterByArea;

// 地图弹窗
const [MapDrawer, mapDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  footer: false,
  class: 'map-drawer',
  contentClass: 'map-drawer-content',
  onCancel() {
    mapDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

const mapData = ref({
  lon: 0,
  lat: 0,
  spaceName: '',
  areaName: '',
});

// 定位操作
const handleLocation = async (row) => {
  if (USE_REAL_API) {
    try {
      const res = await getSpaceQueryLocation({ id: row.id });
      mapData.value = res;
      mapDrawerApi
        .setData({
          title: `泊位定位 - ${res.spaceName}`,
        })
        .open();
    } catch (error) {
      ElMessage.error('获取位置信息失败');
      console.error(error);
    }
  } else {
    // 模拟数据
    mapData.value = {
      lon: 118.555527,
      lat: 24.896373,
      spaceName: row.spaceNo,
      areaName: row.areaName || '泉州丰泽片区',
    };
    mapDrawerApi
      .setData({
        title: `泊位定位 - ${row.spaceNo}`,
      })
      .open();
  }
};

// 查看详情
const handleView = async (row) => {
  if (USE_REAL_API) {
    try {
      const detail = await getSpaceQuery(row.id);
      dataObj.detailObj = detail;
      detailDrawerRef.value?.open();
    } catch (error) {
      ElMessage.error('获取详情失败');
      console.error(error);
    }
  } else {
    dataObj.detailObj = row;
    detailDrawerRef.value?.open();
  }
};

// 下钻筛选 - 点击泊位编号
const handleSpaceNoClick = (row) => {
  // 打开车位详情弹窗
  if (!row.spaceNo) {
    ElMessage.warning('泊位编号不存在');
    return;
  }
  spaceDetailRef.value?.open(row.spaceNo, row);
};

// 下钻筛选 - 点击查询人
const handleQueryUserClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    queryUserId: row.queryUserId,
  };
  dataObj.filterLabels = {
    ...dataObj.filterLabels,
    queryUserId: row.queryUserName,
  };
  handleRefresh();
  ElMessage.success(`已筛选查询人：${row.queryUserName}`);
};

// 下钻筛选 - 点击片区
const handleAreaClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    areaId: row.areaId,
  };
  dataObj.filterLabels = {
    ...dataObj.filterLabels,
    areaId: row.areaName,
  };
  handleRefresh();
  ElMessage.success(`已筛选片区：${row.areaName}`);
};

// 监听图表下钻事件
onMounted(() => {
  loadStationOptions();
  // 监听卡片点击事件 - 下钻到列表
  handleFilterByStatus = (e) => {
    const { status } = e.detail;
    if (status === '') {
      // 查询量卡片 - 清空筛选显示全部
      dataObj.searchParams = {};
      dataObj.filterLabels = {};
    } else if (status === 'success') {
      // 查询成功率卡片 - 筛选查询成功的记录
      dataObj.searchParams = {
        querySuccess: true,
      };
      dataObj.filterLabels = {
        querySuccess: '成功',
      };
    }
    dataObj.currentPage = 1;
    handleRefresh();
  };

  // 监听地图点击事件 - 打开泊位详情弹窗
  handleOpenSpaceDetail = (e) => {
    const { spaceNo, row } = e.detail;
    if (spaceNo) {
      // 从列表中查找对应的记录
      const matchedRow = dataObj.apilist.find((item) => item.spaceNo === spaceNo);
      if (matchedRow) {
        handleView(matchedRow);
      } else if (row && row.id) {
        // 如果列表中没有找到，直接使用地图数据
        handleView(row);
      } else {
        ElMessage.warning('未找到对应的泊位信息');
      }
    }
  };

  // 监听区域筛选事件 - 筛选该区域内所有泊位
  handleFilterByArea = (e) => {
    const { areaName, spaceNos } = e.detail;
    dataObj.searchParams = {
      areaName: areaName,
    };
    handleRefresh();
  };

  window.addEventListener('filterByChart:spaceQuery', handleFilterByStatus);
  window.addEventListener('openSpaceDetail:spaceQuery', handleOpenSpaceDetail);
  window.addEventListener('filterByArea:spaceQuery', handleFilterByArea);
});

onUnmounted(() => {
  if (handleFilterByStatus) {
    window.removeEventListener('filterByChart:spaceQuery', handleFilterByStatus);
  }
  if (handleOpenSpaceDetail) {
    window.removeEventListener('openSpaceDetail:spaceQuery', handleOpenSpaceDetail);
  }
  if (handleFilterByArea) {
    window.removeEventListener('filterByArea:spaceQuery', handleFilterByArea);
  }
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <MapDrawer title="泊位定位">
      <SpaceLocationMap
        :lon="mapData.lon"
        :lat="mapData.lat"
        :space-name="mapData.spaceName"
        :area-name="mapData.areaName"
      />
    </MapDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.spaceNo}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <SpaceDetailDialog ref="spaceDetailRef" />
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
            content="搜索"
            icon-name="Filter"
            @click="handleSerachShow"
          />
          <IconButton
            v-if="activeFilters.length > 0"
            content="重置"
            icon-name="Refresh"
            @click="handleResetFilters"
          />
          <IconButton
            content="导出"
            icon-name="Download"
            @click="handleExport"
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
      <template #spaceNo="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleSpaceNoClick(row)"
        >
          {{ row.spaceNo }}
        </el-text>
      </template>
      <template #queryUserName="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleQueryUserClick(row)"
        >
          {{ row.queryUserName }}
        </el-text>
      </template>
      <template #areaName="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleAreaClick(row)"
        >
          {{ row.areaName }}
        </el-text>
      </template>
      <template #spaceStatus="{ row }">
        <el-tag :type="row.spaceStatus === '空闲' ? 'success' : 'warning'">
          {{ row.spaceStatus }}
        </el-tag>
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
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="定位"
            icon-name="Location"
            @click="handleLocation(row)"
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
            本页统计：查询记录数量: {{ dataObj.list.length }}; 已选择:
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

<style scoped lang="scss">
:deep(.map-drawer) {
  .map-drawer-content {
    height: calc(100vh - 120px);
    padding: 0;
  }
}
</style>
