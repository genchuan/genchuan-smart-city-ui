<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import BatchRectify from '../components/BatchRectify.vue';
import ImportExcel from '../components/ImportExcel.vue';
import SingleRectify from '../components/SingleRectify.vue';
import {
  dataList,
  detailFields,
  textObj,
  useFormSchema,
  useGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  showStats: {
    type: Boolean,
    default: false,
  },
  toggleStats: {
    type: Function,
    default: () => {},
  },
  filterGeoCode: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['clearFilter']);
const getTitle = computed(() => {
  return formData.value?.geoCode ? textObj.editText : textObj.addText;
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

// 导入Excel弹窗
const importDialogVisible = ref(false);
const handleImportDialogClose = () => {
  importDialogVisible.value = false;
};

// 批量整改抽屉
const [BatchRectifyDrawer, batchRectifyDrawerApi] = useVbenDrawer({
  title: '批量整改',
  width: '400px',
  placement: 'right',
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    batchRectifyDrawerApi.close();
  },
  onConfirm() {},
});

// 单个整改抽屉
const [SingleRectifyDrawer, singleRectifyDrawerApi] = useVbenDrawer({
  title: '整改',
  width: '500px',
  placement: 'right',
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    singleRectifyDrawerApi.close();
  },
  onConfirm() {},
});

// 当前整改数据
const currentRectifyData = ref(null);
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 130,
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
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.geoCode === formData.value?.geoCode) {
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
      if (formData.value?.geoCode) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建地理编码 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑地理编码 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const confirmResult = await confirm(`确定删除地理编码 "${row.locationName}" 吗？`);
  if (!confirmResult) return;

  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.locationName]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.geoCode !== row.geoCode);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.locationName]));
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
      (v) => !checkedIds.value.includes(v.geoCode),
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
  checkedIds.value = records.map((item) => item.geoCode);
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

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据activeName和searchParams筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    // 状态筛选
    let statusMatch = true;
    switch (activeName.value) {
      case '停用': {
        statusMatch = v.statusName === '停用';
        break;
      }
      case '建设中': {
        statusMatch = v.statusName === '建设中';
        break;
      }
      case '正常': {
        statusMatch = v.statusName === '正常';
        break;
      }
      case '维护中': {
        statusMatch = v.statusName === '维护中';
        break;
      }
    }

    // 地点名称筛选
    const locationNameMatch =
      !filterLocationName.value || v.locationName === filterLocationName.value;

    // 所属区域筛选
    const areaNameMatch =
      !filterAreaName.value || v.areaName === filterAreaName.value;

    // 图层类型筛选
    const layerTypeNameMatch =
      !filterLayerTypeName.value ||
      v.layerTypeName === filterLayerTypeName.value;

    // 数据质量校验结果筛选
    const checkResultNameMatch =
      !filterCheckResultName.value ||
      v.checkResultName === filterCheckResultName.value;

    // 树形结构筛选
    let geoCodeMatch = true;
    if (props.filterGeoCode) {
      // 筛选当前节点及其所有子节点
      const isChildOf = (nodeId, parentId) => {
        const node = dataObj.apilist.find((item) => item.geoCode === nodeId);
        if (!node) return false;
        if (node.geoCode === parentId || node.parentGeoCodeId === parentId)
          return true;
        if (node.parentGeoCodeId)
          return isChildOf(node.parentGeoCodeId, parentId);
        return false;
      };
      geoCodeMatch =
        v.geoCode === props.filterGeoCode ||
        isChildOf(v.geoCode, props.filterGeoCode);
    }

    // 搜索条件筛选
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

    return (
      statusMatch &&
      locationNameMatch &&
      areaNameMatch &&
      layerTypeNameMatch &&
      checkResultNameMatch &&
      searchMatch &&
      geoCodeMatch
    );
  });

  dataObj.total = filteredList.length;
  // 计算总页数
  const totalPages = Math.ceil(filteredList.length / page.pageSize);
  // 如果当前页码大于总页数，重置为第1页
  if (page.currentPage > totalPages && totalPages > 0) {
    page.currentPage = 1;
    dataObj.currentPage = 1;
  }
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 130,
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: useFormSchema().map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit(values) {
  dataObj.searchParams = values;
  handleRefresh();
  drawerApi.close();
}

// 监听 filterGeoCode 变化，刷新表格
watch(
  () => props.filterGeoCode,
  () => {
    handleRefresh();
  },
);

const activeName = ref('全部');
const filterLocationName = ref(''); // 地点名称筛选
const filterAreaName = ref(''); // 所属区域筛选
const filterLayerTypeName = ref(''); // 图层类型筛选
const filterCheckResultName = ref(''); // 数据质量校验结果筛选

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
      keyField: 'geoCode',
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

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 修改tabsData为状态标签：全部、正常、维护中、停用、建设中
const tabsData = ref([
  { label: '全部' },
  { label: '正常' },
  { label: '维护中' },
  { label: '停用' },
  { label: '建设中' },
]);

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '停用': {
      count = dataObj.apilist.filter((v) => v.statusName === '停用').length;
      break;
    }
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '建设中': {
      count = dataObj.apilist.filter((v) => v.statusName === '建设中').length;
      break;
    }
    case '正常': {
      count = dataObj.apilist.filter((v) => v.statusName === '正常').length;
      break;
    }
    case '维护中': {
      count = dataObj.apilist.filter((v) => v.statusName === '维护中').length;
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

// 处理导入Excel
const handleImport = () => {
  importDialogVisible.value = true;
};

// 处理导入成功
const handleImportSuccess = (result) => {
  ElMessage.success(`导入成功，共导入 ${result.successCount} 条数据`);
  importDialogVisible.value = false;
  handleRefresh();
};

// 处理批量整改
const handleBatchRectify = () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择要整改的数据');
    return;
  }
  batchRectifyDrawerApi.open();
};

// 处理批量整改确认
const handleBatchRectifyConfirm = (result) => {
  ElMessage.success(`批量整改成功，共处理 ${result.successCount} 条数据`);
  batchRectifyDrawerApi.close();
  handleRefresh();
};

// 处理单个整改
const handleSingleRectify = (row) => {
  currentRectifyData.value = row;
  singleRectifyDrawerApi.open();
};

// 处理单个整改确认
const handleSingleRectifyConfirm = (result) => {
  ElMessage.success('整改成功，已提交并通过二次校验');
  singleRectifyDrawerApi.close();
  handleRefresh();
};

// 处理地点名称点击
const handleLocationNameClick = (locationName) => {
  filterLocationName.value =
    filterLocationName.value === locationName ? '' : locationName;
  gridApi.query();
};

/** 取消地点名称筛选（筛选标签关闭按钮） */
const handleCancelLocationNameFilter = () => {
  filterLocationName.value = '';
  gridApi.query();
};

// 处理所属区域点击
const handleAreaNameClick = (areaName) => {
  filterAreaName.value = filterAreaName.value === areaName ? '' : areaName;
  gridApi.query();
};

/** 取消所属区域筛选（筛选标签关闭按钮） */
const handleCancelAreaNameFilter = () => {
  filterAreaName.value = '';
  gridApi.query();
};

// 处理图层类型点击
const handleLayerTypeNameClick = (layerTypeName) => {
  filterLayerTypeName.value =
    filterLayerTypeName.value === layerTypeName ? '' : layerTypeName;
  gridApi.query();
};

/** 取消图层类型筛选（筛选标签关闭按钮） */
const handleCancelLayerTypeNameFilter = () => {
  filterLayerTypeName.value = '';
  gridApi.query();
};

// 处理数据质量校验结果点击
const handleCheckResultNameClick = (checkResultName) => {
  filterCheckResultName.value =
    filterCheckResultName.value === checkResultName ? '' : checkResultName;
  gridApi.query();
};

/** 取消数据质量校验结果筛选（筛选标签关闭按钮） */
const handleCancelCheckResultNameFilter = () => {
  filterCheckResultName.value = '';
  gridApi.query();
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.locationName}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <!-- 导入Excel弹窗 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入Excel"
      width="500px"
      @close="handleImportDialogClose"
    >
      <ImportExcel
        @close="handleImportDialogClose"
        @import-success="handleImportSuccess"
      />
    </el-dialog>
    <!-- 批量整改抽屉 -->
    <BatchRectifyDrawer>
      <BatchRectify
        :selected-count="checkedIds.length"
        @close="batchRectifyDrawerApi.close()"
        @confirm="handleBatchRectifyConfirm"
      />
    </BatchRectifyDrawer>
    <!-- 单个整改抽屉 -->
    <SingleRectifyDrawer>
      <SingleRectify
        :data="currentRectifyData"
        @close="singleRectifyDrawerApi.close()"
        @confirm="handleSingleRectifyConfirm"
      />
    </SingleRectifyDrawer>
    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            align-items: center;
          "
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
          <!-- 地点名称筛选标签 -->
          <ElTag
            v-if="filterLocationName"
            type="primary"
            closable
            @close="handleCancelLocationNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            地点名称：{{ filterLocationName }}
          </ElTag>
          <!-- 所属区域筛选标签 -->
          <ElTag
            v-if="filterAreaName"
            type="success"
            closable
            @close="handleCancelAreaNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            所属区域：{{ filterAreaName }}
          </ElTag>
          <!-- 图层类型筛选标签 -->
          <ElTag
            v-if="filterLayerTypeName"
            type="warning"
            closable
            @close="handleCancelLayerTypeNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            图层类型：{{ filterLayerTypeName }}
          </ElTag>
          <!-- 数据质量校验结果筛选标签 -->
          <ElTag
            v-if="filterCheckResultName"
            type="primary"
            closable
            @close="handleCancelCheckResultNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            数据质量校验结果：{{ filterCheckResultName }}
          </ElTag>
          <!-- 树形结构筛选标签 -->
          <ElTag
            v-if="props.filterGeoCode"
            type="primary"
            closable
            @close="emit('clearFilter')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            地理编码：{{ dataObj.apilist.find(item => item.geoCode === props.filterGeoCode)?.locationName }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="新增"
            icon-name="Plus"
            @click="handleCreate"
          />
          <IconButton
            content="导入"
            icon-name="Upload"
            @click="handleImport"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量整改"
            icon-name="CircleCheck"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchRectify"
          />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #geoCode="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.geoCode }}
        </el-text>
      </template>
      <template #locationName="{ row }">
        <el-text
          @click="handleLocationNameClick(row.locationName)"
          class="common-align"
          type="primary"
        >
          {{ row.locationName }}
        </el-text>
      </template>
      <template #areaName="{ row }">
        <el-text
          @click="handleAreaNameClick(row.areaName)"
          class="common-align"
          type="primary"
        >
          {{ row.areaName }}
        </el-text>
      </template>
      <template #layerTypeName="{ row }">
        <el-text
          @click="handleLayerTypeNameClick(row.layerTypeName)"
          class="common-align"
          type="primary"
        >
          {{ row.layerTypeName }}
        </el-text>
      </template>
      <template #checkResultName="{ row }">
        <el-text
          @click="handleCheckResultNameClick(row.checkResultName)"
          class="common-align"
          type="primary"
        >
          {{ row.checkResultName }}
        </el-text>
      </template>
      <template #statusName="{ row }">
        <ElTag
          :type="
            row.statusName === '正常'
              ? 'success'
              : row.statusName === '维护中'
                ? 'warning'
                : row.statusName === '停用'
                  ? 'danger'
                  : 'info'
          "
        >
          {{ row.statusName }}
        </ElTag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="编辑"
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <IconButton
            content="整改"
            icon-name="CircleCheck"
            @click="handleSingleRectify(row)"
          />
          <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
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
          <span> 本页统计：地理编码数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
