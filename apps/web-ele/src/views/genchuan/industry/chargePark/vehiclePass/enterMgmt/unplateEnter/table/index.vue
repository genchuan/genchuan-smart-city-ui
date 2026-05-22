<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  auditUnplateEnter,
  confirmUnplateEnter,
  correctUnplateEnter,
  createUnplateEnter,
  exportUnplateEnter,
  getUnplateEnter,
  getUnplateEnterPage,
} from '#/api/genchuan/industry/chargePark/vehiclePass/enterMgmt/unplateEnter';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

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

const [SearchForm, searchFormApi] = useVbenForm({
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

const [CreateFormDrawer, createFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    createFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      const values = createFormApi.form.values;
      const loadingInstance = ElLoading.service({ text: '提交中...' });
      try {
        await createUnplateEnter(values);
        ElMessage.success('新增成功');
        handleRefresh();
        createFormDrawerApi.close();
      } finally {
        loadingInstance.close();
      }
    } catch (error) {
      ElMessage.error('新增失败');
      console.error(error);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      createFormApi.resetForm();
    }
  },
});

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

const [CorrectFormDrawer, correctFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    correctFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      const values = correctFormApi.form.values;
      const formData = correctFormDrawerApi.getData();
      const loadingInstance = ElLoading.service({ text: '提交中...' });
      try {
        await correctUnplateEnter({
          id: formData.id,
          ...values,
        });
        ElMessage.success('修正成功');
        handleRefresh();
        correctFormDrawerApi.close();
      } finally {
        loadingInstance.close();
      }
    } catch (error) {
      ElMessage.error('修正失败');
      console.error(error);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const formData = correctFormDrawerApi.getData();
      if (formData?.id) {
        // 将 stationName 映射为 stationId
        const mappedData = { ...formData };
        if (formData.stationName && !formData.stationId) {
          const station = stationOptions.value.find(
            (opt) => opt.label === formData.stationName,
          );
          if (station) {
            mappedData.stationId = station.value;
          }
        }
        await correctFormApi.setValues(mappedData);
      }
    }
  },
});

const [AuditFormDrawer, auditFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    auditFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      await auditFormApi.validate();
      const values = auditFormApi.form.values;
      const formData = auditFormDrawerApi.getData();
      const loadingInstance = ElLoading.service({ text: '提交中...' });
      try {
        await auditUnplateEnter({
          id: formData.id,
          ...values,
        });
        ElMessage.success('审核成功');
        handleRefresh();
        auditFormDrawerApi.close();
      } finally {
        loadingInstance.close();
      }
    } catch (error) {
      ElMessage.error('审核失败');
      console.error(error);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      auditFormApi.resetForm();
    }
  },
});

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  if (USE_REAL_API) {
    const loadingInstance = ElLoading.service({
      text: '正在导出...',
    });
    try {
      const res = await exportUnplateEnter(dataObj.searchParams);
      downloadFileFromBlobPart({
        fileName: `${textObj.excelAllName}.xlsx`,
        source: res,
      });
    } catch (error) {
      ElMessage.error('导出失败');
      console.error(error);
    } finally {
      loadingInstance.close();
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

function handleEdit(row) {
  correctFormDrawerApi
    .setData({
      title: '修正无牌入场',
      ...row,
    })
    .open();
}

function handleAudit(row) {
  auditFormDrawerApi
    .setData({
      title: '审核无牌入场',
      ...row,
    })
    .open();
}

async function handleConfirm(row) {
  try {
    await confirm({
      title: '确认操作',
      content: `确定要确认该无牌入场记录吗？`,
    });
    const loadingInstance = ElLoading.service({ text: '确认中...' });
    try {
      await confirmUnplateEnter({ id: row.id });
      ElMessage.success('确认成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('确认失败');
      console.error(error);
    }
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

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchParams;

  if (obj.plateNo) {
    filters.push({ label: `车牌号码：${obj.plateNo}`, field: 'plateNo' });
  }
  if (obj.status) {
    filters.push({ label: `状态：${obj.status}`, field: 'status' });
  }
  if (obj.stationName) {
    filters.push({ label: `场站：${obj.stationName}`, field: 'stationName' });
  }
  if (obj.isCorrected !== undefined && obj.isCorrected !== null) {
    filters.push({
      label: `修正状态：${obj.isCorrected ? '已修正' : '未修正'}`,
      field: 'isCorrected',
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

      const res = await getUnplateEnterPage(params);
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
      case '异常': {
        statusMatch = v.status === '异常';
        break;
      }
      case '正常': {
        statusMatch = v.status === '正常';
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
    const loading = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    });

    const res = await getUnplateEnter(row.id);
    dataObj.detailObj = res || row;
    detailDrawerRef.value.open();

    loading.close();
  } catch (error) {
    ElMessage.error('获取详情失败');
    console.error(error);
  }
};

const tabsData = ref([{ label: '全部' }, { label: '正常' }, { label: '异常' }]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '异常': {
      count = dataObj.apilist.filter((v) => v.status === '异常').length;
      break;
    }
    case '正常': {
      count = dataObj.apilist.filter((v) => v.status === '正常').length;
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
  // 去除 status 字段，只保留图表相关的筛选字段
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { status, ...validParams } = filterParams;
  dataObj.searchParams = { ...dataObj.searchParams, ...validParams };
  handleRefresh();
  ElMessage.success('已应用图表筛选');
};

onMounted(() => {
  loadStationOptions();
  window.addEventListener('filterByChart:unplateEnter', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:unplateEnter', handleFilterByChart);
});
</script>

<template>
  <div class="park-lot-table-new">
    <CreateFormDrawer title="新增无牌入场">
      <CreateForm />
    </CreateFormDrawer>
    <AuditFormDrawer title="审核无牌入场">
      <AuditForm />
    </AuditFormDrawer>
    <CorrectFormDrawer title="修正无牌入场">
      <CorrectForm />
    </CorrectFormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      title="无牌入场详情"
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
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
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
      <template #updater="{ row }">
        <el-text>{{ row.updater || '-' }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>
          {{ row.updateTime ? formatTime(row.updateTime) : '-' }}
        </el-text>
      </template>
      <template #correctionMark="{ row }">
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
